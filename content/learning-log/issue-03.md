---
issue: 3
of: 30
track: Working with the models
title: Structured outputs
repo: learning-log-03-structured-outputs
status: draft
---

`Issue 3 of 30 · Working with the models`

# Structured outputs

## The concept

At some point you stop reading the model's answer and start handing it to a program. A script that files receipts, a sheet that fills itself, a step in a pipeline. The moment that happens, the output has a reader that can't squint.

So you ask for JSON. "Return only the JSON." It works, often enough that you build on it. Then one reply comes back wrapped in a markdown code fence. Another starts with "Here's the extracted order:". A third has a product called `Monitor arm 27"`, and the quote mark isn't escaped. Each one looks fine to you, and each one breaks `json.loads`.

The usual fix is to repair it. Strip the fences. Find the first `{` and the last `}`. Regex out the part you want. Every repair works until the reply changes shape in a way you didn't think of, and then it fails quietly, on a format you've never seen. You haven't fixed the problem. You've written a parser for one model's habits.

Asking nicely for JSON is not a contract. There are three levels, and the one that matters is the jump from the first to the second.

**Shape in the prompt.** You list the fields and ask. Nothing enforces it. You're hoping the shape holds.

**Shape in a schema.** You hand the API a JSON Schema and generation is constrained to it. The reply parses, every required field is there, and the types are the ones you declared. You've stopped hoping and started constraining. On the Claude API this is structured outputs; your SDK can build the schema from a typed model, so the shape you validate against and the shape you asked for are the same definition.

**Validation after.** A schema guarantees shape, not truth. An order whose line items don't add up to its total is perfectly valid JSON. So the last step checks values: the sums agree, the date is real, the currency is a currency. The schema moves the failures from "can't parse" to "parsed, and wrong", and the second kind you can test for.

If you learned to force JSON by starting the model's reply with `{` yourself, a trick called prefill, it's gone. Current models return an error if you try. The schema replaces it.

### When not to reach for this

If you want prose, don't force JSON. A summary, an explanation or a draft written to fit a schema is a worse summary, explanation or draft: the model spends its effort on the format instead of the writing. Constrain the shape when a program reads the output. When a person does, leave it as text.

---

## The exercise

**Repo:** [`learning-log-03-structured-outputs`](https://github.com/andrebarros6/learning-log-03-structured-outputs)

This one starts in the chat window and ends in a script, because the chat can only ever give you the first level.

Six messy order emails, each with a trap: VAT already inside the prices, a forwarded correction, a date written the American way, a quote mark in a product name, a refund with no order number.

1. **In the chat**, extract each one as JSON and save the reply exactly as it came. Then break it on purpose.
2. **Check it** with a script that runs `json.loads` on the reply as it stands. No repairs.
3. **Through the API**, run the same prompt, then the same emails with a schema. Count the failures.
4. **Read the values** of the outputs that parse. The schema can't catch the traps.

> **[TO WRITE — André's finding, 2–3 sentences, from his own run of the chat step and both API modes. What the chat gave him, the parse rate in each mode, and any trap the model fell into.]**

**Then point it at a document type you actually process**: the invoices, bookings or statements you currently read and retype.


<!--
COURSE FILE — timeless. The weekly send appends that Thursday's news from
content/learning-log/weeks/ and supplies the footer (PRD D1, D13).

The finding must come from André's run, not from Claude's smoke test. For
reference only, the smoke test on 2026-11-03 (Opus 5.5, one run per email):
prompt-only parsed 0/6, every reply wrapped in a ```json fence with valid
JSON inside; schema mode parsed 6/6, right shape 6/6, adds up 6/6, and
every trap was handled correctly. If André's run matches, the honest line
is that the fence was the only failure, which is exactly the temptation to
regex it away.

WORD COUNT — 2026-11-03, before the finding.

  concept:   ~440 words  (brief 400-600)
  exercise:  ~150 words  (brief ~150) + ~50 for the finding
  + news     ~200 words  from the week file
  total:     ~840 words  against a ~750-950 budget
-->
