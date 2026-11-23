import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  composeEmail,
  findBlockers,
  HUB_URL,
  parseIssue,
  parseWeek,
  renderHtml,
  renderText,
  subject,
  unsubscribeUrl,
} from "./render.mjs";

const ready = `---
issue: 3
of: 30
track: Working with the models
title: Structured outputs
status: ready
---

\`Issue 3 of 30 · Working with the models\`

# Structured outputs

Some **bold** and a [link](https://example.com).

<!-- a private note -->

## The exercise

1. One
2. Two
`;

test("parseIssue reads frontmatter and normalises CRLF", () => {
  const { meta, body } = parseIssue(ready.replace(/\n/g, "\r\n"));
  assert.equal(meta.issue, "3");
  assert.equal(meta.status, "ready");
  assert.match(body, /^\n?`Issue 3/);
});

test("parseIssue rejects a file missing required keys", () => {
  assert.throws(() => parseIssue("---\nissue: 1\n---\nbody"), /missing "of"/);
  assert.throws(() => parseIssue("no frontmatter"), /no frontmatter/);
});

test("a ready file with no placeholders has no blockers", () => {
  assert.deepEqual(findBlockers(parseIssue(ready)), []);
});

test("draft status, BLOCKED and [TO WRITE] each block the send", () => {
  const draft = ready.replace("status: ready", "status: draft");
  assert.equal(findBlockers(parseIssue(draft)).length, 1);
  const hidden = ready + "\n<!-- BLOCKED: numbers pending -->\n";
  assert.match(findBlockers(parseIssue(hidden))[0], /BLOCKED/);
  const todo = ready + "\n> **[TO WRITE — 200 words]**\n";
  assert.match(findBlockers(parseIssue(todo))[0], /TO WRITE/);
});

test("an em dash in the body blocks the send, but not one inside a comment", () => {
  assert.match(findBlockers(parseIssue(ready + "\nOne thing — another.\n"))[0], /em dash/);
  assert.deepEqual(findBlockers(parseIssue(ready + "\n<!-- note — aside -->\n")), []);
});

test("html carries the eyebrow, the unsubscribe link, and no comments", () => {
  const html = renderHtml(parseIssue(ready), "tok-123");
  assert.match(html, /ISSUE 3 OF 30 · WORKING WITH THE MODELS/);
  assert.ok(html.includes(unsubscribeUrl("tok-123")));
  assert.doesNotMatch(html, /private note/);
  assert.doesNotMatch(html, /`Issue 3/);
  assert.match(html, /<strong style="[^"]+">bold<\/strong>/);
  assert.match(html, /<a style="[^"]+" href="https:\/\/example.com">link<\/a>/);
});

test("text version spells out links and ends with the unsubscribe URL", () => {
  const text = renderText(parseIssue(ready), "tok-123");
  assert.ok(text.startsWith("Issue 3 of 30 · Working with the models"));
  assert.match(text, /link \(https:\/\/example.com\)/);
  assert.match(text, /^STRUCTURED OUTPUTS$/m);
  assert.doesNotMatch(text, /\*\*|private note/);
  assert.ok(text.trimEnd().includes(`Unsubscribe: ${unsubscribeUrl("tok-123")}`));
});

test("unsubscribe tokens are URL-encoded", () => {
  assert.equal(unsubscribeUrl("a b&c"), "https://barrosbuilds.com/unsubscribe?token=a%20b%26c");
});

test("subject names the title and position", () => {
  assert.equal(subject(parseIssue(ready).meta), "Structured outputs · Learning Log 3/30");
});

const week = `---
week: 2026-10-29
status: ready
---

<!-- editor's note -->

## This week in AI

**Item one.** Why it matters.
`;

test("parseWeek reads a Thursday week file", () => {
  const w = parseWeek(week.replace(/\n/g, "\r\n"));
  assert.equal(w.meta.week, "2026-10-29");
  assert.deepEqual(findBlockers(w), []);
});

test("parseWeek rejects a date that is not a Thursday, or a missing status", () => {
  assert.throws(() => parseWeek(week.replace("2026-10-29", "2026-10-28")), /not a Thursday/);
  assert.throws(() => parseWeek(week.replace("2026-10-29", "29 Oct")), /not a Thursday/);
  assert.throws(() => parseWeek("---\nweek: 2026-10-29\n---\nbody"), /missing "status"/);
});

test("a draft week file or a [TO WRITE] placeholder blocks the send", () => {
  assert.equal(findBlockers(parseWeek(week.replace("status: ready", "status: draft"))).length, 1);
  assert.match(findBlockers(parseWeek(week + "\n> **[TO WRITE — news]**\n"))[0], /TO WRITE/);
});

test("composeEmail puts the course first and the news after a rule, keeping the course header", () => {
  const email = composeEmail(parseIssue(ready), parseWeek(week));
  assert.equal(email.meta.title, "Structured outputs");
  const html = renderHtml(email, "tok");
  assert.ok(html.indexOf("The exercise") < html.indexOf("This week in AI"));
  assert.match(html, /<hr style=/);
  assert.doesNotMatch(html, /editor's note/);
  const text = renderText(email, "tok");
  assert.match(text, /^THIS WEEK IN AI$/m);
  assert.ok(text.startsWith("Issue 3 of 30"));
});

test("every email footer says why it arrived and links the public exercises", () => {
  const html = renderHtml(parseIssue(ready), "tok");
  assert.match(html, /signed up for the Learning Log/);
  assert.ok(html.includes(`href="${HUB_URL}"`));
  assert.ok(renderText(parseIssue(ready), "tok").includes(HUB_URL));
});

test("the real issue 1 file parses and is held back until finished", () => {
  const issue = parseIssue(readFileSync(new URL("../../content/learning-log/issue-01.md", import.meta.url), "utf8"));
  assert.equal(issue.meta.issue, "1");
  // Flip this expectation only by finishing the issue, never by editing the test.
  if (issue.meta.status === "ready") assert.deepEqual(findBlockers(issue), []);
  else assert.ok(findBlockers(issue).length > 0);
});
