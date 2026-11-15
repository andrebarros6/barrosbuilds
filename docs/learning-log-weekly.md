# Learning Log — the weekly send

Every Thursday at 07:00 UTC, Vercel Cron calls `/api/cron/send-weekly`. Each
due subscriber gets one email: their next course file, then that week's news.
Decisions behind it are in the planning repo's `prd.md` (D1–D3, D12, D13).

## Pieces

| File | Role |
|------|------|
| [content/learning-log/issue-NN.md](../content/learning-log/) | Course files, one per issue. Timeless. Sent only when `status: ready` with no placeholders. |
| [content/learning-log/weeks/YYYY-MM-DD.md](../content/learning-log/weeks/) | Week files, one per send Thursday: "This week in AI". |
| [lib/learning-log/drip.mjs](../lib/learning-log/drip.mjs) | Pure rules: which Thursday, who is due, which issue. |
| [lib/learning-log/run-week.mjs](../lib/learning-log/run-week.mjs) | One run: load, plan, send, record, report. |
| [lib/learning-log/render.mjs](../lib/learning-log/render.mjs) | Markdown → email, shared with the welcome email. |
| [lib/learning-log/welcome.mjs](../lib/learning-log/welcome.mjs) | Welcome email: the subscriber's first Thursday and the guidelines. |
| [app/api/cron/send-weekly/route.ts](../app/api/cron/send-weekly/route.ts) | The cron entry point. |
| [scripts/learning-log/weekly.mjs](../scripts/learning-log/weekly.mjs) | The same run, by hand. |
| [docs/sql/2026-10-25-learning-log-sends.sql](sql/2026-10-25-learning-log-sends.sql) | The `learning_log_sends` table. |

## How a week works

- **Who is due:** everyone who signed up before midnight Lisbon time at the
  start of the send Thursday. A Thursday signup starts the following week, which
  is the date the welcome email gives them.
- **Which issue:** one more than the highest issue they have been sent.
  Nothing stores a position, so nothing can drift.
- **Not written yet:** a subscriber whose next issue isn't `ready` is skipped
  and keeps their place. The summary email says how many are waiting on which
  issue.
- **No ready week file:** nobody gets anything, and you get an email saying so.
- **Every run emails you a summary**, even when nothing went wrong.

## Weekly routine

By Wednesday night:

1. The week file for Thursday exists, is edited, and says `status: ready`.
2. The next course file the front-runners need is `ready`. The last summary
   says which one.
3. Both are committed and deployed. The function reads the files that were
   deployed, not the ones on your laptop.

Check before it goes:

```bash
npm run weekly -- --preview --issue 2 --week 2026-11-05   # writes .sends/preview/, no network
npm run weekly -- --to andre@barrosbuilds.com --issue 2   # real email to you, [TEST] subject
npm run weekly -- --dry-run                               # who would get what this week
```

If the summary says "needs a re-run", or the cron didn't fire:

```bash
npm run weekly -- --send
```

It's safe to repeat. Anyone already sent this week is skipped; failures and
leftovers are retried.

## One-time setup

1. Run [the SQL](sql/2026-10-25-learning-log-sends.sql) in the Supabase SQL
   editor.
2. In Vercel → Settings → Environment Variables (Production):
   - `CRON_SECRET` — already set for the keepalive; the same one is used here.
   - `LEARNING_LOG_ALERT_TO` — optional. Defaults to `andre@barrosbuilds.com`.
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` — already set.
3. Deploy. The cron appears under Vercel → Settings → Cron Jobs.

## Limits

- **One function run sends about 70 emails.** The run stops starting new sends
  after 45 seconds (600 ms apart, to stay under Resend's rate limit), and the
  summary says how many were deferred. Re-run with `--send`. Past a few hundred
  subscribers this needs batching or a queue.
- **Resend plan caps.** The free plan has daily and monthly limits; check them
  against the list size before they matter.
- **Vercel Hobby cron timing is approximate** — it fires within the hour.
- **Idempotency keys last 24 hours at Resend.** A `pending` row left by a crash
  is safe to retry the same day. After that, check the Resend dashboard before
  re-running.
