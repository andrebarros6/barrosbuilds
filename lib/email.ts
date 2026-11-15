import { NEWSLETTER_NAME } from "@/lib/newsletter";

export const FROM_ADDRESS = `${NEWSLETTER_NAME} <log@barrosbuilds.com>`;

// Nothing receives mail at log@ — it is a send-only identity. Replies go to
// the real inbox instead, so hitting reply works. Replies are also one of the
// strongest deliverability signals a new sending domain can earn.
export const REPLY_TO_ADDRESS = "andre@barrosbuilds.com";
export const SITE_URL = "https://barrosbuilds.com";

// The welcome email lives with the issue templates in lib/learning-log, as
// plain .mjs, so it is tested and previewed the same way the issues are.
export { welcomeEmail } from "@/lib/learning-log/welcome.mjs";
