import assert from "node:assert/strict";
import { test } from "node:test";
import {
  attemptFor,
  firstIssueDate,
  formatSendDate,
  idempotencyKey,
  isDue,
  lisbonDate,
  nextIssue,
  planWeek,
  sendWeekFor,
  summarise,
} from "./drip.mjs";

const at = (iso) => new Date(iso);

test("lisbonDate follows Lisbon, not UTC, across the clock change", () => {
  // Summer time (UTC+1) until 25 October 2026: 23:30 UTC is already tomorrow.
  assert.equal(lisbonDate(at("2026-10-21T23:30:00Z")), "2026-10-22");
  // Winter time (UTC+0) after it.
  assert.equal(lisbonDate(at("2026-10-28T23:30:00Z")), "2026-10-28");
});

test("sendWeekFor is the Thursday on or before today", () => {
  assert.equal(sendWeekFor(at("2026-10-29T07:00:00Z")), "2026-10-29"); // Thursday
  assert.equal(sendWeekFor(at("2026-10-30T09:00:00Z")), "2026-10-29"); // Friday re-run finishes Thursday's week
  assert.equal(sendWeekFor(at("2026-11-04T12:00:00Z")), "2026-10-29"); // Wednesday
  assert.equal(sendWeekFor(at("2026-11-05T00:30:00Z")), "2026-11-05");
});

test("firstIssueDate is the Thursday strictly after signup day", () => {
  assert.equal(firstIssueDate(at("2026-10-25T10:00:00Z")), "2026-10-29"); // Sunday
  assert.equal(firstIssueDate(at("2026-10-28T22:00:00Z")), "2026-10-29"); // Wednesday night
  assert.equal(firstIssueDate(at("2026-10-29T06:00:00Z")), "2026-11-05"); // Thursday, before the run
  assert.equal(firstIssueDate(at("2026-10-21T23:30:00Z")), "2026-10-29"); // already Thursday in Lisbon
});

test("isDue and firstIssueDate always agree", () => {
  for (let h = 0; h < 24 * 14; h += 5) {
    const signup = new Date(Date.UTC(2026, 9, 18, h, 17));
    const first = firstIssueDate(signup);
    assert.equal(isDue(signup, first), true, `due on ${first} for ${signup.toISOString()}`);
    const weekBefore = new Date(`${first}T12:00:00Z`);
    weekBefore.setUTCDate(weekBefore.getUTCDate() - 7);
    assert.equal(isDue(signup, weekBefore.toISOString().slice(0, 10)), false);
  }
});

test("formatSendDate reads as a day the reader recognises", () => {
  assert.equal(formatSendDate("2026-10-29"), "Thursday 29 October");
});

test("nextIssue is one past the highest issue actually sent", () => {
  assert.equal(nextIssue([]), 1);
  assert.equal(
    nextIssue([
      { issue: 1, status: "sent" },
      { issue: 2, status: "sent" },
      { issue: 3, status: "failed" },
    ]),
    3,
  );
});

const ready = new Set([1, 2, 3]);
const sub = (id, created_at = "2026-10-01T10:00:00Z") => ({ id, created_at, email: `s${id}@x.com` });

test("planWeek: new subscriber gets issue 1, an established one gets their next", () => {
  const plan = planWeek({
    week: "2026-10-29",
    subscribers: [sub(1), sub(2)],
    sends: [
      { subscriber_id: 2, week: "2026-10-15", issue: 1, status: "sent" },
      { subscriber_id: 2, week: "2026-10-22", issue: 2, status: "sent" },
    ],
    readyIssues: ready,
  });
  assert.deepEqual(
    plan.map((p) => [p.subscriber.id, p.action, p.issue]),
    [
      [1, "send", 1],
      [2, "send", 3],
    ],
  );
});

test("planWeek: a signup on the send Thursday waits until next week", () => {
  const [p] = planWeek({
    week: "2026-10-29",
    subscribers: [sub(1, "2026-10-29T06:30:00Z")],
    sends: [],
    readyIssues: ready,
  });
  assert.equal(p.action, "not-due");
});

test("planWeek: already sent this week is never sent again", () => {
  const [p] = planWeek({
    week: "2026-10-29",
    subscribers: [sub(1)],
    sends: [{ subscriber_id: 1, week: "2026-10-29", issue: 1, status: "sent" }],
    readyIssues: ready,
  });
  assert.equal(p.action, "sent");
});

test("planWeek: a pending or failed row is retried with the issue it claimed", () => {
  for (const status of ["pending", "failed"]) {
    const [p] = planWeek({
      week: "2026-10-29",
      subscribers: [sub(1)],
      sends: [
        { subscriber_id: 1, week: "2026-10-22", issue: 1, status: "sent" },
        { subscriber_id: 1, week: "2026-10-29", issue: 2, status, attempts: 1 },
      ],
      readyIssues: ready,
    });
    assert.equal(p.action, "send");
    assert.equal(p.issue, 2);
    assert.equal(p.retry.status, status);
  }
});

test("planWeek: an unwritten next issue skips the subscriber and keeps their place (D3)", () => {
  const sends = [1, 2, 3].map((issue, i) => ({ subscriber_id: 1, week: `2026-10-0${i + 1}`, issue, status: "sent" }));
  const [p] = planWeek({ week: "2026-10-29", subscribers: [sub(1)], sends, readyIssues: ready });
  assert.deepEqual([p.action, p.issue], ["waiting", 4]);
});

test("planWeek: after issue 30 there is nothing more to send", () => {
  const [p] = planWeek({
    week: "2026-10-29",
    subscribers: [sub(1)],
    sends: [{ subscriber_id: 1, week: "2026-10-22", issue: 30, status: "sent" }],
    readyIssues: new Set([30]),
  });
  assert.equal(p.action, "finished");
});

test("a week stored as a timestamp still matches its date", () => {
  const [p] = planWeek({
    week: "2026-10-29",
    subscribers: [sub(1)],
    sends: [{ subscriber_id: 1, week: "2026-10-29T00:00:00+00:00", issue: 1, status: "sent" }],
    readyIssues: ready,
  });
  assert.equal(p.action, "sent");
});

test("retry keys: pending reuses the key so Resend drops a duplicate; failed gets a new one", () => {
  assert.equal(attemptFor(undefined), 1);
  assert.equal(attemptFor({ status: "pending", attempts: 1 }), 1);
  assert.equal(attemptFor({ status: "failed", attempts: 1 }), 2);
  assert.notEqual(idempotencyKey("2026-10-29", 7, 1), idempotencyKey("2026-10-29", 7, 2));
  assert.notEqual(idempotencyKey("2026-10-29", 7, 1), idempotencyKey("2026-11-05", 7, 1));
});

test("summarise counts actions and who is waiting on which issue", () => {
  const { counts, waitingOn } = summarise([
    { action: "send" },
    { action: "waiting", issue: 4 },
    { action: "waiting", issue: 4 },
    { action: "not-due" },
  ]);
  assert.equal(counts.send, 1);
  assert.equal(counts.waiting, 2);
  assert.deepEqual(waitingOn, { 4: 2 });
});
