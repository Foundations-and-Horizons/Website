(function (root) {
  'use strict';
  const EVENTS = [
    {id:'barrels',name:'Barrel Racing',brand:'Turn & Burn',type:'timed',color:'#BE4B23',symbol:'barrel',horse:true,tag:'Find your line. Finish strong.'},
    {id:'breakaway',name:'Breakaway Roping',brand:'Breakaway Roping',type:'timed',color:'#2E7472',symbol:'loop',horse:true,tag:'A clean start. A quick catch.'},
    {id:'goats',name:'Goat Tying',brand:'Goat Tying',type:'timed',color:'#84612D',symbol:'goat',horse:true,tag:'Dismount. Gather. Tie.'},
    {id:'tiedown',name:'Tie-Down Roping',brand:'Tie-Down Roping',type:'timed',color:'#47637A',symbol:'calf',horse:true,tag:'Every catch. Every tie. Every finish.'},
    {id:'steer',name:'Steer Wrestling',brand:'Steer Wrestling',type:'timed',color:'#67703C',symbol:'steer',horse:true,tag:'From the box to the ground.'},
    {id:'team',name:'Team Roping',brand:'Team Roping',type:'timed',color:'#7A4C3F',symbol:'team',horse:true,tag:'Two riders. One run.'},
    {id:'bareback',name:'Bareback Riding',brand:'Bareback Riding',type:'scored',color:'#786078',symbol:'bareback',horse:false,tag:'Track the ride. Build your score.'},
    {id:'saddle',name:'Saddle Bronc Riding',brand:'Saddle Bronc Riding',type:'scored',color:'#98603A',symbol:'saddle',horse:false,tag:'Rhythm from the first jump.'},
    {id:'bulls',name:'Bull Riding',brand:'Bull Riding',type:'scored',color:'#494E56',symbol:'bull',horse:false,tag:'Every out is something to learn from.'}
  ];
  const KEYS={profile:'barn-ready-profile-v1',entries:'barn-ready-entries-v1',rodeos:'barn-ready-rodeos-v1'};
  function read(storage,key,fallback){try{const value=JSON.parse(storage.getItem(key));return value==null?fallback:value;}catch(_){return fallback;}}
  function readArray(storage,key){const a=read(storage,key,[]);return Array.isArray(a)?a:[];}
  function getProfile(storage){const p=read(storage,KEYS.profile,{});return {name:typeof p.name==='string'?p.name:'',school:typeof p.school==='string'?p.school:'',events:Array.isArray(p.events)?p.events.filter(id=>EVENTS.some(e=>e.id===id)):['barrels'],teamRole:['header','heeler','both'].includes(p.teamRole)?p.teamRole:'both'};}
  function rodeoKey(name,date){return String(name||'').trim().toLowerCase().replace(/\s+/g,' ')+'|'+String(date||'');}
  function legacyEntries(storage){return readArray(storage,'turn-burn-runs').map(r=>({...r,eventId:'barrels',rodeoName:r.event||'Unnamed rodeo',status:r.status||'qualified',kind:r.kind||'competition',penalty:Number(r.penaltySeconds)||0,legacy:true}));}
  function allEntries(storage){return legacyEntries(storage).concat(readArray(storage,KEYS.entries));}
  function allRodeos(storage){const saved=readArray(storage,KEYS.rodeos);const out=saved.slice();legacyEntries(storage).forEach(r=>{if(!out.some(x=>x.id===r.rodeoId||rodeoKey(x.name,x.date)===rodeoKey(r.rodeoName,r.date)))out.push({id:'legacy:'+r.id,name:r.rodeoName,date:r.date||'',arena:r.arena||'',city:'',category:r.category||'college',expenses:0,legacy:true});});return out;}
  function eventEntries(storage,id){return allEntries(storage).filter(r=>r.eventId===id);}
  function seasonEntries(entries,season){if(season==='all')return entries;const year=Number(season);return entries.filter(r=>r.date>=year+'-07-01'&&r.date<=(year+1)+'-06-30');}
  function metrics(entries,rodeos){const counted=entries.filter(r=>r.kind!=='practice');const seen=new Set();const keys=new Set();counted.forEach(r=>{keys.add(rodeoKey(r.rodeoName,r.date));if(r.rodeoId)seen.add(r.rodeoId);});const costs=rodeos.filter(r=>seen.has(r.id)||keys.has(rodeoKey(r.name,r.date)));const winnings=counted.reduce((s,r)=>s+(Number(r.earnings)||0),0),fees=counted.reduce((s,r)=>s+(Number(r.entryFee)||0),0),expenses=costs.reduce((s,r)=>s+(Number(r.expenses)||0),0);const canonical=new Set(counted.map(r=>{const saved=rodeos.find(x=>x.id===r.rodeoId||rodeoKey(x.name,x.date)===rodeoKey(r.rodeoName,r.date));return saved?saved.id:rodeoKey(r.rodeoName,r.date);}));return {entries:counted.length,rodeos:canonical.size,winnings,fees,expenses,net:winnings-fees-expenses};}
  function resultValue(r,event){if(r.status!=='qualified')return null;const n=Number(event.type==='scored'?r.score:r.time);return Number.isFinite(n)&&n>0?n+(event.type==='timed'?(Number(r.penalty)||0):0):null;}
  function eventStats(entries,event){const rows=entries.filter(r=>r.kind!=='practice');const values=rows.map(r=>resultValue(r,event)).filter(n=>n!==null);return {total:rows.length,qualified:values.length,best:values.length?(event.type==='scored'?Math.max(...values):Math.min(...values)):null,average:values.length?values.reduce((s,n)=>s+n,0)/values.length:null,rate:rows.length?Math.round(values.length/rows.length*100):0};}
  function validVideo(value){if(!value)return true;try{return ['https:','http:'].includes(new URL(value).protocol);}catch(_){return false;}}
  const api={EVENTS,KEYS,read,readArray,getProfile,rodeoKey,allEntries,allRodeos,eventEntries,seasonEntries,metrics,resultValue,eventStats,validVideo};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BarnReadyModel=api;
})(typeof window!=='undefined'?window:globalThis);
