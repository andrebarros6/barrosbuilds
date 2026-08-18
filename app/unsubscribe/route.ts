import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * One-click unsubscribe.
 *
 * GET  — the link in the email footer, returns a small confirmation page.
 * POST — RFC 8058 one-click, what Gmail/Yahoo call when the user hits their
 *        native "unsubscribe" button. Must work without any confirmation step.
 *
 * Always reports success to the visitor. Whether a token exists is not
 * something an outsider should be able to probe.
 */
async function unsubscribe(token: string | null): Promise<boolean> {
  if (!token) return false;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("unsubscribe: supabase env not set");
    return false;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from("newsletter_waitlist")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null);

  if (error) {
    console.error("unsubscribe: update failed", error);
    return false;
  }
  return true;
}

function page(message: string) {
  return new NextResponse(
    `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Unsubscribed — Barros Builds</title></head>
<body style="margin:0;background:#1c1a17;color:#e8dcc8;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:96px 24px;">
    <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;color:#c4593a;margin-bottom:20px;">LEARNING LOG</div>
    <h1 style="font-size:26px;margin:0 0 16px;">${message}</h1>
    <p style="color:#a89880;line-height:1.7;margin:0 0 28px;">
      You won't get any more emails from the Learning Log. No hard feelings — the
      exercises stay public on GitHub either way.
    </p>
    <a href="https://barrosbuilds.com" style="font-family:'Courier New',monospace;font-size:12px;color:#a89880;border-bottom:1px solid #4f4840;text-decoration:none;">← barrosbuilds.com</a>
  </div>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  await unsubscribe(token);
  return page("You're unsubscribed.");
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  await unsubscribe(token);
  return NextResponse.json({ ok: true });
}
