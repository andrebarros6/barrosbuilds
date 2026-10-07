# Privacy policy — status and how to ship it

Page exists at [app/privacy/page.tsx](../app/privacy/page.tsx), builds clean,
and is served at `/privacy`.

**Linked from the footer** since 2026-10-04, alongside `/terms`
([app/terms/page.tsx](../app/terms/page.tsx)). Both links live in
[components/Footer.tsx](../components/Footer.tsx).

## Facts the page asserts

Each of these must stay true, or the page needs editing:

| Claim | Currently true because |
|---|---|
| Email address is the only personal data stored | `newsletter_waitlist` holds email + source only |
| Signup source is recorded | `source` column: `homepage` / `log-page` |
| No tracking cookies; page views counted by Vercel Analytics | `@vercel/analytics` is the only analytics script, and it is cookieless |
| Stored in the EU | Supabase project region: EU (Frankfurt) |
| Resend delivers the email | `lib/send-welcome.ts` |
| One-click unsubscribe in every email | `List-Unsubscribe` headers + footer link |
| Address removed on unsubscribe | `app/unsubscribe/route.ts` deletes the row |
| Deletion on request | Unsubscribe link is the self-serve path; email requests are handled manually |
| Controller is André Barros, individual | No company registered for Barros Builds |

**If any of those change** — adding analytics, storing names, moving region,
registering a company — update the page before the change goes live.

## Known gaps

- **Rows flagged before 2026-10-04 are still stored.** Unsubscribe used to set
  `unsubscribed_at` and keep the row; it now deletes it. Any row flagged under
  the old behaviour needs a one-off cleanup:
  `delete from public.newsletter_waitlist where unsubscribed_at is not null;`
- **Not legal advice.** Written from what the code actually does. A real product
  taking EU data should eventually get a lawyer to read it.

## Before real users

The policy needs to be reachable before the list grows beyond people who know
you personally. Collecting emails without a published policy is defensible at
zero subscribers; it is not once the form is public and working.
