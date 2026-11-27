// v3.76.0: Games called off (cancel or postpone a game the RFU feed still lists)
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
const fx2=fut(2001,'Alpha RFC',false,10);
globalThis.fetch=(f=>async(u,o)=>{const s=String(u);if(s.includes('cluster.england-rfu.com')&&s.includes('full-matches')&&/season=2026-2027/.test(s)){return J({results:res,fixtures:[nextFx,fx2]})}return f(u,o)})(globalThis.fetch);
const post=async b=>{const r=await w.fetch(new Request('https://x.co.uk/api/games-off',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(b)}),env,ctx);return {s:r.status,j:await r.json()}};
const gj=async q=>{const r=await get(q);return {s:r.status,j:JSON.parse(await r.text())}};
let r=await w.fetch(new Request('https://x.co.uk/games-off'),env,ctx);c('page is behind the club PIN',r.status===303||r.status===401||r.status===503||r.status===302,r.status);
r=await w.fetch(new Request('https://x.co.uk/api/games-off?team=11039'),env,ctx);c('API is behind the club PIN',r.status!==200,r.status);
r=await get('/games-off');const pg=await r.text();c('page opens after unlocking and has the controls',r.status===200&&/Games called off/.test(pg)&&/id="go"/.test(pg)&&/Cancelled/.test(pg)&&/Postponed/.test(pg));
let g=await gj('/api/games-off?team=11039');
c('lists the upcoming games for the team',g.j.ok&&g.j.games.length===2&&g.j.games[0].on==='Okehampton'&&g.j.games[0].h===true&&g.j.games[1].on==='Alpha RFC',JSON.stringify(g.j).slice(0,300));
const d1=g.j.games[0].d;
c('unknown team refused',(await gj('/api/games-off?team=999')).j.ok===false);
let sm=async()=>{const x=await get('/?'+base+'&format=summary');return JSON.parse(await x.text())};
let j0=await sm();c('before: next game is Okehampton',j0.next&&/Okehampton/.test(JSON.stringify(j0.next)),JSON.stringify(j0.next).slice(0,200));
let a=await post({act:'add',team:'11039',d:d1,o:String(g.j.games[0].o),on:'Okehampton',h:true,tm:'14:00',k:'c',n:'Pitch unplayable'});
c('marking a game works',a.j.ok&&a.j.marks.length===1&&a.j.marks[0].n==='Pitch unplayable',JSON.stringify(a));
c('marking refreshes scores so pages catch up',!!store['scores-refresh']);
c('a past date is refused',(await post({act:'add',team:'11039',d:'2020-01-01',k:'c'})).j.ok===false);
c('an unknown team is refused',(await post({act:'add',team:'1',d:d1,k:'c'})).j.ok===false);
c('the same game cannot be marked twice',(await post({act:'add',team:'11039',d:d1,k:'p'})).s===409);
sc.clear();w=await load();
let j1=await sm();c('after: the next game is the following one',j1.next&&/Alpha RFC/.test(JSON.stringify(j1.next))&&!/Okehampton/.test(JSON.stringify(j1.next)),JSON.stringify(j1).slice(0,400));
g=await gj('/api/games-off?team=11039');c('a marked game shows as already marked',g.j.games.length===1||g.j.games.some(x=>x.off),JSON.stringify(g.j.games));
// notices
const nm=await get('/?'+base+'&view=match&layout=tv');const nt=await nm.text();
c('Next game page has no red notice (it just moves on to the following game)',!/role="note"/.test(nt)&&!/CANCELLED &middot;/.test(nt));
const fb=await (await get('/?'+base+'&view=fixtures&layout=tv')).text();c('Fixtures board has no red banner',!/CANCELLED &middot;/.test(fb)&&!/role="note"/.test(fb));
c('Fixtures board still lists the game, marked Cancelled with the note',/Okehampton/.test(fb.split('</h1>').pop()||fb)&&/Cancelled/.test(fb),'');
const fs0=await (await get('/?'+base+'&view=fixtures&theme=dark')).text();c('standard Fixtures page lists it under Upcoming as Cancelled',/Upcoming[\s\S]*Okehampton[\s\S]*Cancelled[\s\S]*Results/.test(fs0),'');
const dj=JSON.parse(await (await get('/?'+base+'&format=summary&detail=fixtures')).text());const og=(dj.games||[]).find(x=>/Okehampton/.test(x.oppName)&&/^2026-11-14/.test(x.iso));c('the game stays in the games list, flagged off and void (so it is never the next game)',og&&og.status==='void'&&og.off==='c'&&og.offNote==='Pitch unplayable',JSON.stringify(og)+JSON.stringify((dj.games||[]).filter(x=>/2026-11/.test(x.iso))));
const tb=await get('/?'+base+'&layout=tv');c('the league table page does not',!/CANCELLED &middot;/.test(await tb.text()));
const mc=await page('/?view=stack&layout=tv&theme=dark');c('Match Centre shows the notice in that team column',/CANCELLED &middot; [A-Za-z]{3} \d+ [A-Za-z]{3} v Okehampton/.test(mc.t),'');
// postponed wording and removal
const id=a.j.marks[0].id;
let rm=await post({act:'remove',id});c('removing a mark works',rm.j.ok&&rm.j.marks.length===0);
a=await post({act:'add',team:'11039',d:d1,o:String(g.j.games[0]&&g.j.games[0].o||''),on:'Okehampton',h:true,k:'p',n:''});
sc.clear();w=await load();
const pp=await (await get('/?'+base+'&view=match&layout=tv')).text();const ppb=await (await get('/?'+base+'&view=fixtures&layout=tv')).text();c('postponed says Postponed against the fixture',/Postponed/.test(ppb)&&!/Cancelled/.test(ppb.split('</h1>').pop()));
await post({act:'remove',id:a.j.marks[0].id});sc.clear();w=await load();
let j2=await sm();c('after removal the game is back as the next game',/Okehampton/.test(JSON.stringify(j2.next)));
const pr=await (await get('/?'+base+'&view=match&layout=tv')).text();const prb=await (await get('/?'+base+'&view=fixtures&layout=tv')).text();c('and the Cancelled word is gone',!/Cancelled|Postponed/.test(prb.split('</h1>').pop()));
// clears itself the day after the game
await post({act:'add',team:'11039',d:d1,o:'',on:'',h:true,k:'c',n:''});
clock+=5*DAY;w=await load();
g=await gj('/api/games-off');c('a mark clears itself after the game date',g.j.marks.length===0,JSON.stringify(g.j.marks));
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
