/**
 * runWeek against an in-memory stand-in for Supabase and a fake Resend.
 * Covers the guarantees that matter most and are hardest to see by hand:
 * nobody is emailed twice, failures retry alone, a missing week file sends
 * nothing, and the time budget leaves the rest for the next run.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { runWeek } from "./run-week.mjs";

const THURSDAY = new Date("2026-10-29T07:00:00Z");
const WEEK = "2026-10-29";

function course(n, status = "ready") {
  return `---\nissue: ${n}\nof: 30\ntrack: Working with the models\ntitle: Issue ${n} title\nstatus: ${status}\n---\n\n# Issue ${n} title\n\nConcept ${n}.\n`;
}
function weekFile(status = "ready", week = WEEK) {
  return `---\nweek: ${week}\nstatus: ${status}\n---\n\n## This week in AI\n\nNews.\n`;
}

function contentDir({ issues = [1, 2], weekStatus = "ready", noWeek = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "ll-"));
  mkdirSync(join(dir, "weeks"));
  for (const n of issues) writeFileSync(join(dir, `issue-${String(n).padStart(2, "0")}.md`), course(n));
  if (!noWeek) writeFileSync(join(dir, "weeks", `${WEEK}.md`), weekFile(weekStatus));
  return dir;
}

/** Just enough of supabase-js for run-week: select/order/range, insert, update().eq().eq(). */
function fakeDb(tables) {
  const data = { newsletter_waitlist: [], learning_log_sends: [], ...tables };
  let nextId = 1000;
  return {
    data,
    from(table) {
      const rows = data[table];
      return {
        select() {
          return { order: () => ({ range: async (a, b) => ({ data: rows.slice(a, b + 1), error: null }) }) };
        },
        async insert(row) {
          if (table === "learning_log_sends" && rows.some((r) => r.subscriber_id === row.subscriber_id && r.week === row.week)) {
            return { error: { code: "23505", message: "duplicate" } };
          }
          rows.push({ id: nextId++, ...row });
          return { error: null };
        },
        update(patch) {
          const filters = [];
          const q = {
            eq(k, v) {
              filters.push([k, v]);
              return q;
            },
            then(resolve) {
              for (const r of rows) if (filters.every(([k, v]) => r[k] === v)) Object.assign(r, patch);
              resolve({ error: null });
            },
          };
          return q;
        },
      };
    },
  };
}

const subscriber = (id, created_at = "2026-10-01T10:00:00Z") => ({
  id,
  email: `s${id}@example.com`,
  unsubscribe_token: `tok-${id}`,
  unsubscribed_at: null,
  created_at,
});

let calls;
let failFor;
const realFetch = globalThis.fetch;
const realTimeout = globalThis.setTimeout;

beforeEach(() => {
  calls = [];
  failFor = new Set();
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ to: body.to[0], subject: body.subject, key: init.headers["Idempotency-Key"], body });
    if (failFor.has(body.to[0])) return new Response("bad address", { status: 422 });
    return new Response(JSON.stringify({ id: `re_${calls.length}` }), { status: 200 });
  };
  // No real waiting between sends in tests.
  globalThis.setTimeout = (fn) => realTimeout(fn, 0);
});
afterEach(() => {
  globalThis.fetch = realFetch;
  globalThis.setTimeout = realTimeout;
});

const run = (db, dir, extra = {}) =>
  runWeek({ db, resendKey: "re_test", contentDir: dir, now: THURSDAY, mode: "send", alertTo: "andre@example.com", ...extra });

const subscriberSends = () => calls.filter((c) => c.to !== "andre@example.com");

