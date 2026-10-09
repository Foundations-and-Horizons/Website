# Scout Inbox — F&H Chief of Staff handoff

Project: `gpqivmzdkgwvdinzfhlf`. Stephen owner: `fe82ef66-5ac1-41d7-b16c-ad2034281b73`.
UI: `/dashboard/scout-inbox`, under the existing Command Center login. No new keys or authentication.

## Intake

New discoveries MUST enter `public.scout_inbox` before the CRM. Use `public.scout_inbox_ingest(p_owner uuid, finding jsonb)` instead of direct INSERT/upsert; it preserves review decisions and original evidence. It returns the inbox UUID. Never use `crm_record_event` for raw discovery.

Required finding JSON fields:
- `dedupe_key`: stable opportunity identity, shared across scouts; no scout name, run date, tracking parameters or random UUID. Use normalized organization + opportunity/program + edition/year when relevant. Check the inbox first and reuse an existing key.
- `event_id`: stable sighting/retry identifier; e.g. `book_scout:opportunity-key:2026-10-09`. Retry with the same ID. A later genuinely new sighting may use a new ID.
- `scout`, `category`, `organization`, `title`, `fit_reason`, `source_url` (http/https), `discovered_at` (actual ISO timestamp with timezone).

Optional: `opportunity_type`, `contact` (JSON object: name/email/phone/route/verification evidence), `email_verified` (boolean, default false), `important_dates` (JSON array of labeled dates and evidence), `deadline_at` (timestamp with timezone), `recommendation`, `notes`, `crm_kind` (consulting/speaking/workshop/client). Additional JSON fields are retained in the complete `original_finding` and sightings evidence.

Generated/system columns: `id`, `owner_id`, `original_finding`, `status` (New/Pursue/Hold/Pass), `created_at`, `updated_at`, `last_seen_at`, `seen_count`, `reviewed_at`, `reviewed_by`, `review_notes`, `review_after`, `crm_record_id`, `crm_entity_key`, `converted_at`. Scouts must not change these columns.

```sql
select public.scout_inbox_ingest(
 'fe82ef66-5ac1-41d7-b16c-ad2034281b73',
 jsonb_build_object('dedupe_key', 'organization:program:2027',
  'event_id','speaking_scout:organization:program:2027:2026-10-09',
  'scout','speaking_scout','category','speaking',
  'organization','Verified organization','title','Verified program 2027',
  'fit_reason','Evidence-based operational fit',
  'source_url','https://example.org/verified-program',
  'discovered_at','2026-10-09T08:00:00-06:00',
  'contact',jsonb_build_object('route','Verified public proposal form'),
  'recommendation','Review proposal requirements','crm_kind','speaking')
);
```

This example is documentation only, not a real lead. Verify the returned row after writing; never claim success on an error.

## Morning review

```sql
select * from public.scout_inbox
where owner_id='fe82ef66-5ac1-41d7-b16c-ad2034281b73'
  and status='New'
order by deadline_at asc nulls last, discovered_at asc;
```

Reading does not mark reviewed. Chief of Staff reviews findings with Stephen; Stephen need not manage the UI. For due held findings, use `status='Hold' and review_after <= (now() at time zone 'America/Denver')::date`. Holds without a review date stay available in the Hold view.

## Decisions

Call `public.scout_inbox_review(p_owner,p_id,p_status,p_reviewer,p_notes,p_kind,p_entity_key,p_review_after,p_expected_at)`.

- `p_status`: exactly `Pursue`, `Hold`, `Pass` (or `New` to explicitly reopen).
- `p_reviewer`: `chief_of_staff` or meaningful reviewer label; record Stephen's decision in `p_notes`.
- `p_kind`: required for the first Pursue; choose the existing CRM category intentionally (e.g. podcast speaking; book partnership consulting). Not required for Hold/Pass.
- `p_entity_key`: optional EXISTING CRM entity key. Read CRM first; reuse matching organization/category/verified email. Explicit selection resolves ambiguous matches.
- `p_review_after`: optional date for Hold.
- `p_expected_at`: fetched inbox `updated_at`, recommended to prevent stale decisions; refresh on conflict.

```sql
select public.scout_inbox_review(
 'fe82ef66-5ac1-41d7-b16c-ad2034281b73',
 'INBOX_UUID'::uuid, 'Pursue', 'chief_of_staff',
 'Stephen approved pursuing during morning review',
 'speaking', null, null, 'FETCHED_UPDATED_AT'::timestamptz
);
```

Hold/Pass return NULL unless already linked. Pursue returns the CRM UUID. Conversion and decision commit together. It calls the existing `crm_record_event` with source `manual`, stable event ID `scout-inbox:pursue:INBOX_UUID`, and only verified email. Existing stages/contact/notes are preserved; evidence is appended as an activity. Retries reuse the existing link and cannot duplicate CRM records. Changing a previously pursued item to Hold/Pass does NOT delete or change its CRM record.

## Deduplication and evidence

Unique `(owner_id,dedupe_key)` identifies an inbox opportunity across scouts. Unique `(owner_id,scout,event_id)` identifies sighting retries. Intake never resets status, overwrites the first original finding, or loses review notes. `public.scout_inbox_sightings` retains complete subsequent findings; `public.scout_inbox_reviews` retains decisions. Query them by owner_id + inbox_id. Pass is durable suppression; check all statuses before surfacing findings. A materially distinct annual opportunity needs a distinct edition key.

CRM conversion serializes writes per owner, matches normalized organization/category plus normalized title or verified email, and rejects multiple matches rather than guessing. Broader matches found by Chief of Staff should use explicit existing entity_key.

## Production verification

Applied to the production project on October 9, 2026:
- `20261009144628 scout_inbox`
- `20261009144754 scout_inbox_parameter_scope`

All three inbox tables have RLS; policies scope signed-in access to auth.uid() = owner_id. RPCs use SECURITY INVOKER; anonymous table and RPC access is revoked. No service key is sent to the browser. Database tests run in a rolled-back transaction: ingestion/retry, cross-scout dedupe, retained Pass, Hold without CRM, Pursue/retry, existing CRM reuse, unverified-email exclusion, stale-review rejection, and cross-owner/anonymous isolation. Existing CRM count remained 41 and inbox had no dummy findings after tests.

The source migrations and rollback test live in this repository. The active F&H discovery scouts are routed to intake after deployment; confirmed reply/payment events retain the CRM event workflow. Lazy B is separate and is not routed into the F&H inbox.
