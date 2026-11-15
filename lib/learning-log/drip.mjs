/**
 * The weekly drip, as pure functions: which Thursday it is, who is due, and
 * which issue each subscriber gets. No Supabase, no Resend, no clock — the
 * caller passes `now` in, so every rule here is testable.
 *
 * Rules, from the planning PRD:
 *   D2   one run per week, on Thursday morning
 *   D3   a subscriber whose next issue is not ready is skipped and keeps
 *        their place (R16)
 *   D12  a subscriber's first issue is the Thursday after they sign up; the
 *        cutoff is midnight Lisbon time at the start of the send Thursday
 *
 * A subscriber's position is derived, not stored: one more than the highest
 * issue recorded as `sent` for them. One source of truth, so a crash between
 * sending and advancing can never leave the two disagreeing.
 */

export const TIME_ZONE = "Europe/Lisbon";
export const LAST_ISSUE = 30;

const ymd = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The calendar date in Lisbon for an instant, as YYYY-MM-DD. */
export function lisbonDate(instant) {
  return ymd.format(new Date(instant));
}

function addDays(date, n) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function weekday(date) {
  return new Date(`${date}T12:00:00Z`).getUTCDay(); // 0 = Sunday, 4 = Thursday
}

/**
 * The send week a run belongs to: the Thursday on or before today in Lisbon.
 * A late or repeated run on Friday therefore finishes Thursday's week rather
 * than starting a new one.
 */
export function sendWeekFor(now) {
  const today = lisbonDate(now);
  return addDays(today, -((weekday(today) - 4 + 7) % 7));
}

/** The Thursday a new subscriber's first issue goes out: strictly after signup day. */
export function firstIssueDate(signedUpAt) {
  const day = lisbonDate(signedUpAt);
  const ahead = (4 - weekday(day) + 7) % 7 || 7;
  return addDays(day, ahead);
}

/** "Thursday 29 October", for the welcome email. */
export function formatSendDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

/** True when someone who signed up at `createdAt` is due in `week`. */
export function isDue(createdAt, week) {
  return lisbonDate(createdAt) < week;
}

/**
 * What to do for each subscriber this week.
 *
 * @param {object} args
 * @param {string} args.week            send Thursday, YYYY-MM-DD
 * @param {Array<{id:number, created_at:string}>} args.subscribers  active only
 * @param {Array<{subscriber_id:number, week:string, issue:number, status:string, attempts?:number}>} args.sends
 * @param {Set<number>} args.readyIssues  course files that exist and have no blockers
 * @returns {Array<{subscriber:object, action:string, issue?:number, retry?:object}>}
 *
 * Actions:
 *   send      — email `issue`; `retry` is this week's existing row, if any
 *   sent      — already sent this week
 *   not-due   — signed up on or after this Thursday
 *   waiting   — next issue is not ready yet; keeps their place (D3)
 *   finished  — has had all 30
 */
export function planWeek({ week, subscribers, sends, readyIssues }) {
  const bySubscriber = new Map();
  for (const row of sends) {
    if (!bySubscriber.has(row.subscriber_id)) bySubscriber.set(row.subscriber_id, []);
    bySubscriber.get(row.subscriber_id).push(row);
  }

  return subscribers.map((subscriber) => {
    const rows = bySubscriber.get(subscriber.id) ?? [];
    const thisWeek = rows.find((r) => String(r.week).slice(0, 10) === week);

    if (thisWeek?.status === "sent") return { subscriber, action: "sent", issue: thisWeek.issue };
    // A pending or failed row from an earlier attempt this week: finish it,
    // with the issue it already claimed, so a retry never changes the issue.
    if (thisWeek) return { subscriber, action: "send", issue: thisWeek.issue, retry: thisWeek };

    if (!isDue(subscriber.created_at, week)) return { subscriber, action: "not-due" };

    const issue = nextIssue(rows);
    if (issue > LAST_ISSUE) return { subscriber, action: "finished" };
    if (!readyIssues.has(issue)) return { subscriber, action: "waiting", issue };
    return { subscriber, action: "send", issue };
  });
}

/** One more than the highest issue sent; 1 for someone who has had nothing. */
export function nextIssue(rows) {
  let highest = 0;
  for (const r of rows) if (r.status === "sent" && r.issue > highest) highest = r.issue;
  return highest + 1;
}

/**
 * Resend's Idempotency-Key for one attempt. A `pending` row means the outcome
 * of the last attempt is unknown — it may have been sent before a crash — so
 * the retry reuses that key and Resend drops the duplicate. A `failed` row was
 * definitely not sent, so it gets a fresh key.
 */
export function idempotencyKey(week, subscriberId, attempts) {
  return `learning-log-${week}-${subscriberId}-${attempts}`;
}

export function attemptFor(retry) {
  if (!retry) return 1;
  const prior = retry.attempts ?? 1;
  return retry.status === "pending" ? prior : prior + 1;
}

/** Counts by action, plus how many are waiting on each unwritten issue. */
export function summarise(plan) {
  const counts = { send: 0, sent: 0, "not-due": 0, waiting: 0, finished: 0 };
  const waitingOn = {};
  for (const p of plan) {
    counts[p.action]++;
    if (p.action === "waiting") waitingOn[p.issue] = (waitingOn[p.issue] ?? 0) + 1;
  }
  return { counts, waitingOn };
}
