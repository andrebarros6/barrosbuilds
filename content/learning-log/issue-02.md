---
issue: 2
of: 30
track: Working with the models
title: Prompting as engineering
repo: learning-log-02-prompting-as-engineering
status: draft
---

`Issue 2 of 30 · Working with the models`

# Prompting as engineering

## The concept

Most prompting advice is folklore. "You are a world-class expert." "Take a deep breath." "I'll tip you $200." Each one spread because someone tried it and the output looked better.

Looked better, on one input, against nothing written down. That's the whole evidence base. Nobody checked whether the output improved or just changed, and nobody tried it on a second input.

Strip the folklore out and what's left is duller, and it works.

**Specificity beats incantation.** "Be concise" is an adjective the model has to interpret. "Under 200 words" is a constraint it can meet. One nudges the output; the other changes it.

**Examples beat adjectives.** You can spend a paragraph describing the tone and layout you want, or paste one example of it. The example wins, because it leaves nothing to interpret.

**Stated shape beats implied shape.** You know you want decisions first, then actions with owners. The model doesn't, unless you say so. Most "it ignored me" moments are a format you had in mind and never wrote down.

None of these is a trick. Each closes a gap between what you meant and what you typed. That's also why there's no magic phrase to learn: the gap is different for every task, so the fix is too.

So stop treating a prompt as something you write once and hope about. Treat it like code: write it, run it, look at where it fails, change it, run it again. Two rules make that loop worth anything.

**Change one thing at a time.** Change three things, the output improves, and you've learned nothing. You don't know which change did it, or whether one of the others broke something you haven't noticed yet.

**Run every version against several inputs.** A prompt tuned on one input is tuned to that input. You fix what was wrong with it, the fix looks like success, and it falls over on the next one. That's overfitting, and from the inside it feels exactly like progress.

The second rule is the one people skip, because it's tedious. Five inputs and four versions is twenty runs, each scored by hand. That tedium is real, and it's the point. This loop doesn't scale, and issue 12 turns it into an eval that runs itself. You'll understand what an eval is for much better once you've been the eval.

### When not to reach for this

Don't iterate a prompt against a single input. You'll overfit to it, and the fix will look like success.

And don't run the loop on a one-off. If you're asking something once and reading the answer yourself, just ask: you are the check. The loop pays for itself on prompts you reuse, on inputs you won't read every time.

---

## The exercise

**Repo:** [`learning-log-02-prompting-as-engineering`](https://github.com/andrebarros6/learning-log-02-prompting-as-engineering)

This one happens in the Claude chat window. No code, no API key; the free plan works.

The task is one most people already hand to a model: turn a meeting transcript into notes for someone who wasn't there. The repo has five transcripts and six pass/fail checks for what good notes get right.

1. **Write v1 the way you normally would.** You need an honest baseline.
2. **Run it on all five**, each in a fresh chat, and score every output.
3. **Change one thing**, save it as the next version, and run all five again.
4. **Stop** at five out of five, or when two versions in a row don't move the score.
5. **Check your scores** against the answer key on the solution branch.

My v1 was eight words and passed none of the five. Adding "under 200 words" fixed length on all five at once. By v4 my scoreboard said 5/5. The answer key disagreed: asking for calendar dates had pushed the model to invent one where the real date was inaudible, and I'd passed it. The miss worth finding isn't a fail you couldn't fix. It's a pass that should have been a fail.

**Then run the loop on a prompt you already use**: the one you paste every week and tidy up by hand. Five real inputs, checks written first.


<!--
COURSE FILE — timeless. The weekly send appends that Thursday's news from
content/learning-log/weeks/ and supplies the footer (PRD D1, D13).

Exercise finding is from André's run on the solution branch (Opus 5.5,
claude.ai, 26 October 2026; SOLUTION.md).

WORD COUNT — 2026-11-03.

  concept:   ~470 words  (brief 400-600)
  exercise:  ~210 words  (brief ~150)
  + news     ~200 words  from the week file
  total:     ~880 words  against a ~750-950 budget
-->
