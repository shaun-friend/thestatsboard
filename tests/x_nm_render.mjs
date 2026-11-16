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

const env={CLUB_PIN:'1234'};
globalThis.__urls.length=0;
const r=await w.fetch(new Request('https://thestatsboard.co.uk/?season=2026-2027&competition=1699&division=75791&team=55001&teamName=Ivybridge+U18&friendlyName=Ivybridge+U18&layout=tv'),env,{waitUntil(){}});
fs.writeFileSync('w/nm_tv.html',await r.text());console.log('tv',r.status,'outside calls',globalThis.__urls.length);
globalThis.__urls.length=0;
const r2=await w.fetch(new Request('https://thestatsboard.co.uk/?season=2026-2027&competition=1699&division=75791&team=55001&teamName=Ivybridge+U18&friendlyName=Ivybridge+U18&layout=mobile'),env,{waitUntil(){}});
fs.writeFileSync('w/nm_ph.html',await r2.text());console.log('phone',r2.status,'outside calls',globalThis.__urls.length);
