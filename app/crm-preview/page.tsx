import { notFound } from "next/navigation";
import CrmWorkspace from "../(dashboard)/dashboard/CrmWorkspace";
import { readFile } from "node:fs/promises";
import { type Workspace } from "@/lib/crm/model";
export const dynamic="force-dynamic";
export default async function CrmPreview() {
  if(process.env.NODE_ENV!=="development") notFound();
  const initial=JSON.parse(await readFile(".crm-preview.json","utf8")) as Workspace;
  return <main className="min-h-screen bg-[#f6f7f9] p-4 sm:p-8 lg:p-12"><CrmWorkspace initial={initial} preview/></main>;
}
