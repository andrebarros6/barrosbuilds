/**
 * Learning Log issue → email. Pure functions only, so they can be tested
 * without Supabase or Resend.
 *
 * Plain .mjs rather than TypeScript: the send script runs under bare Node,
 * outside Next, where the `@/` alias does not resolve. The constants below
 * therefore mirror lib/email.ts — change both together.
 */
import { createHash } from "node:crypto";
import { marked } from "marked";

export const NAME = "Learning Log";
export const FROM_ADDRESS = `${NAME} <log@barrosbuilds.com>`;
export const REPLY_TO_ADDRESS = "andre@barrosbuilds.com";
export const SITE_URL = "https://barrosbuilds.com";

const C = {
  bg: "#1c1a17",
  cream: "#e8dcc8",
  accent: "#c4593a",
  muted: "#a89880",
  rule: "#3d3830",
  faint: "#5a5040",
};
const MONO = "'Courier New',monospace";
const SANS = "-apple-system,Segoe UI,Helvetica,Arial,sans-serif";

/** Split YAML-ish frontmatter (flat `key: value` lines) from the body. */
export function parseIssue(source) {
  const src = source.replace(/\r\n/g, "\n");
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error("issue file has no frontmatter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  for (const key of ["issue", "of", "track", "title", "status"]) {
    if (!meta[key]) throw new Error(`frontmatter is missing "${key}"`);
  }
  return { meta, body: src.slice(m[0].length) };
}

/**
 * Everything that must stop a real send. Checked on the raw body, before
 * comments are stripped, because the BLOCKED marker lives in a comment.
 */
export function findBlockers({ meta, body }) {
  const blockers = [];
  if (meta.status !== "ready") blockers.push(`status is "${meta.status}", not "ready"`);
  if (/BLOCKED/.test(body)) blockers.push("a BLOCKED marker is still in the body");
  if (/\[TO WRITE/.test(body)) blockers.push("a [TO WRITE] placeholder is still in the body");
  return blockers;
}

/** Drop HTML comments and the hand-written eyebrow line the template now supplies. */
function cleanBody(body) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^`Issue \d+ of \d+ ·[^`]*`\s*$/m, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function eyebrow(meta) {
  return `Issue ${meta.issue} of ${meta.of} · ${meta.track}`;
}

export function subject(meta) {
  return `${meta.title} · ${NAME} ${meta.issue}/${meta.of}`;
}

export function unsubscribeUrl(token) {
  return `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
}

// Email clients ignore <style> blocks unevenly, so every tag gets inline styles.
const TAG_STYLES = {
  h1: `font-family:Georgia,serif;font-size:28px;line-height:1.2;color:${C.cream};margin:0 0 20px;`,
  h2: `font-family:${MONO};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:${C.accent};margin:36px 0 14px;`,
  h3: `font-family:Georgia,serif;font-size:19px;color:${C.cream};margin:28px 0 10px;`,
  p: `font-family:${SANS};font-size:15px;line-height:1.7;color:${C.muted};margin:0 0 16px;`,
  ul: `font-family:${SANS};font-size:15px;line-height:1.7;color:${C.muted};margin:0 0 16px;padding-left:22px;`,
  ol: `font-family:${SANS};font-size:15px;line-height:1.7;color:${C.muted};margin:0 0 16px;padding-left:22px;`,
  li: "margin:0 0 8px;",
  blockquote: `border-left:2px solid ${C.accent};margin:0 0 16px;padding:0 0 0 16px;`,
  hr: `border:0;border-top:1px solid ${C.rule};margin:32px 0;`,
  strong: `color:${C.cream};`,
  em: "font-style:italic;",
  code: `font-family:${MONO};font-size:13px;color:${C.cream};`,
  pre: `background:#26231f;padding:14px;overflow-x:auto;margin:0 0 16px;`,
};

function styleTags(html) {
  return html
    .replace(/<(h1|h2|h3|p|ul|ol|li|blockquote|hr|strong|em|code|pre)(\s[^>]*)?>/g, (_, tag, attrs = "") =>
      `<${tag}${attrs} style="${TAG_STYLES[tag]}">`)
    .replace(/<a /g, `<a style="color:${C.cream};text-decoration:underline;" `);
}

export function renderHtml(issue, token) {
  const unsub = unsubscribeUrl(token);
  const content = styleTags(marked.parse(cleanBody(issue.body), { async: false }));
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject(issue.meta))}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="font-family:${MONO};font-size:12px;color:${C.accent};letter-spacing:0.08em;padding-bottom:28px;">
          ${escapeHtml(eyebrow(issue.meta).toUpperCase())}
        </td></tr>
        <tr><td>${content}</td></tr>
        <tr><td style="border-top:1px solid ${C.rule};padding-top:20px;font-family:${MONO};font-size:11px;color:${C.faint};">
          <a href="${unsub}" style="color:${C.muted};">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="${SITE_URL}/log" style="color:${C.muted};">barrosbuilds.com/log</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderText(issue, token) {
  const text = cleanBody(issue.body)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => (label === url ? url : `${label} (${url})`))
    .replace(/^#{1,3} (.*)$/gm, (_, h) => h.toUpperCase())
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^---$/gm, "—");
  return `${eyebrow(issue.meta)}\n\n${text}\n\n—\nUnsubscribe: ${unsubscribeUrl(token)}\n${SITE_URL}/log\n`;
}

/**
 * Stable per-subscriber key for the send log and Resend's Idempotency-Key.
 * Hashed so the local log never holds addresses in plain text.
 */
export function subscriberKey(email) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/** Who still needs this issue, given the keys already recorded as sent. */
export function planSends(subscribers, sentKeys) {
  const toSend = [];
  let alreadySent = 0;
  for (const s of subscribers) {
    if (sentKeys.has(subscriberKey(s.email))) alreadySent++;
    else toSend.push(s);
  }
  return { toSend, alreadySent };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
