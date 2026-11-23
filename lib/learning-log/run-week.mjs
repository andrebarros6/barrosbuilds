/**
 * One weekly run: read the files and the list, plan, send, record, report.
 * Used by the Thursday cron route and by the CLI (scripts/learning-log/weekly.mjs),
 * so a hand-triggered run and a scheduled one behave identically.
 *
 * Guarantees, from the planning PRD:
 *   R5   never emails anyone twice in a week — the row is claimed before the
 *        send, unique on (subscriber_id, week), and Resend's Idempotency-Key
 *        covers a crash between sending and recording
 *   R7   a failed send is recorded and retried by the next run, alone
 *   R11  no ready week file → nothing is sent and André is told
 *   R16  a subscriber whose next issue is not written keeps their place
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { attemptFor, idempotencyKey, LAST_ISSUE, planWeek, sendWeekFor, summarise } from "./drip.mjs";
import {
  composeEmail,
  findBlockers,
  FROM_ADDRESS,
  parseIssue,
  parseWeek,
  renderHtml,
  renderText,
  REPLY_TO_ADDRESS,
  subject,
  unsubscribeUrl,
} from "./render.mjs";

const SENDS = "learning_log_sends";
const SUBSCRIBERS = "newsletter_waitlist";
// Resend's default limit is a few requests per second; stay well under it.
const DELAY_MS = 600;
const PAGE = 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Load the week file and every course file, with what blocks each. */
export function loadContent(contentDir, week) {
  const weekPath = join(contentDir, "weeks", `${week}.md`);
  let weekFile = null;
  let weekBlockers = [];
  if (!existsSync(weekPath)) {
    weekBlockers = [`no week file at content/learning-log/weeks/${week}.md`];
  } else {
    weekFile = parseWeek(readFileSync(weekPath, "utf8"));
    if (weekFile.meta.week !== week) weekBlockers.push(`week file says ${weekFile.meta.week}, expected ${week}`);
    weekBlockers.push(...findBlockers(weekFile));
  }

  const courses = new Map();
  const notReady = {};
  for (let n = 1; n <= LAST_ISSUE; n++) {
    const p = join(contentDir, `issue-${String(n).padStart(2, "0")}.md`);
    if (!existsSync(p)) continue;
    const issue = parseIssue(readFileSync(p, "utf8"));
    const blockers = findBlockers(issue);
    if (blockers.length) notReady[n] = blockers;
    else courses.set(n, issue);
  }
  return { weekFile, weekBlockers, courses, notReady };
}

async function selectAll(query) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await query().range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

/** Active subscribers. Unsubscribe deletes the row; flagged rows predate that. */
export async function loadSubscribers(db) {
  const rows = await selectAll(() =>
    db.from(SUBSCRIBERS).select("id, email, unsubscribe_token, unsubscribed_at, created_at").order("id"),
  );
  return rows.filter((r) => r.unsubscribe_token && !r.unsubscribed_at);
}

async function loadSends(db) {
  return selectAll(() =>
    db.from(SENDS).select("subscriber_id, week, issue, status, attempts").order("id"),
  );
}

