# CRM updates for Client Scout, Speaking Scout and Reply Watch

The private `/dashboard` reads `crm_records`, `crm_invoices`, `crm_tasks` and `crm_activity` in the F&H website Supabase project. Earlier tables remain intact for history. The dashboard listens for database changes and checks again every 30 seconds if its event connection is unavailable.

## Rules for every run

Read the shared CRM before researching or contacting an organization. Match an existing `entity_key` by organization, category and verified email; do not create another record for the same opportunity. If a match is ambiguous, flag it for human review. For a new record, use a stable key like `consulting:organization-slug:operations-consulting` or `speaking:organizer-slug:event-year`. Preserve that key in later runs.

Log confirmed events immediately after they happen, then verify that the event and updated record exist. Retrying an event must use the same `event_id`. For email, use `gmail:MESSAGE_ID` even when a different scout observes it. For scouting, use `scout:STABLE_OPPORTUNITY_KEY:FIRST_DISCOVERY_DATE`. Do not use a fresh random ID on retries. The function ignores older events for status changes and records them as history. It never reopens closed or paused records automatically.

Use current evidence. A draft is not a sent email. A friendly reply is not a booked meeting. Scouted speaking opportunities are not applications; only a confirmed submission may use `application_submitted`. Autoresponders and emoji reactions are notes, not positive replies. Declines close the opportunity and clear its follow-up. No new emails may be sent without the user's applicable sending authorization. CRM synchronization does not grant new permission to send email.

## Connected Supabase SQL tool

Resolve the owner's ID from the already-known F&H login in `auth.users`. The SQL connector runs as a database administrator; the functions use invoker security. Browser callers use their authenticated owner ID and row-level ownership policies. Never store or share a service-role key with a scout.

Read the existing records, then invoke this function through `execute_sql` using correctly quoted JSON:

```sql
select public.crm_record_event(OWNER_UUID, jsonb_build_object(
 'source', 'client_scout',
 'event_id', 'gmail:CONFIRMED_MESSAGE_ID',
 'entity_key', 'EXISTING_ENTITY_KEY',
 'kind', 'consulting',
 'event_type', 'email_sent',
 'occurred_at', 'ACTUAL_EVENT_TIME_WITH_TIMEZONE',
 'summary', 'Brief factual summary with message or source reference',
 'next_action', 'One useful next step'
));
```

Sources: `client_scout`, `speaking_scout`, `reply_watch`, `manual`, `reconciliation`.

Record event types: `discovered`, `email_sent`, `reply_received`, `positive_reply`, `declined`, `application_submitted`, `booked`, `note`.

For a new record, include `organization`, `title`, `contact`, and `email` if verified. `kind` must be `consulting`, `speaking`, `client` or `workshop`. A `discovered` event creates a scouted prospect/speaking opportunity. Reply Watch should classify explicit interest in talking as `positive_reply`, a normal human response as `reply_received`, and a decline as `declined`. Do not infer payments, dates or booked meetings.

## Square invoice and payment notifications

Match the existing client and exact external invoice number. Ignore test invoices, refunds, marketing messages and unrelated payments. A provider-confirmed full payment can update the tracked invoice using:

```sql
select public.crm_invoice_event(OWNER_UUID, jsonb_build_object(
 'source', 'reply_watch',
 'event_id', 'gmail:CONFIRMED_PAYMENT_MESSAGE_ID',
 'entity_key', 'EXISTING_CLIENT_ENTITY_KEY',
 'event_type', 'payment_received',
 'invoice_key', 'square:EXACT_INVOICE_NUMBER',
 'amount', CONFIRMED_FULL_AMOUNT,
 'paid_on', 'CONFIRMED_PAYMENT_DATE',
 'occurred_at', 'ACTUAL_EVENT_TIME_WITH_TIMEZONE',
 'summary', 'Provider confirmation and reference'
));
```

For `invoice_sent`, supply verified `label`, `amount`, `issued_on`, and `due_on` if known. Payment notifications must match an existing invoice and full amount; partial payments and mismatches require manual review. Replaying a sent notification cannot turn a paid invoice back into sent. Log provider confirmation, not a guessed financial outcome.

## Operational limits

These functions are active database integrations, not Gmail push subscriptions. Scheduled scouts update the CRM when their jobs run, and authorized sends should be logged during that same run. Reply Watch updates when it checks the inbox. The open dashboard receives those database changes promptly. Existing job schedules and notification preferences should be preserved; notify the user only for meaningful changes or required action.

When the connector or CRM is unavailable, explicitly report that synchronization failed. Keep the confirmed provider message ID for replay on the next run. Never claim a CRM update succeeded until it is verified.
