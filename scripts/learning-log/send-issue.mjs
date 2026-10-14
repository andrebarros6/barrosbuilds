/**
 * One-off sender for a Learning Log issue. Built for issue 1, where every
 * subscriber is at position 1, so it broadcasts one file to the whole list.
 * The per-subscriber drip (positions, sends table, cron) replaces it from
 * issue 2 — see learning-log/prd.md R3–R16.
 *
 *   node --env-file=.env.local scripts/learning-log/send-issue.mjs <issue.md> --preview
 *   node --env-file=.env.local scripts/learning-log/send-issue.mjs <issue.md> --list
 *   node --env-file=.env.local scripts/learning-log/send-issue.mjs <issue.md> --to you@example.com
 *   node --env-file=.env.local scripts/learning-log/send-issue.mjs <issue.md> --all --dry-run
 *   node --env-file=.env.local scripts/learning-log/send-issue.mjs <issue.md> --all
 *
 * --preview  writes .sends/preview/issue-NN.{html,txt}; no network.
 * --list     prints the recipients the real send would use; sends nothing.
 * --to       sends to one subscriber already on the list (their real token,
 *            so the unsubscribe link is testable). Never touches the send log.
 * --all      sends to everyone not yet in .sends/issue-NN.jsonl. Refuses while
 *            the file is not `status: ready` or still has placeholders.
 *            Safe to re-run: logged subscribers are skipped, and Resend's
 *            Idempotency-Key catches a crash between send and log write.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  FROM_ADDRESS,
  REPLY_TO_ADDRESS,
  findBlockers,
  parseIssue,
  planSends,
  renderHtml,
  renderText,
  subject,
  subscriberKey,
  unsubscribeUrl,
} from "./render.mjs";

const SEND_DIR = ".sends";
// Resend's default limit is a few requests per second; stay well under it.
const DELAY_MS = 600;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mask = (email) => {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
};

function parseArgs(argv) {
  const args = { file: null, mode: null, to: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--preview" || a === "--list" || a === "--all") args.mode = a.slice(2);
    else if (a === "--to") {
      args.mode = "to";
      args.to = argv[++i];
    }
    else if (a === "--dry-run") args.dryRun = true;
    else if (!a.startsWith("--")) args.file = a;
    else throw new Error(`unknown flag ${a}`);
  }
  if (!args.file || !args.mode) throw new Error("usage: send-issue.mjs <issue.md> --preview|--list|--to <email>|--all [--dry-run]");
  if (args.mode === "to" && !args.to) throw new Error("--to needs an address");
  return args;
}

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set (run with --env-file=.env.local)");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Every active subscriber, paged so the 1,000-row default cap never truncates the list. */
async function loadSubscribers() {
  const db = supabase();
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("newsletter_waitlist")
      .select("email, unsubscribe_token, unsubscribed_at, created_at")
      .order("created_at")
      .range(from, from + 999);
    if (error) throw new Error(`could not read subscribers: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) break;
  }
  // Unsubscribe now deletes the row; unsubscribed_at only exists on rows
  // flagged before that change, and those people must not be emailed.
  return rows.filter((r) => r.unsubscribe_token && !r.unsubscribed_at);
}

async function sendOne(issue, sub, idempotencyKey, subjectLine) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        reply_to: REPLY_TO_ADDRESS,
        to: [sub.email],
        subject: subjectLine,
        text: renderText(issue, sub.unsubscribe_token),
        html: renderHtml(issue, sub.unsubscribe_token),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl(sub.unsubscribe_token)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (res.ok) return { ok: true, id: (await res.json()).id };
    const body = (await res.text().catch(() => "")).slice(0, 300);
    if (res.status === 429 && attempt < 3) {
      await sleep(2000 * attempt);
      continue;
    }
    return { ok: false, error: `http_${res.status} ${body}` };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const issue = parseIssue(readFileSync(args.file, "utf8"));
  const nn = String(issue.meta.issue).padStart(2, "0");
  const blockers = findBlockers(issue);

  if (args.mode === "preview") {
    const dir = join(SEND_DIR, "preview");
    mkdirSync(dir, { recursive: true });
    const token = "preview-token";
    writeFileSync(join(dir, `issue-${nn}.html`), renderHtml(issue, token));
    writeFileSync(join(dir, `issue-${nn}.txt`), renderText(issue, token));
    console.log(`Subject: ${subject(issue.meta)}`);
    console.log(`Wrote ${dir}/issue-${nn}.html and .txt`);
    if (blockers.length) console.log(`\nNot sendable yet:\n  - ${blockers.join("\n  - ")}`);
    return;
  }

  const subscribers = await loadSubscribers();

  if (args.mode === "list") {
    console.log(`${subscribers.length} active subscribers:`);
    for (const s of subscribers) console.log(`  ${s.created_at.slice(0, 10)}  ${s.email}`);
    return;
  }

  if (args.mode === "to") {
    const sub = subscribers.find((s) => s.email.toLowerCase() === args.to.trim().toLowerCase());
    if (!sub) throw new Error(`${args.to} is not on the list. Sign it up on barrosbuilds.com first, so the test uses a real unsubscribe token.`);
    const line = `[TEST] ${subject(issue.meta)}`;
    const r = await sendOne(issue, sub, `test-${nn}-${Date.now()}`, line);
    console.log(r.ok ? `Sent test to ${args.to} (${r.id})` : `Failed: ${r.error}`);
    if (blockers.length) console.log(`\nNote, the real send will refuse until fixed:\n  - ${blockers.join("\n  - ")}`);
    return;
  }

  // --all
  if (blockers.length) {
    console.error(`Refusing to send issue ${issue.meta.issue}:\n  - ${blockers.join("\n  - ")}`);
    process.exit(1);
  }
  mkdirSync(SEND_DIR, { recursive: true });
  const logPath = join(SEND_DIR, `issue-${nn}.jsonl`);
  const sentKeys = new Set(
    existsSync(logPath)
      ? readFileSync(logPath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l).key)
      : [],
  );
  const { toSend, alreadySent } = planSends(subscribers, sentKeys);
  console.log(`Issue ${issue.meta.issue}: ${subscribers.length} subscribers, ${alreadySent} already sent, ${toSend.length} to send.`);
  if (args.dryRun) {
    for (const s of toSend) console.log(`  would send → ${mask(s.email)}`);
    return;
  }

  let ok = 0;
  const failed = [];
  for (const sub of toSend) {
    const key = subscriberKey(sub.email);
    const r = await sendOne(issue, sub, `issue-${nn}-${key}`, subject(issue.meta));
    if (r.ok) {
      appendFileSync(logPath, JSON.stringify({ key, resendId: r.id, at: new Date().toISOString() }) + "\n");
      ok++;
    } else {
      failed.push(`${mask(sub.email)}: ${r.error}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`\nSent ${ok}, failed ${failed.length}.`);
  if (failed.length) {
    console.log(`Failures (re-run the same command to retry only these):\n  - ${failed.join("\n  - ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
