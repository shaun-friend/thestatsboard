// v3.38.0 TV quick setup: pairing API (PIN, single use, validation), pages, screen name forwarding to the rotator frames.
import vm from 'vm';
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c,x)=>{console.log(c?'PASS':'FAIL',n,c?'':(x||''));c?pass++:fail++};
const store={},ttl={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v,op){store[k]=v;ttl[k]=op&&op.expirationTtl},async delete(k){delete store[k]}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'},ctx={waitUntil(){}};
globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({}),text:async()=>''});
const O='https://thestatsboard.co.uk';
const F=(p,o,e)=>w.fetch(new Request(O+p,o),e||env,ctx);
let r=await F('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})});
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
const post=(b,c)=>F('/api/pair-send',{method:'POST',headers:{'Content-Type':'application/json',...(c===false?{}:{Cookie:ck})},body:JSON.stringify(b)});
// TV page
r=await F('/setup');let h=await r.text();
ok('/setup is public and returns the TV page',r.status===200&&/Set up this screen/.test(h));
const code=(/CODE="(\d{6})"/.exec(h)||[])[1];
ok('/setup shows a 6-digit code',!!code,h.slice(0,0));
ok('/setup code differs on each load',(/CODE="(\d{6})"/.exec(await (await F('/setup')).text())||[])[1]!==code||Math.random()<1e-5);
{const sc=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);let bad='';sc.forEach(s=>{try{new vm.Script(s)}catch(e){bad+=e.message}});ok('/setup scripts compile ('+sc.length+')',sc.length>=2&&!bad,bad)}
// Phone pages need the PIN
r=await F('/p/'+code);ok('/p/<code> without sign-in redirects to the PIN page',r.status===303&&/club-unlock\?next=%2Fp%2F/.test(r.headers.get('location')||''),r.status+' '+r.headers.get('location'));
r=await F('/p');ok('/p without sign-in redirects',r.status===303);
r=await post({code,kind:'rotator'},false);ok('send without sign-in is refused (401) and stores nothing',r.status===401&&!store['pair:'+code]);
r=await F('/p/'+code,{headers:{Cookie:ck}});h=await r.text();
ok('/p/<code> with sign-in shows the choices',r.status===200&&/Rotating screen/.test(h)&&/Match Centre/.test(h)&&/One page for one team/.test(h)&&new RegExp('CODE="'+code+'"').test(h));
{const sc=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);let bad='';sc.forEach(s=>{try{new vm.Script(s)}catch(e){bad+=e.message}});ok('/p scripts compile',sc.length>=1&&!bad,bad)}
ok('team choices come from Our teams',/<option value="\d+">/.test(h));
r=await F('/p',{headers:{Cookie:ck}});ok('/p asks for a code',/6-digit code/.test(await r.text()));
r=await F('/p?c=482%20719',{headers:{Cookie:ck}});ok('/p?c= with 6 digits goes to /p/<code>',r.status===303&&r.headers.get('location')==='/p/482719');
r=await F('/p?c=4827',{headers:{Cookie:ck}});ok('/p?c= with 4 digits is refused',r.status===200&&/needs 6 digits/.test(await r.text()));
r=await F('/p/1234',{headers:{Cookie:ck}});ok('/p/<4 digits> is not a page (404)',r.status===404);
// send + collect
r=await post({code,kind:'rotator',name:'Bar <b>1'});let j=await r.json();
const SID=/&sid=([0-9a-f]{12})$/;
ok('rotator send ok',r.status===200&&j.ok&&/^\/ivybridge\/tv\?screen=Bar%20b1%20[0-9a-f]{4}&sid=[0-9a-f]{12}$/.test(j.link),JSON.stringify(j));
ok('record expires after 10 minutes',ttl['pair:'+code]===600);
r=await F('/api/pair?c='+code+'&check=1');j=await r.json();ok('check says waiting and keeps the code',j.waiting===true&&!!store['pair:'+code]);
r=await F('/api/pair?c='+code);j=await r.json();ok('screen collects the link',j.ok&&/^\/ivybridge\/tv\?screen=Bar%20b1%20[0-9a-f]{4}&sid=/.test(j.t)&&j.l==='Rotating screen',JSON.stringify(j));
r=await F('/api/pair?c='+code);j=await r.json();ok('code works only once',!j.ok&&!store['pair:'+code]);
r=await F('/api/pair?c=12ab');ok('bad code format is 400',r.status===400);
r=await F('/api/pair?c=999999');ok('unknown code gives ok:false',(await r.json()).ok===false);
// choices
r=await post({code:'111111',kind:'centre',name:'Hall'});j=await r.json();
ok('Match Centre link has layout=tv, screen, sid, no stamp',j.ok&&/^\/\?view=stack&layout=tv&theme=dark&screen=Hall(?:%20|\+)[0-9a-f]{4}&sid=[0-9a-f]{12}$/.test(j.link),j.link);
const tm=/<option value="(\d+)">/.exec(await (await F('/p/222222',{headers:{Cookie:ck}})).text())[1];
r=await post({code:'333333',kind:'page',team:tm,page:'leaders',name:''});j=await r.json();
ok('one-page link is the team page with layout=tv',j.ok&&j.link.startsWith('/?view=leaders&layout=tv&competition=')&&j.link.includes('team='+tm)&&!j.link.includes('_v=')&&/screen=Screen(?:%20|\+)[0-9a-f]{4}&sid=/.test(j.link),j.link);
r=await post({code:'333333',kind:'page',team:'999',page:'leaders'});ok('unknown team refused',r.status===400);
r=await post({code:'333333',kind:'page',team:tm,page:'../evil'});ok('unknown page refused',r.status===400);
r=await post({code:'333333',kind:'url',target:'https://evil.example'});ok('arbitrary link refused',r.status===400);
r=await post({code:'12345',kind:'rotator'});ok('5-digit code refused',r.status===400);
r=await post({code:'444444',kind:'rotator',name:'x'.repeat(60)});j=await r.json();ok('screen name cut to 24 characters',j.link.startsWith('/ivybridge/tv?screen='+'x'.repeat(19)+'%20')&&decodeURIComponent(j.link.split('screen=')[1].split('&')[0]).length===24,j.link);
r=await post({code:'555555',kind:'rotator'},true);ok('no screen name gives the default name Screen and an ID',/^\/ivybridge\/tv\?screen=Screen%20[0-9a-f]{4}&sid=[0-9a-f]{12}$/.test((await (await F('/api/pair?c=555555')).json()).t));
// No storage
{const e2={...env};delete e2.SETTINGS;r=await F('/api/pair?c=111111',{},e2);ok('no settings store: 503 not a crash',r.status===503)}
// Rotator forwards the screen name
await F('/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify({tv:{items:[{page:'fixtures',team:'11039',secs:10},{page:'centre',team:'all',secs:10}]}})});
r=await F('/ivybridge/tv?screen=Bar');h=await r.text();
ok('rotator frames carry the screen name',(h.match(/screen=Bar/g)||[]).length>=2,(h.match(/id="tvd">[^<]{0,300}/)||[''])[0]);
r=await F('/ivybridge/tv');h=await r.text();ok('rotator without a name has none',/id="tvd">\{"p":\[\{/.test(h)&&!/screen=/.test((h.match(/id="tvd">[^<]*/)||[''])[0]));
console.log(pass+' pass, '+fail+' fail');process.exit(fail?1:0);
