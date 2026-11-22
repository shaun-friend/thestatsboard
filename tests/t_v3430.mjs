// v3.43.0: Player sponsors: Current player flag, one-off scan of the season's team sheets, last-seen hint
import fs from 'fs';import vm from 'vm';
const src=fs.readFileSync(process.argv[2],'utf8');
const a=src.indexOf('const SPONSOR_KEY');const b=src.indexOf('function sponsorsPage(');const e=src.indexOf('function inboxPage(');
let pass=0,fail=0;const c=(n,ok,d)=>{if(ok)pass++;else{fail++;console.log('FAIL',n,d||'')}};
const store={};let puts=0;
const kv={get:async k=>store[k]?JSON.parse(store[k]):null,put:async(k,v)=>{puts++;store[k]=v}};
const SQUAD=[{_id:1530430,player_name:'Wesley Vermigle'},{_id:1704351,player_name:'Harry Newman-Wild'},{_id:2649651,player_name:'******* *******'},{_id:1313523,player_name:'Adam Lilley'},{_id:2380102,player_name:'Adam Lilley'},{_id:5,player_name:'Aled Price'}];
const P=(no,fn,ln,team,x)=>({individualId:no,teamId:team,firstName:fn,lastName:ln,...(x||{})});
const OUR=8595,OPP=9999;
const SHEETS={
 '101':[P(1530430,'Wesley','Vermigle',OUR),P(1704351,'Harry','Newman-Wild',OUR),P(2649651,'Ben','Hidden',OUR,{hasDisclosure:true}),P(5,'Aled','Price',OUR),P(900,'Other','Man',OPP)],
 '102':[P(1530430,'Wesley','Vermigle',OUR),P(5,'Aled','Price',OUR),P(901,'Other','Two',OPP)],
 '103':[P(1530430,'Wesley','Vermigle',OUR),P(777,'New','Lad',OUR),P(1313523,'Adam','Lilley',OUR),P(902,'Other','Three',OPP)]};
let games=[{id:'103',status:'done',iso:'2026-10-24T14:00:00Z',oppName:'Okehampton'},{id:'101',status:'done',iso:'2026-09-05T14:00:00Z',oppName:'Exmouth'},{id:'102',status:'done',iso:'2026-09-19T14:00:00Z',oppName:'Plympton'},{id:'104',status:'upcoming',iso:'2026-12-05T14:00:00Z'},{id:'105',status:'done',wo:true,iso:'2026-11-01T14:00:00Z'}];
let sheetMiss=new Set(),sheetCalls=[];
const ctx={Response,URL,URLSearchParams,Request,JSON,String,Array,Set,Map,Object,Number,Math,parseInt,Promise,Uint32Array,crypto:globalThis.crypto,Date,kvOf:()=>kv,siteSettings:async()=>({}),
 TEAMS:[{team:'11039',name:'Ivybridge 1XV',competition:'1',division:'2',teamName:'Ivybridge',league:'L'},{team:'11063',name:'The Vandals',competition:'1',division:'3',teamName:'Vandals',league:'L'}],
 ADDR_RULES:{season:v=>/^20\d\d-20\d\d$/.test(v)},dateSeasonName:()=>'2026-2027',todayIso:()=>'2026-11-19',seasonName:y=>y+'-'+(y+1),
 cachedText:async()=>({ok:true,text:JSON.stringify(SQUAD)}),
 sheetHidesNames:()=>false,
 sheetJson:async u=>{const id=/matchId=(\d+)/.exec(u)[1];sheetCalls.push(id);if(sheetMiss.has(id))return null;return{participants:SHEETS[id]||SHEETS['102']}}};
