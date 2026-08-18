# Newsletter Waitlist — setup & operations

Email capture for the upcoming AI learning newsletter. Section lives on the
homepage below the products grid.

**Status: live in production.** Schema applied, smoke test passed, welcome
email verified end to end, and a black-box test pass run against the deployment
on 2026-08-18 (see "Known limitation" at the bottom).

## Pieces

| File | Role |
|------|------|
| [components/NewsletterWaitlist.tsx](../components/NewsletterWaitlist.tsx) | Compact homepage block (~11 words) |
| [app/log/page.tsx](../app/log/page.tsx) | Full pitch — the long-form copy |
| [components/WaitlistForm.tsx](../components/WaitlistForm.tsx) | Shared capture form, used by both |
| [app/api/waitlist/route.ts](../app/api/waitlist/route.ts) | POST endpoint, validation, insert |
| [lib/newsletter.ts](../lib/newsletter.ts) | Name, headline, first-issue month |

**Two surfaces, one form.** The homepage keeps a short block with an inline
field plus a "What this is →" link; `/log` carries the full pitch for
readers who click through. Both render `WaitlistForm` and POST to the same
endpoint, so validation and duplicate handling live in one place.

The homepage block is deliberately short — the rest of the page runs 12–33
words per section, and a 155-word block read as a landing page bolted into
the scroll. The long copy wasn't cut, it moved to `/log`.

`source` distinguishes the two (`homepage` / `log-page`) so you can see
which surface converts. It's allowlisted server-side; anything else stores as
`unknown`.

This is the first API route on the site — it was fully static before. Vercel
will now build it as a serverless function. `/log` stays static.

## 1. Create the Supabase project

No project exists yet. At [supabase.com/dashboard](https://supabase.com/dashboard):

1. New project — name it `barrosbuilds`, pick the EU (Frankfurt) region
   (closest to your users, keeps EU personal data in the EU for GDPR).
2. Save the database password to a password manager.
3. Free tier is fine — this table will be tiny.

## 2. Create the table

SQL Editor → run:

```sql
create table public.newsletter_waitlist (
  id           bigint generated always as identity primary key,
  email        text not null,
  source       text not null default 'homepage',
  created_at   timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Case-insensitive uniqueness. The API lowercases before insert, but this
-- is the actual guarantee — it's what makes the duplicate path (23505) work.
create unique index newsletter_waitlist_email_key
  on public.newsletter_waitlist (lower(email));

-- Deny-by-default. The API uses the service role key, which bypasses RLS.
-- With RLS on and no policies, anon/authenticated clients get nothing —
-- so the list can never be read from the browser.
alter table public.newsletter_waitlist enable row level security;
```

## 3. Environment variables

Settings → API. Create `homepage/.env.local`:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role secret>
```

Then add both to Vercel → Project → Settings → Environment Variables
(Production + Preview).

> **The service role key bypasses RLS.** It must never be prefixed
> `NEXT_PUBLIC_`, never imported into a client component, and never committed.
> `.env*` is already gitignored. It is only read inside the route handler,
> which runs server-side.

## 4. Smoke test

```bash
npm run dev

# happy path → {"ok":true}
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' -d '{"email":"test@example.com"}'

# duplicate → {"ok":true,"alreadySubscribed":true}
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' -d '{"email":"TEST@example.com"}'

# invalid → 400
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' -d '{"email":"nope"}'

# honeypot → {"ok":true} but NO new row
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"bot@example.com","company":"x"}'

# source allowlist → row stores source='unknown', not 'bogus'
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"src@example.com","source":"bogus"}'
```

Confirm in Table Editor:
- `test@example.com` present, exactly once (the uppercase duplicate must **not**
  create a second row)
- nothing for `bot@example.com`
- `src@example.com` has `source = 'unknown'`

Also submit through both UIs and confirm `source` reads `homepage` from `/`
and `log-page` from `/log`.

Then delete the test rows.

## Naming

The product is **Learning Log**; the first issue ships **September**. Both live
in [lib/newsletter.ts](../lib/newsletter.ts). In user-facing copy it is never
called a "newsletter" — the descriptor is "a public build log".

## Not built yet (deliberately)

Subscriber position tracking, weekly cron, archive subdomain, progress
tracking, comments, accounts. The welcome email and unsubscribe *are* built —
see [welcome-email.md](welcome-email.md).

### GDPR note

You're collecting personal data from EU users. Unsubscribe is built and
verified. A privacy policy exists at `/privacy` but is **deliberately not
linked** — see [privacy-policy.md](privacy-policy.md). Link it before the form
gets real traffic.


## Known limitation: rate limiting is per-instance

Measured 2026-08-18 against production: **30 concurrent POSTs all passed the
rate limiter, zero 429s.** Vercel served the burst across roughly 6 serverless
instances, each with its own empty in-memory counter, so the effective limit
under concurrency is `5 x instances`, not 5.

Sequential requests from one browser *are* limited (verified). Concurrent
requests are not.

**This is accepted, not fixed.** What actually protects the list:

| Protection | Works across instances? |
|---|---|
| Unique index on `lower(email)` | yes — no duplicate rows, ever |
| Honeypot `company` field | yes — stateless |
| ASCII + control-char validation | yes — stateless |
| In-memory rate limit | **no** — per-instance only |

Worst realistic case is a burst of junk-but-valid signups: new rows plus
welcome emails to addresses that did technically submit the form. Annoying,
not damaging, and every one of them can unsubscribe.

If it ever becomes a real problem, the fix is a Vercel Firewall rate-limit rule
(runs at the edge, before the function, so it works across all instances)
rather than more application code. A Supabase-backed counter would also work
but adds a round-trip to every signup.
