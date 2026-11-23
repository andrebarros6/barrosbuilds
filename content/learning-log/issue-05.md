---
issue: 5
of: 30
track: Working with the models
title: Context engineering
repo: learning-log-05-context-engineering
status: draft
---

`Issue 5 of 30 · Working with the models`

# Context engineering

## The concept

Every message carries its context with it. The instructions, the documents you pasted, the whole conversation so far: the model reads all of it, every time. Issue 1 measures that. So context is a budget. You spend it on every call, and you decide what it buys.

The easy way to spend it is to paste everything. The whole policy folder, the whole spreadsheet, the whole thread. Choosing takes effort, and leaving something out feels like a risk. That's the anti-pattern: the dump. Not because it always fails. Strong models often cope with a lot of noise. But it always costs, and when it does fail, it fails quietly.

Three moves, in this order.

**Selection.** What does this task actually need? Usually a handful of facts: the current rule, the one record it applies to, today's date. Out-of-date versions are the worst kind of noise, because they don't look wrong. A smaller model handed three versions of the same policy rarely picks the wrong one. It stalls, and writes "I'll check", which looks careful and isn't an answer.

**Ordering.** Stable material first, the question last. That's the layout Anthropic recommends for long inputs, and there's a mechanical reason too. Through the API, a cached prefix is reused only if it matches byte for byte, so anything that changes per call, placed early, invalidates the cache for everything after it. Issue 27 does the arithmetic.

**Eviction.** What can go now that it has done its job? Superseded versions, settled threads, last month's numbers. In a long chat, this is when you start a fresh one with a summary instead of carrying the history.

The skill isn't cutting. It's defending the cut. "Superseded by the October terms" holds up. "Not relevant" usually doesn't.

### Checking what your tool gives you

Claude and ChatGPT both publish their context windows per plan and per model, and both change them. Don't trust a number you read in passing, including here. Look up your plan's help page, then test it: paste your longest document and ask about something near the middle.

### When not to reach for this

When the material fits and all of it is relevant, engineering it is wasted work. A long document the task needs belongs in the context whole. Issue 27 makes that case properly.

And a cut loses what you didn't know to keep. A selection answers the question you asked. Everything sometimes answers one you didn't think to ask.

---

## The exercise

**Repo:** [`learning-log-05-context-engineering`](https://github.com/andrebarros6/learning-log-05-context-engineering)

This one happens in the Claude chat window. No code, no API key; the free plan works.

A small coffee roaster has three emails to answer, and a shared drive of about 10,000 words: three versions of its terms, an old FAQ, a year of invoices, and past replies that quote rules since replaced. The prompt is fixed. Only the context changes.

1. **Answer all three with the whole drive** pasted in, and score the replies.
2. **Select** what each email needs, and write down why you dropped the rest.
3. **Answer them again** with only your selection.
4. **Compare** the size, the answers, and anything the whole-drive replies said that yours couldn't.

My selections were 97% smaller, and on Sonnet and Opus both versions got every answer right. Haiku is a different story, and so is what the whole-drive replies said that my selections couldn't. Both are in SOLUTION.md on the repo's solution branch. Do the exercise first.

**Then find the largest prompt in your own work**, the one where you paste a whole document because choosing is harder, and cut it by half without losing quality.


<!--
COURSE FILE — timeless. The weekly send appends that Thursday's news from
content/learning-log/weeks/ and supplies the footer (PRD D1, D13).

Brief amended 2026-11-23 after a pilot (planning repo, learning-log-issues.md,
issue 5). The original "a task that fails with a naive dump" only reproduced
on Haiku.

The finding comes from the runs in SOLUTION.md on the repo's solution branch
(Claude Code subagents, 23 Nov 2026; counted as the solution run by decision
of 2026-11-23). "The free plan works" is an assumption, decided 2026-11-23:
the help centre states no free-plan context window.

Verified 2026-11-23: Anthropic's long-context prompting tips put long
documents above the query; the prompt-caching docs describe the cache as an
exact prefix match, invalidated from the first changed byte onward.

WORD COUNT — 2026-11-23.

  concept:   ~415 words  (brief 400-600)
  exercise:  ~190 words  (brief ~150, plus a short finding)
  + news     ~200 words  from the week file
  total:     ~805 words  against a ~750-950 budget

The finding is cut to what doesn't spoil the exercise (2026-11-23). Haiku's
results and the dropped email archive live only in SOLUTION.md.

Status stays draft until André reads it and flips it.
-->
