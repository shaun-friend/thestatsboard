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
const opp=async()=>await (await get('/?view=opposition&'+base)).text();
const oppJ=async()=>await (await get('/?'+base+'&format=summary&detail=opposition')).json();
// off by default
let t=await opp();c('off: no Win Predictor on the Opposition Report',!/Win Predictor/.test(t)&&/This game/.test(t));
let d=await oppJ();c('off: no win in the report data',d.status==='ok'&&!d.win);
// on
let r=await post({features:{winchance:true}});c('save ok',(await r.json()).ok===true);w=await load();
d=await oppJ();c('on: report data carries the win chance',!!d.win&&d.win.home.pct+d.win.away.pct===100&&d.win.home.id==='11039');
t=await opp();(await import('fs')).writeFileSync(new URL('./w/opp_wc.html',import.meta.url),t);
c('on: Win Predictor shown under "This game"',/This game<\/h2><div class="gbox"><div class="card"><div class="wc"/.test(t.replace(/<style>[\s\S]*?<\/style>/g,'')));
c('on: the how-it-works text is open',/<details class="wcx wcf" open>/.test(t)&&(/rated about/.test(t)||/class="wbs"/.test(t)));
c('on: both team names on the bar',/Ivybridge 1XV/.test(t)&&/Okehampton/.test(t));
// the team page's lazy "This game" block is not slowed by it
let g=await (await get('/?'+base+'&format=summary&detail=opposition&frag=gd&nowx=1')).text();c('team page block is unchanged (no bar)',!/Win Predictor/.test(g));
// a cup game: no bar
nextFx={...fut(15342,'Okehampton',true,3),competition:{name:'Devon Cup'},group:{name:''}};w=await load();t=await opp();c('cup game: no Win Predictor',!/Win Predictor/.test(t));
// v3.30.14: at most six club teams are kept
const eight=Array.from({length:8},(_,i)=>({name:'Team '+i,teamName:'Team '+i,competition:'1699',division:'75791',team:String(5000+i),league:'L',accent:'#2f9e5b'}));
r=await post({club:{teams:eight}});c('saving eight teams is accepted',(await r.json()).ok===true);
const stored=Object.values(store).map(v=>{try{return JSON.parse(v)}catch(_){return null}}).find(o=>o&&o.club)||{};
const kept=(stored.club&&stored.club.teams||[]).length;const showing=(stored.club&&stored.club.teams||[]).filter(t=>!t.hidden).length;c('eight are kept but only six show (v3.31.1)',kept===8&&showing===6);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
