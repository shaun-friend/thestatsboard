// v3.30.7: a missing competition feed must not be stored or shown as the answer (next game flipping between a cup game and the league game).
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
const page0=async(q)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+(q||'/?'+base),{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},ctx2);const t=await r.text();return {h:r.headers,t,s:r.status}};
const page=async(q)=>{let r=await page0(q);const m=/var D=(\[[\d,]*\]),K="rfuWarmAt"/.exec(r.t);if(m&&q&&q.includes('view=stack')){for(const i of JSON.parse(m[1]))await page0(q+'&warm='+i);r=await page0(q)}return r};
const env2={};

let failTeamFeed=false;const f1=globalThis.fetch;globalThis.fetch=async(u,o)=>{const s=String(u);if(failTeamFeed&&/full-matches\?/.test(s)&&/teamId=/.test(s)&&!/competitionId=/.test(s)&&/season=2026-2027/.test(s))return {ok:false,status:500,text:async()=>''};return f1(u,o)};
let addBlank=false;const f2=globalThis.fetch;globalThis.fetch=async(u,o)=>{const x=String(u);if(addBlank&&/full-matches\?/.test(x)&&/teamId=/.test(x)&&!/competitionId=/.test(x)&&/season=2026-2027/.test(x)){const r=await f2(u,o);const d=JSON.parse(await r.text());d.fixtures=[...(d.fixtures||[]),{id:777,type:'fixture',date:iso(1),time:'11:30',homeTeam:{id:77,commonId:77,name:'Paignton',score:null},awayTeam:{id:11039*7,commonId:11039,name:'Ivybridge',score:null}}];return {ok:true,status:200,text:async()=>JSON.stringify(d)}}return f2(u,o)};
const sum=async()=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk/?'+base+'&format=summary',{headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx2);return await r.json()};
clock=Date.UTC(2026,10,11,12,0,0);
w=await load();let j=await sum();c('summary with every feed answering is not partial',!j.partial&&j.next);
failTeamFeed=true;sc.clear();w=await load();j=await sum();c('summary says partial when the team feed fails',j.partial===true&&Array.isArray(j.partialWhy)&&j.partialWhy.includes('team feed'));
// pages built while a feed is missing are not stored
for(const k of [...sc.keys()])sc.delete(k);
w=await load();let a=await page();await flush();a=await page();c('page built with a feed missing is not stored',!a.h.get('X-Page-Cache'));
failTeamFeed=false;w=await load();a=await page();await flush();a=await page();c('page built with every feed is stored',a.h.get('X-Page-Cache')==='HIT');
// Match Centre keeps the last complete answer
const stack='/?view=stack&ly=next';
for(const k of [...sc.keys()])sc.delete(k);failTeamFeed=false;w=await load();
a=await page(stack);await flush();c('match centre builds',a.s===200&&[...sc.keys()].some(k=>k.includes('sumgood')));
clock+=20*60e3;failTeamFeed=true;sc.forEach((v,k)=>{if(!k.includes('sumgood'))sc.delete(k)});w=await load();for(const k of [...sc.keys()])if(k.includes('sum%7C')||k.includes('thestatsboard.co.uk/?'))sc.delete(k);
const before=a.t.match(/Next game[\s\S]{0,400}?(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]* \d+ [A-Z][a-z]+/);
a=await page(stack);const mid=a.t.match(/Next game[\s\S]{0,400}?(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]* \d+ [A-Z][a-z]+/);
c('while a feed is missing the Match Centre shows the same next game as before',!!before&&!!mid&&before[0]===mid[0]);
c('the incomplete answer was not stored as the 15-minute copy',![...sc.keys()].some(k=>k.includes('sum%7C')));
failTeamFeed=false;addBlank=true;sc.clear();w=await load();j=await sum();c('a game with no competition name in none of the competitions we read makes the answer partial',j.partial===true&&(j.partialWhy||[]).some(x=>/unlabelled/.test(x)));
addBlank=false;
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
