// v3.35.0 Underdog lines in Admin.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const TEAMSL=[[11039,'Ivybridge',14],[15342,'Okehampton',-6],[2001,'Alpha RFC',6],[2002,'Beta RFC',0],[2003,'Gamma RFC',-10],[2004,'Delta RFC',8],[2005,'Epsilon RFC',-2],[2006,'Zeta RFC',-8]];
let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
let gid=100;const mk=(h,a,d,ha)=>{const m=h[2]-a[2]+ha+(rnd()-0.5)*18;const hs=Math.max(3,Math.round(28+m/2)),as=Math.max(3,Math.round(28-m/2));return {id:gid++,type:'result',date:iso(d),time:'14:00',homeTeam:T(h[0],h[1],hs),awayTeam:T(a[0],a[1],as),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}}};
let res=[];let day=-80;for(const h of TEAMSL)for(const a of TEAMSL)if(h!==a&&!(h[0]===15342&&a[0]===11039)){if((h[0]+a[0])%3!==0||true){res.push(mk(h,a,day,4));day+=1.3}}
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

// round robin of the 8 teams, first R rounds (circle method): every team plays R games
const rr=R=>{const out=[];let ids=TEAMSL.slice();for(let r=0;r<R;r++){for(let i=0;i<4;i++){let h=ids[i],a=ids[7-i];if(r%2)[h,a]=[a,h];if(h[0]===15342&&a[0]===11039)[h,a]=[a,h];out.push(mk(h,a,-60+r*7+i,4))}ids=[ids[0],ids[7],...ids.slice(1,7)]}return out};
const fullRes=res.slice();

const { __w } = await import(src.replace('t_worker.mjs','t_worker_exp.mjs'));const {underdogLine,UNDERDOG_LINES}=__w;
const adm=async()=>await (await get('/admin')).text();
const saved=()=>{const o=JSON.parse(store['club:ivybridge']||'{}');return o.underdogLines};
// 1. Admin shows the defaults
let a=await adm();
c('Admin: Underdog lines list is there with Add and Restore',/id="ull"/.test(a)&&/id="uad"/.test(a)&&/id="urs"/.test(a)&&/Underdog lines/.test(a));
c('Admin: all eight default lines are in the page',UNDERDOG_LINES.length===8&&UNDERDOG_LINES.every(l=>a.includes(l.replace(/"/g,'\\u0022'))||a.includes(l)));
c('Admin: the add button reads text with a proper whitespace pattern (not the letter s)',/\$\("unl"\)\.value\.replace\(\/\\s\+\/g/.test(a)&&/\$\("mnl"\)\.value\.replace\(\/\\s\+\/g/.test(a));
// 2. save and read back
let r=await post({features:{winchance:true},underdogLines:['Line one.','Line two.',' Line  three. ','Line one.','Has <b>tags</b>',''.padEnd(150,'x')]});c('save ok',(await r.json()).ok===true);
let sv=saved();
c('saved: three clean lines first',sv[0]==='Line one.'&&sv[1]==='Line two.'&&sv[2]==='Line three.');
c('saved: no angle brackets anywhere',sv.every(l=>!/[<>]/.test(l)));
c('saved: duplicate dropped (one "Line one.")',sv.filter(l=>l==='Line one.').length===1);
c('saved: long line cut to 100',sv.some(l=>l.length===100)&&sv.every(l=>l.length<=100));
w=await load();a=await adm();
{const m=/ulines=(\[.*?\]);/.exec(a);const ul=m?JSON.parse(m[1]):[];c('Admin shows the saved lines',ul.includes('Line two.')&&!ul.includes('Odds are for bookmakers. Get stuck in.'));}
// 3. cap at 20
r=await post({features:{winchance:true},underdogLines:Array.from({length:30},(_,i)=>'Line '+i)});await r.json();
c('capped at 20 lines',saved().length===20);
// 4. empty stays empty, missing key gives defaults
r=await post({features:{winchance:true},underdogLines:[]});await r.json();c('empty list is kept empty',Array.isArray(saved())&&saved().length===0);
r=await post({features:{winchance:true}});await r.json();c('no list sent (older save): defaults',JSON.stringify(saved())===JSON.stringify(UNDERDOG_LINES));
// 5. selection uses the list given
const W=(h,a)=>({home:{id:'1',name:'A',pct:h},away:{id:'2',name:'B',pct:a}});
c('selection: only lines from the saved list',['k1','k2','k3','k4','k5'].every(k=>['X.','Y.'].includes(underdogLine(W(20,80),true,k,['X.','Y.']))));
c('selection: empty list gives no line',underdogLine(W(20,80),true,'k',[])==='');
c('selection: no list given uses the built-in lines',UNDERDOG_LINES.includes(underdogLine(W(20,80),true,'k')));
// 6. real underdog fixture: view Okehampton (the weaker side) against Ivybridge
const base2='season=2026-2027&competition=1699&division=75791&team=15342&teamName=Okehampton';
const sum2=async()=>(await (await get('/?'+base2+'&format=summary&detail=match')).json());
r=await post({features:{winchance:true},underdogLines:['Only line.']});await r.json();w=await load();
let j=await sum2();
c('real fixture: the weaker side is the underdog and gets the saved line',!!(j.next&&j.next.win)&&j.next.win.line==='Only line.');
r=await post({features:{winchance:true},underdogLines:[]});await r.json();w=await load();j=await sum2();
c('real fixture: empty list shows no line',!!(j.next&&j.next.win)&&!j.next.win.line);
r=await post({features:{winchance:true,underdog:false},underdogLines:['Only line.']});await r.json();w=await load();j=await sum2();
c('real fixture: switch off shows no line',!!(j.next&&j.next.win)&&!j.next.win.line);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
