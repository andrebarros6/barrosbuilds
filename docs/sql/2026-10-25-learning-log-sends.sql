-- Learning Log weekly drip: one row per subscriber per send week.
-- Run once in the Supabase SQL editor, after newsletter_waitlist exists.
-- See docs/learning-log-weekly.md.

create table public.learning_log_sends (
  id            bigint generated always as identity primary key,
  -- Cascade: unsubscribe deletes the subscriber row, and with it every record
  -- of what they were sent. Email stays the only personal data held.
  subscriber_id bigint not null references public.newsletter_waitlist (id) on delete cascade,
  week          date not null,       -- the send Thursday
  issue         smallint not null check (issue between 1 and 30),
  status        text not null check (status in ('pending', 'sent', 'failed')),
  attempts      smallint not null default 1,
  resend_id     text,
  error         text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz
);

-- R5: one email per subscriber per week. The run claims this row before it
-- sends, so two overlapping runs cannot both send.
create unique index learning_log_sends_subscriber_week_key
  on public.learning_log_sends (subscriber_id, week);

-- Nobody is ever sent the same issue twice, whatever the weeks say.
create unique index learning_log_sends_subscriber_issue_sent_key
  on public.learning_log_sends (subscriber_id, issue)
  where status = 'sent';

-- Deny-by-default, as on newsletter_waitlist. Only the service role (which
-- bypasses RLS) reads or writes this table.
alter table public.learning_log_sends enable row level security;
