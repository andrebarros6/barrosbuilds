import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/send-welcome";

export const runtime = "nodejs";

// Deliberately loose: the only thing worth rejecting up front is input that
// clearly isn't an address. Real deliverability is confirmed at send time.
// ASCII-only by design — `[^\s@]` would otherwise admit null bytes (which
// Postgres rejects in `text`, surfacing as a 500) and emoji domains that no
// mail server will ever route.
const EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

// Reject C0/C1 control characters outright. Postgres cannot store a NUL
// byte in a text column, so letting one through turns a 400 into a 500.
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/;

// Best-effort in-memory throttle. Serverless instances are per-region and
// recycle, so this stops casual repeat submits, not a determined attacker.
// The unique index on `email` is the actual integrity guarantee.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) hits.clear(); // crude bound on memory growth
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("waitlist: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
    return NextResponse.json(
      { error: "Signup is temporarily unavailable." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body as { email?: unknown })?.email;
  // Honeypot: a hidden field real users never fill. Bots that fill every input
  // get a success response so they don't retry with a different strategy.
  const trap = (body as { company?: unknown })?.company;
  if (typeof trap === "string" && trap.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof raw !== "string") {
    return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
  }

  const email = raw.trim().toLowerCase();
  if (
    email.length > MAX_EMAIL_LENGTH ||
    CONTROL_CHARS.test(email) ||
    !EMAIL.test(email)
  ) {
    return NextResponse.json({ error: "That doesn't look like a valid email." }, { status: 400 });
  }

  // Which surface converted. Allowlisted so the column can't be used as a
  // free-text sink from a crafted request.
  const SOURCES = new Set(["homepage", "log-page"]);
  const rawSource = (body as { source?: unknown })?.source;
  const source =
    typeof rawSource === "string" && SOURCES.has(rawSource) ? rawSource : "unknown";

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Unsubscribe token, generated per subscriber. Random rather than derived
  // from the email so it can't be guessed or forged for someone else.
  const unsubscribeToken = randomUUID();

  const { data, error } = await supabase
    .from("newsletter_waitlist")
    .insert({ email, source, unsubscribe_token: unsubscribeToken })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique violation. Already on the list is a success from the
    // visitor's point of view, and telling them otherwise leaks list membership.
    // No second welcome email — they already got one.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    console.error("waitlist: insert failed", error);
    return NextResponse.json(
      { error: "Something broke on our end. Try again." },
      { status: 500 }
    );
  }

  // Welcome email is best-effort. The subscriber is already on the list, so a
  // send failure must not turn into a failed signup — `welcome_sent_at` staying
  // NULL is the record of who still needs one.
  const { sent } = await sendWelcomeEmail(email, unsubscribeToken);
  if (sent) {
    const { error: stampError } = await supabase
      .from("newsletter_waitlist")
      .update({ welcome_sent_at: new Date().toISOString() })
      .eq("id", data.id);
    if (stampError) {
      console.error("waitlist: welcome_sent_at stamp failed", stampError);
    }
  }

  return NextResponse.json({ ok: true });
}
