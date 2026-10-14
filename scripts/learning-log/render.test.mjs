import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  findBlockers,
  parseIssue,
  planSends,
  renderHtml,
  renderText,
  subject,
  subscriberKey,
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

test("subscriberKey is stable across case and whitespace, and not the address", () => {
  const k = subscriberKey(" Ana@Example.com ");
  assert.equal(k, subscriberKey("ana@example.com"));
  assert.equal(k.length, 32);
  assert.doesNotMatch(k, /ana|example/);
});

test("planSends skips anyone already logged, so a re-run emails no one twice", () => {
  const subs = [{ email: "a@x.com" }, { email: "b@x.com" }, { email: "c@x.com" }];
  const first = planSends(subs, new Set());
  assert.equal(first.toSend.length, 3);
  const sent = new Set([subscriberKey("a@x.com"), subscriberKey("C@x.com")]);
  const rerun = planSends(subs, sent);
  assert.deepEqual(rerun.toSend.map((s) => s.email), ["b@x.com"]);
  assert.equal(rerun.alreadySent, 2);
});

test("the real issue 1 file parses and is held back until finished", () => {
  const issue = parseIssue(readFileSync(new URL("../../content/learning-log/issue-01.md", import.meta.url), "utf8"));
  assert.equal(issue.meta.issue, "1");
  // Flip this expectation only by finishing the issue, never by editing the test.
  if (issue.meta.status === "ready") assert.deepEqual(findBlockers(issue), []);
  else assert.ok(findBlockers(issue).length > 0);
});
