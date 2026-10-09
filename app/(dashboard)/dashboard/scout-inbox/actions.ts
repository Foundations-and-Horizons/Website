"use server";
import {session} from '@/lib/crm/data';
import {uuid,textField,dateField} from '@/lib/crm/validation';
import {revalidatePath} from 'next/cache';
import type {InboxData} from './model';
export async function loadInbox():Promise<InboxData> {
 const {db,owner}=await session();
 const [items,records]=await Promise.all([
  db.from('scout_inbox').select('*').eq('owner_id',owner).order('discovered_at',{ascending:false}),
  db.from('crm_records').select('id,kind,organization,title,entity_key').eq('owner_id',owner).order('organization'),
 ]);
 if(items.error||records.error)throw new Error('Scout Inbox could not load. No records have been changed.');
 return {items:items.data,records:records.data};
}
export async function reviewFinding(input:Record<string,unknown>) {
 const {db,owner}=await session();
 if(!['New','Pursue','Hold','Pass'].includes(String(input.status)))throw new Error('Choose a valid decision.');
 const result=await db.rpc('scout_inbox_review',{p_owner:owner,p_id:uuid(input.id),p_status:input.status,p_reviewer:'Stephen / Command Center',p_notes:textField(input.notes),p_kind:input.kind||null,p_entity_key:input.entity_key||null,p_review_after:dateField(input.review_after),p_expected_at:textField(input.updated_at,100)});
 if(result.error)throw new Error(result.error.message||'Could not save the decision. Refresh and try again.');
 revalidatePath('/dashboard');revalidatePath('/dashboard/scout-inbox');return loadInbox();
}
