export type InboxStatus = 'New' | 'Pursue' | 'Hold' | 'Pass';
export type ScoutFinding = {
 id:string; dedupe_key:string; scout:string; category:string; organization:string; title:string; opportunity_type:string;
 fit_reason:string; contact:Record<string,unknown>; email_verified:boolean; important_dates:unknown[]; deadline_at:string|null;
 source_url:string; recommendation:string; notes:string; original_finding:Record<string,unknown>; discovered_at:string;
 last_seen_at:string; seen_count:number; status:InboxStatus; reviewed_at:string|null; reviewed_by:string|null;
 review_notes:string; review_after:string|null; crm_kind:string|null; crm_record_id:string|null; updated_at:string;
};
export type InboxData = {items:ScoutFinding[];records:{id:string;kind:string;organization:string;title:string;entity_key:string|null}[]};
