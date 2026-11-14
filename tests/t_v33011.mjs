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
const page=async(q)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+(q||'/?'+base),{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},ctx2);const t=await r.text();return {h:r.headers,t,s:r.status}};
const env2={};

let failTeamFeed=false;const f1=globalThis.fetch;globalThis.fetch=async(u,o)=>{const s=String(u);if(failTeamFeed&&/full-matches\?/.test(s)&&/teamId=/.test(s)&&!/competitionId=/.test(s)&&/season=2026-2027/.test(s))return {ok:false,status:500,text:async()=>''};return f1(u,o)};
// v3.30.11: a game that goes missing from the feed (no error) is held for one round, then accepted if it stays missing
const stack='/?view=stack&ly=next';
const nextDate=t=>{const m=t.match(/Next game[\s\S]{0,500}?((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]* \d+ [A-Z][a-z]+)/);return m&&m[1]};
const wipe=()=>{for(const k of [...sc.keys()])if(!k.includes('sumgood')&&!k.includes('vanish'))sc.delete(k)};
sc.clear();clock=Date.UTC(2026,10,11,12,0,0);nextFx=fut(15342,'Okehampton',true,1);w=await load();
let a=await page(stack);await flush();const good=nextDate(a.t);c('match centre shows the game due tomorrow',!!good);
// the game goes missing: the feed now only has one a week later
clock+=20*60e3;wipe();nextFx=fut(15342,'Okehampton',true,8);w=await load();
a=await page(stack);c('a game missing from the feed is held: still shows the earlier game',nextDate(a.t)===good);
// the feed comes back with it: fine
clock+=20*60e3;wipe();nextFx=fut(15342,'Okehampton',true,1);w=await load();
a=await page(stack);c('when the game returns it shows as before',nextDate(a.t)===good);
// missing for good (postponed): held once, then accepted
clock+=20*60e3;wipe();nextFx=fut(15342,'Okehampton',true,8);w=await load();
a=await page(stack);c('postponed game: first round still holds the earlier game',nextDate(a.t)===good);
clock+=20*60e3;wipe();w=await load();
a=await page(stack);const later=nextDate(a.t);c('postponed game: next round accepts the new next game',!!later&&later!==good);
// a game that has been played is never held
clock=Date.UTC(2026,10,11,12,0,0);sc.clear();nextFx=fut(15342,'Okehampton',true,1);w=await load();a=await page(stack);await flush();
clock+=3*DAY;wipe();nextFx=fut(15342,'Okehampton',true,8);w=await load();a=await page(stack);
c('after the game date has passed the newer game shows',nextDate(a.t)!==good);
// v3.30.12: the feed log records it, and the page needs the club PIN
store={};sc.clear();clock=Date.UTC(2026,10,11,12,0,0);nextFx=fut(15342,'Okehampton',true,1);w=await load();
a=await page(stack);await flush();
clock+=20*60e3;wipe();nextFx=fut(15342,'Okehampton',true,8);w=await load();a=await page(stack);await flush();
const lg=JSON.parse(store.feedlog||'[]');c('the held game is logged',lg.length>=1&&lg.every(x=>x.kind==='held')&&/missing/.test(lg[0].detail));
clock+=20*60e3;wipe();w=await load();a=await page(stack);await flush();
const lg2=JSON.parse(store.feedlog||'[]');c('the accepted change is logged',lg2[0]&&lg2[0].kind==='accepted');
const r1=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx2);const ck2=(r1.headers.get('Set-Cookie')||'').split(';')[0];const fl=await w.fetch(new Request('https://x.co.uk/feedlog',{headers:{'User-Agent':'Mozilla/5.0',Cookie:ck2}}),env,ctx2);const ft=await fl.text();if(!/Feed log/.test(ft))console.log('DBG',fl.status,ft.slice(0,300));
c('feed log page shows the entries',fl.status===200&&/Feed log/.test(ft)&&/Game missing, earlier game kept/.test(ft)&&/Game still missing/.test(ft));
const fl2=await w.fetch(new Request('https://x.co.uk/feedlog',{headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx2);const ft2=await fl2.text();
c('feed log page needs the club PIN',!/Game missing, earlier game kept/.test(ft2));
// the same event twice in ten minutes is one row
await (async()=>{const n0=JSON.parse(store.feedlog).length;clock+=60e3;wipe();nextFx=fut(15342,'Okehampton',true,1);w=await load();await page(stack);await flush();c('log does not grow when nothing went wrong',JSON.parse(store.feedlog).length===n0)})();
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
