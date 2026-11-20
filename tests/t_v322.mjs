import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const MEN='Test XV';
const mkM=me=>(id,type,d,home,opp,hs,as)=>({id,type,date:iso(d),time:'15:00',homeTeam:home?T(me,MEN,hs):T(opp[0],opp[1],hs),awayTeam:home?T(opp[0],opp[1],as):T(me,MEN,as),stadium:'Test Ground, Plymouth'});
const O=(id,h,a,hs,as)=>({id,type:'result',date:iso(-3),time:'15:00',homeTeam:T(h[0],h[1],hs),awayTeam:T(a[0],a[1],as)});
const dataFor=me=>{const mk=mkM(me);return {res:[mk(1,'result',-7,false,[9005,'Newton Abbot'],15,18),mk(2,'result',-14,true,[9004,'Exmouth'],40,5),O(9,[9003,'Cullompton'],[9004,'Exmouth'],30,10)],fx:[mk(3,'fixture',3,true,[9003,'Cullompton'],null,null)]}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
const STAFF='Mr Secret Staff (99999)';
const person=(id,team,no,desc,first,last,extra={})=>({id,teamId:team,playingPositionNo:no,description:desc,firstName:first,lastName:last,startedMatch:!/^S/.test(no),isU18:false,hasDisclosure:false,subMatchRole:{value:'',display:''},creator:STAFF,updater:STAFF,individualId:424242,...extra});
const people=[person(1,8595,'15','Full Back','Alice','Alpha'),person(2,8595,'12','Inside Centre','Brian','Bravo',{subMatchRole:{value:'CPTAIN',display:'Captain'}}),person(3,8595,'8','Number 8','','Name withheld',{hasDisclosure:true}),person(4,8595,'S1','Substitute','Carl','Charlie'),person(5,8595,'14','Right Wing','Young','Youngster',{isU18:true}),person(6,8710,'10','Fly Half','Dan','Delta')];
const events=[{eventType:{value:'MATCHEVENT_SCORE'},eventSubType:{value:'MATCHSUBEVENT_SCORETRY',display:'Try'},duration:4,teamId:8595,teamName:'Ivybridge',playingPosition:'15',matchParticipantId:1,firstName:'Alice',lastName:'Alpha',creator:STAFF},{eventType:{value:'MATCHEVENT_SCORE'},eventSubType:{value:'MATCHSUBEVENT_SCORECONV_MISS',display:'Conversion Miss'},duration:5,teamId:8595,playingPosition:'12',matchParticipantId:2,creator:STAFF},{eventType:{value:'MATCHEVENT_SCORE'},eventSubType:{value:'MATCHSUBEVENT_SCORECONV',display:'Conversion'},duration:13,teamId:8595,playingPosition:'12',matchParticipantId:2}];
const rec=id=>({id,homeTeamId:8595,awayTeamId:8710,homeClubName:'Home RFC',awayClubName:'Away RFC',homeFullTimeScore:63,awayFullTimeScore:12,competitionName:'South West Division',groupName:'Regional 2',creator:STAFF,resultRecordedBy:STAFF});
let sheetsIn=true;
globalThis.__u=[];
globalThis.fetch=async u=>{const s=String(u);globalThis.__u.push(s);
 if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);
 if(s.includes('full-matches')){const d=dataFor(+(new URL(s).searchParams.get('teamId')||55001));return J({results:d.res,fixtures:d.fx,leagueTables:[]})}
 if(s.includes('gms/matchparticipants'))return J(/matchId=[12]$/.test(s)&&sheetsIn?{lineup:true,participants:people}:{lineup:false,participants:[]});
 if(s.includes('gms/matchevents'))return J(/matchId=[12]$/.test(s)?events:[]);
 if(/gms\/matches\/\d+$/.test(s))return J(rec(+s.split('/').pop()));
 return {ok:false,status:500,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};let w=await load();
const get0=(p,h={},e=env)=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',...h}}),e,{});
const get=async(p,h={},e=env)=>{let r=await get0(p,h,e);if(p.includes('view=stack')&&!p.includes('warm=')){const t=await r.clone().text();const m=/var D=(\[[\d,]*\]),K="rfuWarmAt"/.exec(t);if(m){for(const i of JSON.parse(m[1]))await (await get0(p+'&warm='+i,h,e)).text();r=await get0(p,h,e)}}return r};
const ck=((await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,{})).headers.get('Set-Cookie')||'').split(';')[0];

// ---- Match Centre: ground and table line ----
const team=nm=>[nm,MEN,'1699','75791','55001','L','2026-2027'];
const tq=k=>'&teams='+encodeURIComponent(JSON.stringify(Array.from({length:k},(_,i)=>team('Team '+(i+1)))));
const stack=async(extra,k=2)=>{const r=await get('/?view=stack&layout=tv&season=2026-2027&competition=1699&division=75791'+tq(k)+extra);return {r,t:await r.text()}};
const mainOf=t=>{const i=t.indexOf('<main class="ly');return i<0?'':t.slice(i,t.indexOf('</main>',i))};
let {t}=await stack('');let m=mainOf(t);
c('next layout shows ground',m.includes('<div class="og">Test Ground, Plymouth</div>'));
c('next layout shows table line',/<div class="oq">\d+(st|nd|rd|th) v \d+(st|nd|rd|th) &middot; (\d+ points? apart|level on points)<\/div>/.test(m));
({t}=await stack('&ly=classic'));c('classic rows unchanged (no new lines)',!/class="oq"|class="bso bq"/.test(mainOf(t))&&!t.includes('<div class="og">'));
({t}=await stack(''));c('no kick-off time, QR or difficulty',!/15:00/.test(mainOf(t))&&!/qr/i.test(mainOf(t))&&!/difficulty/i.test(mainOf(t)));
{const r=await get('/?season=2026-2027&competition=1699&division=75791&team=55001&teamName=Test%20XV&friendlyName=Test%20XV&format=summary');const j=await r.json();c('summary carries opponent position',j.next&&Number.isInteger(j.next.oppPos)&&j.next.oppPos>0);c('summary carries opponent points',j.next&&Number.isFinite(Number(j.next.oppPts)))}

