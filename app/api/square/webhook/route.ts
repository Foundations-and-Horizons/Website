import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {validSquareSignature,squareInvoicePayment} from "@/lib/crm/square";
import {todayDenver} from "@/lib/crm/model";
export const runtime="nodejs";
export async function POST(request:NextRequest) {
  const key=process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,url=process.env.SQUARE_WEBHOOK_NOTIFICATION_URL,merchant=process.env.SQUARE_MERCHANT_ID,owner=process.env.SQUARE_CRM_OWNER_ID;
  const dbUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!key||!url||!merchant||!owner||!dbUrl||!service)return NextResponse.json({error:"Square synchronization is not configured"},{status:503});
  const body=await request.text();
  if(body.length>250000)return NextResponse.json({error:"Request too large"},{status:413});
  if(!validSquareSignature(body,request.headers.get("x-square-hmacsha256-signature"),key,url))return NextResponse.json({error:"Invalid signature"},{status:401});
  try{
    const payment=squareInvoicePayment(JSON.parse(body),merchant);
    if(!payment)return NextResponse.json({ignored:true});
    const db=createClient(dbUrl,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const invoice=await db.from("crm_invoices").select("amount,record_id").eq("owner_id",owner).eq("import_key",payment.key).maybeSingle();
    if(invoice.error)throw new Error("Database unavailable");
    if(!invoice.data||Number(invoice.data.amount)!==payment.amount)return NextResponse.json({error:"Invoice must be matched in the CRM before payment can sync"},{status:409});
    const record=await db.from("crm_records").select("entity_key,email").eq("owner_id",owner).eq("id",invoice.data.record_id).single();
    if(record.error)throw new Error("Database unavailable");
    if(payment.email&&record.data.email&&payment.email.toLowerCase()!==record.data.email.toLowerCase())return NextResponse.json({error:"Invoice recipient requires review"},{status:409});
    const result=await db.rpc("crm_invoice_event",{p_owner:owner,event:{source:"reconciliation",event_id:payment.eventId,entity_key:record.data.entity_key,event_type:"payment_received",invoice_key:payment.key,amount:payment.amount,paid_on:todayDenver(new Date(payment.occurredAt)),occurred_at:payment.occurredAt,summary:"Square confirmed full payment for "+payment.key}});
    if(result.error)throw new Error("Payment synchronization failed");
    return NextResponse.json({received:true});
  }catch{return NextResponse.json({error:"Square event could not be processed; review and retry"},{status:500});}
}
