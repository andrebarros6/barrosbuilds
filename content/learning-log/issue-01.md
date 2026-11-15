---
issue: 1
of: 30
track: Working with the models
title: What the model actually sees
repo: learning-log-01-what-the-model-sees
status: draft
---

`Issue 1 of 30 · Working with the models`

# What the model actually sees

*This is the first of thirty. One concept a week and an exercise you run yourself. I'm learning this properly and publishing as I go — you're getting the same thing I am, at the same time.*

*I'm assuming you've used a chat model and that you'd rather check its work than trust it. I'm not assuming you know how to check yet, or that you've built anything with one. That's the gap this closes.*

*Starting here, because almost every frustration further on turns out to be this.*

---

## The concept

You've had this conversation. Forty messages in, something you established at the start gets ignored. The model contradicts a decision it made twenty turns ago. Output quality drifts. The natural read is that it forgot.

It didn't forget. It has no memory to forget *with*.

Every call to a model is stateless. No session, no running conversation on the other side, nothing persisting between requests. Your entire conversation — every message, yours and its, from the top — is packaged up and sent again, in full, on every turn. The model reads that flat sequence and predicts what comes next. Then it's gone.

The chat interface hides this well. It looks like you're talking to something with continuity. You're not. You're re-submitting a document that grows by two paragraphs each time you hit enter.

Two consequences follow, and everything else comes from them.

**The unit is the token, not the word.** Text gets split into tokens before the model sees it — roughly word-sized chunks, but not reliably. Common words are usually one token. Rare words split into several. Whitespace, punctuation and code all tokenize differently from prose. The rules of thumb people repeat — four characters per token, three-quarters of a word — are approximations built for older tokenizers, and only ever for English prose. Tokenizers change between model generations, and the old rule now runs low on plain prose too — lower still on code, file paths and structured data, which is exactly what you'll be putting in front of a model.

**The window is a budget, and it's shared.** Every model has a maximum number of tokens it can take in one request. Your system prompt, the entire conversation history, any documents you pasted, and the space reserved for the response all come out of the same allowance. That budget doesn't reset between turns. It fills as you talk.

Now the failure makes sense. As the window fills, two different problems appear that look identical from outside.

**Eviction.** You cross the limit, something has to go, and it's usually the oldest content — which is where you set up the task and stated your constraints. Not deprioritized: absent. The model can't act on what isn't in front of it.

**Burial** is the more interesting one, because it happens well before any limit. Attention is finite. A crucial instruction from turn three, now surrounded by forty turns of back-and-forth, tool output and pasted logs, competes with everything else in the window. Technically present, functionally invisible. This is why a long conversation degrades noticeably *before* it breaks.

Seen this way, the fixes stop being folklore. A fresh conversation works because you're rebuilding context deliberately, not because a reset clears hidden state. Restating constraints works because you've moved them from turn three to turn forty-one. Pasting a huge document "for reference" hurts, because it evicts or buries everything else.

### Measure it, don't estimate it

Here's the part I got wrong for months, and it's why this is issue 1 rather than a footnote.

I estimated. `len(text) / 4`, or a vague sense that a conversation was "getting long." Both are guesses, and both wrong in the direction that hurts: they under-count exactly the content that tokenizes badly — code, JSON, tables, non-English text.

Counting tokens is an API call. Cheap, fast, and it gives you the real number. Two things worth knowing.

Tokenizers are model-specific. `tiktoken` is a good library and the wrong tool for measuring what you send to Claude — it produces a plausible figure that quietly disagrees with what you're actually billed and bounded by.

And the numbers move. Context windows change between model versions, tokenizers between generations, so any limit I print here is stale within months. Query them instead: the models endpoint reports each model's context window, and the token-counting endpoint tells you what your prompt actually costs. Both are live. Anything published — including this — is a snapshot.

That habit is the durable skill. The specific numbers aren't.

### When not to reach for this

Don't optimize context before you've measured it.

Most problems that look like context problems, at the scale you're working now, are prompt problems. A vague instruction produces vague output whether it's at turn three or turn thirty. Restructuring your whole context management to fix what was actually an under-specified request is a lot of work for nothing — and worse, it teaches you the wrong lesson about what went wrong.

Measure first. If the count is comfortable and the output is still poor, the problem is what you asked, not how much you sent. That's issue 2.

---

## The exercise

**Repo:** [`learning-log-01-what-the-model-sees`](https://github.com/andrebarros6/learning-log-01-what-the-model-sees)

This one is a script you run in a terminal, against the API. That's not a preference: the chat window never shows you a token count, and the API is the only place the real number exists. Not every exercise is like this — about half happen inside Claude or Claude Code — but this one can't be.

Take a real conversation — a long one, from actual work, not a toy. Export it.

Then:

1. **Count it properly.** Token counts per message, using a real tokenizer for the model you used, not a character heuristic.
2. **Chart the growth.** Cumulative tokens against turn number. The shape is the point: it climbs faster than you'd guess, because every turn resends everything before it.
3. **Find the turn it broke.** You'll usually remember roughly where quality dropped. Locate it on the chart, then look at what was in the window at that moment — and what had fallen out, or was buried under forty turns of noise.
4. **Compare heuristic to actual.** Run `len(text) / 4` alongside the real count. Note the gap, and where it's worst. Expect it to be low everywhere, and worst on code, file paths and JSON.

The starter handles export parsing and the chart; the tests run without an API key so you can check your parsing for free. The solution branch has mine.

I ran it on a 69-turn Claude Code session with almost no code in it, and `len / 4` still came out 30% low, on nearly every turn. The biggest jump wasn't anything I pasted: one turn added 9,710 tokens of environment the tool injected on its own. Of everything the model saw, I'd typed about 2%.

**Now do it on your own longest working chat** — the one you actually rely on. Nothing about this lands until you see your own number.


<!--
COURSE FILE — timeless. The weekly send appends that Thursday's news from
content/learning-log/weeks/ and supplies the footer (PRD D1, D13), so neither
lives here. The news drafted for 15 October is in git history and the
planning repo's drafts file.

WORD COUNT — rechecked 2026-10-25.

  concept:   ~760 words  (brief 400-600)
  exercise:  ~200 words  (brief ~150)
  + news     ~200 words  from the week file
  total:   ~1,160 words  against a ~750-950 budget

The concept is load-bearing as it stands: the eviction/burial distinction is
the spine of the issue and seeds issues 5, 21 and 27; the tokenizer and
query-it-live points are the durable skill the exercise then drills. Issue 1
stays over budget because of its framing preamble, which no other issue
carries; exempt it explicitly rather than cut the concept further.
-->
