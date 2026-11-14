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
const sumM=async()=>(await (await get('/?'+base+'&format=summary&detail=match')).json());
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
// 1. off by default
let j=await sumM();c('summary loads with a next game',!!(j.next&&j.next.homeName==='Ivybridge 1XV'));
c('off: no win in the summary',j.next&&!j.next.win);
let h=await (await get('/?'+base)).text();c('off: no bar on the dashboard',!/class="wc"/.test(h));
// 2. switch on
let r=await post({features:{winchance:true}});c('save ok',(await r.json()).ok===true);
w=await load();
j=await sumM();const win=j.next&&j.next.win;
c('on: summary carries a win chance',!!win);
c('on: the two chances add to 100',!!win&&win.home.pct+win.away.pct===100);
c('on: home side is Ivybridge, on the left, and favoured',!!win&&win.home.id==='11039'&&win.home.name==='Ivybridge 1XV'&&win.home.pct>50);
c('on: kept between 3 and 97',!!win&&win.home.pct<=97&&win.home.pct>=3);
c('on: earlier seasons were read',!!win&&win.prior>0);
h=await (await get('/?'+base)).text();
c('on: dashboard shows the bar with both names',/class="wc"/.test(h)&&/class="wcn"/.test(h)&&new RegExp(win.home.pct+'%').test(h)&&/Okehampton/.test(h));
c('on: how-it-works line is there for phones only',/class="wcx"/.test(h)&&/\.wcx\{display:none/.test(h)&&/@media\(max-width:800px\)\{\.wcx\{display:block\}/.test(h));
c('on: how-it-works text names the sides',/Ivybridge 1XV are rated about \d+ points better than Okehampton|rated level|Okehampton are rated about/.test(h));
const ms=await (await get('/?view=match&'+base)).text();
c('on: Match Stats shows the bar in the side colours',/class="wc"/.test(ms)&&/--wcl:var\(--ca\)/.test(ms)&&/--wcr:var\(--cb\)/.test(ms));
// away game: our side on the right
nextFx=fut(15342,'Okehampton',false,3);w=await load();
j=await sumM();c('away game: Okehampton on the left',j.next.win&&j.next.win.home.id==='15342'&&j.next.win.away.id==='11039');
// not eligible: opponent with no games / not in the table
nextFx=fut(7777,'Newcomers',true,3);w=await load();
j=await sumM();c('opponent not in this league: no win chance',j.next&&!j.next.win);
h=await (await get('/?'+base)).text();c('and no bar',!/class="wc"/.test(h));
// cup game: no win chance
nextFx={...fut(15342,'Okehampton',true,3),competition:{name:'Devon Cup'},group:{name:'Devon Cup Round 2'}};w=await load();
j=await sumM();c('cup game: no win chance',j.next&&!j.next.win);
nextFx=fut(15342,'Okehampton',true,3);w=await load();
// 3. check page and data
const wc=await (await get('/?'+base+'&format=summary&detail=wcheck')).json();
c('check data: games predicted',wc.predicted>20);
c('check data: better than saying 50/50',wc.brier<0.25&&wc.favouriteWon>0.55);
c('check data: calibration table present',Array.isArray(wc.buckets)&&wc.buckets.length>0);
c('check data: season and league named',wc.season==='2026-2027'&&typeof wc.league==='string');
r=await get('/winchance');const hp=await r.text();c('check page opens with the PIN cookie',r.status===200&&/Win Predictor check/.test(hp)&&/detail:"wcheck"/.test(hp));
{const sc=[...hp.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);let comp=true;for(const s of sc){try{new Function(s)}catch(e){comp=false;console.log(e.message)}}c('check page script compiles',comp)}
r=await w.fetch(new Request('https://x.co.uk/winchance',{headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx);c('check page needs the club PIN',r.status!==200||/Enter PIN/.test(await r.text()));
// 4. Admin
const ad=await (await get('/admin')).text();
c('admin has the switch, on',/id="fwc" checked|id="fwc"[^>]* checked/.test(ad));
c('admin tools list the check page',/href="\/winchance">Win Predictor check/.test(ad));
c('admin save sends the switch',/winchance:\$\("fwc"\)\.checked/.test(ad));
// 4b. shared cache: a fresh server instance reuses the sums instead of redoing them
{const sc=new Map();globalThis.caches={default:{match:async r=>{const v=sc.get(String(r.url||r));return v?new Response(v.body,{headers:v.h}):undefined},put:async(r,x)=>{sc.set(String(r.url||r),{body:await x.text(),h:[...x.headers]})}}};
 w=await load();j=await sumM();const w1=j.next&&j.next.win;c('shared cache: first instance works the figure out and stores it',!!w1&&[...sc.keys()].some(k=>k.includes('wp.cache.internal')));
 calls.length=0;w=await load();j=await sumM();c('shared cache: a fresh instance gives the same figure',j.next&&j.next.win&&j.next.win.home.pct===w1.home.pct);
 c('shared cache: and does not fetch earlier seasons again',!calls.some(u=>/season=2025-2026|season=2024-2025/.test(u)));
 const before=sc.size;await get('/?'+base+'&format=summary&detail=wcheck');await get('/?'+base+'&format=summary&detail=wcheck');c('shared cache: the check result is stored too',sc.size>before&&[...sc.keys()].some(k=>k.includes('wc%7C')));
 delete globalThis.caches;}
// 5. switch off again
r=await post({features:{winchance:false}});w=await load();j=await sumM();c('off again: no win',j.next&&!j.next.win);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
