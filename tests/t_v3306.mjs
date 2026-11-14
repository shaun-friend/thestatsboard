// v3.30.6: page cache: fresh for the UK day on weekdays, 30 minutes at weekends with a stale copy shown while rebuilding.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let clock=Date.UTC(2026,10,11,12,0,0);const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
const DAY=864e5,now=clock,iso=n=>new Date(now+n*DAY).toISOString();
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const TEAMSL=[[11039,'Ivybridge',14],[15342,'Okehampton',-6],[2001,'Alpha RFC',6],[2002,'Beta RFC',0],[2003,'Gamma RFC',-10],[2004,'Delta RFC',8],[2005,'Epsilon RFC',-2],[2006,'Zeta RFC',-8]];
let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
let gid=100;const mk=(h,a,d,ha)=>{const m=h[2]-a[2]+ha+(rnd()-0.5)*18;const hs=Math.max(3,Math.round(28+m/2)),as=Math.max(3,Math.round(28-m/2));return {id:gid++,type:'result',date:iso(d),time:'14:00',homeTeam:T(h[0],h[1],hs),awayTeam:T(a[0],a[1],as),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}}};
const res=[];let day=-80;for(const h of TEAMSL)for(const a of TEAMSL)if(h!==a&&!(h[0]===15342&&a[0]===11039)){if((h[0]+a[0])%3!==0||true){res.push(mk(h,a,day,4));day+=1.3}}
const past=[];for(const h of TEAMSL.slice(0,5))for(const a of TEAMSL.slice(0,5))if(h!==a)past.push({...mk(h,a,-400,4),id:gid++});
const ivy=TEAMSL[0],okeh=TEAMSL[1];
const fut=(oid,on,home,d)=>({id:900+oid%100,type:'fixture',date:iso(d),time:'14:00',homeTeam:home?T(11039,'Ivybridge',null):T(oid,on,null),awayTeam:home?T(oid,on,null):T(11039,'Ivybridge',null),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}});
let nextFx=fut(15342,'Okehampton',true,3);
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
let calls=[];
globalThis.fetch=async u=>{const s=String(u);calls.push(s);
 if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);
 if(s.includes('full-matches')&&/season=2025-2026|season=2024-2025/.test(s))return J({results:past,fixtures:[],leagueTables:[]});
 if(s.includes('cluster.england-rfu.com'))return J({results:res,fixtures:[nextFx]});
 return {ok:false,status:404,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
let w=await load();let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const base='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge';
const get=(p)=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',Cookie:ck}}),env,ctx);
const sc=new Map();globalThis.caches={default:{match:async r=>{const v=sc.get(String(r.url||r));return v?new Response(v.body,{headers:v.h}):undefined},put:async(r,x)=>{sc.set(String(r.url||r),{body:await x.text(),h:[...x.headers]})}}};
const bg=[];const ctx2={waitUntil(p){bg.push(p)}};const flush=async()=>{await Promise.all(bg.splice(0))};
let rfu=0;const f0=globalThis.fetch;globalThis.fetch=async(u,o)=>{if(String(u).includes('cluster.england-rfu.com'))rfu++;return f0(u,o)};
const page=async(q)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+(q||'/?'+base),{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},ctx2);const t=await r.text();return {h:r.headers,t,s:r.status}};
const env2={};
// Wednesday 12:00 (weekday)
let a=await page();c('weekday: first visit builds the page',a.s===200&&!a.h.get('X-Page-Cache'));await flush();
a=await page();c('weekday: second visit is a stored copy',a.h.get('X-Page-Cache')==='HIT'&&a.h.get('X-Page-State')==='fresh');
c('stored copy tells the browser to keep it only 60 seconds',/max-age=60/.test(a.h.get('Cache-Control')||''));
clock+=10*3600e3;const r1=rfu;a=await page();c('weekday: still a stored copy 10 hours later, same day',a.h.get('X-Page-Cache')==='HIT'&&rfu===r1);
clock+=3*3600e3;a=await page();c('weekday: next UK day is rebuilt, not served old',!a.h.get('X-Page-Cache'));await flush();
a=await page();c('weekday: and then stored again',a.h.get('X-Page-Cache')==='HIT');
// Saturday 10:00
clock=Date.UTC(2026,10,14,10,0,0);a=await page();c('saturday: a copy from a weekday is not shown',!a.h.get('X-Page-Cache'));await flush();
clock+=20*60e3;a=await page();c('saturday: fresh for 30 minutes',a.h.get('X-Page-Cache')==='HIT'&&a.h.get('X-Page-State')==='fresh');
clock+=25*60e3;const bgBefore=bg.length;a=await page();c('saturday: after 30 minutes the older copy is shown at once',a.h.get('X-Page-Cache')==='HIT'&&a.h.get('X-Page-State')==='stale');
c('saturday: and a rebuild is started in the background',bg.length>bgBefore);await flush();
a=await page();c('saturday: next visit has the new copy, fresh',a.h.get('X-Page-State')==='fresh');
clock+=7*3600e3;a=await page();c('saturday: a copy over 6 hours old is rebuilt first',!a.h.get('X-Page-Cache'));await flush();
// midnight Sat to Sun
clock=Date.UTC(2026,10,14,23,50,0);await page();await flush();clock+=20*60e3;a=await page();c('copy from the day before is not shown after midnight',!a.h.get('X-Page-Cache'));await flush();
// an Admin save changes the key
clock=Date.UTC(2026,10,11,12,0,0);await page();await flush();a=await page();const hit0=a.h.get('X-Page-Cache')==='HIT';
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify({features:{powered:false}})}),env,ctx2);
a=await page();c('an Admin save makes the next visit a rebuild',hit0&&!a.h.get('X-Page-Cache'));
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
