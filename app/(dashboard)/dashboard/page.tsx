import CrmWorkspace from "./CrmWorkspace";
import { workspace } from "@/lib/crm/data";
export const dynamic = "force-dynamic";
export default async function DashboardHome() {
  let initial, loadError;
  try { initial = await workspace(); }
  catch(error) { loadError=error instanceof Error?error.message:"CRM unavailable. Please try again."; }
  return <CrmWorkspace initial={initial||{records:[],invoices:[],tasks:[],activity:[]}} loadError={loadError}/>;
}
