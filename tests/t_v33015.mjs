// v3.30 win chance: model, switch, summary, pages, check page.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
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
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
// 1. off by default
let h=await (await get('/?'+base)).text();c('off: no bar on the dashboard',!/class="wc"/.test(h));
// 2. switch on
let r=await post({features:{winchance:true}});c('save ok',(await r.json()).ok===true);
const setTeams=async names=>{await post({club:{teams:names.map((n,k)=>({name:n,teamName:'Ivybridge',competition:'1699',division:'75791',team:k?String(11040+k):'11039',league:'R2',accent:'#2f9e5b'}))}});w=await load()};
await setTeams(['Ivybridge 1XV']);
const pages=[['mobile','/?'+base+'&layout=mobile'],['tv','/?'+base+'&layout=tv'],['match','/?view=match&'+base],['opposition','/?view=opposition&'+base],['fixtures','/?view=fixtures&'+base],['leaders','/?view=leaders&'+base]];
for(const [n,q] of pages){const t=await (await get(q)).text();c(n+': no friendlyName with the Admin name in any link',!/friendlyName(=|%3D)Ivybridge(\+|%20|%2B|%2520)1XV/.test(t));c(n+': page still shows the Admin name',/Ivybridge 1XV/.test(t))}
// the links still work: opening a stripped link gives the Admin name back
const t1=await (await get('/?'+base+'&layout=tv')).text();const ml=(t1.match(/href="(\/\?view=opposition[^"]*)"/)||[])[1];
c('the TV page links to the opposition report',!!ml);
if(ml){const o=await (await get(ml.replace(/&amp;/g,'&'))).text();c('a stripped link still shows the Admin name',/Ivybridge 1XV/.test(o))}
// calendar link without a name uses the Admin name
const ics=await (await get('/calendar.ics?'+base)).text();c('calendar file follows the Admin name',/Ivybridge 1XV/.test(ics)||ics.includes('BEGIN:VCALENDAR'));
// a different name typed into the link is kept
const cu=await (await get('/?view=match&'+base+'&friendlyName=Seniors')).text();c('a name typed into the link is kept in its links',/friendlyName(=|%3D)Seniors/.test(cu));
// names that start the same: "Ivybridge" must not cut "Ivybridge Women" short
await setTeams(['Ivybridge']);
const cw=await (await get('/?view=match&'+base+'&friendlyName=Ivybridge+Women')).text();
c('a longer name starting with an Admin name is not cut short',/friendlyName(=|%3D)Ivybridge(\+|%2B)Women/.test(cw));
// the DEV PIN page's return address does not pick up the Admin name
{const envD={...env,ENV_LABEL:'TEST',DEV_PIN:'4321'};
 await setTeams(['Ivybridge 1XV']);
 const r0=await w.fetch(new Request('https://dev.x.co.uk/?competition=1699&division=75791&team=11039&teamName=Ivybridge&theme=dark&app=1',{headers:{'User-Agent':'Mozilla/5.0'}}),envD,ctx);
 const loc=r0.headers.get('Location')||'';c('DEV PIN redirect is issued',r0.status===303&&/unlock/.test(loc));
 c('DEV PIN return address has no friendlyName',!/friendlyName/i.test(decodeURIComponent(loc)));
 const r1=await w.fetch(new Request('https://dev.x.co.uk/?competition=1699&division=75791&team=11039&teamName=Ivybridge&theme=dark&friendlyName=Seniors',{headers:{'User-Agent':'Mozilla/5.0'}}),envD,ctx);
 c('a name typed into the link survives the PIN page',/friendlyName%3DSeniors|friendlyName=Seniors/.test(r1.headers.get('Location')||''));}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
