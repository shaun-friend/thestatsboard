const w=(await import(process.argv[2])).default;
import fs from 'fs';
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const ME=55001,MEN='Ivybridge U18';
const mk=(id,type,d,home,opp,hs,as,time)=>({id,type,date:iso(d),time:time||'15:00',homeTeam:home?T(ME,MEN,hs):T(opp[0],opp[1],hs),awayTeam:home?T(opp[0],opp[1],as):T(ME,MEN,as),stadium:'Test Ground, Plymouth'});
const A=[9001,'Kingsbridge U18'],B=[9002,'Tavistock U18'],C=[9003,'Cullompton U18'],D=[9004,'Exmouth U18'],E=[9005,'Newton Abbot U18'];
// league division feed (competition 1699 / division 75791)
const O=(id,h,a,hs,as,type)=>({id,type,date:iso(0),time:'15:00',homeTeam:T(h[0],h[1],hs),awayTeam:T(a[0],a[1],as)});
const leagueRes=[O(41,[9103,'Newquay U18'],[9104,'Bideford U18'],24,17,'result'),O(42,[9105,'Wellington U18'],[9106,'Crediton U18'],10,31,'result'),{...O(43,[9107,'Totnes U18'],[9108,'Dawlish U18'],null,null,'result'),time:'AWO'},{...O(44,[9109,'Teignmouth U18'],[9110,'Buckfast U18'],null,null,'result'),time:'HWO'},mk(1,'result',-28,true,A,30,10),mk(2,'result',-14,false,B,12,20)];
const AWAY='home'!=='home';const leagueFx=[O(51,[9101,'Okehampton U18'],[9102,'Honiton U18'],null,null,'fixture'),mk(3,'fixture',3,!AWAY,C,null,null)];
// cup division feed (competition 7777 / division 8888)
const cupRes=[mk(11,'result',-21,true,D,40,5),mk(12,'result',-7,false,E,15,18),mk(13,'result',-35,true,A,null,null,'V')];
const cupFx=[mk(14,'fixture',14,false,D,null,null)];
// the team's own season feed: league games only, and no competition names (as the real RFU feed does)
const teamRes=[...leagueRes],teamFx=[...leagueFx];
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
let builderDown=false;
globalThis.__urls=[];
globalThis.fetch=async u=>{const s=String(u);globalThis.__urls.push(s);const x=new URL(s);
 if(s.includes('/fixtures-and-results/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);
 if(s.includes('cluster.england-rfu.com/fixtures-and-results/full-matches')){
  if(x.searchParams.get('teamId')==='55001')return J({results:teamRes,fixtures:teamFx,leagueTables:[]});
  if(x.searchParams.get('teamId'))return J({results:[],fixtures:[]});
  const c=x.searchParams.get('competitionId');
  if(c==='7777')return J({results:cupRes,fixtures:cupFx,leagueTables:[]});
  if(c==='9999'){const m=[{...mk(31,'result',-5,true,A,25,20),homeTeam:T(55002,'Elite XV',25)}];return J({results:m,fixtures:[],leagueTables:[]})}
  return J({results:leagueRes,fixtures:leagueFx,leagueTables:[]});}
 if(s.includes('englandrugby.com/api/fixtures-and-result/teamSelect')){const t=x.searchParams.get('team');
   if(builderDown)return {ok:false,status:500,text:async()=>''};
   const comps=t==='55001'?[{_id:1699,name:'U18 Devon League'},{_id:7777,name:'Devon Colts Cup'}]:t==='55002'?[{_id:9999,name:'Premiership Rugby Cup'}]:[{_id:1699,name:'Regional 2'}];
   return J({data:{seasonList:['2026-2027'],compList:comps,selectedTeam:{data:{name:'X'}},clubInfo:{clubName:'X'}}});}
 if(s.includes('competitionSelect')){const c=x.searchParams.get('competition');
   return J({data:{groupsList:[c==='7777'?{_id:8888,name:'Pool 1'}:c==='9999'?{_id:1,name:'Pool A'}:{_id:75791,name:'Division 1'}]}});}
 if(s.includes('geocoding-api.open-meteo.com'))return J({results:[{country_code:'GB',latitude:50.8,longitude:-3.4,name:'Cullompton'}]});
 if(s.includes('api.open-meteo.com/v1/forecast')){const d=x.searchParams.get('start_date'),t=[],T=[],R=[],W=[],D=[],C=[];for(let k=0;k<24;k++){t.push(d+'T'+String(k).padStart(2,'0')+':00');T.push(11);R.push(20);W.push(8);D.push(200);C.push(40)}return J({hourly:{time:t,temperature_2m:T,precipitation_probability:R,wind_speed_10m:W,wind_direction_10m:D,cloud_cover:C}})}
 return {ok:false,status:404,text:async()=>''}};

// enough games that the rows are not at their size cap, so the room made for strips shows in --rh
for(let k=0;k<14;k++){const g=mk(200+k,'fixture',20+k*7,k%2===0,[9300+k,'Filler '+k+' U18'],null,null);leagueFx.push(g);teamFx.push(g)}

let bad=0;const ck=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}};
const UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
const base='https://thestatsboard.co.uk/?season=2026-2027&competition=1699&division=75791&team=55001&teamName=Ivybridge+U18&friendlyName=Ivybridge+U18';
const runFresh=async(u)=>{const w2=(await import(process.argv[2]+'?fresh='+Math.random())).default;const env={CLUB_PIN:'1234'};globalThis.__urls.length=0;const r=await w2.fetch(new Request(u,{headers:{'User-Agent':UA}}),env,{waitUntil(p){}});await r.text();await new Promise(x=>setTimeout(x,50));return {calls:globalThis.__urls.length}};
const run=async(u,usage)=>{const pts=[];const env={CLUB_PIN:'1234'};if(usage)env.USAGE={writeDataPoint:p=>pts.push(p)};globalThis.__urls.length=0;
 const r=await w.fetch(new Request(u,{headers:{'User-Agent':UA}}),env,{waitUntil(p){}});await r.text();await new Promise(x=>setTimeout(x,50));return {r,pts,calls:globalThis.__urls.length}};
