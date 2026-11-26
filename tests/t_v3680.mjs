// v3.68.0: a player can have two sponsors
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
const moor=(await sp({act:'add',name:'Moor Ale'})).j.items.find(x=>x.name==='Moor Ale').id;
const bake=(await sp({act:'add',name:'Ivy Bakery'})).j.items.find(x=>x.name==='Ivy Bakery').id;
const T='11039',S='2026-2027',NO='1530430';
const row=async(no)=>{const j=await get('?team='+T+'&season='+S);return j.rows.find(r=>r.no===no)};
let r0=await post({act:'set',team:T,season:S,no:NO,n:'Wesley Vermigle',nm:'',s:dart,s2:moor,alt:'',cur:true});
c('saving two sponsors works',r0.s===200&&r0.j.ok,JSON.stringify(r0));
let x=await row(NO);
c('the row carries both sponsors, the text shows both',x&&x.sid===dart&&x.sid2===moor&&x.sponsor==='Dart Motors + Moor Ale',JSON.stringify(x));
r0=await post({act:'set',team:T,season:S,no:NO,n:'Wesley Vermigle',nm:'',s:'',s2:moor,alt:'',cur:true});x=await row(NO);
c('a second sponsor alone becomes the first',x.sid===moor&&!x.sid2&&x.sponsor==='Moor Ale',JSON.stringify(x));
r0=await post({act:'set',team:T,season:S,no:NO,n:'Wesley Vermigle',nm:'',s:moor,s2:moor,alt:'',cur:true});x=await row(NO);
c('the same sponsor twice is kept once',x.sid===moor&&!x.sid2,JSON.stringify(x));
r0=await post({act:'set',team:T,season:S,no:NO,n:'x',nm:'',s:dart,s2:'deadbeef',alt:'',cur:true});
c('an unknown second sponsor is refused',r0.s===404,JSON.stringify(r0));
r0=await post({act:'set',team:T,season:S,no:NO,n:'x',nm:'',s:dart,s2:moor,alt:'',cur:true});
// Sponsors page views
const det=async id=>{const u=new URL('https://x.test/api/sponsors');const r=await ctx.s(new Request(u,{method:'POST',body:JSON.stringify({act:'detail',id})}),u);return r.json()};
const d1=await det(moor),d2=await det(dart);
c('both sponsors list the player',d1.players.length===1&&d2.players.length===1,JSON.stringify([d1.players,d2.players]));
const rep=await (async()=>{const u=new URL('https://x.test/api/sponsors');const r=await ctx.s(new Request(u,{method:'POST',body:JSON.stringify({act:'report'})}),u);return r.json()})();
c('the sponsor report lists the player under both',rep.sponsors.filter(s=>[dart,moor].includes(s.id)).every(s=>s.players.length===1),JSON.stringify(rep.sponsors.map(s=>[s.name,s.players.length])));
const tot=(await get('?team='+T+'&season='+S)).tot;
c('the player counts once in the season totals',tot.players===1&&tot.used===2,JSON.stringify(tot));
// assign: adding a third is refused, removing one keeps the other
let as=await post({act:'assign',team:T,season:S,s:bake,nos:[NO]});
c('a third sponsor is not added (two is the most)',as.j.ok&&as.j.changed===0&&as.j.full===1,JSON.stringify(a.j));
x=await row(NO);c('still the same two',x.sid===dart&&x.sid2===moor,JSON.stringify(x));
as=await post({act:'assign',team:T,season:S,s:'',from:dart,nos:[NO]});x=await row(NO);
c('removing one sponsor keeps the other',as.j.ok&&x.sid===moor&&!x.sid2&&x.sponsor==='Moor Ale',JSON.stringify(x));
as=await post({act:'assign',team:T,season:S,s:bake,nos:[NO]});x=await row(NO);
c('adding a sponsor to a player with one makes two',as.j.changed===1&&x.sid===moor&&x.sid2===bake,JSON.stringify(x));
as=await post({act:'assign',team:T,season:S,s:'',nos:[NO]});x=await row(NO);
c('removing with no sponsor named clears both',x&&!x.sid&&!x.sid2,JSON.stringify(x));
// wiring
c('Players page lets a player have two sponsors and passes s2',/of 2\)<\/div>/.test(src)&&/s2:ids\[1\]\|\|""/.test(src)&&/s2:q\.sids\[1\]\|\|""/.test(src));
c('Sponsors page remove names the sponsor, pool skips both',/s:"",from:open,nos:\[i\]/.test(src)&&/r\.sid===open\|\|r\.sid2===open/.test(src));
c('Match day rows carry both logos',/lg2: sids\[1\]/.test(src)&&/for \(const g of \[p\.lg, p\.lg2\]\)/.test(src));
c('no extra "Available to sponsor" for a player with one sponsor',!/Second sponsor available/.test(src));
console.log(pass+' pass, '+fail+' fail');process.exit(fail?1:0);
