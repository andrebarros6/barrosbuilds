/**
 * The weekly Learning Log send, by hand. Same code path as the Thursday cron
 * (lib/learning-log/run-week.mjs), so what this does is what the cron does.
 *
 *   npm run weekly -- --preview [--issue N] [--week YYYY-MM-DD]
 *   npm run weekly -- --dry-run
 *   npm run weekly -- --to you@example.com [--issue N] [--week YYYY-MM-DD]
 *   npm run weekly -- --send
 *
 * --preview  writes .sends/preview/issue-NN-<week>.{html,txt}; no network.
 *            Defaults to issue 1 and the current send week.
 * --dry-run  reads the list and prints who would get which issue; sends nothing.
 * --to       sends one combined email to a subscriber already on the list,
 *            with their real unsubscribe token, subject prefixed [TEST].
 *            Ignores status, so a draft can be checked in a real inbox.
 *            Never writes a send record.
 * --send     the real run, exactly as the cron does it. Safe to re-run.
 *
 * Needs .env.local: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { sendWeekFor } from "../../lib/learning-log/drip.mjs";
import { parseIssue, parseWeek } from "../../lib/learning-log/render.mjs";
import { buildEmail, loadSubscribers, runWeek, sendEmail } from "../../lib/learning-log/run-week.mjs";

const CONTENT = resolve("content", "learning-log");

function parseArgs(argv) {
  const args = { mode: null, to: null, issue: 1, week: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--preview" || a === "--dry-run" || a === "--send") args.mode = a.slice(2);
    else if (a === "--to") {
      args.mode = "to";
      args.to = argv[++i];
    }
    else if (a === "--issue") args.issue = Number(argv[++i]);
    else if (a === "--week") args.week = argv[++i];
    else throw new Error(`unknown argument ${a}`);
  }
  if (!args.mode) throw new Error("usage: weekly.mjs --preview|--dry-run|--to <email>|--send [--issue N] [--week YYYY-MM-DD]");
  if (args.mode === "to" && !args.to) throw new Error("--to needs an address");
  if (!Number.isInteger(args.issue) || args.issue < 1 || args.issue > 30) throw new Error("--issue must be 1–30");
  if (args.week && args.mode !== "preview" && args.mode !== "to") throw new Error("--week is only for --preview and --to");
  return args;
}

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set (npm run weekly loads .env.local)");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function readPair(issueNo, week) {
  const nn = String(issueNo).padStart(2, "0");
  const course = parseIssue(readFileSync(join(CONTENT, `issue-${nn}.md`), "utf8"));
  const weekFile = parseWeek(readFileSync(join(CONTENT, "weeks", `${week}.md`), "utf8"));
  return { nn, course, weekFile };
}

const mask = (email) => `${email.slice(0, 2)}***@${email.split("@")[1]}`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const week = args.week ?? sendWeekFor(new Date());

  if (args.mode === "preview") {
    const { nn, course, weekFile } = readPair(args.issue, week);
    const email = buildEmail(course, weekFile, "preview-token");
    const dir = join(".sends", "preview");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `issue-${nn}-${week}.html`), email.html);
    writeFileSync(join(dir, `issue-${nn}-${week}.txt`), email.text);
    console.log(`Subject: ${email.subjectLine}`);
    console.log(`Wrote ${dir}/issue-${nn}-${week}.html and .txt`);
    return;
  }

  if (args.mode === "to") {
    const { course, weekFile } = readPair(args.issue, week);
    const sub = (await loadSubscribers(db())).find((s) => s.email.toLowerCase() === args.to.trim().toLowerCase());
    if (!sub) throw new Error(`${args.to} is not on the list. Sign it up on barrosbuilds.com first, so the test uses a real unsubscribe token.`);
    const email = buildEmail(course, weekFile, sub.unsubscribe_token);
    const r = await sendEmail(process.env.RESEND_API_KEY, {
      to: sub.email,
      ...email,
      subjectLine: `[TEST] ${email.subjectLine}`,
      token: sub.unsubscribe_token,
    });
    console.log(r.ok ? `Sent test to ${args.to} (${r.id})` : `Failed: ${r.error}`);
    return;
  }

  const report = await runWeek({
    db: db(),
    resendKey: process.env.RESEND_API_KEY,
    contentDir: CONTENT,
    now: new Date(),
    mode: args.mode,
    alertTo: process.env.LEARNING_LOG_ALERT_TO ?? "andre@barrosbuilds.com",
    log: (line) => console.log(line),
  });

  for (const [n, blockers] of Object.entries(report.notReady)) console.log(`  issue ${n} not ready: ${blockers.join("; ")}`);
  if (report.status === "dry-run") {
    for (const p of report.due) console.log(`  would send issue ${p.issue} → ${mask(p.subscriber.email)}${p.retry ? " (retry)" : ""}`);
    for (const [issue, n] of Object.entries(report.waitingOn)) console.log(`  waiting on issue ${issue}: ${n}`);
  }
  if (report.status === "blocked" || report.status === "incomplete") process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
