// Renders the dashboard (TV and phone layout) and Match Stats with the win chance bar on, for the browser check.
import fs from 'fs';
const src=process.argv[2];
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const TL=[[11039,'Ivybridge',14],[15342,'Okehampton',-6],[2001,'Alpha RFC',6],[2002,'Beta RFC',0],[2003,'Gamma RFC',-10],[2004,'Delta RFC',8],[2005,'Epsilon RFC',-2],[2006,'Zeta RFC',-8]];
let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};let gid=100;
const mk=(h,a,d)=>{const m=h[2]-a[2]+4+(rnd()-0.5)*18;return {id:gid++,type:'result',date:iso(d),time:'14:00',homeTeam:T(h[0],h[1],Math.max(3,Math.round(28+m/2))),awayTeam:T(a[0],a[1],Math.max(3,Math.round(28-m/2))),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}}};
const res=[];let day=-80;for(const h of TL)for(const a of TL)if(h!==a&&!(h[0]===15342&&a[0]===11039)){res.push(mk(h,a,day));day+=1.3}
const fx={id:901,type:'fixture',date:iso(3),time:'14:00',homeTeam:T(11039,'Ivybridge',null),awayTeam:T(15342,'Okehampton',null),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>{const s=String(u);if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);if(s.includes('cluster.england-rfu.com'))return J({results:res,fixtures:[fx]});return {ok:false,status:404,text:async()=>''}};
const w=(await import(src)).default;const env={CLUB_PIN:'1',SETTINGS:kv},ctx={waitUntil(){}};
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({features:{winchance:true}})}),env,ctx).catch(()=>{});
const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);const ck=(r0.headers.get('Set-Cookie')||'').split(';')[0];
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify({features:{winchance:true}})}),env,ctx);
const base='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge';
fs.mkdirSync('w',{recursive:true});
for(const [n,q] of [['wc_tv','/?'+base+'&layout=tv'],['wc_mobile','/?'+base+'&layout=mobile'],['wc_match','/?view=match&'+base],['wc_mc_next','/?view=stack&ly=next'],['wc_mc_classic','/?view=stack&ly=classic']]){
 const r=await w.fetch(new Request('https://thestatsboard.co.uk'+q,{headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx);fs.writeFileSync('w/'+n+'.html',await r.text());}
console.log('rendered');
