import { FROM_ADDRESS, REPLY_TO_ADDRESS, welcomeEmail } from "@/lib/email";

/**
 * Fire the welcome email via Resend's REST API.
 *
 * Deliberately uses fetch rather than the SDK — one HTTP call, no dependency,
 * and it keeps the serverless bundle small.
 *
 * Never throws. A failed send must not fail the signup: the subscriber is
 * already on the list, and `welcome_sent_at` staying NULL is the record of
 * who still needs one. Returns whether it sent so the caller can stamp it.
 */
export async function sendWelcomeEmail(
  email: string,
  unsubscribeToken: string
): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("welcome email: RESEND_API_KEY is not set");
    return { sent: false, error: "not_configured" };
  }

  const { subject, text, html, unsubscribeUrl } = welcomeEmail(unsubscribeToken);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        reply_to: REPLY_TO_ADDRESS,
        to: [email],
        subject,
        text,
        html,
        // One-click unsubscribe. Required by Gmail/Yahoo for bulk senders and
        // it keeps complaints out of the spam-report path.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("welcome email: send failed", res.status, body.slice(0, 300));
      return { sent: false, error: `http_${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error("welcome email: request threw", err);
    return { sent: false, error: "network" };
  }
}