test("sends each due subscriber their next issue, records it, and reports to André", async () => {
  const db = fakeDb({
    newsletter_waitlist: [subscriber(1), subscriber(2)],
    learning_log_sends: [{ id: 1, subscriber_id: 2, week: "2026-10-22", issue: 1, status: "sent", attempts: 1 }],
  });
  const report = await run(db, contentDir());
  assert.equal(report.status, "done");
  assert.equal(report.sent, 2);

  const sent = subscriberSends();
  assert.deepEqual(sent.map((c) => [c.to, c.subject]), [
    ["s1@example.com", "Issue 1 title · Learning Log 1/30"],
    ["s2@example.com", "Issue 2 title · Learning Log 2/30"],
  ]);
  assert.match(sent[0].body.html, /This week in AI/);
  assert.equal(sent[0].body.headers["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
  assert.ok(sent[0].key.startsWith(`learning-log-${WEEK}-1-`));

  const rows = db.data.learning_log_sends.filter((r) => r.week === WEEK);
  assert.ok(rows.every((r) => r.status === "sent" && r.resend_id));

  const alert = calls.at(-1);
  assert.equal(alert.to, "andre@example.com");
  assert.match(alert.subject, /2 sent$/);
});

test("a second run the same week emails no subscriber again", async () => {
  const db = fakeDb({ newsletter_waitlist: [subscriber(1), subscriber(2)] });
  const dir = contentDir();
  await run(db, dir);
  calls = [];
  const again = await run(db, dir);
  assert.equal(again.sent, 0);
  assert.equal(again.counts.sent, 2);
  assert.equal(subscriberSends().length, 0);
});

test("no ready week file: nothing is sent to anyone, and André is told", async () => {
  for (const dir of [contentDir({ weekStatus: "draft" }), contentDir({ noWeek: true })]) {
    calls = [];
    const db = fakeDb({ newsletter_waitlist: [subscriber(1)] });
    const report = await run(db, dir);
    assert.equal(report.status, "blocked");
    assert.equal(subscriberSends().length, 0);
    assert.equal(db.data.learning_log_sends.length, 0);
    assert.match(calls[0].subject, /nothing sent/);
  }
});

test("a failed send is recorded, retried alone next run with a fresh key, and others are untouched", async () => {
  const db = fakeDb({ newsletter_waitlist: [subscriber(1), subscriber(2)] });
  const dir = contentDir();
  failFor.add("s2@example.com");
  const first = await run(db, dir);
  assert.equal(first.status, "incomplete");
  assert.equal(first.failed.length, 1);
  const failedRow = db.data.learning_log_sends.find((r) => r.subscriber_id === 2);
  assert.equal(failedRow.status, "failed");
  const firstKey = subscriberSends().find((c) => c.to === "s2@example.com").key;

  failFor.clear();
  calls = [];
  const second = await run(db, dir);
  assert.equal(second.status, "done");
  assert.deepEqual(subscriberSends().map((c) => c.to), ["s2@example.com"]);
  assert.notEqual(subscriberSends()[0].key, firstKey);
  assert.equal(db.data.learning_log_sends.find((r) => r.subscriber_id === 2).status, "sent");
});

test("a pending row left by a crash is retried with the same key, so Resend can drop a duplicate", async () => {
  const db = fakeDb({
    newsletter_waitlist: [subscriber(1)],
    learning_log_sends: [{ id: 1, subscriber_id: 1, week: WEEK, issue: 1, status: "pending", attempts: 1 }],
  });
  await run(db, contentDir());
  assert.equal(subscriberSends()[0].key, `learning-log-${WEEK}-1-1`);
});

test("subscribers whose next issue is unwritten keep their place; others still get theirs", async () => {
  const db = fakeDb({
    newsletter_waitlist: [subscriber(1), subscriber(2)],
    learning_log_sends: [{ id: 1, subscriber_id: 2, week: "2026-10-22", issue: 1, status: "sent", attempts: 1 }],
  });
  const report = await run(db, contentDir({ issues: [1] }));
  assert.deepEqual(subscriberSends().map((c) => c.to), ["s1@example.com"]);
  assert.deepEqual(report.waitingOn, { 2: 1 });
  assert.equal(db.data.learning_log_sends.filter((r) => r.subscriber_id === 2).length, 1);
  assert.match(calls.at(-1).body.text, /issue 2: 1 subscriber/);
});

test("a draft issue counts as unwritten", async () => {
  const dir = contentDir({ issues: [] });
  writeFileSync(join(dir, "issue-01.md"), course(1, "draft"));
  const db = fakeDb({ newsletter_waitlist: [subscriber(1)] });
  const report = await run(db, dir);
  assert.equal(subscriberSends().length, 0);
  assert.deepEqual(report.waitingOn, { 1: 1 });
  assert.ok(report.notReady[1]);
});

test("someone who signed up on the send Thursday is not due until next week", async () => {
  const db = fakeDb({ newsletter_waitlist: [subscriber(1, "2026-10-29T06:00:00Z")] });
  const report = await run(db, contentDir());
  assert.equal(report.counts["not-due"], 1);
  assert.equal(subscriberSends().length, 0);
});

test("dry-run plans without sending or writing anything", async () => {
  const db = fakeDb({ newsletter_waitlist: [subscriber(1)] });
  const report = await run(db, contentDir(), { mode: "dry-run" });
  assert.equal(report.status, "dry-run");
  assert.equal(report.due.length, 1);
  assert.equal(calls.length, 0);
  assert.equal(db.data.learning_log_sends.length, 0);
});

test("the time budget stops new sends and leaves them for the next run", async () => {
  const db = fakeDb({ newsletter_waitlist: [subscriber(1), subscriber(2), subscriber(3)] });
  const report = await run(db, contentDir(), { budgetMs: -1 });
  assert.equal(report.deferred, 3);
  assert.equal(report.status, "incomplete");
  assert.equal(subscriberSends().length, 0);
  assert.equal(db.data.learning_log_sends.length, 0);
});

test("rows flagged unsubscribed before deletion-on-unsubscribe are never emailed", async () => {
  const db = fakeDb({ newsletter_waitlist: [{ ...subscriber(1), unsubscribed_at: "2026-09-01T00:00:00Z" }] });
  await run(db, contentDir());
  assert.equal(subscriberSends().length, 0);
});
