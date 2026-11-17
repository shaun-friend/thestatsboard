const mod=await import(process.argv[2]);const w=mod.default;
let calls=[];
globalThis.fetch=async(u,o)=>{ if(String(u).includes('analytics_engine/sql')){calls.push({u:String(u),b:o.body,a:o.headers.Authorization});
  const b=o.body; let data=[];
  if(/GROUP BY d ORDER/.test(b)) data=[{d:'2026-11-07',people:'12'},{d:'2026-11-08',people:'9'}];
  else if(/GROUP BY kind$/.test(b)&&/COUNT\(DISTINCT/.test(b)) data=[{kind:'page',who:'20',n:'60'},{kind:'tv',who:'3',n:'900'},{kind:'cal',who:'4',n:'40'}];
  else if(/GROUP BY view/.test(b)) data=[{view:'team',n:'40'},{view:'fixtures'  ,n:'20'}];
  else if(/blob11 = '1'/.test(b)) data=[{team:'11039',name:'Ivybridge',n:'30'}];
  else if(/blob11 AS own/.test(b)) data=[{name:'Exeter Chiefs',comp:'1',div:'2',region:'Devon',country:'GB',n:'5'}];
  else if(/GROUP BY device/.test(b)) data=[{device:'phone',who:'15'}];
  else if(/'search','pick'/.test(b)) data=[{kind:'search',n:'7'}];
  else data=[{n:'1234'}];
  return {ok:true,status:200,json:async()=>({data}),text:async()=>''}}
  return {ok:false,status:404,json:async()=>({}),text:async()=>''}};
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const ctx={waitUntil(p){ctx.p.push(p)},p:[]};
const flush=async()=>{await Promise.all(ctx.p);ctx.p=[]};
const written=[];const ups=[];const USAGE={writeDataPoint(d){(d.blobs[1]==='up'?ups:d.blobs[1]==='start'?[]:written).push(d)}};
let j4x,kvData=null;const aux={};const kv={async get(k,o){if(k!=='club:ivybridge'){const v=aux[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)}return kvData},async put(k,v){if(k!=='club:ivybridge'){aux[k]=v;return}kvData=JSON.parse(v)},async delete(k){delete aux[k]}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE,CF_ACCOUNT_ID:'acc1',CF_API_TOKEN:'tok1'};
const UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
const req=(p,h={})=>new Request('https://thestatsboard.co.uk'+p,{headers:{'User-Agent':UA,'CF-Connecting-IP':'1.2.3.4',...h}});
await w.fetch(req('/?team=11039&teamName=Ivybridge&competition=1699&division=75791'),env,ctx);await flush();
ok('team page counted once',written.length===1);
const d=written[0]||{};
ok('club in index and blob1, tagged live',d.indexes&&d.indexes[0]==='ivybridge|live'&&d.blobs[0]==='ivybridge|live');
ok('kind page, view team, device phone, known team',d.blobs[1]==='page'&&d.blobs[2]==='team'&&d.blobs[7]==='phone'&&d.blobs[10]==='1');
ok('visitor code is 16 hex and holds no IP',/^[0-9a-f]{16}$/.test(d.blobs[11])&&!JSON.stringify(d).includes('1.2.3.4'));
await w.fetch(req('/?team=11039&teamName=Ivybridge&competition=1699&division=75791'),env,ctx);await flush();
ok('same person same day gives same code',written[1].blobs[11]===d.blobs[11]);
await w.fetch(req('/?team=11039',{'CF-Connecting-IP':'9.9.9.9'}),env,ctx);await flush();
ok('different person gives a different code',written[2].blobs[11]!==d.blobs[11]);
await w.fetch(req('/?view=stack&layout=tv&teams=x'),env,ctx);await flush();
ok('TV counted as tv',written[written.length-1].blobs[1]==='tv');
await w.fetch(req('/?team=999&teamName=Exeter+Chiefs&competition=5&division=6'),env,ctx);await flush();
ok('other club team flagged not known',written[written.length-1].blobs[10]==='0'&&written[written.length-1].blobs[4]==='Exeter Chiefs');
const n0=written.length;
await w.fetch(req('/calendar.ics?team=11039'),env,ctx);await flush();
ok('calendar counted as cal',written.length===n0+1&&written[n0].blobs[1]==='cal'&&written[n0].blobs[7]==='calendar');
await w.fetch(req('/api/builder/search?name=secretname'),env,ctx);await flush();
const sd=written[written.length-1];
ok('search counted but typed text never stored',sd.blobs[1]==='search'&&!JSON.stringify(sd).includes('secretname'));
const n1=written.length;
await w.fetch(req('/?team=11039',{'User-Agent':'Googlebot/2.1'}),env,ctx);
await w.fetch(req('/?team=11039',{'User-Agent':'curl/8.0'}),env,ctx);
await w.fetch(req('/?team=11039&format=summary'),env,ctx);
await w.fetch(req('/manifest.webmanifest'),env,ctx);
await w.fetch(req('/version'),env,ctx);await flush();
ok('bots, data fetches and icons not counted',written.length===n1);
// iPad
await w.fetch(req('/?view=fixtures&team=11039',{'User-Agent':'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'}),env,ctx);await flush();
ok('iPad counted as tablet',written[written.length-1].blobs[7]==='tablet');
// switch off via admin
const ck=(await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/admin'})}),env,ctx)).headers.get('set-cookie').split(';')[0];
let r=await w.fetch(req('/admin',{Cookie:ck}),env,ctx);let h=await r.text();
ok('admin page has the Count visits switch, on by default',/id="fv" checked/.test(h)&&/Count visits/.test(h));
r=await w.fetch(new Request('https://thestatsboard.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json',Origin:'https://thestatsboard.co.uk'},body:JSON.stringify({notices:{},features:{around:true,weather:true,checked:true,wocolour:true,count:false}})}),env,ctx);
ok('saving the switch off works',(await r.json()).ok===true&&kvData.features.count===false);
// settings cache is 30s; saving updates the cache in-process
const n2=written.length;
await w.fetch(req('/?team=11039'),env,ctx);await flush();
ok('nothing counted when switch is off',written.length===n2);
// no binding: no crash
const r2=await w.fetch(req('/?team=11039'),{CLUB_PIN:'1234'},ctx);await flush();
ok('no USAGE binding: page still works',r2.status!==500);
// usage page + api
r=await w.fetch(req('/usage',{Cookie:ck}),env,ctx);h=await r.text();
ok('/usage loads behind PIN',r.status===200&&/<title>Usage<\/title>/.test(h)&&/noindex/.test(h));
ok('/usage and /api/usage need the PIN',(await w.fetch(req('/usage'),env,ctx)).status===303&&(await w.fetch(req('/api/usage'),env,ctx)).status===303);
r=await w.fetch(req('/api/usage?days=30',{Cookie:ck}),env,ctx);const j=await r.json();
ok('api returns data, sends token, uses club filter and 30 days',j.ok&&j.days===30&&calls.length>=8&&calls[0].a==='Bearer tok1'&&calls[0].u.includes('/accounts/acc1/')&&calls.every(c=>/blob1 = 'ivybridge\|live'/.test(c.b))&&calls.some(c=>/INTERVAL '30' DAY/.test(c.b)));
ok('api payload shape',j.perDay.length===2&&j.today===1234&&j.others[0].name==='Exeter Chiefs'&&j.teamsKnown.length>=4);
r=await w.fetch(req('/api/usage?days=5;DROP',{Cookie:ck}),env,ctx);const j2=await r.json();
ok('days is limited to the allowed list',j2.days===14);
r=await w.fetch(req('/api/usage',{Cookie:ck}),{...env,USAGE:undefined},ctx);const j3=await r.json();
ok('missing binding gives setup info',j3.ok===false&&j3.setup&&j3.setup.binding===false&&j3.setup.key===true);
// client script parses
const sc=h.match(/<script>([\s\S]*?)<\/script>/g).pop().replace(/<\/?script>/g,'');
try{new Function(sc);ok('Usage page script parses',true)}catch(e){ok('Usage page script parses '+e.message,false)}
r=await w.fetch(req('/',{Cookie:ck}),env,ctx);
// v3.11
kvData={...kvData,features:{...kvData.features,count:true,screens:false},reporting:{days:30}};
w.fetch; 
r=await w.fetch(req('/api/admin',{}),env,ctx);
const save=async(f,rp)=>{const x=await w.fetch(new Request('https://thestatsboard.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json',Origin:'https://thestatsboard.co.uk'},body:JSON.stringify({notices:{},features:f,reporting:rp})}),env,ctx);return x.json()};
ok('save screens off and 30 days',(await save({around:true,weather:true,checked:true,wocolour:true,count:true,screens:false},{days:30})).ok&&kvData.features.screens===false&&kvData.reporting.days===30);
const n3=written.length;
await w.fetch(req('/?view=stack&layout=tv'),env,ctx);await flush();
ok('screens off: TV load not counted',written.length===n3);
await w.fetch(req('/?team=11039'),env,ctx);await flush();
ok('screens off: people still counted',written.length===n3+1);
r=await w.fetch(req('/admin',{Cookie:ck}),env,ctx);h=await r.text();
ok('admin has Privacy and counts section, screens switch off, 30 days ticked',/<h1>Privacy and counts<\/h1>/.test(h)&&/id="fs"(?! checked)/.test(h)&&/name="rd" value="30" checked/.test(h));
r=await w.fetch(req('/usage',{Cookie:ck}),env,ctx);h=await r.text();
ok('usage page opens on default 30 days',/days=30;/.test(h));
calls.length=0;r=await w.fetch(req('/api/usage',{Cookie:ck}),env,ctx);const j4=await r.json();
ok('api default period is 30 and screens flag off',j4.days===30&&j4.screensOn===false&&calls.some(c=>/INTERVAL '30' DAY/.test(c.b)));
ok('api asks for screen loads per day',calls.some(c=>/blob2 = 'tv' GROUP BY d/.test(c.b))&&Array.isArray(j4.tvDay));
await save({around:true,weather:true,checked:true,wocolour:true,count:true,screens:true},{days:99});
ok('bad period falls back to 14, screens back on',kvData.reporting.days===14);
await w.fetch(req('/?view=stack&layout=tv'),env,ctx);await flush();
ok('screens on: TV counted again',written[written.length-1].blobs[1]==='tv');
// v3.12
await save({around:true,weather:true,checked:true,wocolour:true,count:true,screens:true},{days:14});
let nn=written.length;
await w.fetch(req('/docs',{Cookie:ck}),env,ctx);await w.fetch(req('/admin',{Cookie:ck}),env,ctx);await w.fetch(req('/usage',{Cookie:ck}),env,ctx);await w.fetch(req('/?view=teams',{Cookie:ck}),env,ctx);await flush();
const cl=written.slice(nn);
ok('club pages counted after sign-in as kind club',cl.length===4&&cl.every(x=>x.blobs[1]==='club')&&['docs','admin','usage','links'].every(v=>cl.some(x=>x.blobs[2]===v)));
nn=written.length;
await w.fetch(req('/docs'),env,ctx);await w.fetch(req('/admin'),env,ctx);await flush();
ok('club pages not counted without sign-in',written.length===nn);
nn=written.length;
const bad=await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',headers:{'User-Agent':'curl/8','CF-Connecting-IP':'6.6.6.6'},body:new URLSearchParams({pin:'0000',next:'/docs'})}),env,ctx);
ok('wrong PIN gives 401',bad.status===401);
const pf=written.slice(nn);
ok('wrong PIN recorded, bot not filtered, PIN text and IP not stored',pf.length===1&&pf[0].blobs[1]==='pinfail'&&pf[0].blobs[2]==='club'&&!JSON.stringify(pf[0]).includes('0000')&&!JSON.stringify(pf[0]).includes('6.6.6.6')&&/^[0-9a-f]{16}$/.test(pf[0].blobs[11]));
await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/docs'})}),env,ctx);await flush();
ok('right PIN not recorded as wrong',written.slice(nn).length===1);
const devEnv={...env,ENV_LABEL:'TEST',DEV_PIN:'9999'};nn=written.length;
const dbad=await w.fetch(new Request('https://dev.example.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'1',next:'/'})}),devEnv,ctx);
ok('wrong test-site PIN recorded as dev',dbad.status===401&&written.slice(nn).some(x=>x.blobs[1]==='pinfail'&&x.blobs[2]==='dev'));
await save({around:true,weather:true,checked:true,wocolour:true,count:false,screens:true},{days:14});nn=written.length;
await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'bad',next:'/docs'})}),env,ctx);
ok('Count visits off: wrong PIN not recorded',written.length===nn);
await save({around:true,weather:true,checked:true,wocolour:true,count:true,screens:true},{days:14});
calls.length=0;j4x=await (await w.fetch(req('/api/usage',{Cookie:ck}),env,ctx)).json();
ok('api asks for screen pages, club pages and wrong PINs',calls.some(c=>/blob2 = 'tv' GROUP BY d, view/.test(c.b))&&calls.some(c=>/blob2 = 'club'/.test(c.b))&&calls.some(c=>/blob2 = 'pinfail' GROUP BY d/.test(c.b))&&calls.some(c=>/blob2 = 'pinfail' GROUP BY region/.test(c.b)));
const hh=await (await w.fetch(req('/usage',{Cookie:ck}),env,ctx)).text();
try{new Function(hh.match(/<script>([\s\S]*?)<\/script>/g).pop().replace(/<\/?script>/g,''));ok('Usage page script still parses',true)}catch(e){ok('script parses '+e.message,false)}
// v3.13.1: test site is tagged and reads only its own records
{const wr=[];const e2={CLUB_PIN:'1234',ENV_LABEL:'TEST',DEV_PIN:'9999',SETTINGS:kv,CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t',USAGE:{writeDataPoint:d=>wr.push(d)}};
 const ck2=await (async()=>{const x=await w.fetch(new Request('https://dev.example.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'9999',next:'/'})}),e2,ctx);return x.headers.get('set-cookie').split(';')[0]})();
 const x2=await w.fetch(new Request('https://dev.example.co.uk/?team=11039',{headers:{Cookie:ck2+'; '+ck,'User-Agent':UA,'CF-Connecting-IP':'8.8.8.8'}}),e2,ctx);await flush();
 ok('test site records are tagged test',wr.some(p=>p.blobs[0]==='ivybridge|test'&&p.indexes[0]==='ivybridge|test')&&!wr.some(p=>p.blobs[0]==='ivybridge|live'));
 calls.length=0;await w.fetch(new Request('https://dev.example.co.uk/api/usage',{headers:{Cookie:ck2+'; '+ck}}),e2,ctx);
 ok('test site usage report reads only test records',calls.length>0&&calls.every(c=>/blob1 = 'ivybridge\|test'/.test(c.b)));}
console.log(pass+' pass, '+fail+' fail');
