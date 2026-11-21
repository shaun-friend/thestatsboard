// v3.41.0: Sponsors stage 1 (club sponsor list API and page)
import fs from 'fs';import vm from 'vm';
const src=fs.readFileSync(process.argv[2],'utf8');
const a=src.indexOf('const SPONSOR_KEY');const b=src.indexOf('function sponsorsPage(');const bEnd=src.indexOf('function inboxPage(');
if(a<0||b<0){console.log('FAIL code not found');process.exit(1)}
let pass=0,fail=0;const c=(n,ok,d)=>{if(ok)pass++;else{fail++;console.log('FAIL',n,d||'')}};
const store={};let puts=0,gets=0;
const kv={get:async k=>{gets++;return store[k]?JSON.parse(store[k]):null},put:async(k,v)=>{puts++;store[k]=v}};
const ctx={Response,URL,JSON,String,Array,Set,Map,Object,Number,Uint32Array,crypto:globalThis.crypto,Date,kvOf:()=>kv,siteSettings:async()=>({}),TEAMS:[{team:'11039',name:'Ivybridge 1XV'}],ADDR_RULES:{season:v=>/^20\d\d-20\d\d$/.test(v)},dateSeasonName:()=>'2026-2027',todayIso:()=>'2026-11-19',seasonName:y=>y+'-'+(y+1),cachedText:async()=>({ok:true,text:'[]'})};
vm.createContext(ctx);vm.runInContext(src.slice(a,bEnd)+';this.api=sponsorsApi;this.clean=cleanSponsors',ctx);
const U=new URL('https://x.test/api/sponsors');
const post=async(o,origin)=>{const h={};if(origin)h.Origin=origin;const r=await ctx.api(new Request(U,{method:'POST',body:JSON.stringify(o),headers:h}),U);return{s:r.status,j:await r.json()}};
const get=async()=>{const r=await ctx.api(new Request(U),U);return r.json()};
let j=await get();c('empty list to start',j.ok&&j.items.length===0&&j.max===300);
let r=await post({act:'add',name:'  Dart   Motors '});c('add cleans the name and gives a hidden 8-character ID',r.j.ok&&r.j.items[0].name==='Dart Motors'&&/^[0-9a-f]{8}$/.test(r.j.items[0].id),JSON.stringify(r.j));
const id=r.j.items[0].id;
r=await post({act:'add',name:'dart motors'});c('same name (any capitals) refused',r.s===409&&!r.j.ok);
r=await post({act:'add',name:'   '});c('empty name refused',r.s===400);
r=await post({act:'bulk',text:'Brook Dental\nDart Motors\n\nKestrel Electrical\nbrook dental\n<b>Tamar Print</b>'});
c('paste adds new names, skips repeats',r.j.ok&&r.j.added===3&&r.j.skipped===2,JSON.stringify(r.j));
{const n=r.j.items.map(x=>x.name.toLowerCase());c('list comes back sorted by name',n.join('|')===n.slice().sort().join('|'),n.join('|'))}
c('markup characters never stored',!JSON.stringify(r.j.items).includes('<'));
r=await post({act:'rename',id,name:'Dart Motors Ltd'});c('rename keeps the same ID',r.j.ok&&r.j.items.find(x=>x.id===id).name==='Dart Motors Ltd');
r=await post({act:'rename',id,name:'Brook Dental'});c('rename to an existing name refused',r.s===409);
r=await post({act:'rename',id:'ffffffff',name:'Zed'});c('rename of an unknown sponsor refused',r.s===404);
r=await post({act:'remove',id});c('remove works',r.j.ok&&!r.j.items.some(x=>x.id===id));
r=await post({act:'remove',id});c('removing twice says it has gone',r.s===404);
r=await post({act:'add',name:'Evil'},'https://evil.test');c('a request from another site is refused',r.s===403);
r=await post({act:'nope'});c('unknown action refused',r.s===400);
const p0=puts;await get();c('opening the list makes no writes',puts===p0);
await post({act:'add',name:'One More'});c('one write per change',puts===p0+1);
c('stored data is cleaned on the way in',ctx.clean({items:[{id:'abc',name:'x'},{id:'0123abcd',name:'  '},{id:'0123abcd',name:'Ok'},{id:'0123abcd',name:'Dup'}]}).length===1);
const bigText=Array.from({length:400},(_,i)=>'S'+i).join('\n');store.sponsors=JSON.stringify({v:1,items:[]});r=await post({act:'bulk',text:bigText});
c('list stops at 300 sponsors',r.j.items.length===300&&r.j.skipped===100,String(r.j.items&&r.j.items.length));
c('page is behind the club PIN and linked from Admin',/path === "\/sponsors"/.test(src)&&/<a href="\/sponsor-players">Player names and sponsors<\/a>/.test(src)&&!/<a href="\/sponsors">Sponsors<\/a>/.test(src));
const pg=src.slice(b,src.indexOf('// v3.42.0: Sponsors, stage 2'));
c('page has no outside calls and uses only the sponsors API',!/https?:\/\//.test(pg.replace(/<meta[^>]*>/g,''))&&/\/api\/sponsors/.test(pg));
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0)
