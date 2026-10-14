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

*This is the first of thirty. One concept a week, an exercise you run yourself, and an honest log of what broke. I'm learning this properly and publishing as I go — you're getting the same thing I am, at the same time.*

*I'm assuming you've used a chat model and that you'd rather check its work than trust it. I'm not assuming you know how to check yet, or that you've built anything with one. That's the gap this closes.*

*Starting here, because almost every frustration further on turns out to be this.*

---

## The concept

You've had this conversation. Forty messages in, something you established at the start gets ignored. The model contradicts a decision it made twenty turns ago. Output quality drifts. The natural read is that it forgot.

It didn't forget. It has no memory to forget *with*.

Every call to a model is stateless. No session, no running conversation on the other side, nothing persisting between requests. Your entire conversation — every message, yours and its, from the top — is packaged up and sent again, in full, on every turn. The model reads that flat sequence and predicts what comes next. Then it's gone.

The chat interface hides this well. It looks like you're talking to something with continuity. You're not. You're re-submitting a document that grows by two paragraphs each time you hit enter.

Two consequences follow, and everything else comes from them.

**The unit is the token, not the word.** Text gets split into tokens before the model sees it — roughly word-sized chunks, but not reliably. Common words are usually one token. Rare words split into several. Whitespace, punctuation and code all tokenize differently from prose. The rules of thumb people repeat — four characters per token, three-quarters of a word — are approximations that hold for English prose and fall apart precisely where you need them, which is on code, structured data, and non-English text. Those are exactly what you'll be putting in front of a model.

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

Take a real conversation — a long one, from actual work, not a toy. Export it.

Then:

1. **Count it properly.** Token counts per message, using a real tokenizer for the model you used, not a character heuristic.
2. **Chart the growth.** Cumulative tokens against turn number. The shape is the point: it climbs faster than you'd guess, because every turn resends everything before it.
3. **Find the turn it broke.** You'll usually remember roughly where quality dropped. Locate it on the chart, then look at what was in the window at that moment — and what had fallen out, or was buried under forty turns of noise.
4. **Compare heuristic to actual.** Run `len(text) / 4` alongside the real count. Note the gap, and where it's worst. If your conversation has code or JSON in it, the gap will be embarrassing.

The starter handles export parsing and the chart; the tests run without an API key so you can check your parsing for free. The solution branch has mine.

<!-- BLOCKED: the sentence that belongs here is what the numbers actually
     showed on my own conversation — the size of the gap, and which turn
     caused the biggest jump. It cannot be written until the exercise has
     been run. Do not ship issue 1 with this comment still in place. -->

**Now do it on your own longest working chat** — the one you actually rely on. Nothing about this lands until you see your own number.

---

<!--
DATED BLOCK — do not publish with placeholders.

Per the curriculum: this block is shared, written the week of sending, and
must stand alone. Subscribers are at different points in the sequence, so it
cannot assume the reader just read the concept above.

"What broke" must be real and verifiable. Never invent it. If nothing broke
this week, that is a signal the week's exercise was too small — say that
instead of manufacturing a failure.
-->

## What broke

> **[TO WRITE — ~200–300 words, from your actual week.]**
>
> Real, specific, verifiable. Name the thing, what you expected, what happened, what it cost you, and what you changed.
>
> A natural candidate if it fits honestly: the token-counting gap from building this exercise — the moment your character-based estimate turned out to be materially wrong on real content. Only use it if that genuinely happened this week.
>
> Must stand alone. Do not open with "as we saw above."

## From the build

Claude Haiku 5.5 came out last week. Crafted runs three of its calls on Haiku 4.5 (parsing the CV, parsing the job description, scoring the fit), so I checked what switching would take. It isn't a one-line change.

Crafted decides how much of a job description the model sees in characters, not tokens: the first 2,000 characters when tailoring the CV, 1,500 when scoring, 1,000 for the cover letter. None of those limits comes from a token count. On the new tokenizer, the same 2,000 characters cost roughly 30% more tokens, so every limit shifts without a line of code changing.

