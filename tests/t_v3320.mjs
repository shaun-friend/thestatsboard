// v3.32 visitor messages: public form, spam guard, KV storage with expiry, Inbox behind the club PIN, Admin envelope and switch.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={},meta={},expi={};
const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},
 put:async(k,v,o)=>{store[k]=v;meta[k]=o&&o.metadata;expi[k]=o&&(o.expiration||(o.expirationTtl?Math.floor(Date.now()/1000)+o.expirationTtl:null))||null},
 delete:async k=>{delete store[k];delete meta[k];delete expi[k]},
 list:async o=>{const ks=Object.keys(store).filter(k=>k.startsWith(o.prefix||'')).sort().slice(0,o.limit||1000).map(k=>({name:k,metadata:meta[k]}));return {keys:ks,list_complete:true}}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>{const s=String(u);if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);if(s.includes('cluster.england-rfu.com'))return J({results:[],fixtures:[],leagueTables:[]});return {ok:false,status:404,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
let w=await load();let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const req=(p,o)=>w.fetch(new Request('https://x.co.uk'+p,o),env,ctx);
const get=(p,cookie)=>req(p,{headers:{'User-Agent':'Mozilla/5.0',...(cookie?{Cookie:cookie}:{})}});
let ip='1.1.1.1';
const send=(b,h)=>req('/api/contact',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':ip,...(h||{})},body:JSON.stringify(b)});
const good=(o)=>({reason:'data',text:'Colts shows last weeks game as next',email:'',website:'',t0:Date.now()-6000,from:'/?team=11039&view=fixtures',...(o||{})});
const keys=()=>Object.keys(store).filter(k=>k.startsWith('msg:'));
const inbox=(p,o)=>req(p,{...(o||{}),headers:{'Content-Type':'application/json',Cookie:ck,...((o&&o.headers)||{})}});
// public form
let r=await get('/contact');let t=await r.text();
c('the form is public and has its fields',r.status===200&&/Message the Stats Board/.test(t)&&/name="r"/.test(t)&&/id="mt"/.test(t)&&/id="mw"/.test(t));
c('the form says messages are deleted after 90 days',/deleted after 90 days/.test(t));
c('the form is not indexed',/noindex/.test(t));
c('the form carries the welcome page branding',/BOARD/.test(t)&&/rugby fixtures, results and tables at a glance/.test(t));
c('the thank you wording is the new text',/Thank you for your message\./.test(t)&&/aim to resolve as many of the problems we hear about as we can/.test(t)&&/you may see your request on the site in our next release/.test(t)&&/check back soon/.test(t));
c('the form says the device type is noted',/type of device/.test(t));
// spam guard
r=await send(good({t0:Date.now()-500}));c('too fast is refused',r.status===429&&keys().length===0);
r=await send(good({website:'http://spam.example'}));c('hidden field filled in: pretends ok, stores nothing',(await r.json()).ok===true&&keys().length===0);
r=await send(good({text:' '}));c('empty message refused',r.status===400);
r=await send(good({text:'x'.repeat(1001)}));c('over 1000 characters refused',r.status===400);
r=await send(good({email:'not an email'}));c('bad email refused',r.status===400&&keys().length===0);
r=await send(good({reason:'bogus'}));let j=await r.json();c('an unknown reason is accepted as other',j.ok===true&&keys().length===1);
let m=JSON.parse(store[keys()[0]]);
c('the device type is worked out (a plain browser is a computer) and no raw user agent is kept',m.dc==='Computer'&&meta[keys()[0]].d==='Computer'&&!/Mozilla/.test(store[keys()[0]]));
c('stored as new, with a 90 day expiry',m.s==='new'&&m.r==='other'&&Math.abs(expi[keys()[0]]-(Date.now()/1000+90*86400))<120);
c('the page they came from is kept',m.from==='/?team=11039&view=fixtures');
c('metadata carries the list fields',meta[keys()[0]].s==='new'&&meta[keys()[0]].r==='other'&&/Colts/.test(meta[keys()[0]].sn));
r=await send(good({from:'https://evil.example/x',email:'a@b.co'}));await r.json();
let ms=keys().map(k=>JSON.parse(store[k]));c('an address on another site is dropped, an email is kept',ms.some(x=>x.from===''&&x.email==='a@b.co'));
for(const k of Object.keys(store))if(k.startsWith('msg:')||k.startsWith('mrl:'))delete store[k];
ip='7.7.7.7';r=await send(good({text:'From an iPhone'}),{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});await r.json();
let iph=keys().map(k=>JSON.parse(store[k])).find(x=>x.text==='From an iPhone');c('an iPhone is noted as Phone, iOS, Safari',iph&&iph.dv==='Phone \u00b7 iOS \u00b7 Safari'&&iph.dc==='Phone');
ip='7.7.7.8';r=await send(good({text:'From an iPad',touch:true}),{'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'});await r.json();
let ipd=keys().map(k=>JSON.parse(store[k])).find(x=>x.text==='From an iPad');c('a touch Mac is noted as an iPad',ipd&&ipd.dc==='Tablet'&&/iPadOS/.test(ipd.dv));
ip='7.7.7.9';r=await send(good({text:'From a TV'}),{'User-Agent':'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 Chrome/76 TV Safari/537.36'});await r.json();
c('a smart TV is noted as TV',keys().map(k=>JSON.parse(store[k])).some(x=>x.text==='From a TV'&&x.dc==='TV'));
for(const k of Object.keys(store))if(k.startsWith('msg:')||k.startsWith('mrl:'))delete store[k];ip='1.1.1.1';
// rate limits
let sent=0;for(let i=0;i<6;i++){r=await send(good());if((await r.json()).ok)sent++}c('one visitor can send five an hour, not six',sent===5&&keys().length===5);
ip='2.2.2.2';sent=0;for(let i=0;i<8;i++){r=await send(good());if((await r.json()).ok)sent++}c('the whole site takes ten an hour',sent===5&&keys().length===10);
c('no IP address is stored',!Object.values(store).some(v=>/2\.2\.2\.2|1\.1\.1\.1/.test(v)));
for(const k of Object.keys(store))if(k.startsWith('msg:')||k.startsWith('mrl:'))delete store[k];
// inbox is behind the PIN
r=await get('/inbox');c('/inbox needs the club PIN',r.status===303||r.status===401);
r=await get('/api/inbox');c('/api/inbox needs the club PIN',r.status===303||r.status===401);
r=await req('/api/inbox',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'msg:0000000000000-aaaa',act:'delete'})});c('changing the inbox needs the club PIN',r.status===401);
r=await inbox('/inbox');t=await r.text();c('/inbox opens with the PIN, with a refresh button and filters',r.status===200&&/Inbox/.test(t)&&/Mark done/.test(t)&&/id="rf"/.test(t)&&/id="fl"/.test(t)&&/setInterval/.test(t));
// reading
ip='3.3.3.3';await (await send(good({reason:'team',text:'Please add our U14s'}))).json();await new Promise(r=>setTimeout(r,5));ip='4.4.4.4';await (await send(good({reason:'idea',text:'Sponsor logos on the TV'}))).json();
j=await (await inbox('/api/inbox')).json();
c('the list shows both, newest first, both new, with the device',j.ok&&j.items.length===2&&j.news===2&&/Sponsor/.test(j.items[0].sn)&&j.items[0].d==='Computer');
let id=j.items[1].id;
j=await (await inbox('/api/inbox?msg='+encodeURIComponent(id))).json();c('opening a message returns it',j.ok&&/U14s/.test(j.m.text));
j=await (await inbox('/api/inbox')).json();c('opening marks it read, one is still new',j.news===1&&j.items.find(x=>x.id===id).s==='read');
j=await (await inbox('/api/inbox',{method:'POST',body:JSON.stringify({id,act:'done'})})).json();c('mark done',j.ok&&j.m.s==='done'&&meta[id].s==='done');
j=await (await inbox('/api/inbox',{method:'POST',body:JSON.stringify({id,act:'keep'})})).json();c('keep removes the expiry',j.ok&&j.m.k===1&&expi[id]===null&&meta[id].k===1);
j=await (await inbox('/api/inbox',{method:'POST',body:JSON.stringify({id,act:'unkeep'})})).json();c('stop keeping restores 90 days',j.ok&&expi[id]>Date.now()/1000+89*86400);
j=await (await inbox('/api/inbox',{method:'POST',body:JSON.stringify({id,act:'delete'})})).json();c('delete removes it',j.ok&&store[id]==null);
j=await (await inbox('/api/inbox',{method:'POST',body:JSON.stringify({id:'msg:bad',act:'delete'})})).json();c('a bad id is refused',j.ok===false);
j=await (await inbox('/api/inbox?msg='+encodeURIComponent('msg:0000000000000-zzzz'))).json();c('a missing message says it has gone',j.ok===false);
r=await req('/api/inbox',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck,Origin:'https://evil.example'},body:JSON.stringify({id,act:'done'})});c('another site cannot change the inbox',r.status===403);
// the list must not depend on key details being stored
{const keep=JSON.parse(JSON.stringify(meta));for(const k of Object.keys(meta))if(k.startsWith('msg:'))meta[k]=null;
 j=await (await inbox('/api/inbox')).json();c('with no details stored the list still shows reason, text and device',j.ok&&j.items.length>0&&j.items.every(x=>x.sn&&x.at&&x.r&&x.d));
 c('and is newest first',j.items.every((x,i)=>i===0||j.items[i-1].at>=x.at));
 for(const k of Object.keys(keep))meta[k]=keep[k];}
