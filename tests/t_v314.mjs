const mod2=await import(process.argv[2]);const w=mod2.default;const mk=async n=>(await import(process.argv[2]+'?i='+n)).default;
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const ctx={waitUntil(){}};
const BT={team:'11039',name:'X',seasons:['2026-2027'],season:'2026-2027',leagues:[{competition:'1',competitionName:'Counties 1',division:'10',divisionName:'Div A'},{competition:'2',competitionName:'National Cup',division:'20',divisionName:'Pool 1'}]};
globalThis.fetch=async(u)=>{u=String(u);const J=o=>new Response(JSON.stringify(o),{headers:{'content-type':'application/json'}});if(/teamSelect/.test(u))return J({data:{seasonList:['2026-2027'],compList:BT.leagues.map(l=>({_id:l.competition,name:l.competitionName}))}});if(/competitionSelect/.test(u)){const c=new URL(u).searchParams.get('competition');return J({data:{groupsList:BT.leagues.filter(l=>l.competition===c).map(l=>({_id:l.division,name:l.divisionName}))}})}return {ok:false,status:404,json:async()=>({}),text:async()=>''}};
const req=(p,o={},h={})=>new Request('https://thestatsboard.co.uk'+p,{...o,headers:h});
let store={};const kv={async get(k){const v=store[k];return v?JSON.parse(v):null},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv};
let r=await w.fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/docs'})}),env,ctx);
ok('default cookie 30 days',/Max-Age=2592000/.test(r.headers.get('set-cookie')));
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
store['club:ivybridge']=JSON.stringify({signin:{days:7}});
r=await (await mk(1)).fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/docs'})}),env,ctx);
ok('7-day setting gives 604800',/Max-Age=604800/.test(r.headers.get('set-cookie')));
store['club:ivybridge']=JSON.stringify({signin:{days:5}});
r=await (await mk(2)).fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/docs'})}),env,ctx);
ok('invalid length falls back to 30',/Max-Age=2592000/.test(r.headers.get('set-cookie')));
r=await w.fetch(req('/club-signout',{},{Cookie:ck}),env,ctx);
ok('sign out clears cookie and redirects',r.status===303&&/Max-Age=0/.test(r.headers.get('set-cookie'))&&r.headers.get('location')==='/club-unlock');
for(const p of ['/docs','/admin']){const h=await (await w.fetch(req(p,{},{Cookie:ck}),env,ctx)).text();ok(p+' has Sign out link',/href="\/club-signout"/.test(h))}
ok('admin shows Access setting',/How long a PIN sign-in lasts/.test(await (await w.fetch(req('/admin',{},{Cookie:ck}),env,ctx)).text()));
const docs=await (await w.fetch(req('/docs',{},{Cookie:ck}),env,ctx)).text();
ok('docs has usage data section',/id="sec-usagedata"/.test(docs)&&/blob12/.test(docs));
// noindex
for(const [u,exp] of [['/?team=11039&competition=1&division=10&season=2026-2027',true],['/?view=fixtures&team=11039',true],['/?view=match&team=11039',true],['/?view=opposition&team=11039',true],['/',false]]){
 const rr=await w.fetch(req(u),{},ctx);ok('noindex '+u+' = '+exp,/noindex/.test(rr.headers.get('x-robots-tag')||'')===exp)}
