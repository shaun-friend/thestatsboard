let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const ctx={waitUntil(){}};let inst=0;
const mkw=async()=>(await import(process.argv[2]+'?i='+(++inst))).default;
const J=o=>new Response(JSON.stringify(o),{headers:{'content-type':'application/json'}});
const SEASONS=[{name:'2025-2026',startDate:'2025-08-31T00:00:00.000Z',isCurrent:true},{name:'2026-2027',startDate:'2026-08-31T00:00:00.000Z',isCurrent:false},{name:'2024-2025',startDate:'2024-08-31T00:00:00.000Z',isCurrent:false}];
const game=(d,c,g,home,away)=>({date:d,competition:{id:1,commonId:c[0],name:c[1]},group:{id:2,commonId:g[0],name:g[1]},matches:[{id:1,homeTeam:{commonId:home[0],name:home[1]},awayTeam:{commonId:away[0],name:away[1]}}]});
let calls,NEXT,web;
const fetchMock=async(u)=>{u=String(u);calls.push(u);
 if(/cluster\.england-rfu\.com\/fixtures-and-results\/seasons/.test(u))return J(SEASONS);
 if(/cluster\.england-rfu\.com\/fixtures-and-results\/nextmatch/.test(u))return NEXT===null?new Response('x',{status:500}):J(NEXT);
 if(/cluster\.england-rfu\.com\/teams\/11057/.test(u))return J({id:11057,data:{name:'Ivybridge U18s'}});
 if(/cluster\.england-rfu\.com\/fixtures-and-results\/search/.test(u))return web.dsSearch===null?new Response('x',{status:500}):J(web.dsSearch);
 if(/englandrugby\.com\/api\/fixtures-and-result\/search/.test(u))return J({data:[{_id:7,listType:'TeamType',name:'Web Team'}]});
 if(/englandrugby\.com\/api\/fixtures-and-result\/teamSelect/.test(u))return J({data:{seasonList:['2026-2027','2025-2026'],compList:[{_id:1699,name:'Web League'}],selectedTeam:{data:{name:'Web Name'}},clubInfo:{clubName:'Web Club'}}});
 if(/englandrugby\.com\/api\/fixtures-and-result\/competitionSelect/.test(u))return J({data:{groupsList:[{_id:75791,name:'Web Div'}]}});
 return new Response('',{status:404})};
globalThis.fetch=fetchMock;
const store=new Map();globalThis.caches={default:{async match(k){const r=store.get(k.url||String(k));return r?r.clone():undefined},async put(k,v){store.set(k.url||String(k),v)}}};
const get=async(w,p)=>{const r=await w.fetch(new Request('https://x.test'+p),{},ctx);return r.json()};
// 1. Colts-like team: league + cup + friendlies
{const w=await mkw();calls=[];store.clear();
 NEXT=[game('2026-11-15T11:30:00Z',[1608,'National Under 18 Cup'],[78772,'Group 8'],[16529,'Paignton Colts U18'],[11057,'Ivybridge U18s']),
  game('2026-11-21T10:00:00Z',[266,'Manual Fixture'],[76119,'November 2026'],[11057,'Ivybridge U18s'],[1,'X']),
  game('2026-11-28T10:00:00Z',[2388,'Devon RFU Colts 2026-27'],[77306,'Group 1'],[11057,'Ivybridge U18s'],[2,'Y']),
  game('2026-12-05T10:00:00Z',[2388,'Devon RFU Colts 2026-27'],[77306,'Group 1'],[3,'Z'],[11057,'Ivybridge U18s'])];
 const d=await get(w,'/api/builder/team?team=11057');
 ok('via data service',d.via==='data-service');
 ok('two real competitions, friendlies left out',d.leagues.length===2&&!d.leagues.some(l=>/manual/i.test(l.competitionName)));
 ok('ids are the common ids',d.leagues.some(l=>l.competition==='1608'&&l.division==='78772')&&d.leagues.some(l=>l.competition==='2388'&&l.division==='77306'));
 ok('season suffix tidied',d.leagues.some(l=>l.competitionName==='Devon RFU Colts'));
 ok('current season from dates, not the RFU flag',d.season==='2026-2027'&&d.seasons[0]==='2026-2027'&&d.seasons.includes('2025-2026'));
 ok('team name from the data service',d.name==='Ivybridge U18s');
 ok('no englandrugby.com call at all',!calls.some(u=>/englandrugby\.com/.test(u)));
 // 2. later: the cup is no longer upcoming, but remembered
 const w2=await mkw();calls=[];
 NEXT=[game('2026-11-28T10:00:00Z',[2388,'Devon RFU Colts 2026-27'],[77306,'Group 1'],[11057,'Ivybridge U18s'],[2,'Y'])];
 const d2=await get(w2,'/api/builder/team?team=11057');
 ok('finished cup still listed (remembered)',d2.via==='data-service'&&d2.leagues.length===2);
}
// 3. past season goes to the website
{const w=await mkw();calls=[];store.clear();
 const d=await get(w,'/api/builder/team?team=11057&season=2025-2026');
 ok('past season uses the website',d.via==='website'&&d.name==='Web Name'&&calls.some(u=>/teamSelect/.test(u)))}
// 4. nothing left to play: website
{const w=await mkw();calls=[];store.clear();NEXT=[];
 const d=await get(w,'/api/builder/team?team=11057');
 ok('no upcoming games falls back to website',d.via==='website')}
// 5. only friendlies: website
{const w=await mkw();calls=[];store.clear();NEXT=[game('2026-11-21T10:00:00Z',[266,'Manual Fixture'],[76119,'November 2026'],[11057,'A'],[1,'X'])];
 const d=await get(w,'/api/builder/team?team=11057');
 ok('only friendlies falls back to website',d.via==='website')}
// 6. data service down: website
{const w=await mkw();calls=[];store.clear();NEXT=null;
 const d=await get(w,'/api/builder/team?team=11057');
 ok('data service error falls back to website',d.via==='website'&&d.leagues.length===1)}
// 7. webonly forces the website
{const w=await mkw();calls=[];store.clear();NEXT=[game('2026-11-15T11:30:00Z',[1608,'National Under 18 Cup'],[78772,'Group 8'],[16529,'P'],[11057,'Ivybridge U18s'])];
 const d=await get(w,'/api/builder/team?team=11057&webonly=1');
 ok('webonly=1 forces the website',d.via==='website'&&!calls.some(u=>/nextmatch/.test(u)))}
// 8. search
{const w=await mkw();calls=[];store.clear();web={dsSearch:[{_id:15342,listType:'TeamType',name:'Okehampton'},{_id:5,listType:'GroupType',name:'No'}]};
 let d=await get(w,'/api/builder/search?name=Okeh');
 ok('search from the data service, teams only',d.via==='data-service'&&d.teams.length===1&&d.teams[0].id==='15342');
 ok('search made no website call',!calls.some(u=>/englandrugby\.com/.test(u)));
 const w2=await mkw();store.clear();web={dsSearch:null};calls=[];
 d=await get(w2,'/api/builder/search?name=Okeh');
 ok('search falls back to website',d.teams&&d.teams[0]&&d.teams[0].name==='Web Team');
 const w3=await mkw();web={dsSearch:[]};d=await get(w3,'/api/builder/search?name=Zzzz');
 ok('empty search result tries the website',d.teams&&d.teams[0]&&d.teams[0].name==='Web Team')}
console.log(pass+' pass, '+fail+' fail');
