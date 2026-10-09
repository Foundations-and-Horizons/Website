import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {loadInbox} from './actions';
import ScoutInbox from './ScoutInbox';
export const dynamic='force-dynamic';
export default async function InboxPage(){
 const db=await createClient();const {data:{user}}=await db.auth.getUser();
 if(!user)redirect('/dashboard/login');
 let initial,loadError;
 try{initial=await loadInbox();}
 catch{loadError="Scout Inbox could not load. Refresh to reconnect; decisions are disabled until it loads.";}
 return <ScoutInbox initial={initial||{items:[],records:[]}} loadError={loadError}/>;
}
