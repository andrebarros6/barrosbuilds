/**
 * Learning Log — config for the waitlist surfaces.
 *
 * Naming rule: in user-facing copy this is never called a "newsletter".
 * The name is Learning Log; what it is is "a public build log".
 *
 * The wordmark sits ABOVE the headline (Syne 800) and the headline stays
 * fixed — the name does not get folded into the headline text.
 */
export const NEWSLETTER_NAME = "Learning Log";
export const NEWSLETTER_DESCRIPTOR = "a public build log";
export const FIRST_ISSUE_MONTH: string | null = "September";
export const MONTH_PLACEHOLDER = "[MONTH]";

export const NEWSLETTER_HEADLINE = "Learn AI by building it. Every week.";

export function firstIssueMonth(): string {
  return FIRST_ISSUE_MONTH ?? MONTH_PLACEHOLDER;
}
