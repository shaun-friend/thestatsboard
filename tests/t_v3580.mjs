// v3.58.0 Refresh scores now: endpoints, PIN, rate limit, epoch makes cached RFU data old, poller present, no usage counting.
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c,x)=>{console.log(c?'PASS':'FAIL',n,c?'':(x||''));c?pass++:fail++};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v},async delete(k){delete store[k]}};
const pts=[];const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(d){pts.push(d)}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'},ctx={waitUntil(){}};
globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({}),text:async()=>''});
const O='https://thestatsboard.co.uk';const F=(p,o)=>w.fetch(new Request(O+p,o),env,ctx);
let r=await F('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})});const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await F('/api/scores-at');let j=await r.json();ok('scores-at is public and starts at 0',r.status===200&&j.t===0,JSON.stringify(j));
r=await F('/api/scores-refresh',{method:'POST'});ok('refresh without the PIN is refused',r.status===401||r.status===303,r.status);
r=await F('/api/scores-refresh',{method:'POST',headers:{Cookie:ck}});j=await r.json();ok('refresh with the PIN saves a time',r.status===200&&j.ok&&j.t>Date.now()-5000&&!j.again,JSON.stringify(j));
const t1=j.t;
ok('the time is stored',JSON.parse(store['scores-refresh']).t===t1);
r=await F('/api/scores-at');j=await r.json();ok('scores-at now returns that time',j.t===t1,JSON.stringify(j));
r=await F('/api/scores-refresh',{method:'POST',headers:{Cookie:ck}});j=await r.json();ok('pressing again within a minute changes nothing',j.ok&&j.again&&j.t===t1,JSON.stringify(j));
r=await F('/api/scores-refresh',{headers:{Cookie:ck}});j=await r.json();ok('GET gives the last time (for the Admin card)',j.ok&&j.t===t1);
pts.length=0;await F('/api/scores-at');ok('polling is not counted as a visit',pts.length===0,JSON.stringify(pts));
r=await F('/admin',{headers:{Cookie:ck}});const h=await r.text();ok('Admin Overview has the Refresh scores now button',/id="ovsr"[^>]*>Refresh scores now/.test(h));
// behaviour (fresh copy of the worker): cached until Refresh scores now, then fetched again once, then cached again
{const w2=(await import(process.argv[2]+'?beh')).default;const st2={};const kv2={async get(k,o){const v=st2[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){st2[k]=v}};
const env2={CLUB_PIN:'1234',SETTINGS:kv2,USAGE:{writeDataPoint(){}}};let calls=0;const body=JSON.stringify({data:{matches:[]},content:[]});
globalThis.fetch=async(u)=>{if(/england-rfu\.com/.test(String(u)))calls++;return new Response(body,{status:200,headers:{'content-type':'application/json'}})};
const G=(p,o)=>w2.fetch(new Request(O+p,o),env2,ctx);
let rr=await G('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})});const c2=(rr.headers.get('set-cookie')||'').split(';')[0];
const q='/?team=1&season=2026-2027&competition=1&division=1&format=summary&detail=fixtures&nowx=1';
await G(q);const a=calls;await G(q);const b=calls;await G('/api/scores-refresh',{method:'POST',headers:{Cookie:c2}});await G(q);const c=calls;await G(q);const d=calls;
ok('RFU data is kept between visits',a>0&&b===a,a+' '+b);ok('after Refresh scores now the RFU is asked again',c>b,b+' '+c);ok('and the new copy is kept again',d===c,c+' '+d);}
// source-level checks of the cache rule and the poller
ok('cachedText treats live data older than the saved time as old',/const isOld = fa => now - fa >= ttl \|\| \(ep > 0 && fa < ep\)/.test(src)&&/!isOld\(mem\.fetchedAt\)/.test(src)&&/!isOld\(fetchedAt\)/.test(src));
ok('an old-by-refresh copy is not shown while rebuilding in the background',/stale && !\(ep > 0 && stale\.fetchedAt < ep\) && now - stale\.fetchedAt/.test(src));
ok('page and summary cache keys carry the saved time',/&_sa=" \+ SCORES_AT/.test(src)&&/TEAMS_STAMP \+ "\|" \+ SCORES_AT/.test(src));
ok('open big display pages poll once a minute and reload softly',/\/api\/scores-at/.test(src)&&/setInterval\(p,60000\)/.test(src)&&/if\(window\.rfuSoft\)rfuSoft\(\)/.test(src)&&/top!==self/.test(src));
ok('the help text says 30 minutes at weekends',!/fresh for 10 minutes on Saturdays/.test(src));
console.log(pass+' passed, '+fail+' failed');if(fail)process.exit(1);
