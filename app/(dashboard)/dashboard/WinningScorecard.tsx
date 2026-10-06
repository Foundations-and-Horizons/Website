"use client";
import {useState} from "react";
import {money,todayDenver,type Workspace} from "@/lib/crm/model";
import {scorecard} from "@/lib/crm/scorecard";
import {logOtherIncome} from "./crm-actions";
import styles from "./crm.module.css";
export default function WinningScorecard({data,preview,onUpdate}:{data:Workspace;preview:boolean;onUpdate:(data:Workspace)=>void}) {
  const today=todayDenver(),currentYear=Number(today.slice(0,4));
  const [year,setYear]=useState(currentYear),[adding,setAdding]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const score=scorecard(data,year,today),goal=data.goal;
  if(!goal)return null;
  const years=Array.from({length:Math.max(2,currentYear-goal.first_year+2)},(_,i)=>goal.first_year+i);
  const clients=data.records.filter(r=>r.kind==="client"&&r.stage!=="on_hold");
  const conversations=data.records.filter(r=>r.kind==="consulting"&&["conversation","proposal"].includes(r.stage)).length;
  const booked=data.records.filter(r=>r.kind==="speaking"&&r.stage==="booked").length;
  async function save(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();if(preview)return;
    const fields=new FormData(event.currentTarget);setBusy(true);setError("");
    try{onUpdate(await logOtherIncome({label:fields.get("label"),amount:Number(fields.get("amount")),received_on:fields.get("received_on"),reference:fields.get("reference")}));setAdding(false);}
    catch(e){setError(e instanceof Error?e.message:"Could not record income.");}finally{setBusy(false);}
  }
  return <section className={styles.winning} aria-label="Am I winning scorecard">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Your winning mark</p><h2>Am I winning?</h2></div><label className={styles.yearChoice}>Year <select aria-label="Goal year" value={year} onChange={e=>setYear(Number(e.target.value))}>{years.map(y=><option key={y}>{y}</option>)}</select></label></div>
    <div className={styles.goalHeadline}><strong>{money(score.collected)}</strong><span>collected of your {money(score.target)} income goal</span><b>{score.percent}%</b></div>
    <div className={styles.goalTrack} role="progressbar" aria-label="Income goal progress" aria-valuenow={Math.min(100,score.percent)} aria-valuemin={0} aria-valuemax={100}><div style={{width:Math.min(100,score.percent)+"%"}}/></div>
    <p className={styles.goalStatus}>{score.remaining===0?"Winning mark reached. Keep building.":money(score.remaining)+" still to collect."} {score.pending>0?money(score.pending)+" invoiced this year is still awaiting payment confirmation.":""}</p>
    <div className={styles.goalMomentum}><div><strong>{clients.length}</strong><span>Clients won · all time</span></div><div><strong>{money(clients.reduce((s,r)=>s+Number(r.value||0),0))}</strong><span>Agreed client work · all time</span></div><div><strong>{conversations}</strong><span>Open conversations / proposals</span></div><div><strong>{booked}</strong><span>Speaking engagements booked</span></div></div>
    <p className={styles.goalFoot}>{goal.first_year}: {money(Number(goal.first_target))}. From {goal.first_year+1}: {money(Number(goal.annual_target))} each year, aiming for {money(Number(goal.take_home_aim))} take-home. This tracks income before expenses and tax; take-home is an aim, not a tax estimate.</p>
    <div className={styles.goalLinks}><span>Based on confirmed CRM payments and logged other income. Unrecorded earnings are not counted.</span><button type="button" className={styles.secondary} disabled={preview||busy} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"＋ Log other income"}</button></div>
    {adding&&<form onSubmit={save} className={styles.incomeForm}><p>For book royalties, workshop receipts or other income already received. Payments against a CRM invoice belong in Invoices; do not enter them again here.</p><div className={styles.formGrid}><label>Income description<input name="label" required maxLength={250}/></label><label>Amount received<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>Received date<input name="received_on" type="date" required max={today} defaultValue={today}/></label><label>Unique receipt / payout reference<input name="reference" required maxLength={250}/></label></div>{error&&<p role="alert">{error}</p>}<button className={styles.primary} disabled={busy} type="submit">{busy?"Saving…":"Record confirmed income"}</button></form>}
  </section>;
}
