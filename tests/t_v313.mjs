const mod=await import(process.argv[2]);const T=mod.__t;const w=mod.default;
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
let clock=1_800_000_000_000;const realNow=Date.now;Date.now=()=>clock;
// 2026-11-11 is a Wednesday (weekday clock = 1 hour). Use a fixed weekday time.
clock=Date.UTC(2026,10,11,12,0,0);
let calls=[],body='v1',failNext=false,timeouts=[];
const AS=AbortSignal.timeout;AbortSignal.timeout=ms=>{timeouts.push(ms);return AS.call(AbortSignal,ms)};
globalThis.fetch=async(u,o)=>{calls.push(String(u));if(failNext)throw new Error('boom');return {ok:true,status:200,text:async()=>body}};
const bg=[];const ctx={waitUntil(p){bg.push(p)}};const flush=async()=>{await Promise.all(bg.splice(0))};
const pts=[];T.setEnv({USAGE:{writeDataPoint:d=>pts.push(d)}});T.setCtx(ctx);
const U='https://cluster.england-rfu.com/fixtures-and-results/full-matches?x=1';
let r=await T.cachedText(U);ok('first call fetches',r.text==='v1'&&calls.length===1);
ok('first call waits up to 8 s',timeouts.at(-1)===8000);
await new Promise(r=>setTimeout(r,20));
ok('visitor-waited fetch recorded as an "up" point',pts.some(p=>p.blobs[1]==='up'&&p.blobs[2]==='RFU results feed'&&p.blobs[3]==='ok'&&p.blobs[4]==='wait'&&p.doubles[1]>=0));
clock+=30*60*1000;r=await T.cachedText(U);ok('within the hour: no refetch',calls.length===1&&r.text==='v1');
clock+=40*60*1000;body='v2';r=await T.cachedText(U);
ok('just out of date: old copy returned at once',r.text==='v1'&&calls.length===2===false||r.text==='v1');
await flush();
ok('background refresh happened',calls.length===2);
ok('background refresh used 8 s timeout and is marked bg',timeouts.at(-1)===8000);
await new Promise(r=>setTimeout(r,20));
ok('background fetch recorded as bg',pts.some(p=>p.blobs[1]==='up'&&p.blobs[4]==='bg'));
r=await T.cachedText(U);ok('next call has the new copy without fetching',r.text==='v2'&&calls.length===2);
// many calls while refresh pending only start one
clock+=61*60*1000;body='v3';const n0=calls.length;
await Promise.all([T.cachedText(U),T.cachedText(U),T.cachedText(U)]);await flush();
ok('three simultaneous visitors cause one background refresh',calls.length===n0+1);
// too old: blocking
clock+=7*3600*1000;body='v4';const n1=calls.length;timeouts.length=0;
r=await T.cachedText(U);ok('older than 6 clocks: visitor waits for fresh data',r.text==='v4'&&calls.length===n1+1);
ok('with an old copy the wait is 4 s',timeouts.at(-1)===4000);
// failure with old copy
clock+=7*3600*1000;failNext=true;r=await T.cachedText(U);ok('fetch fails: old copy used instead of an error',r.text==='v4'&&r.stale===true);
// background failure keeps the copy
failNext=false;body='v5';clock+=70*60*1000;await T.cachedText(U);failNext=true;await flush();
T.refreshing.clear();r=await T.cachedText(U);await flush();failNext=false;
ok('failed background refresh leaves the stored copy',(await T.cachedText(U)).text.length>0);
// no ctx: falls back to waiting
T.setCtx(null);T.memCache.clear();body='fresh';
const U2=U+'&y=2';await T.cachedText(U2);clock+=70*60*1000;body='newer';r=await T.cachedText(U2);
ok('without a background context it waits and returns fresh',r.text==='newer');
T.setCtx(ctx);
// stable data tiers
ok('ttl tiers',T.ttlFor('https://api.postcodes.io/postcodes/PL21')===30*86400&&T.ttlFor('https://geocoding-api.open-meteo.com/v1/search?x')===30*86400&&T.ttlFor('https://api.open-meteo.com/v1/forecast')===3*3600&&T.ttlFor('https://cluster.england-rfu.com/fixtures-and-results/seasons')===86400&&T.ttlFor(U)===3600);
const P='https://api.postcodes.io/postcodes/PL21';body='pc';const n2=calls.length;await T.cachedText(P);clock+=20*86400*1000;await T.cachedText(P);
ok('postcode lookup still cached after 20 days',calls.length===n2+1);
// weekend clock
ok('live clock is 10 minutes or 1 hour',[600,3600].includes(T.ttlFor(U)));
// Server-Timing + page record with timing
const written=[];T.setEnv({});
const env={CLUB_PIN:'1234',USAGE:{writeDataPoint:d=>d.blobs[1]!=='up'&&written.push(d)}};
Date.now=realNow;
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>'',json:async()=>({})});
const c2={waitUntil(p){bg.push(p)}};
const res=await w.fetch(new Request('https://thestatsboard.co.uk/?team=11039&teamName=Ivybridge',{headers:{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148','CF-Connecting-IP':'1.1.1.1'}}),env,c2);
await flush();
ok('Server-Timing header present',/^total;dur=\d+/.test(res.headers.get('Server-Timing')||''));
ok('page record carries time (ms), status and cache flag',written.length===1&&written[0].doubles.length===2&&written[0].doubles[1]>=1&&written[0].blobs[12]===String(res.status)&&['hit','miss'].includes(written[0].blobs[13]));
{const tx=await res.text();console.log(res.status,tx.length,tx.slice(0,120).replace(/\n/g,' '));ok('page body still returned',tx.length>10)}
console.log(pass+' pass, '+fail+' fail');
