// v3.81.0: Snowflake seasonal theme
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
const fx2=fut(2006,'Zeta RFC',false,10);globalThis.fetch=(f=>async(u,o)=>{const x=String(u);if(x.includes('cluster.england-rfu.com')&&x.includes('full-matches')&&/season=2026-2027/.test(x))return J({results:res,fixtures:[nextFx,fx2]});return f(u,o)})(globalThis.fetch);

const SK='club:ivybridge';
const setTheme=async(th,extra)=>{store[SK]=JSON.stringify({savedAt:'2026-11-11T10:00:00Z',theme:th,...(extra||{})});sc.clear();w=await load()};
const envD={...env,ENV_LABEL:'DEV',DEV_PIN:'9'};let dck='';{const ul=await w.fetch(new Request('https://dev.thestatsboard.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'9',next:'/'})}),envD,ctx);dck=(ul.headers.get('set-cookie')||'').split(';')[0]}
const pageD=async(q)=>{const r=await w.fetch(new Request('https://dev.thestatsboard.co.uk'+q,{headers:{'User-Agent':'Mozilla/5.0',Cookie:dck+'; '+ck}}),envD,ctx2);return {t:await r.text(),s:r.status}};
const TVQ='/?view=stack&layout=tv&theme=dark&'+base, PHQ='/?view=match&theme=dark&'+base;
const snowy=t=>t.includes('id="sbsnow"')&&t.includes('id="sbxs"');
// 1. default settings: Auto, so off outside the dates
await setTheme(undefined);
let r=await pageD(TVQ+'&today=2026-12-15');r=await pageD(TVQ+'&today=2026-11-11');c('default Auto is off in November',!snowy(r.t));
// 2. the dates: 9 Dec off, 10 Dec on, 2 Jan on (last day included), 3 Jan off
for(const [d,on] of [['2026-12-09',false],['2026-12-10',true],['2026-12-31',true],['2027-01-02',true],['2027-01-03',false]]){
  r=await pageD(TVQ+'&today='+d);c('Auto on '+d+' is '+(on?'on':'off'),snowy(r.t)===on)}
// 3. TV page content
r=await pageD(TVQ+'&today=2026-12-15');
c('TV snow is still by default (animation off)',!/animation:sbfall/.test(r.t)&&/class="sbfl"/.test(r.t));
c('TV page keeps its content',r.t.includes('Match Centre'));
c('reduced motion rule present',r.t.includes('prefers-reduced-motion:reduce'));
c('script free: no script added by the theme',(r.t.match(/<script/g)||[]).length===(await (async()=>{await setTheme({mode:'off'});const o=await pageD(TVQ+'&today=2026-12-15');await setTheme(undefined);return (o.t.match(/<script/g)||[]).length})()));
// 4. phone page animates, has a shorter edge
await setTheme(undefined);r=await pageD(PHQ+'&today=2026-12-15');
c('phone page themed and animated',snowy(r.t)&&/animation:sbfall/.test(r.t)&&r.t.includes('>Happy Christmas<'));
// 5. home page
r=await pageD('/?today=2026-12-15');
c('home page has the line and snow',snowy(r.t)&&r.t.includes('Happy Christmas, rugby fans')&&r.t.includes('class="wrap wl"'),r.s);
r=await pageD('/?today=2026-11-11');c('home page plain outside the dates',!snowy(r.t)&&!r.t.includes('rugby fans'));
// 6. modes and show-on switches
await setTheme({mode:'on'});r=await pageD(TVQ+'&today=2026-07-01');c('On works outside the dates',snowy(r.t));
await setTheme({mode:'off'});r=await pageD(TVQ+'&today=2026-12-15');c('Off beats the dates',!snowy(r.t));
await setTheme({mode:'on',tv:false});r=await pageD(TVQ);c('TV switch off: TV page plain',!snowy(r.t));r=await pageD(PHQ);c('TV switch off: phone page still themed',snowy(r.t));
await setTheme({mode:'on',phone:false});r=await pageD(PHQ);c('phone switch off: phone page plain',!snowy(r.t));
await setTheme({mode:'on',home:false});r=await pageD('/');c('home switch off: home page plain',!snowy(r.t));
await setTheme({mode:'on',tvAnim:true});r=await pageD(TVQ);c('TV animation switch on gives falling snow',/animation:sbfall/.test(r.t));
await setTheme({mode:'on'});r=await pageD(TVQ.replace('theme=dark','theme=light'));c('light theme requests are left alone',!snowy(r.t));
// 7. custom dates, including over New Year and a bad date
await setTheme({mode:'auto',from:{d:1,m:12},to:{d:25,m:12}});
r=await pageD(TVQ+'&today=2026-12-26');c('custom end date 25 Dec: 26 Dec off',!snowy(r.t));r=await pageD(TVQ+'&today=2026-12-25');c('custom end date: 25 Dec on',snowy(r.t));
await setTheme({mode:'auto',from:{d:31,m:2},to:{d:2,m:1}});r=await pageD(TVQ+'&today=2026-12-15');c('impossible date falls back to 10 Dec',snowy(r.t));
await setTheme({mode:'banana'});r=await pageD(TVQ+'&today=2026-12-15');c('unknown mode counts as Auto',snowy(r.t));
// 8. Admin page
await setTheme({mode:'auto'});
const ad=await w.fetch(new Request('https://dev.thestatsboard.co.uk/admin',{headers:{'User-Agent':'Mozilla/5.0',Cookie:dck+'; '+ck}}),envD,ctx2);const at=await ad.text();
c('Admin has the Seasonal theme controls',['Seasonal theme: Snowflake','name="tm"','id="tfd"','id="ttm"','id="tht"','id="tha"','id="thp"','id="thh"'].every(x=>at.includes(x)));
c('Admin status line says Auto off with days to go',/Auto: off until 10 Dec \(\d+ days?\)/.test(at),(/Auto:[^<]*/.exec(at)||[''])[0]);
c('Admin sends the theme when saving',at.includes('theme:{mode:radio("tm")'));
if(process.env.DUMP){const fs=await import('fs');await setTheme({mode:'on',tvAnim:true});for(const [n,q] of [['tv',TVQ],['ph',PHQ],['home','/?']])fs.writeFileSync('/tmp/mk/snow_'+n+'.html',(await pageD(q+(q.includes('?')&&!q.endsWith('?')?'&':'')+'today=2026-12-15')).t)}
// 9. no extra work: same number of KV reads and outside fetches with the theme on or off
const count=async(th)=>{await setTheme(th);let kvn=0,fn=0;const g=kv.get;kv.get=async(...a)=>{kvn++;return g(...a)};const f1=globalThis.fetch;globalThis.fetch=async(...a)=>{fn++;return f1(...a)};await pageD(TVQ+'&today=2026-12-15');await pageD(TVQ+'&today=2026-12-15');kv.get=g;globalThis.fetch=f1;return [kvn,fn]};
const a0=await count({mode:'off'}),a1=await count({mode:'on'});
c('theme adds no KV reads and no fetches',a0[0]===a1[0]&&a0[1]===a1[1],JSON.stringify([a0,a1]));
console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0)
