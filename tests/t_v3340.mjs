// v3.34.0 Win Predictor: early-season limits, note, per-team switch.
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
// 1. unit: the limits
const { __w } = await import(src.replace('t_worker.mjs','t_worker_exp.mjs'));const {winPercents,winBarHtml}=__w;
c('limit: 4 games gives 80/20 at most',winPercents(0.9999,4).home===80&&winPercents(0.9999,4).away===20);
c('limit: 7 games still 80/20',winPercents(0.9999,7).home===80);
c('limit: 8 games gives 85/15',winPercents(0.9999,8).home===85&&winPercents(0.0001,8).home===15);
c('limit: 20 games gives 85/15',winPercents(0.9999,20).home===85);
c('limit: underdog side never below 20 early',winPercents(0.0001,5).home===20&&winPercents(0.0001,5).away===80);
c('limit: no game count keeps the old 97/3',winPercents(0.9999).home===97&&winPercents(0.0001).home===3);
c('limit: middle chances unchanged',winPercents(0.6,5).home===60&&winPercents(0.55,12).home===55);
// 2. early season: five games each
res=rr(5);
let r=await post({features:{winchance:true}});c('save ok',(await r.json()).ok===true);
w=await load();
let j=await sumM();let win=j.next&&j.next.win;
c('early: a prediction is shown with five games each',!!win&&win.home.pct+win.away.pct===100);
c('early: flagged early with the game count',!!win&&win.early===true&&win.n===5);
c('early: never more lopsided than 80/20',!!win&&win.home.pct<=80&&win.home.pct>=20);
let h=await (await get('/?'+base)).text();
c('early: note under the bar',/class="wce">Early season: based on 5 games each</.test(h));
c('early: note is TV-only (hidden by default, shown from 900px)',/\.wce\{display:none\}/.test(h)&&/@media\(min-width:900px\)\{\.wce\{display:block/.test(h));
c('early: phone how-it-works text does not mention it',!/It is early in the season/.test(h));
// 3. later in the season: whole round robin (7 games each plus)
res=fullRes;w=await load();
j=await sumM();win=j.next&&j.next.win;
c('later: prediction shown, not early',!!win&&win.early===false&&win.n>=8);
c('later: within 15 to 85',!!win&&win.home.pct<=85&&win.home.pct>=15);
h=await (await get('/?'+base)).text();
c('later: no early note on the page',!/class="wce"/.test(h));
// 4. per-team switch
const team=(o)=>({name:'Ivybridge 1XV',teamName:'Ivybridge',competition:'1699',division:'75791',team:'11039',league:'R2',accent:'#2f9e5b',...o});
r=await post({features:{winchance:true},club:{teams:[team({nowin:true})]}});c('saving a team with the switch off is accepted',(await r.json()).ok===true);
w=await load();j=await sumM();
c('switch off: no win chance in the summary',j.next&&!j.next.win);
h=await (await get('/?'+base)).text();c('switch off: no bar on the page',!/class="wc"/.test(h));
let adm=await (await get('/admin')).text();
c('Admin: each team row has a Win Predictor switch',/class="twp"/.test(adm)&&/Switch off to stop the win chance showing for this team/.test(adm));
c('switch off: kept in the saved team list',(store['club:ivybridge']||'').includes('"nowin":true'));
r=await post({features:{winchance:true},club:{teams:[team({})]}});await r.json();w=await load();
j=await sumM();c('switch on again: win chance is back',!!(j.next&&j.next.win));
r=await post({features:{winchance:true},club:{teams:[team({nowin:'yes'})]}});await r.json();w=await load();
j=await sumM();c('only true switches it off (junk is ignored)',!!(j.next&&j.next.win));
// WhatsApp message never carries the underdog line
let wt=await (await get('/?view=opposition&'+base)).text();c('whatsapp: no underdog line',!/%F0%9F%92%AA/.test(wt));
// 5. opposition report follows the same limits and the switch
let t=await (await get('/?view=opposition&'+base)).text();
c('opposition: early-season note appears only when early',!/class="wce"/.test(t));
// 6. underdog lines are gone; the note keeps its place so bars line up
const W=(h,a)=>({home:{id:'1',name:'Ivybridge 1XV',pct:h},away:{id:'2',name:'Okehampton',pct:a}});
const earlyBar=winBarHtml({...W(20,80),early:true,n:5,gap:-10,ha:4},{compact:true}),laterBar=winBarHtml({...W(20,80),early:false,n:9,gap:-10,ha:4},{compact:true}),fullBar=winBarHtml({...W(20,80),early:false,n:9,gap:-10,ha:4},{});
c('compact bar: early note shows its text',earlyBar.includes('class="wce">Early season: based on 5 games each'));
c('compact bar: no note still keeps an invisible row (so bars line up)',laterBar.includes('class="wce wcp" aria-hidden="true"'));
c('non-compact bar: no placeholder row',!fullBar.includes('wcp"'));
c('placeholder is hidden but takes space, and only on TV widths',/@media\(min-width:900px\)\{\.wce\{display:block[^}]*\}\.wcp\{visibility:hidden\}/.test(earlyBar));
c('no underdog code left in the bar',!/wcq/.test(earlyBar)&&!/underdog/i.test(earlyBar));
const adm2=await (await get('/admin')).text();
c('Admin: no underdog switch or list',!/Underdog/i.test(adm2)&&!/id="fu"/.test(adm2)&&!/id="ull"/.test(adm2));
c('Admin: Win Predictor switch and per-team switch still there',/id="fwc"/.test(adm2)&&/class="twp"/.test(adm2));
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