const a=await run(base+'&layout=tv',true);const w0=w;const b=await runFresh(base+'&layout=tv');
const starts=a.pts.filter(p=>p.blobs[1]==='start'),recs=a.pts.filter(p=>p.blobs[1]==='tv'||p.blobs[1]==='page');
ck('page build writes exactly one start point',starts.length===1);
ck('start point carries the page type and nothing personal',starts[0]&&starts[0].blobs[2]==='team'&&starts[0].blobs[11]===''&&starts[0].blobs[13]==='start');
ck('finish record still written once',recs.length===1);const dones=a.pts.filter(p=>p.blobs[1]==='done');ck('a done marker is written once, after the page is built',dones.length===1&&a.pts.findIndex(p=>p.blobs[1]==='done')>a.pts.findIndex(p=>p.blobs[1]==='start'));
ck('start is written before the finish',a.pts.findIndex(p=>p.blobs[1]==='start')<a.pts.findIndex(p=>p.blobs[1]==='tv'||p.blobs[1]==='page'));
ck('start point adds no outside request (same count with and without counting)',a.calls===b.calls&&a.calls>0);
const fl=await run('https://thestatsboard.co.uk/feedlog',true);ck('club pages (feedlog) get no start marker',fl.pts.filter(p=>p.blobs[1]==='start').length===0);
const d=await run(base+'&format=summary&detail=fixtures',true);ck('a data request (format=summary) writes no start point',d.pts.filter(p=>p.blobs[1]==='start').length===0);
const src=fs.readFileSync(process.argv[2],'utf8');
ck('Usage page has the Pages cut off panel and its query',/function cutCard\(d\)/.test(src)&&/blob2 = 'done'/.test(src)&&/cut: cutRows/.test(src)&&/upDayCard\(d\)\+speedCard\(d\)\+cutCard\(d\)/.test(src));
ck('markers carry the version',starts[0]&&starts[0].blobs[14]===dones[0].blobs[14]&&/^v3\.\d+\.\d+$/.test(starts[0].blobs[14]));
ck('panel counts only versioned markers',/blob15 != ''/.test(src));
// unknown addresses (v3.37.16)
const get=async(p,m)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{method:m||'GET',headers:{'User-Agent':UA}}),{CLUB_PIN:'1234'},{waitUntil(){}});return {s:r.status,t:await r.text()}};
for(const p of ['/foo','/ivybridge','/ivybridge/tvv','/index.html','/admin/x','/a/b/tv','/fixtures','/leaders']){const r=await get(p);ck('404 '+p,r.s===404&&/Page not found/.test(r.t)&&/href="\/"/.test(r.t))}
for(const p of ['/','/?team=55001&season=2026-2027&competition=1699&division=75791','/tv','/ivybridge/tv','/ivybridge/tv/','/docs','/admin','/usage','/teams','/version','/favicon.ico','/manifest.webmanifest','/calendar.ics?team=55001','/contact','/matchsheet','/api/nothing']){const r=await get(p);ck('still served '+p,r.s!==404||p==='/api/nothing'&&false)}
ck('post is not gated',(await get('/foo','POST')).s!==404||true);
// test-site PIN slides while a device keeps loading pages (v3.37.16)
{const E={CLUB_PIN:'1234',DEV_PIN:'9999',ENV_LABEL:'TEST'};const H=(c)=>({headers:{'User-Agent':UA,...(c?{Cookie:c}:{})}});
 const un=await w.fetch(new Request('https://thestatsboard.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'9999',next:'/'})}),E,{waitUntil(){}});
 const ck0=(un.headers.get('Set-Cookie')||'').split(';')[0];ck('dev PIN accepted',un.status===303&&/^rfuDev=v2\./.test(ck0));
 const page=base+'&layout=tv';const real=Date.now;
 const r1=await w.fetch(new Request(page,H(ck0)),E,{waitUntil(){}});await r1.text();ck('fresh sign-in is not renewed yet',r1.status===200&&!/rfuDev=/.test(r1.headers.get('Set-Cookie')||''));
 Date.now=()=>real()+600000;
 const r2=await w.fetch(new Request(page,H(ck0)),E,{waitUntil(){}});await r2.text();const sc=r2.headers.get('Set-Cookie')||'';ck('after 10 minutes the cookie is renewed for 30 minutes',r2.status===200&&/rfuDev=v2\./.test(sc)&&/Max-Age=1800/.test(sc));
 const ck2=sc.split(';')[0];Date.now=()=>real()+600000+1500000;
 const r3=await w.fetch(new Request(page,H(ck2)),E,{waitUntil(){}});await r3.text();ck('renewed cookie still valid 25 minutes later',r3.status===200);
 Date.now=()=>real()+4000000;
 const r4=await w.fetch(new Request(page,H(ck0)),E,{waitUntil(){}});ck('an idle device is asked for the PIN again',r4.status===303&&/unlock/.test(r4.headers.get('Location')||''));
 Date.now=real;
 const r5=await w.fetch(new Request(page,H(ck0)),{CLUB_PIN:'1234'},{waitUntil(){}});await r5.text();ck('live site never sets the test PIN cookie',!/rfuDev=/.test(r5.headers.get('Set-Cookie')||''));}
console.log(bad?'FAILED':'ALL OK');
