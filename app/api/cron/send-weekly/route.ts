import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { runWeek } from "@/lib/learning-log/run-week.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel's ceiling for this function. The run stops starting new sends well
// before it (BUDGET_MS) and the next run picks up the rest, so a long list
// never ends in a half-recorded send.
export const maxDuration = 60;
const BUDGET_MS = 45_000;

/**
 * The Thursday Learning Log send, called by Vercel Cron (vercel.json).
 *
 * Sends nothing unless that week's file is `status: ready` (PRD R11), and
 * emails André either way. Safe to call again: anyone already sent this week
 * is skipped, so a re-run only retries failures and anything left over.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`; anything else gets a 401.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!url || !key || !resendKey) {
    console.error("send-weekly: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY not set");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const report = await runWeek({
      db,
      resendKey,
      contentDir: join(process.cwd(), "content", "learning-log"),
      now: new Date(),
      mode: "send",
      budgetMs: BUDGET_MS,
      alertTo: process.env.LEARNING_LOG_ALERT_TO ?? "andre@barrosbuilds.com",
      log: (line: string) => console.log(`send-weekly: ${line}`),
    });
    // Counts only. No addresses leave the function in the response.
    return NextResponse.json({
      ok: report.status !== "blocked",
      status: report.status,
      week: report.week,
      sent: report.sent,
      failed: report.failed.length,
      deferred: report.deferred,
    });
  } catch (err) {
    console.error("send-weekly: run failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