export async function sendEmail(resendKey, { to, subjectLine, text, html, token, key }) {
  const headers = { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" };
  if (key) headers["Idempotency-Key"] = key;
  const payload = {
    from: FROM_ADDRESS,
    reply_to: REPLY_TO_ADDRESS,
    to: [to],
    subject: subjectLine,
    text,
    html,
  };
  if (token) {
    payload.headers = {
      "List-Unsubscribe": `<${unsubscribeUrl(token)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    };
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    let res;
    try {
      res = await fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(payload) });
    } catch (err) {
      if (attempt < 3) {
        await sleep(2000 * attempt);
        continue;
      }
      return { ok: false, error: `network ${err?.message ?? err}` };
    }
    if (res.ok) return { ok: true, id: (await res.json()).id };
    const body = (await res.text().catch(() => "")).slice(0, 300);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await sleep(2000 * attempt);
      continue;
    }
    return { ok: false, error: `http_${res.status} ${body}` };
  }
}

/** Render one subscriber's email for this week. */
export function buildEmail(course, weekFile, token) {
  const email = composeEmail(course, weekFile);
  return { subjectLine: subject(email.meta), text: renderText(email, token), html: renderHtml(email, token) };
}

/**
 * @param {object} o
 * @param {import("@supabase/supabase-js").SupabaseClient} o.db
 * @param {string} o.resendKey
 * @param {string} o.contentDir   absolute path to content/learning-log
 * @param {Date}   o.now
 * @param {"dry-run"|"send"} o.mode
 * @param {number} [o.budgetMs]  stop starting new sends after this long; the next run picks up the rest
 * @param {string} [o.alertTo]   where the run summary and "nothing sent" alerts go
 * @param {(line:string)=>void} [o.log]
 */
export async function runWeek({ db, resendKey, contentDir, now, mode, budgetMs = Infinity, alertTo, log = () => {} }) {
  const started = Date.now();
  const week = sendWeekFor(now);
  const { weekFile, weekBlockers, courses, notReady } = loadContent(contentDir, week);

  const report = { week, mode, weekBlockers, notReady, counts: null, waitingOn: {}, sent: 0, failed: [], deferred: 0 };

  if (weekBlockers.length) {
    log(`Week ${week}: nothing sent.\n  - ${weekBlockers.join("\n  - ")}`);
    if (mode === "send") await alert(resendKey, alertTo, `Learning Log: nothing sent for ${week}`, blockedText(report));
    return { ...report, status: "blocked" };
  }

  const [subscribers, sends] = await Promise.all([loadSubscribers(db), loadSends(db)]);
  const plan = planWeek({ week, subscribers, sends, readyIssues: new Set(courses.keys()) });
  Object.assign(report, summarise(plan));
  log(`Week ${week}: ${subscribers.length} active. ${JSON.stringify(report.counts)}`);

  const due = plan.filter((p) => p.action === "send");
  if (mode === "dry-run") return { ...report, status: "dry-run", due };

  for (let i = 0; i < due.length; i++) {
    if (Date.now() - started > budgetMs) {
      report.deferred = due.length - i;
      log(`Time budget reached; ${report.deferred} left for the next run.`);
      break;
    }
    const p = due[i];
    const sub = p.subscriber;
    const attempts = attemptFor(p.retry);

    if (!p.retry) {
      // Claim the row first. If another run already claimed it, it owns the send.
      const { error } = await db
        .from(SENDS)
        .insert({ subscriber_id: sub.id, week, issue: p.issue, status: "pending", attempts });
      if (error) {
        if (error.code === "23505") continue;
        report.failed.push({ id: sub.id, error: `claim failed: ${error.message}` });
        continue;
      }
    } else if (p.retry.status === "failed") {
      await db.from(SENDS).update({ status: "pending", attempts }).eq("subscriber_id", sub.id).eq("week", week);
    }

    const course = courses.get(p.issue);
    if (!course) {
      // A retry whose issue file was un-readied since the claim. Leave it pending.
      report.failed.push({ id: sub.id, error: `issue ${p.issue} is no longer ready` });
      continue;
    }

    const r = await sendEmail(resendKey, {
      to: sub.email,
      ...buildEmail(course, weekFile, sub.unsubscribe_token),
      token: sub.unsubscribe_token,
      key: idempotencyKey(week, sub.id, attempts),
    });

    const update = r.ok
      ? { status: "sent", resend_id: r.id, error: null, sent_at: new Date().toISOString() }
      : { status: "failed", error: r.error };
    const { error: recordError } = await db.from(SENDS).update(update).eq("subscriber_id", sub.id).eq("week", week);
    if (recordError) log(`Could not record subscriber ${sub.id}: ${recordError.message}`);

    if (r.ok) report.sent++;
    else report.failed.push({ id: sub.id, error: r.error });
    await sleep(DELAY_MS);
  }

  log(`Sent ${report.sent}, failed ${report.failed.length}, deferred ${report.deferred}.`);
  await alert(resendKey, alertTo, summarySubject(report), summaryText(report));
  return { ...report, status: report.failed.length || report.deferred ? "incomplete" : "done" };
}

async function alert(resendKey, to, subjectLine, text) {
  if (!to) return;
  const r = await sendEmail(resendKey, { to, subjectLine, text, html: `<pre>${escape(text)}</pre>` });
  if (!r.ok) console.error("learning-log: alert email failed", r.error);
}

function blockedText(report) {
  return [
    `Nothing was sent to anyone for the week of ${report.week}.`,
    "",
    ...report.weekBlockers.map((b) => `- ${b}`),
    "",
    "Fix the week file, commit, deploy, then trigger the send by hand:",
    "  npm run weekly -- --send",
  ].join("\n");
}

function summarySubject(r) {
  const tail = r.failed.length || r.deferred ? " (needs a re-run)" : "";
  return `Learning Log ${r.week}: ${r.sent} sent${tail}`;
}

function summaryText(r) {
  const lines = [
    `Week ${r.week}`,
    `Sent: ${r.sent}`,
    `Already sent earlier this week: ${r.counts.sent}`,
    `Not due yet (signed up this Thursday): ${r.counts["not-due"]}`,
    `Finished all 30: ${r.counts.finished}`,
  ];
  const waiting = Object.entries(r.waitingOn);
  if (waiting.length) {
    lines.push("", "Waiting, because their next issue isn't ready:");
    for (const [issue, n] of waiting) lines.push(`- issue ${issue}: ${n} subscriber${n === 1 ? "" : "s"}`);
  }
  if (r.failed.length) {
    lines.push("", "Failed (re-run to retry only these):");
    for (const f of r.failed) lines.push(`- subscriber ${f.id}: ${f.error}`);
  }
  if (r.deferred) lines.push("", `Deferred by the time limit: ${r.deferred}. Re-run to send them.`);
  if (r.failed.length || r.deferred) lines.push("", "  npm run weekly -- --send");
  return lines.join("\n");
}

function escape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
