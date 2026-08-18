# Welcome email — setup & operations

Single opt-in: someone submits their email, they're on the list immediately, and
one welcome email goes out. No confirmation step.

**Status:** schema applied and verified; code typechecks, builds, and passes
every test that does not require Resend (signup writes the token, send-failure
does not lose the subscriber, unsubscribe works via link and one-click).
**Not yet verified: an actual email send** — blocked on domain verification.

## Pieces

| File | Role |
|------|------|
| [lib/email.ts](../lib/email.ts) | Subject, HTML + text bodies, sender address |
| [lib/send-welcome.ts](../lib/send-welcome.ts) | Resend REST call; never throws |
| [app/api/waitlist/route.ts](../app/api/waitlist/route.ts) | Sends after a successful insert |
| [app/unsubscribe/route.ts](../app/unsubscribe/route.ts) | GET (link) + POST (one-click) |

## 1. Schema — run this first

The signup route writes `unsubscribe_token` and `welcome_sent_at`. Without these
columns **every signup will fail**, so run this before deploying:

```sql
alter table public.newsletter_waitlist
  add column unsubscribe_token uuid,
  add column welcome_sent_at   timestamptz;

create unique index newsletter_waitlist_unsub_token_key
  on public.newsletter_waitlist (unsubscribe_token);
```

`unsubscribed_at` already exists from the original schema.

## 2. Resend — domain and key

**All three DNS records are already published** (confirmed live in DNS on
2026-08-18) —
`barrosbuilds.com` was set up for Resend during earlier work on this domain.
Nothing to add:

| Type | Host | Live value |
|---|---|---|
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpBchgy/R7HGIW3XIc…` |

Re-check any time with:

```bash
nslookup -type=TXT resend._domainkey.barrosbuilds.com 1.1.1.1
nslookup -type=MX  send.barrosbuilds.com 1.1.1.1
```

### What is still needed

1. Confirm `barrosbuilds.com` reads **Verified** in the Resend dashboard.
   Records living in DNS is not the same as Resend having checked them — if the
   records were added but verify was never clicked, it may still be pending.
2. **API Keys → Create**, sending permission only. It must be created in the
   **same Resend account** where `barrosbuilds.com` is verified — a key from a
   different account will 401 no matter how correct the DNS is.
3. Add to `homepage/.env.local`:

```
RESEND_API_KEY=re_...
```

Also add it to Vercel → Settings → Environment Variables (Production + Preview).

> There is an `api-key-resend.txt` in the repo root from earlier work. Given the
> DNS predates this task it may well be the right account — but create a fresh
> sending-only key rather than reusing one of unknown age and scope from a
> plaintext file.

> **You do not create a `log@` mailbox anywhere.** Verifying the *domain* is
> what authorises sending from any address at it — `log@`, `hello@`, whatever.
> Resend is never told the specific address; the code supplies it per send in
> [lib/email.ts](../lib/email.ts).
>
> Nothing *receives* mail at `log@` either — the domain's root MX points at
> Zoho, not Resend — which is why every send sets
> `reply_to: andre@barrosbuilds.com`. Replies land in the real inbox rather
> than bouncing, and replies are one of the strongest deliverability signals a
> new sending domain can earn.

## 3. Smoke test

```bash
npm run dev

# real signup — use an address you can actually check
curl -s -X POST localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"YOUR@REAL.EMAIL","source":"homepage"}'
```

Confirm:
- Response is `{"ok":true}`
- The email arrives (check spam on the first send from a new domain)
- Table row has `unsubscribe_token` set and `welcome_sent_at` non-NULL
- Clicking **Unsubscribe** in the footer sets `unsubscribed_at`
- Submitting the same address again returns `alreadySubscribed` and sends
  **no** second email

Then delete the test row.

### Deliberate failure test

Temporarily break `RESEND_API_KEY`, then sign up again. The signup must still
return `{"ok":true}` with a row created and `welcome_sent_at` NULL — proving a
send outage never costs you a subscriber. Restore the key afterwards.

## Design notes

**Send failure never fails signup.** They're on the list; `welcome_sent_at` NULL
marks who needs a retry. A dead Resend must not turn into a dead signup form.

**Duplicates get no second email.** The unique index short-circuits before the
send.

**Unsubscribe ships with the first email, not later.** GDPR requires it, and
Gmail/Yahoo bulk-sender rules require the `List-Unsubscribe` headers that
[lib/send-welcome.ts](../lib/send-welcome.ts) sets.

## Still not built

Weekly send pipeline, per-subscriber position tracking, cron, archive index.
The welcome email is capture confirmation, not the send pipeline.

### Before the first real send

A privacy policy must be reachable from the site. You're storing personal data
and now emailing it — the waitlist alone was defensible without one, an active
mailing list is not.
