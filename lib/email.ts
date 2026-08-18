import { FIRST_ISSUE_MONTH, NEWSLETTER_NAME } from "@/lib/newsletter";

export const FROM_ADDRESS = `${NEWSLETTER_NAME} <log@barrosbuilds.com>`;

// Nothing receives mail at log@ — it is a send-only identity. Replies go to
// the real inbox instead, so hitting reply works. Replies are also one of the
// strongest deliverability signals a new sending domain can earn.
export const REPLY_TO_ADDRESS = "andre@barrosbuilds.com";
export const SITE_URL = "https://barrosbuilds.com";

/**
 * Welcome email — single opt-in, sent once immediately after signup.
 *
 * Copy follows the naming rule: this is a build log, never a "newsletter".
 * Every send must carry a working unsubscribe link (GDPR, and Gmail/Yahoo
 * bulk-sender rules), so the token is a required argument rather than an
 * optional extra.
 */
export function welcomeEmail(unsubscribeToken: string) {
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;
  const month = FIRST_ISSUE_MONTH ?? "soon";

  const text = `You're in.

First issue ships ${month}. Every week: one concept, a hands-on exercise you can run, and the failure log from my own week.

The exercises ship as public repos — yours to keep.

— André

Unsubscribe: ${unsubscribeUrl}
${SITE_URL}`;

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#1c1a17;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1c1a17;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="font-family:'Courier New',monospace;font-size:13px;color:#c4593a;letter-spacing:0.08em;padding-bottom:28px;">
          ${NEWSLETTER_NAME.toUpperCase()}
        </td></tr>

        <tr><td style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#e8dcc8;padding-bottom:20px;line-height:1.2;">
          You're in.
        </td></tr>

        <tr><td style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a89880;padding-bottom:16px;">
          First issue ships <strong style="color:#e8dcc8;">${month}</strong>. Every week: one concept, a hands-on exercise you can run, and the failure log from my own week.
        </td></tr>

        <tr><td style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a89880;padding-bottom:28px;">
          The exercises ship as public repos — yours to keep.
        </td></tr>

        <tr><td style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;color:#e8dcc8;padding-bottom:32px;">
          — André
        </td></tr>

        <tr><td style="border-top:1px solid #3d3830;padding-top:20px;font-family:'Courier New',monospace;font-size:11px;color:#5a5040;">
          <a href="${unsubscribeUrl}" style="color:#a89880;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="${SITE_URL}" style="color:#a89880;">barrosbuilds.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: `You're on the ${NEWSLETTER_NAME} list`,
    text,
    html,
    unsubscribeUrl,
  };
}
