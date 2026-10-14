import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily keep-alive, called by Vercel Cron (vercel.json).
 *
 * The free Supabase plan pauses a project after a week without activity, and
 * a paused project silently breaks signup and unsubscribe. It paused once
 * already (found 2026-10-14). One cheap read a day keeps it awake.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set,
 * so anyone else calling this gets a 401 and never touches the database.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("keepalive: supabase env not set");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // head: true returns only the count, so no subscriber data leaves the database.
  const { error } = await supabase
    .from("newsletter_waitlist")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("keepalive: query failed", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
