import { type Workspace, todayDenver } from "./model";
export function scorecard(data:Workspace, year:number, today=todayDenver()) {
  const goal=data.goal;
  const target=goal ? Number(year===goal.first_year?goal.first_target:year>goal.first_year?goal.annual_target:0) : 0;
  const inYear=(date:string|null)=>!!date&&date.startsWith(year+"-")&&date<=today;
  const collected=data.invoices.filter(i=>i.status==="paid"&&inYear(i.paid_on)).reduce((s,i)=>s+Number(i.amount),0)
    +(data.otherIncome||[]).filter(i=>inYear(i.received_on)).reduce((s,i)=>s+Number(i.amount),0);
  const pending=data.invoices.filter(i=>i.status==="sent"&&inYear(i.issued_on)).reduce((s,i)=>s+Number(i.amount),0);
  return {target,collected,pending,remaining:Math.max(0,target-collected),percent:target?Math.round(collected/target*1000)/10:0};
}