// ---- Match sheet (now part of Match day) ----
const day2=new Date(now-14*DAY).toLocaleDateString('en-CA',{timeZone:'Europe/London'});
const api=async(team,day)=>{const r=await w.fetch(new Request('https://x.co.uk/api/matchday',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck,'User-Agent':'Mozilla/5.0'},body:JSON.stringify({team,day})}),env,{});const t=await r.text();return {r,t,j:JSON.parse(t)}};
{const r=await get('/matchsheet');c('old match sheet address needs the club PIN',r.status===303&&/club-unlock/.test(r.headers.get('Location')||''));}
{const r=await get('/matchsheet?t=0',{Cookie:ck});c('old match sheet address opens Match day',r.status===302&&r.headers.get('Location')==='/matchday');}
{const r=await get('/matchday');c('Match day needs the club PIN',r.status===303);const r2=await get('/matchday',{Cookie:ck});const p=await r2.text();
 c('Match day opens with the PIN, never cached, not indexed',r2.status===200&&p.includes('<h1>Match day</h1>')&&/no-store/.test(r2.headers.get('Cache-Control')||'')&&/noindex/.test(r2.headers.get('X-Robots-Tag')||'')&&p.includes('name="robots" content="noindex,nofollow"'))}
{const a=await api('11039',day2);const j=a.j;const our=j.players||[],opp=(j.opp||{}).players||[];
 c('the game is found on its day',j.ok&&j.game&&j.game.opp==='Exmouth'&&j.sheet===true,a.t.slice(0,300));
 c('adult names shown for our side',our.some(x=>x.name==='Alice Alpha')&&our.some(x=>x.name==='Brian Bravo')&&our.some(x=>x.name==='Carl Charlie'));
 c('captain tag',our.some(x=>x.tag==='Captain'&&x.name==='Brian Bravo'));
 c('name withheld shown as supplied (redacted)',our.some(x=>x.no==='8'&&x.red===true&&x.name===''));
 c('player marked under 18 shows no name',our.some(x=>x.no==='14'&&x.hidden===true&&x.name===''));
 c('our side in shirt order',our.map(x=>x.no).join()==='8,12,14,15,S1',our.map(x=>x.no).join());
 c('opposition side listed with names and no sponsors',opp.length===1&&opp[0].name==='Dan Delta'&&opp[0].no==='10'&&!('sponsor' in opp[0]));
 c('score of the game',j.score&&j.score.home==='Home RFC'&&j.score.hs===63&&j.score.as===12&&j.score.away==='Away RFC',JSON.stringify(j.score));
 c('scorers with minutes',(j.events||[]).some(x=>x.min===4&&x.what==='Try')&&(j.events||[]).some(x=>x.what==='Conversion missed')&&(j.events||[]).some(x=>x.min===13&&x.what==='Conversion'),JSON.stringify(j.events));
 c('staff names and ids never leave the server',!/Secret Staff|99999|424242/.test(a.t));
}
{const a=await api('11057',day2);const j=a.j;
 c('under-18 team: no names at all, either side',a.r.status===200&&!/Alice|Alpha|Brian|Bravo|Charlie|Delta|Young/.test(a.t)&&(j.players||[]).length>0&&(j.opp.players||[]).every(x=>x.hidden&&x.name===''));
 c('under-18 team: no staff names',!a.t.includes('Secret Staff'));
}
{const a=await api('11039','');c('days only lists the coming game',a.j.ok&&a.j.days.length>=1&&a.j.days.some(x=>x.opp==='Cullompton'),a.t.slice(0,300));
 const b=await api('999999','');c('a team that is not ours is refused',b.r.status===404)}
sheetsIn=false;w=await load();
{const a=await api('11039',day2);c('game with no sheet says so, with no players',a.j.sheet===false&&a.j.players.length===0&&a.j.opp.players.length===0)}
// Admin links to it; usage label
{const r=await get('/admin',{Cookie:ck});const p=await r.text();c('admin links to Match day and no longer to the match sheet',p.includes('href="/matchday"')&&!p.includes('href="/matchsheet"'))}
// no public or PROD page serves it without the PIN; plain (no club PIN set) PROD stays locked
{const r=await get('/matchsheet',{},{SETTINGS:kv});c('no PIN configured: locked',r.status===503||r.status===303)}
// the team sheet and scorer calls are kept two minutes
{const x=(await import(src.replace('t_worker.mjs','t_worker_exp.mjs')+'?i=x')).__t;c('team sheet kept 2 minutes',x.ttlFor('https://cluster.england-rfu.com/gms/matchparticipants?matchId=5')===120&&x.ttlFor('https://cluster.england-rfu.com/gms/matchevents?matchId=5')===120)}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
