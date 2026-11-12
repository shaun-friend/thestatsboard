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
const AWAY=process.argv[4]!=='home';const leagueFx=[O(51,[9101,'Okehampton U18'],[9102,'Honiton U18'],null,null,'fixture'),mk(3,'fixture',3,!AWAY,C,null,null)];
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
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const ctx={waitUntil(){}};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const req=(p,o={},h={},host='https://thestatsboard.co.uk')=>new Request(host+p,{...o,headers:h});
const env={CLUB_PIN:'1234',SETTINGS:kv},envNo={CLUB_PIN:'1234'};
const base='season=2026-2027&competition=1699&division=75791&team=55001&teamName=Ivybridge%20U18&friendlyName=Ivybridge%20U18';
// the three real club teams
const own='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&friendlyName=Ivybridge%201XV';
let r=await w.fetch(req('/admin'),{},ctx);ok('PROD without CLUB_PIN locked (503)',r.status===503);
r=await w.fetch(req('/admin',{},{}),env,ctx);ok('no cookie redirects to PIN page',r.status===303&&/club-unlock\?next=%2Fadmin/.test(r.headers.get('location')));
r=await w.fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/admin'})}),env,ctx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];ok('unlock cookie',/rfuClub=/.test(ck));
const H={Cookie:ck,'Content-Type':'application/json',Origin:'https://thestatsboard.co.uk'};
// no KV connected
r=await w.fetch(req('/admin',{},{Cookie:ck}),envNo,ctx);let h=await r.text();
ok('admin loads without KV and explains the binding',r.status===200&&/not connected/.test(h)&&/SETTINGS/.test(h)&&/no-store/.test(r.headers.get('cache-control')||'')&&/noindex/.test(r.headers.get('x-robots-tag')||''));
r=await w.fetch(req('/api/admin',{method:'POST',body:'{}'},H),envNo,ctx);ok('save without KV answers 503',r.status===503);
// defaults with KV but nothing saved
r=await w.fetch(req('/admin',{},{Cookie:ck}),env,ctx);h=await r.text();
ok('admin with KV: form enabled, defaults shown',r.status===200&&!/not connected/.test(h)&&/id="fa"[^>]*checked/.test(h)&&/Not saved yet/.test(h));
// API security
r=await w.fetch(req('/api/admin',{method:'POST',body:'{}'},{'Content-Type':'application/json',Origin:'https://thestatsboard.co.uk'}),env,ctx);ok('save without cookie rejected (401)',r.status===401);
r=await w.fetch(req('/api/admin',{method:'POST',body:'{}'},{...H,Origin:'https://evil.example'}),env,ctx);ok('save from another site rejected (403)',r.status===403);
r=await w.fetch(req('/api/admin',{},{Cookie:ck}),env,ctx);ok('GET on the save address answers 405',r.status===405);
r=await w.fetch(req('/api/admin',{method:'POST',body:'not json'},H),env,ctx);ok('bad body rejected (400)',r.status===400);
ok('nothing saved by bad calls',Object.keys(store).filter(k=>k==='club:ivybridge').length===0);
// save with messy input
const bad={notices:{home:{on:true,text:'  Feed <b>down</b> \n today  '+'x'.repeat(300),style:'weird',until:'tomorrow'},tv:{on:true,text:'Bar closed Saturday '+'y'.repeat(200),style:'warning',applies:'nope',teams:['11039','999','11063'],until:'2999-01-01'}},features:{around:false,weather:'no',checked:false,wocolour:true}};
r=await w.fetch(req('/api/admin',{method:'POST',body:JSON.stringify(bad)},H),env,ctx);let j=await r.json();
ok('save ok with a UK-format time label',r.status===200&&j.ok&&/^\d{2}-[A-Z][a-z]{2}-\d{4}, \d{2}:\d{2}$/.test(j.label));
const sv=JSON.parse(store['club:ivybridge']);
ok('stored under club:ivybridge',!!sv);
ok('home text trimmed to 200, style falls back, bad date dropped',sv.notices.home.text.length===200&&sv.notices.home.style==='info'&&sv.notices.home.until==='');
ok('tv text trimmed to 120, applies falls back to club, unknown team dropped',sv.notices.tv.text.length===120&&sv.notices.tv.applies==='club'&&JSON.stringify(sv.notices.tv.teams)==='["11039","11063"]'&&sv.notices.tv.style==='warning');
ok('only exact false switches a feature off',sv.features.around===false&&sv.features.checked===false&&sv.features.weather===true&&sv.features.wocolour===true);
r=await w.fetch(req('/admin',{},{Cookie:ck}),env,ctx);h=await r.text();
ok('admin shows what was saved',/id="hon" checked/.test(h)&&!/id="fa" checked/.test(h)&&/Last saved \d{2}-[A-Z][a-z]{2}-\d{4}/.test(h)&&/value="2999-01-01"/.test(h));
// good settings for the notice tests
const good=(o)=>({notices:{home:{on:true,text:'Feed is slow <today> & tomorrow',style:'info',until:''},tv:{on:true,text:'Bar closed Saturday',style:'info',applies:'club',teams:[],until:''},...o},features:{around:true,weather:true,checked:true,wocolour:true}});
const save=async o=>{const x=await w.fetch(req('/api/admin',{method:'POST',body:JSON.stringify(o)},H),env,ctx);return x.status};
ok('save good settings',await save(good({}))===200);
// homepage
let hp=await (await w.fetch(req('/'),env,ctx)).text();
ok('homepage shows the notice, escaped, info style',/class="sbn info"[^>]*>Feed is slow &lt;today&gt; &amp; tomorrow</.test(hp)&&/The Stats Board/.test(hp));
ok('homepage notice is inside the page, above the title',hp.indexOf('id="sbnh"')>0&&hp.indexOf('id="sbnh"')<hp.indexOf('<h1'));
ok('no notice without the KV binding',!/id="sbnh"/.test(await (await w.fetch(req('/'),envNo,ctx)).text()));
await save(good({home:{on:false,text:'Hidden',style:'info',until:''}}));
ok('homepage notice off',!/id="sbnh"/.test(await (await w.fetch(req('/'),env,ctx)).text()));
await save(good({home:{on:true,text:'Old news',style:'warning',until:'2000-01-01'}}));
ok('homepage notice past its hide-after date is hidden',!/id="sbnh"/.test(await (await w.fetch(req('/'),env,ctx)).text()));
await save(good({home:{on:true,text:'Today only',style:'warning',until:'2999-01-01'}}));
hp=await (await w.fetch(req('/'),env,ctx)).text();ok('future hide-after date still shows it (warning style)',/class="sbn warning"[^>]*>Today only/.test(hp));
ok('team pages do not get the homepage notice',!/id="sbnh"/.test(await (await w.fetch(req('/?'+own),env,ctx)).text()));
// TV notice scope
const tvp=t=>'/?season=2026-2027&competition=1699&division=75791&team='+t+'&teamName=Ivybridge&friendlyName=X&view=fixtures&layout=tv';
const has=async(p)=>/id="sbnt"/.test(await (await w.fetch(req(p),env,ctx)).text());
ok('club teams only: shows for a club team',await has(tvp('11039')));
ok('club teams only: hidden for another club\'s team',!(await has(tvp('55001'))));
await save(good({tv:{on:true,text:'For all',style:'info',applies:'all',teams:[],until:''}}));
ok('all screens: shows for another club\'s team too',await has(tvp('55001')));
await save(good({tv:{on:true,text:'Only vandals',style:'info',applies:'chosen',teams:['11063'],until:''}}));
ok('chosen teams: shows for a chosen team',await has(tvp('11063')));
ok('chosen teams: hidden for an unchosen team',!(await has(tvp('11039'))));
await save(good({tv:{on:false,text:'Off',style:'info',applies:'all',teams:[],until:''}}));
ok('tv notice off',!(await has(tvp('11039'))));
await save(good({tv:{on:true,text:'Bar closed Saturday',style:'info',applies:'club',teams:[],until:''}}));
ok('phone Fixtures page never gets the TV notice',!/id="sbnt"/.test(await (await w.fetch(req('/?'+own+'&view=fixtures'),env,ctx)).text()));
ok('Match Centre (view=stack) gets it',await has('/?view=stack&layout=tv')||await has('/?view=stack'));
const std=await (await w.fetch(req('/?'+own+'&layout=tv'),env,ctx)).text();
ok('standard TV page gets exactly one strip after <body>',(std.match(/id="sbnt"/g)||[]).length===1&&/<body[^>]*>(<style>[^<]*<\/style>)?<div class="sbn/.test(std.replace(/\n/g,'')));
ok('phone team page does not',!/id="sbnt"/.test(await (await w.fetch(req('/?'+own),env,ctx)).text()));
// rows shrink to make room
const rhOf=t=>Number((t.match(/--rh:([\d.]+)/)||[])[1]);
await save(good({tv:{on:false,text:'x',style:'info',applies:'all',teams:[],until:''}}));
const noN=rhOf(await (await w.fetch(req('/?'+base+'&view=fixtures&layout=tv'),env,ctx)).text());
await save(good({tv:{on:true,text:'Bar closed',style:'info',applies:'all',teams:[],until:''}}));
const withN=rhOf(await (await w.fetch(req('/?'+base+'&view=fixtures&layout=tv'),env,ctx)).text());
ok('fixtures rows shrink when a notice is showing ('+noN+' -> '+withN+')',noN>0&&withN>0&&withN<noN);
// feature switches (mock data has an away game with weather, an around strip with walkovers, and a feed time)
const feat=async f=>{await save({notices:{home:{on:false,text:'',style:'info',until:''},tv:{on:false,text:'',style:'info',applies:'club',teams:[],until:''}},features:f});return (await w.fetch(req('/?'+base+'&view=fixtures&layout=tv'),env,ctx)).text()};
const all=await feat({around:true,weather:true,checked:true,wocolour:true});
fs.writeFileSync('x_v35_all.html',all);
ok('defaults: strip, last checked, walkover colours present',/Around the league today/.test(all)&&/last checked/.test(all)&&/class="aa wow"/.test(all));
const noA=await feat({around:false,weather:true,checked:true,wocolour:true});
ok('around off: strip gone, rows get the space back',!/Around the league today/.test(noA)&&rhOf(noA)>rhOf(all));
const noC=await feat({around:true,weather:true,checked:false,wocolour:true});
ok('last checked off',!/last checked/.test(noC)&&/Around the league today/.test(noC));
const noW=await feat({around:true,weather:true,checked:true,wocolour:false});
ok('walkover colours off: no green/red, winner still bold',!/ wow"/.test(noW)&&!/ wol"/.test(noW)&&/class="aa wn">Dawlish/.test(noW));
const noX=await feat({around:true,weather:false,checked:true,wocolour:true});
const wxMark='class="bwx"';
ok('weather present by default and gone when off',all.includes(wxMark)&&!noX.includes(wxMark)&&/Forecast for the day/.test(all)&&!/Forecast for the day/.test(noX));
ok('KV missing: every feature stays on',/Around the league today/.test(await (await w.fetch(req('/?'+base+'&view=fixtures&layout=tv'),envNo,ctx)).text()));
// links page and docs
r=await w.fetch(req('/?view=teams',{},{Cookie:ck}),env,ctx);h=await r.text();ok('Links page has an Admin link',/href="\/admin"[^>]*>Admin</.test(h));
r=await w.fetch(req('/docs',{},{Cookie:ck}),env,ctx);h=await r.text();ok('docs page lists /admin',h.includes('<code>/admin</code>'));
console.log(pass,'pass',fail,'fail')
