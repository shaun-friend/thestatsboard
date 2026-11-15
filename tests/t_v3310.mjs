// v3.31.0: the Match Centre prepares each team in its own request.
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


const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
const names=['Ivybridge 1XV','The Vandals','Ivybridge Women','Colts'];
await post({features:{winchance:true},club:{teams:names.map((n,i)=>({name:n,teamName:'Ivybridge',competition:String(1699+i*7),division:String(75791+i*11),team:i?String(11040+i):'11039',league:'L'+i,accent:'#2f9e5b'}))}});
let cops=0;const cm=new Map();globalThis.caches={default:{match:async k=>{cops++;const v=cm.get(typeof k==='string'?k:k.url);return v?v.clone():undefined},put:async(k,v)=>{cops++;cm.set(typeof k==='string'?k:k.url,v.clone())},delete:async k=>{cm.delete(typeof k==='string'?k:k.url);return true}}};
const urls=[];const f8=globalThis.fetch;globalThis.fetch=async(u,o)=>{urls.push(String(u));return f8(u,o)};
const ctxq={waitUntil(p){bg.push(p)}};
const hit=async(p)=>{urls.length=0;cops=0;const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},ctxq);const t=await r.text();await flush();const ext=urls.filter(u=>/cluster\.england-rfu\.com|englandrugby\.com/.test(u)).length;return {t,ext,ops:ext+cops,ct:r.headers.get('Content-Type')||'',urls:urls.slice()}};
sc.clear();w=await load();
const Q='/?view=stack&ly=classic';
const p1=await hit(Q);
c('cold page is HTML and stays well inside the limit ('+p1.ops+')',/text\/html/.test(p1.ct)&&p1.ops<=40);
c('cold page shows teams as updating',(p1.t.match(/Updating this team/g)||[]).length>=1);
c('cold page asks the browser to prepare all four teams',/D=\[0,1,2,3\]/.test(p1.t)&&/warm=/.test(p1.t));
const warms=[];for(let i=0;i<4;i++){warms.push(await hit(Q+'&warm='+i))}
c('each team request is JSON and succeeds',warms.every(x=>/json/.test(x.ct)&&/"ok":true/.test(x.t)));
c('each team request stays within the 50 limit (max '+Math.max(...warms.map(x=>x.ops))+')',warms.every(x=>x.ops<=50));
const p2=await hit(Q);
c('after the four requests the page is complete (no updating, no warm script)',!/Updating this team/.test(p2.t)&&!/warm=/.test(p2.t));
c('the complete page needs almost no outside requests ('+p2.ext+')',p2.ext<=2);
const bad1=await hit(Q+'&warm=9');
c('a team number that does not exist is refused',/"ok":false/.test(bad1.t));
const again=await hit(Q+'&warm=1');
c('asking again for a team that is ready costs one lookup and no outside request',/"cached":true/.test(again.t)&&again.ext===0);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