const worker={fetch:async()=>new Response(JSON.stringify({games}),{status:200})};
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+src.slice(src.indexOf('// v3.42.0: Sponsors, stage 2'),e)+';this.p=sponsorPlayersApi;this.s=sponsorsApi',ctx);
const U=q=>new URL('https://x.test/api/sponsor-players'+(q||''));
const get=async q=>{const u=U(q);return (await ctx.p(new Request(u),u,worker)).json()};
const post=async o=>{const u=U();const r=await ctx.p(new Request(u,{method:'POST',body:JSON.stringify(o)}),u,worker);return{s:r.status,j:await r.json()}};
const sp=async o=>{const u=new URL('https://x.test/api/sponsors');const r=await ctx.s(new Request(u,{method:'POST',body:JSON.stringify(o)}),u);return{s:r.status,j:await r.json()}};
const sget=async()=>{const u=new URL('https://x.test/api/sponsors');return (await ctx.s(new Request(u),u)).json()};
const dart=(await sp({act:'add',name:'Dart Motors'})).j.items[0].id;
const SC={act:'scan',team:'11039',season:'2026-2027',offset:0};
let j=await get('');
c('nobody is current before a scan',j.rows.every(r=>!r.cur)&&j.played===0&&j.rows.every(r=>r.last===-1));
// a sponsored player from before this release (no flag) counts as current
store['sponsor-links:2026-2027']=JSON.stringify({v:1,t:{'11039':{'1530430':{n:'Wesley Vermigle',nm:'',s:dart,a:[]}}}});
j=await get('');
c('a sponsored player with no flag is current',j.rows.find(r=>r.no==='1530430').cur&&j.rows.filter(r=>r.cur).length===1);
let p0=puts;let r=await post(SC);
c('scan reads every played game, one batch, one write',r.j.ok&&r.j.total===3&&r.j.next===null&&r.j.read===3&&r.j.missed===0&&puts===p0+1,JSON.stringify(r.j));
c('only played games with a result are read, earliest first',sheetCalls.join()==='101,102,103',sheetCalls.join());
c('players are ticked and new ones counted',r.j.added===5&&r.j.marked===5,JSON.stringify(r.j));
j=await get('');const by=n=>j.rows.find(x=>x.no===n);
c('every player who played is current',['1530430','1704351','2649651','5','777','1313523'].every(n=>by(n)&&by(n).cur),JSON.stringify(j.rows.map(x=>[x.no,x.cur])));
c('the opposition is never added',!by('900')&&!by('901')&&!by('902'));
c('the second record of a player who did not play is not current',by('2380102')&&!by('2380102').cur);
c('a player not in the RFU squad list is added with the sheet name',by('777').left&&by('777').rfu==='New Lad'&&by('777').cur);
c('a hidden player is added without a name',by('2649651').hidden&&by('2649651').rfu==='');
c('games played is stored and last-on-a-sheet is worked out',j.played===3&&by('1530430').last===0&&by('5').last===1&&by('1704351').last===2&&by('777').last===0,JSON.stringify(j.rows.map(x=>[x.no,x.last])));
c('last game date and opponent are kept for each player',by('1530430').lastOn==='2026-10-24'&&by('1530430').lastOpp==='Okehampton'&&by('1704351').lastOn==='2026-09-05'&&by('1704351').lastOpp==='Exmouth'&&by('5').lastOpp==='Plympton',JSON.stringify(j.rows.map(x=>[x.no,x.lastOn,x.lastOpp])));
c('the scan lists the games it read',Array.isArray(r.j.games)&&r.j.games.length===3&&r.j.games[0].o==='Exmouth'&&r.j.games[2].d==='2026-10-24',JSON.stringify(r.j.games));
c('the sponsor already set is kept',by('1530430').sponsor==='Dart Motors');
// scanning again changes nothing important
p0=puts;r=await post(SC);c('scanning again marks nobody new',r.j.ok&&r.j.marked===0&&r.j.added===0,JSON.stringify(r.j));
// untick
r=await post({act:'set',team:'11039',season:'2026-2027',no:'1704351',n:'Harry Newman-Wild',nm:'',s:'',alt:'',cur:false});j=await get('');
c('a player without anything else can be unticked',r.j.ok&&!by('1704351').cur);
r=await post({act:'set',team:'11039',season:'2026-2027',no:'1530430',n:'Wesley Vermigle',nm:'',s:dart,alt:'',cur:false});j=await get('');
c('a sponsored player can be unticked and stays unticked',r.j.ok&&!by('1530430').cur&&by('1530430').sponsor==='Dart Motors');
r=await post(SC);j=await get('');
c('a scan never re-ticks a player who was unticked on purpose',!by('1530430').cur);
c('a scan re-ticks one who was only removed (no deliberate choice)',by('1704351').cur);
r=await post({act:'set',team:'11039',season:'2026-2027',no:'1530430',n:'Wesley Vermigle',nm:'',s:dart,alt:'',cur:true});j=await get('');
c('ticking again works',by('1530430').cur);
// batches
games=[];for(let i=1;i<=10;i++)games.push({id:String(200+i),status:'done',iso:'2026-09-'+String(10+i)+'T14:00:00Z'});
sheetCalls=[];r=await post({act:'scan',team:'11063',season:'2026-2027',offset:0});
c('a long season is read in batches of 8 with the next place given',r.j.ok&&r.j.total===10&&r.j.next===8&&sheetCalls.length===8,JSON.stringify(r.j));
sheetCalls=[];r=await post({act:'scan',team:'11063',season:'2026-2027',offset:8});
c('the last batch ends the scan',r.j.ok&&r.j.next===null&&sheetCalls.length===2,JSON.stringify(r.j));
j=await get('?team=11063');c('the other team has its own current players and games played',j.played===10&&j.rows.some(x=>x.cur));
// a game that belongs to another team is skipped
SHEETS['301']=[P(5,'Aled','Price',7000),P(1704351,'Harry','Newman-Wild',7000),P(903,'O','One',OPP)];
SHEETS['302']=[P(5,'Aled','Price',7000),P(904,'O','Two',OPP)];
SHEETS['303']=[P(1530430,'Wesley','Vermigle',8595),P(905,'O','Three',OPP)];
games=[{id:'301',status:'done',iso:'2026-09-05T14:00:00Z',oppName:'A'},{id:'302',status:'done',iso:'2026-09-19T14:00:00Z',oppName:'B'},{id:'303',status:'done',iso:'2026-10-24T14:00:00Z',oppName:'C'}];
await post({act:'reset',team:'11063',season:'2026-2027'});
r=await post({act:'scan',team:'11063',season:'2026-2027',offset:0});j=await get('?team=11063');
c('a sheet from another team is skipped and counted',r.j.ok&&r.j.other===1&&r.j.read===2&&r.j.games[2].x===1,JSON.stringify(r.j));
c('players on the other team sheet are not ticked here',!j.rows.find(x=>x.no==='1530430'||false)||!j.rows.find(x=>x.no==='1530430').cur,JSON.stringify(j.rows.filter(x=>x.cur).map(x=>x.no)));
c('players from this team are ticked',j.rows.find(x=>x.no==='5').cur&&j.rows.find(x=>x.no==='1704351').cur);
// reset
await post({act:'set',team:'11063',season:'2026-2027',no:'5',n:'Aled Price',nm:'',s:dart,alt:'',cur:true});
r=await post({act:'reset',team:'11063',season:'2026-2027'});j=await get('?team=11063');
c('clearing ticks removes unsponsored players but keeps sponsored ones current',r.j.ok&&r.j.copied>=1&&j.rows.find(x=>x.no==='5').cur&&!j.rows.find(x=>x.no==='1704351').cur&&j.rows.find(x=>x.no==='5').lastOn==='',JSON.stringify(r.j));
// unreadable sheets
games=[{id:'101',status:'done',iso:'2026-09-05T14:00:00Z'},{id:'102',status:'done',iso:'2026-09-19T14:00:00Z'}];sheetMiss=new Set(['102']);
r=await post(SC);c('a sheet that cannot be read is counted, not fatal',r.j.ok&&r.j.missed===1&&r.j.read===1,JSON.stringify(r.j));sheetMiss=new Set();
games=[{id:'104',status:'upcoming',iso:'2026-12-05T14:00:00Z'}];r=await post(SC);c('no played games gives a plain message',!r.j.ok&&/No played games/.test(r.j.error)&&r.s===404);
games=[{id:'101',status:'done',iso:'2026-09-05T14:00:00Z'}];
r=await post({act:'scan',team:'11039',season:'2025-2026',offset:0});c('scan is for this season only',!r.j.ok&&r.s===400);
// next season: nobody current; copy keeps sponsors only
j=await get('?season=2027-2028');c('next season starts with nobody current',j.rows.every(x=>!x.cur)&&j.played===0);
r=await post({act:'copy',team:'11039',season:'2027-2028',from:'2026-2027'});j=await get('?season=2027-2028');
c('copying a season brings sponsored players, and they count as current until unticked',r.j.ok&&j.rows.find(x=>x.no==='1530430').sponsor==='Dart Motors'&&j.rows.find(x=>x.no==='1530430').cur&&!j.rows.find(x=>x.no==='1704351').cur,JSON.stringify([r.j,j.rows.filter(x=>x.no==='1530430'||x.no==='5')]));
const k=JSON.parse(store['sponsor-links:2026-2027']);
c('stored per season with the flag, last game and games played',k.t['11039']['5'].c===1&&k.t['11039']['5'].l===2&&k.g['11039']===1||k.g['11039']>=1,JSON.stringify(k.g));
// a player on two teams has one sponsor and one own name
await post({act:'set',team:'11039',season:'2026-2027',no:'2380102',n:'Adam Lilley',nm:'Ads Lilley',s:dart,alt:'',cur:true});
j=await get('?team=11063');
c('a sponsor set on one team shows on the other team',by('2380102').sponsor==='Dart Motors'&&by('2380102').nm==='Ads Lilley'&&by('2380102').own,JSON.stringify(by('2380102')));
c('being sponsored on another team does not make the player current here',!by('2380102').cur);
await post({act:'set',team:'11063',season:'2026-2027',no:'2380102',n:'Adam Lilley',nm:'Ads Lilley',s:dart,alt:'',cur:true});
let s2=await sget();const kk=JSON.parse(store['sponsor-links:2026-2027']);const nos=new Set();for(const tk of Object.keys(kk.t))for(const n of Object.keys(kk.t[tk]))if(kk.t[tk][n].s===dart)nos.add(n);
c('the same player on two teams counts once for the sponsor',s2.use[dart]===nos.size&&nos.has('2380102'),JSON.stringify(s2.use)+[...nos]);
await post({act:'set',team:'11063',season:'2026-2027',no:'2380102',n:'Adam Lilley',nm:'',s:'',alt:'',cur:true});
j=await get('?team=11039');
c('clearing the sponsor on one team clears it for the player everywhere',!by('2380102').sponsor&&!by('2380102').nm,JSON.stringify(by('2380102')));
// Sponsors page: add several players to a sponsor, list them, take them off
const sdet=async id=>{const u=new URL('https://x.test/api/sponsors');const r=await ctx.s(new Request(u,{method:'POST',body:JSON.stringify({act:'detail',id})}),u);return{s:r.status,j:await r.json()}};
r=await post({act:'assign',team:'11039',season:'2026-2027',s:dart,nos:['1704351','2649651','5','999']});
c('assign gives the sponsor to the players in the squad list and skips unknown numbers',r.j.ok&&r.j.changed>=1&&r.j.changed<=3,JSON.stringify(r.j));
let d=await sdet(dart);
c('the sponsor lists its players once each with the team',d.j.ok&&['1704351','2649651','5'].every(n=>d.j.players.some(p=>p.no===n))&&!d.j.players.some(p=>p.no==='999')&&d.j.players.every(p=>p.team),JSON.stringify(d.j.players));
c('a hidden RFU name is listed without a name',d.j.players.find(p=>p.no==='2649651').name==='');
c('the teams to pick from are the shown teams',d.j.teams.length===2&&d.j.season==='2026-2027');
j=await get('');c('assigned players are current and sponsored on the list',by('1704351').sponsor==='Dart Motors'&&by('1704351').cur);
r=await post({act:'assign',team:'11039',season:'2026-2027',s:'',nos:['1704351','5']});j=await get('');
c('taking the sponsor off clears it',r.j.ok&&!by('1704351').sponsor&&!by('5').sponsor,JSON.stringify(r.j));
d=await sdet(dart);c('and they leave the sponsor list',!d.j.players.some(p=>p.no==='1704351'||p.no==='5'));
r=await post({act:'assign',team:'11039',season:'2026-2027',s:'deadbeef',nos:['5']});c('an unknown sponsor is refused',r.s===404);
r=await post({act:'assign',team:'11039',season:'2026-2027',s:dart,nos:[]});c('choosing nobody is refused',r.s===400);
d=await sdet('deadbeef');c('an unknown sponsor has no detail',d.s===404);
// page
const pg=src.slice(src.indexOf('function sponsorPlayersPage('),e);
c('page has the tick box, the filter and the scan button',/data-a="cur"/.test(pg)&&/\["cur","Current "/.test(pg)&&/Find this season/.test(pg)&&/Not current/.test(pg));
const sc=/<script>([\s\S]*?)<\/script>/.exec(vm.runInContext('(function(){return '+pg.slice(0,pg.indexOf('\n}\n'))+'\n}\n})()', vm.createContext({MENU_CSS:'',SP_LAYOUT_CSS:'',SP_PLAYERS_CSS:'',themeBoot:()=>'',themeToggleScript:'',VERSION_LABEL:'v',}))('dark',false,true)||'');
let okJs=false;try{new vm.Script(sc[1]);okJs=true}catch(x){}
c('the page script is valid',okJs);
c('no page script puts an id= on an /api/ address (the site refuses ids that are not numbers)',!/\/api\/[a-z-]+\?[^"']*\bid=/.test(src.slice(src.indexOf('function sponsorsPage('),e)),'');
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0)
