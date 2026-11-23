/**
 * Learning Log issue → email. Pure functions only, so they can be tested
 * without Supabase or Resend.
 *
 * Two kinds of file go into one email (PRD D1):
 *   - a course file, content/learning-log/issue-NN.md — timeless, one per issue
 *   - a week file, content/learning-log/weeks/YYYY-MM-DD.md — "this week in
 *     AI", shared by everyone that Thursday
 *
 * Plain .mjs rather than TypeScript: the weekly CLI runs under bare Node,
 * outside Next, where the `@/` alias does not resolve. The constants below
 * therefore mirror lib/email.ts — change both together.
 */
import { marked } from "marked";

export const NAME = "Learning Log";
export const FROM_ADDRESS = `${NAME} <log@barrosbuilds.com>`;
export const REPLY_TO_ADDRESS = "andre@barrosbuilds.com";
export const SITE_URL = "https://barrosbuilds.com";
export const HUB_URL = "https://github.com/andrebarros6/learning-log";

const FOOTER_LINE =
  "You're getting this because you signed up for the Learning Log. One issue every Thursday, free. Every exercise is public:";

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
function splitFrontmatter(source, kind) {
  const src = source.replace(/\r\n/g, "\n");
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${kind} file has no frontmatter`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

/** A course file: one issue's concept and exercise. */
export function parseIssue(source) {
  const issue = splitFrontmatter(source, "issue");
  for (const key of ["issue", "of", "track", "title", "status"]) {
    if (!issue.meta[key]) throw new Error(`frontmatter is missing "${key}"`);
  }
  return issue;
}

/** A week file: the shared "this week in AI" block for one send Thursday. */
export function parseWeek(source) {
  const week = splitFrontmatter(source, "week");
  for (const key of ["week", "status"]) {
    if (!week.meta[key]) throw new Error(`frontmatter is missing "${key}"`);
  }
  const d = week.meta.week;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || new Date(`${d}T12:00:00Z`).getUTCDay() !== 4) {
    throw new Error(`week "${d}" is not a Thursday in YYYY-MM-DD form`);
  }
  return week;
}

/**
 * Everything that must stop a real send. Checked on the raw body, before
 * comments are stripped, because the BLOCKED marker lives in a comment.
 * Works for course files and week files alike.
 */
export function findBlockers({ meta, body }) {
  const blockers = [];
  if (meta.status !== "ready") blockers.push(`status is "${meta.status}", not "ready"`);
  if (/BLOCKED/.test(body)) blockers.push("a BLOCKED marker is still in the body");
  if (/\[TO WRITE/.test(body)) blockers.push("a [TO WRITE] placeholder is still in the body");
  // House rule: no em dashes in anything a reader receives. Comments are exempt.
  if (/—/.test(body.replace(/<!--[\s\S]*?-->/g, ""))) blockers.push("an em dash is in the body (house rule: none in emails)");
  return blockers;
}

/**
 * One email: the subscriber's course file, then the week's news. The header
 * and subject come from the course file; the news never changes them.
 */
export function composeEmail(course, week) {
  return { meta: course.meta, body: `${course.body.trimEnd()}\n\n---\n\n${week.body.trim()}\n` };
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

/** Markdown → inline-styled HTML fragment. Shared with the welcome email. */
export function markdownToHtml(md) {
  return styleTags(marked.parse(cleanBody(md), { async: false }));
}

/** Markdown → readable plain text for the text/plain part. */
export function markdownToText(md) {
  return cleanBody(md)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => (label === url ? url : `${label} (${url})`))
    .replace(/^#{1,3} (.*)$/gm, (_, h) => h.toUpperCase())
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^---$/gm, "* * *");
}

/**
 * The full HTML document. `eyebrowText` sits above the content; the footer
 * always carries the unsubscribe link, because every send must.
 */
export function wrapHtml({ title, eyebrowText, contentHtml, token }) {
  const unsub = unsubscribeUrl(token);
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="font-family:${MONO};font-size:12px;color:${C.accent};letter-spacing:0.08em;padding-bottom:28px;">
          ${escapeHtml(eyebrowText.toUpperCase())}
        </td></tr>
        <tr><td>${contentHtml}</td></tr>
        <tr><td style="border-top:1px solid ${C.rule};padding-top:20px;padding-bottom:14px;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.muted};">
          ${escapeHtml(FOOTER_LINE)} <a href="${HUB_URL}" style="color:${C.cream};">${HUB_URL.replace("https://", "")}</a>
        </td></tr>
        <tr><td style="font-family:${MONO};font-size:11px;color:${C.faint};">
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

export function wrapText({ eyebrowText, contentText, token }) {
  return `${eyebrowText}\n\n${contentText}\n\n* * *\n${FOOTER_LINE} ${HUB_URL}\n\nUnsubscribe: ${unsubscribeUrl(token)}\n${SITE_URL}/log\n`;
}

export function renderHtml(issue, token) {
  return wrapHtml({
    title: subject(issue.meta),
    eyebrowText: eyebrow(issue.meta),
    contentHtml: markdownToHtml(issue.body),
    token,
  });
}

export function renderText(issue, token) {
  return wrapText({ eyebrowText: eyebrow(issue.meta), contentText: markdownToText(issue.body), token });
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
