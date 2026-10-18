/* Remove only unchanged records supplied by the original demo. Never seed examples. */
(function(root){
'use strict';
const samples={"turn-burn-runs":[{"id":"r1","date":"2026-06-27","event":"Cache Valley Summer Jackpot","arena":"Cache County Fairgrounds","category":"jackpot","time":"17.42","earnings":320,"videoLink":"","notes":"Clean run, great first turn."},{"id":"r6","date":"2026-06-06","event":"Southern Utah University Rodeo","arena":"Golden Spike Arena","category":"college","time":"17.48","earnings":0,"videoLink":"","notes":"Great indoor footing."},{"id":"r2","date":"2026-05-30","event":"Weber State College Rodeo","arena":"Golden Spike Arena","category":"college","time":"17.65","earnings":0,"videoLink":"","notes":"First college rodeo of the split."},{"id":"r3","date":"2026-05-16","event":"Spring Sizzler Jackpot","arena":"Cache County Fairgrounds","category":"jackpot","time":"17.61","earnings":150,"videoLink":"","notes":""},{"id":"r4","date":"2026-04-25","event":"Utah State University Rodeo","arena":"Heber City Rodeo Grounds","category":"college","time":"18.05","earnings":0,"videoLink":"","notes":"Deep ground, ran wide on purpose."},{"id":"r5","date":"2026-04-11","event":"Season Opener Jackpot","arena":"Heber City Rodeo Grounds","category":"jackpot","time":"17.95","earnings":75,"videoLink":"","notes":"First run of the season."}],"turn-burn-travel":[{"id":"t1","startDate":"2026-06-26","endDate":"2026-06-28","type":"hotel","name":"Best Western Logan Inn","arena":"Cache County Fairgrounds","ada":true,"rating":4,"notes":"Close to the fairgrounds, easy trailer parking."},{"id":"t2","startDate":"2026-05-29","endDate":"2026-05-31","type":"campground","name":"Golden Spike RV Park","arena":"Golden Spike Arena","ada":false,"rating":3,"notes":"Full hookups, a little dusty but fine for a weekend."}],"turn-burn-arena-info":{"Cache County Fairgrounds":{"type":"outdoor","notes":"Ground stays firm. Good electronic timer. Warm-up pen is small — get there early."},"Golden Spike Arena":{"type":"indoor","notes":"Indoor, great footing. Can get loud, give her a minute to settle."},"Heber City Rodeo Grounds":{"type":"outdoor","notes":"Deep near barrel 3, take it a touch wider. Long score line."}}};
const marker='barn-ready-samples-cleared-v1';
const defaults={horseId:'h1',drawNumber:'',entryFee:0,ground:'',barrelsDown:0,penaltySeconds:0,barrel1Notes:'',barrel2Notes:'',barrel3Notes:'',registeredName:'',notes:'',status:'qualified',kind:'competition',round:'Long round'};
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function unchanged(record,sample){return Object.keys(sample).every(k=>same(record[k],sample[k]))&&Object.keys(record).every(k=>k in sample||(k in defaults&&same(record[k],defaults[k])));}
function clearSamples(storage){
 if(storage.getItem(marker))return;
 const pending=[];
 function read(key,fallback){const value=storage.getItem(key);return value===null?fallback:JSON.parse(value);}
 for(const key of ['turn-burn-runs','turn-burn-travel']){
  const rows=read(key,[]);if(!Array.isArray(rows))throw Error('Invalid saved records');
  const filtered=rows.filter(r=>!samples[key].some(s=>unchanged(r,s)));
  if(filtered.length!==rows.length)pending.push([key,filtered]);
 }
 const info=read('turn-burn-arena-info',{}),cleanInfo={...info};
 for(const [name,value]of Object.entries(samples['turn-burn-arena-info']))if(same(info[name],value))delete cleanInfo[name];
 if(!same(info,cleanInfo))pending.push(['turn-burn-arena-info',cleanInfo]);
 const runs=pending.find(x=>x[0]==='turn-burn-runs')?.[1]||read('turn-burn-runs',[]);
 const horses=read('turn-burn-horses',[]);
 if(Array.isArray(horses)&&!runs.concat(read('barn-ready-entries-v1',[])).some(r=>(r.horseId||'h1')==='h1')){
  const filtered=horses.filter(h=>!unchanged(h,{id:'h1',name:'Primary Horse'}));
  if(filtered.length!==horses.length)pending.push(['turn-burn-horses',filtered]);
 }
 const previous=pending.map(([key])=>[key,storage.getItem(key)]);
 try{for(const [key,value]of pending)storage.setItem(key,JSON.stringify(value));storage.setItem(marker,'1');}
 catch(error){for(const [key,value]of previous){try{value===null?storage.removeItem(key):storage.setItem(key,value);}catch(_){}}throw error;}
}
if(typeof module!=='undefined'&&module.exports)module.exports={clearSamples};
else {try{clearSamples(root.localStorage);}catch(error){console.error('Could not remove sample records; saved data was kept.',error);}}
})(typeof window!=='undefined'?window:globalThis);