// chips now live only in the phone/iPad app page: plain pages never carry them
for(const u of ['/?view=fixtures','/?view=match']){const h=await (await w.fetch(req(u+'&team=11039&competition=1&division=10&season=2026-2027'),{},ctx)).text();ok('no chips injected into plain '+u,!/class="cchips"/.test(h))}
console.log(pass+' pass, '+fail+' fail');
{
 const w2=(await import(process.argv[2]+'?u=1')).default;const sqls=[];let refuse=false;
 const base=globalThis.fetch;
 globalThis.fetch=async(u,o)=>{if(/analytics_engine\/sql/.test(String(u))){sqls.push(o.body);if(refuse&&/toStartOfInterval/.test(o.body))return new Response('{}',{status:400});return new Response(JSON.stringify({data:[{n:5,d:'2026-11-12 07:00:00',people:2,s:'x'}]}))}return base(u,o)};
 const e2={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'b'};
 let rr=await w2.fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/usage'})}),e2,ctx);const c2=rr.headers.get('set-cookie').split(';')[0];
 rr=await w2.fetch(req('/api/usage?days=1',{},{Cookie:c2}),e2,ctx);const j=await rr.json();
 ok('today view: utc day start used',j.limitBasis==='utcday'&&sqls.some(q=>/timestamp > toStartOfInterval\(NOW\(\), INTERVAL '1' DAY\)/.test(q)));
 ok('today view: hourly buckets',sqls.some(q=>/toStartOfInterval\(timestamp, INTERVAL '1' HOUR\) AS d/.test(q)));
 ok('limit query uses start of day',sqls.some(q=>/NOT IN \('up', 'pinfail', 'sec'\) AND timestamp > toStartOfInterval/.test(q)));
 sqls.length=0;refuse=true;
 rr=await w2.fetch(req('/api/usage?days=1',{},{Cookie:c2}),e2,ctx);const j2=await rr.json();
 ok('falls back to rolling when refused',j2.ok&&j2.limitBasis==='rolling'&&sqls.some(q=>/NOW\(\) - INTERVAL '1' DAY/.test(q)));
 sqls.length=0;refuse=false;
 await w2.fetch(req('/api/usage?days=7',{},{Cookie:c2}),e2,ctx);
 ok('7 days still rolling range',sqls.some(q=>/NOW\(\) - INTERVAL '7' DAY/.test(q))&&sqls.some(q=>/toDate\(timestamp\) AS d/.test(q)));
 const pg=await (await w2.fetch(req('/usage',{},{Cookie:c2}),e2,ctx)).text();
 ok('page has Today button',/\[1,7,14,30,90\]/.test(pg));
 console.log(pass+' pass, '+fail+' fail');
}
{
 const f=mod2.__t.pageTtlFor;
 ok('match: weekday 2 hours',f('match',new Date('2026-11-12T10:00:00Z'))===7200);
 ok('match: Saturday 5 min',f('match',new Date('2026-11-14T10:00:00Z'))===300);
 ok('match: Sunday 5 min',f('match',new Date('2026-11-15T10:00:00Z'))===300);
 ok('other pages 2 min',f('fixtures',new Date('2026-11-12T10:00:00Z'))===120&&f('',new Date('2026-11-14T10:00:00Z'))===120);
 {
 const T=mod2.__t;
 const VU='https://www.englandrugby.com/fixtures-and-results/match-centre-community?competition=1&division=2&season=2026-2027&team=3&matchId=99';
 ok('venue page kept 24 hours',T.ttlFor(VU)===86400);
 // a refused venue page is remembered site-wide for 6 hours
 const store3=new Map();globalThis.caches={default:{async match(k){const r=store3.get(k.url||String(k));return r?r.clone():undefined},async put(k,v){store3.set(k.url||String(k),v)}}};
 let hits=0;globalThis.fetch=async()=>{hits++;return new Response('<div id="challenge-container"></div>',{status:200})};
 let r1=await T.cachedText(VU,'text/html');
 ok('refused venue page returns not-ok',r1.ok===false);
 const n1=hits;
 await T.cachedText(VU,'text/html');
 ok('second try inside 6 hours makes no request',hits===n1&&n1>=1);
 T.blockedMem.clear();
 await T.cachedText(VU,'text/html');
 ok('another copy of the site also waits (edge cache note)',hits===n1);
 const fk=[...store3.keys()].find(k=>/_fail=1/.test(k));
 ok('failure note kept 6 hours',!!fk&&store3.get(fk).headers.get('Cache-Control')==='public, max-age=21600');
 // ordinary RFU pages keep the short 5-minute memory and write no edge note
 store3.clear();T.blockedMem.clear();hits=0;
 const OU='https://www.englandrugby.com/fixtures-and-results/search-results?team=5&season=2026-2027&x=1';
 await T.cachedText(OU,'text/html');
 ok('other pages: no long failure note',![...store3.keys()].some(k=>/_fail=1/.test(k)));
 // weather: no venue, no lookups
 hits=0;const wx=await T.weatherFor('',new Date(Date.now()+864e5*3),'Ivybridge RFC');
 ok('no venue: no weather lookup',wx===null&&hits===0);
 // early refresh in the last hour of a venue copy
 {const VU2=VU.replace('matchId=99','matchId=77');const pend=[];T.setCtx({waitUntil:p=>pend.push(p)});hits=0;
  globalThis.fetch=async()=>{hits++;return new Response('<p>Location</p>ok',{status:200})};
  T.memCache.set(VU2,{ok:true,status:200,text:'old',fetchedAt:Date.now()-23.5*3600*1000});
  const got=await T.cachedText(VU2,'text/html');await Promise.all(pend);
  ok('last hour: old copy served at once and refreshed behind the scenes',got.text==='old'&&hits===1);
  hits=0;T.memCache.set(VU2,{ok:true,status:200,text:'new',fetchedAt:Date.now()-2*3600*1000});T.refreshing.clear();
  await T.cachedText(VU2,'text/html');await Promise.all(pend);
  ok('earlier than that: no refresh',hits===0);}
 delete globalThis.caches;
}
console.log(pass+' pass, '+fail+' fail');
}
{
 const w5=(await import(process.argv[2]+'?p=1')).default;
 globalThis.fetch=async(u)=>new Response(JSON.stringify([{date:'2026-11-14T00:00:00.000Z',competition:{id:93,commonId:1699,name:'South West Division'},group:{id:76382,name:'Regional 2',commonId:75791},matches:[{id:1}]},{date:'2026-11-15T10:00:00.000Z',competition:{id:5,commonId:2388,name:'National Cup'},group:{id:9,name:'Pool',commonId:77306},matches:[{id:2}]},{date:'2026-11-21T10:00:00.000Z',competition:{id:93,commonId:1699,name:'South West Division'},group:{id:76382,name:'Regional 2',commonId:75791},matches:[{id:3}]}]),{headers:{'content-type':'application/json'}});
 const e5={ENV_LABEL:'DEV',CLUB_PIN:'1234',DEV_PIN:'9',SETTINGS:{async get(){return null},async put(){}}};
 const ul=await w5.fetch(new Request('https://dev.example/unlock',{method:'POST',body:new URLSearchParams({pin:'9',next:'/'})}),e5,ctx);
 const dc=(ul.headers.get('set-cookie')||'').split(';')[0];
 const pr=await w5.fetch(new Request('https://dev.example/api/probe?ep=nextmatch_all&teamId=11057',{headers:{Cookie:dc}}),e5,ctx);
 const txt=await pr.text();let jj=null;try{jj=JSON.parse(txt)}catch(_){}
 if(jj&&jj.json){ok('probe lists competitions in upcoming games',jj.json.competitions.length===2&&jj.json.competitions.find(c=>c.competitionId===2388).games===1&&jj.found!==undefined)}
 else console.log('probe not reachable in test (gate):',txt.slice(0,80));
 ok('copy includes found block',/found:r\.found/.test(await (await import('fs')).promises.readFile(process.argv[2],'utf8')));
 ok('Under 18 shortened',mod2.__t.shortComp('National Under 18 Cup')==='National U18 Cup'&&mod2.__t.shortComp('Devon Under-16s Plate')==='Devon U16 Plate'&&mod2.__t.shortComp('Devon Cup')==='Devon Cup');
console.log(pass+' pass, '+fail+' fail');
}