// admin
t=await (await get('/admin',ck)).text();
c('Admin has the envelope and an Inbox link',/id="env"/.test(t)&&/href="\/inbox"/.test(t)&&/Inbox<span id="inbm"/.test(t));
c('Admin has the message form switch',/id="fm"/.test(t)&&/Message form for visitors/.test(t));
// switch off
r=await inbox('/api/admin',{method:'POST',body:JSON.stringify({club:{teams:[{name:'T',teamName:'T',competition:'1699',division:'75791',team:'5001',league:'L',accent:'#2f9e5b'}]},features:{contact:false}})});j=await r.json();c('switch off saves',j.ok===true);
w=await load();
t=await (await get('/')).text();c('welcome page link is hidden when off',!/Message the Stats Board/.test(t));
r=await send(good());c('API refuses when off',r.status===403);
t=await (await get('/contact')).text();c('form page says messages are off',/not being taken/.test(t)&&!/id="mt"/.test(t));
r=await inbox('/api/admin',{method:'POST',body:JSON.stringify({club:{teams:[{name:'T',teamName:'T',competition:'1699',division:'75791',team:'5001',league:'L',accent:'#2f9e5b'}]},features:{contact:true}})});await r.json();w=await load();
t=await (await get('/')).text();c('welcome page link shows when on',/href="\/contact"[^>]*>Message the Stats Board/.test(t));
// the Message us link
const tb='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge';
t=await (await get('/?'+tb+'&view=fixtures')).text();c('a phone team page has a Message us link that remembers the page',/id="sbmsg" href="\/contact\?from=%2F%3F/.test(t));
t=await (await get('/?'+tb+'&view=fixtures&layout=tv')).text();c('a TV screen has no Message us link',!/sbmsg/.test(t));
t=await (await get('/?view=teams',ck)).text();c('the Links page has no Message us link',!/sbmsg/.test(t));
// no storage
const env2={CLUB_PIN:'1'};r=await w.fetch(new Request('https://x.co.uk/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(good())}),env2,ctx);c('no storage gives a polite 503',r.status===503);
console.log(bad?'FAILED':'ALL OK',ok+' ok',bad+' bad');process.exit(bad?1:0)
