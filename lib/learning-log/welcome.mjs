/**
 * Welcome email — single opt-in, sent once immediately after signup.
 *
 * It names the Thursday the subscriber's issue 1 arrives (PRD D12) and carries
 * the guidelines: what an issue contains, the reader's setup, and the standard
 * exercise flow, all as decided in the planning repo's curriculum. Rendered
 * through the same template as the issues, so the two look like one thing.
 *
 * Copy follows the naming rule: this is a build log, never a "newsletter".
 * Every send must carry a working unsubscribe link (GDPR, and Gmail/Yahoo
 * bulk-sender rules), so the token is a required argument rather than an
 * optional extra.
 */
import { firstIssueDate, formatSendDate } from "./drip.mjs";
import { HUB_URL, markdownToHtml, markdownToText, NAME, unsubscribeUrl, wrapHtml, wrapText } from "./render.mjs";

export function welcomeMarkdown(firstIssue) {
  return `# You're in.

Your first issue arrives on **${firstIssue}**, in the morning. After that, one every Thursday: thirty issues, starting at issue 1 whenever you joined.

## What each issue is

- **The concept.** One idea, what problem it solves, and when *not* to reach for it.
- **The exercise.** A public GitHub repo you run yourself. Each one ships with sample material, so you can start before you have your own.
- **This week in AI.** What actually moved in the past seven days, ranked by whether you'd build with it.

## What you'll need

- **A terminal and git.** Any editor works. VS Code is the easiest place to start, and Claude Code runs inside it from issue 6.
- **Python**, for the exercises that are scripts, which is about half of them.
- **An Anthropic API key from the Console**, from issue 1. It's separate from a Claude Pro or Max subscription. It's pay-as-you-go, and every exercise README says what that exercise costs to run. Issue 1's costs nothing.
- **Claude Code**, from issue 6.

## How to work through an exercise

1. Read the issue first. The concept comes before the code.
2. Open the repo's README. Its header says what kind of exercise it is and what it needs.
3. Run it on the sample in the repo, then check your work: \`pytest\` for the scripts, your log for the rest.
4. Compare with the \`solution\` branch.
5. Then do it on your own work. That's the step that makes it stick.

Stuck, or found a step that's gone stale? Ask in [Discussions](${HUB_URL}/discussions), one place for every exercise. Or reply to this email; it comes to me.

I'm not an expert — that's the point. Every exercise is run before it reaches you, and its solution says how.

— André`;
}

/**
 * @param {string} unsubscribeToken
 * @param {Date} [signedUpAt]
 * @returns {{subject: string, text: string, html: string, unsubscribeUrl: string}}
 */
export function welcomeEmail(unsubscribeToken, signedUpAt = new Date()) {
  const firstIssue = formatSendDate(firstIssueDate(signedUpAt));
  const markdown = welcomeMarkdown(firstIssue);
  return {
    subject: `You're in. Issue 1 arrives ${firstIssue}`,
    text: wrapText({ eyebrowText: NAME, contentText: markdownToText(markdown), token: unsubscribeToken }),
    html: wrapHtml({
      title: `Welcome to the ${NAME}`,
      eyebrowText: NAME,
      contentHtml: markdownToHtml(markdown),
      token: unsubscribeToken,
    }),
    unsubscribeUrl: unsubscribeUrl(unsubscribeToken),
  };
}
