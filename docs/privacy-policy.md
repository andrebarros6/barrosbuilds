# Privacy policy — status and how to ship it

Page exists at [app/privacy/page.tsx](../app/privacy/page.tsx), builds clean,
and is served at `/privacy`.

**Deliberately not linked from anywhere.** No footer link, no nav entry — it is
reachable only by typing the URL. This was a decision, not an oversight: the
page is written and ready, but not published as part of the site yet.

## To ship it

1. Add a link in [components/Footer.tsx](../components/Footer.tsx) alongside the
   LinkedIn / GitHub / email links.
2. Re-read the page and confirm the facts still match reality — see below.

## Facts the page asserts

Each of these must stay true, or the page needs editing:

| Claim | Currently true because |
|---|---|
| Email address is the only personal data stored | `newsletter_waitlist` holds email + source only |
| Signup source is recorded | `source` column: `homepage` / `log-page` |
| No tracking cookies, no analytics | No analytics script anywhere in the app |
| Stored in the EU | Supabase project region: EU (Frankfurt) |
| Resend delivers the email | `lib/send-welcome.ts` |
| One-click unsubscribe in every email | `List-Unsubscribe` headers + footer link |
| Deletion on request | Manual today — no self-serve delete UI exists |
| Controller is André Barros, individual | No company registered for Barros Builds |

**If any of those change** — adding analytics, storing names, moving region,
registering a company — update the page before the change goes live.

## Known gaps

- **Deletion is manual.** The policy promises deletion on request and that is
  honourable today, but there is no self-serve flow. The global product standard
  ("every product must support full account deletion by the user") is not met by
  a mailing list with no accounts, but a delete-my-data link would be stronger
  than an email request.
- **Terms & Conditions do not exist.** The global standard lists them as a
  launch blocker for consumer-facing products. Arguably lower priority here —
  no accounts, no payments, nothing to agree to — but it is a deliberate gap,
  not an oversight.
- **Not legal advice.** Written from what the code actually does. A real product
  taking EU data should eventually get a lawyer to read it.

## Before real users

The policy needs to be reachable before the list grows beyond people who know
you personally. Collecting emails without a published policy is defensible at
zero subscribers; it is not once the form is public and working.
