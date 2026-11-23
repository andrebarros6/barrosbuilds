---
issue: 4
of: 30
track: Working with the models
title: Reusable setup
repo: learning-log-04-reusable-setup
status: draft
---

`Issue 4 of 30 · Working with the models`

# Reusable setup

## The concept

Open the prompt you paste most often and read it as if someone else wrote it. Most of it isn't the task. It's who you are, how you write, the words you never use, the format you always want. The task is the last two lines.

You type the rest every time. And because you wrote each prompt when you first needed it, the rest is slightly different in each one. One says prices like €12.50, another says 12,50 €. One has the new delivery day, another still has the old one. Nobody notices, because nobody reads their prompts side by side. The model reads whichever one you pasted and does exactly what it says.

That context is configuration, and it belongs in one place. Written once, kept up to date in one spot, applied to every chat. In claude.ai it's a project's instructions. Through the API it's the system prompt. In Claude Code it's a file called `CLAUDE.md`, which is issue 7. Skills, in issue 19, take the same idea one step further and load it only when the task needs it. Get the split right here and both of those come almost for free.

The split is the whole skill. Every line in a repeated prompt goes one of two ways.

**Setup** is what's true for every task and will still be true next month. Who you are. House style. Domain vocabulary: what you call things, and what you never call them. Output conventions. Policies.

**Turn** is what changes. The task itself, its data, and anything with a date on it: this week's stock, this month's deadline, a price that's about to move.

Two lines need more care than the rest. Apparent conflicts first: two prompts saying different things isn't always a mistake. Customers and wholesale clients really can have different thresholds. Merge them into one "consistent" rule and you've broken one of the two tasks. Second, lines that belong to one task. Its word limit and its format sit in the turn, or in a clearly labelled section of the setup. Otherwise every chat carries every task's format, and they start leaking into each other.

Then check the output, not the tidiness. A cleaner prompt that produces worse answers is a regression with nicer formatting. Run the same inputs before and after, and score them the same way.

### When not to reach for this

Don't put volatile or task-specific detail in persistent setup. A setup is written once and reread almost never. That's the point of it, and it's also the danger. A sold-out product or a closing date goes stale there without anyone noticing, and every chat after that inherits it, with full confidence.

And don't build a setup for a prompt you use once a month. It pays off when several prompts share a context.

---

## The exercise

**Repo:** [`learning-log-04-reusable-setup`](https://github.com/andrebarros6/learning-log-04-reusable-setup)

This one happens in the Claude chat window. No code, no API key; the free plan works.

A small coffee roaster has three prompts it pastes every week: a customer reply, a product description, an update for the cafés it supplies. They've drifted apart.

1. **Run the baseline**: each prompt on two inputs, scored against six checks.
2. **Find where the prompts disagree**, and which ones only look like they do.
3. **Sort every line** into setup or turn, and write the project instructions.
4. **Run the same inputs** in the project. No score should get worse.
5. **Jump to January** and run two more without touching the setup.

Before I changed anything, five of the six outputs failed, four of them straight from a line one prompt had wrong. The setup cut what I type each time from 243, 119 and 117 words to 22, 49 and 40. It didn't hold quality on its own, though. I'd merged three tone lines into "warm and plain", and both product descriptions came back with tasting notes that weren't on the card. Tone differs by reader, not just thresholds. And a version that kept wholesale prices in the setup scored perfectly in November, then quoted a January price nobody had confirmed since. The November scoreboard would never have shown it.

**Then do it for the assistant setup you use most**: the prompts you keep in a notes file and paste at the top of chats.


<!--
COURSE FILE — timeless. The weekly send appends that Thursday's news from
content/learning-log/weeks/ and supplies the footer (PRD D1, D13).

The finding comes from the runs in SOLUTION.md on the repo's solution branch
(Claude Code subagents, 20 Nov 2026; counted as the solution run by decision
of 2026-11-23, see the curriculum's production method). Written 2026-11-23.
Status stays draft until André reads it and flips it.

Free plan check, 2026-11-14: Anthropic's help centre says projects and
project instructions are available on the free plan, up to five projects.

WORD COUNT — 2026-11-23, with the finding.

  concept:   ~475 words  (brief 400-600)
  exercise:  ~115 words  (brief ~150) + ~105 for the finding
  + news     ~200 words  from the week file
  total:     ~895 words  against a ~750-950 budget
-->
