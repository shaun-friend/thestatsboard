// v3.69.0: every sponsored player across all teams, once each
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
const S='2026-2027';
await post({act:'set',team:'11039',season:S,no:'1530430',n:'Wesley Vermigle',nm:'',s:dart,s2:moor,alt:'',cur:true});
await post({act:'set',team:'11063',season:S,no:'1530430',n:'Wesley Vermigle',nm:'',s:dart,s2:moor,alt:'',cur:true});
await post({act:'set',team:'11039',season:S,no:'1704351',n:'Harry Newman-Wild',nm:'',s:moor,alt:'',cur:true});
await post({act:'set',team:'11063',season:S,no:'5',n:'Aled Price',nm:'',s:'',alt:'',cur:true});
await post({act:'set',team:'11039',season:S,no:'777',n:'Old Lad',nm:'',s:'',alt:'',cur:false});
const j=await get('?all=1&season='+S);
c('ok and season',j.ok&&j.season===S,JSON.stringify(j));
c('a player on two teams is listed once',j.sponsored.filter(p=>p.no==='1530430').length===1,JSON.stringify(j.sponsored));
const w=j.sponsored.find(p=>p.no==='1530430');
c('with both teams and both sponsors',w&&w.teams.length===2&&w.sponsor==='Dart Motors + Moor Ale'&&w.name==='Wesley Vermigle',JSON.stringify(w));
c('sponsored list has the two sponsored players only, sorted by name',j.sponsored.length===2&&j.sponsored[0].name==='Harry Newman-Wild',JSON.stringify(j.sponsored.map(p=>p.name)));
c('current players with no sponsor are listed, not-current ones are not',j.avail.length===1&&j.avail[0].no==='5'&&!j.avail.some(p=>p.no==='777'),JSON.stringify(j.avail));
c('other players page request still works',(await get('?team=11039&season='+S)).rows!==undefined);
c('page loads the all-teams list from the server and has the download button',/id="wx"/.test(src)&&/sponsor-players\?all=1&season=/.test(src))
c('rows carry the sponsors as a list',j.sponsored.find(p=>p.no==='1530430').sponsors.join()==='Dart Motors,Moor Ale',JSON.stringify(j.sponsored));
c('export button builds a CSV with the six columns, quoted, with a formula guard',/id="wx"/.test(src)&&/"Player","RFU number","Teams","Sponsor 1","Sponsor 2","Status"/.test(src)&&/function csvCell/.test(src)&&/\^\[=\+@-\]/.test(src)&&/sponsored-players-/.test(src));
console.log(pass+' pass, '+fail+' fail');process.exit(fail?1:0);