There's a second catch. Six places in the code read the reply as `content[0]` and expect text. Haiku 5.5 thinks by default, so the first block of a reply can be a thinking block instead.

So the order is: count the real prompts first, then switch the model.

## This week in AI

**[Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview).** Anthropic's small model now has a 1M-token window and starts at $0.10 / $0.50 per million input / output tokens. That rate holds for prompts up to 100,000 tokens; above that, input costs five times more. It also uses the newer tokenizer, so the same text counts as about 30% more tokens than on Haiku 4.5. Why it matters: price now depends on how much you send, so context size is a cost decision as well as a quality one. If you migrate, read the [migration guide](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide) first: non-default sampling parameters return errors, and a reply can start with a thinking block.

**Decision models.** A new category from Cloudflare ([Clef](https://infoq.com/news/2026/10/clef-decision-models)) and Microsoft ([Decision-1](https://www.testingcatalog.com/microsoft-launches-decision-1-model-in-foundry/)). You pass a fixed set of options; the model returns a probability for each, in one pass, with no text to parse. Clef comes in 27B and 9B sizes with a 64K window, and the weights are on Hugging Face. Decision-1 runs in Microsoft Foundry from $0.042 per million input tokens, with output free. Why it matters: a routing or classification step you now handle by asking a chat model for JSON could become one cheap call with a calibrated score. The benchmarks so far are the vendors' own.

**[Meta Muse Wonder](https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder).** Meta's first frontier model, on its Model API at $4 / $20 per million input / output tokens. A larger Wonder Full stays inside Meta's Muse Code subscription. Meta says it scores comparably to the top models from Anthropic and OpenAI and leads on long-term memory, but those are Meta's own tests. Why it matters: one more provider at the top tier, which only helps if your code isn't tied to one vendor's API.

**[Mistral Large 4](https://letsdatascience.com/news/mistral-debuts-large-4-open-weight-model-preview-cbf9e0b5).** Public preview in Mistral Studio, multimodal, with a 1M-token window. Mistral says downloadable weights follow by the end of October; the licence isn't confirmed yet. Why it matters: if the weights ship under a permissive licence, it's a large model you can run on your own infrastructure, which matters for data that can't leave the EU.

**Google: Nano Banana 2.1 and EmbeddingGemma 2.** [Nano Banana 2.1](https://yourstory.com/ai-story/nano-banana-21-google-ai-image-generation-cheaper), Google's image model, roughly halves the price per image (1K images go from $0.067 to $0.034) and lets you edit over several turns instead of regenerating. [EmbeddingGemma 2](https://www.eesel.ai/blog/embeddinggemma-2) is open (Apache 2.0, 740M parameters) and puts text, code, images, audio and video in one embedding space. Why it matters: image generation is now cheap enough for per-user features, and search across mixed media can run on a laptop or phone without an API.

---

*You're getting this because you joined the Learning Log waitlist. One issue a week, free, unsubscribe whenever.*

*Every exercise is public and stays updated as the tools change: [github.com/andrebarros6/learning-log](https://github.com/andrebarros6/learning-log)*

<!--
WORD COUNT — trimmed, one decision left.

  concept:   755 words  (brief 400-600)
  exercise:  208 words  (brief ~150)
  timeless:  963 words
  + dated block ~550-650 => ~1,510-1,610 against a 1,200-1,500 budget.

Down from ~1,750. Cut in this pass:
  - the Claude-vs-ChatGPT paragraph, in full (weakest content, ages fastest)
  - ~100w of redundancy from "measure it"
  - ~65w of connective padding from the stateless and eviction/burial passages

What remains is close to the ceiling but not under it. Everything still
here is load-bearing: the eviction/burial distinction is the spine of the
issue and seeds issues 5, 21 and 27; the tokenizer and query-it-live points
are the durable skill the exercise then drills.

Recheck once the dated block is written and the real total is known. If it
lands over 1,500, the honest move is to exempt issue 1 explicitly in the
curriculum (it carries the framing preamble no other issue needs) rather
than cut into the concept further.
-->
