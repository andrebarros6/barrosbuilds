import assert from "node:assert/strict";
import { test } from "node:test";
import { HUB_URL, unsubscribeUrl } from "./render.mjs";
import { welcomeEmail } from "./welcome.mjs";

test("the welcome names the Thursday issue 1 arrives", () => {
  const sunday = welcomeEmail("tok", new Date("2026-10-25T10:00:00Z"));
  assert.equal(sunday.subject, "You're in. Issue 1 arrives Thursday 29 October");
  assert.match(sunday.text, /Your first issue arrives on Thursday 29 October/);
  // A Thursday signup waits a week, matching the drip's cutoff.
  const thursday = welcomeEmail("tok", new Date("2026-10-29T09:00:00Z"));
  assert.match(thursday.subject, /Thursday 5 November$/);
});

test("the welcome carries the guidelines from the curriculum", () => {
  const { text } = welcomeEmail("tok", new Date("2026-10-25T10:00:00Z"));
  for (const heading of ["WHAT EACH ISSUE IS", "WHAT YOU'LL NEED", "HOW TO WORK THROUGH AN EXERCISE"]) {
    assert.match(text, new RegExp(`^${heading}$`, "m"));
  }
  assert.match(text, /separate from a Claude Pro or Max subscription/);
  assert.match(text, /solution branch/);
  assert.ok(text.includes(`${HUB_URL}/discussions`));
  assert.match(text, /I'm not an expert — that's the point\./);
  assert.doesNotMatch(text, /newsletter/i);
});

test("the welcome has a working unsubscribe link in both parts", () => {
  const w = welcomeEmail("tok-9", new Date("2026-10-25T10:00:00Z"));
  assert.equal(w.unsubscribeUrl, unsubscribeUrl("tok-9"));
  assert.ok(w.html.includes(unsubscribeUrl("tok-9")));
  assert.ok(w.text.includes(`Unsubscribe: ${unsubscribeUrl("tok-9")}`));
});
