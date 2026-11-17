// v3.39.0 paired screens: unique IDs, the Admin list (PIN), kick out / remove, kicked screens sent back to the setup page, duplicate names.
import vm from 'vm';
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c,x)=>{console.log(c?'PASS':'FAIL',n,c?'':(x||''));c?pass++:fail++};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v},async delete(k){delete store[k]}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'},ctx={waitUntil(){}};
globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({}),text:async()=>''});
const O='https://thestatsboard.co.uk';const F=(p,o)=>w.fetch(new Request(O+p,o),env,ctx);
let r=await F('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})});const ck=(r.headers.get('set-cookie')||'').split(';')[0];
const J=(m,b,c)=>({method:m,headers:{'Content-Type':'application/json',...(c===false?{}:{Cookie:ck})},body:b?JSON.stringify(b):undefined});
const pair=async(code,b)=>{const x=await (await F('/api/pair-send',J('POST',{code,...b}))).json();return x};
// IDs
const ids=new Set();const links=[];
for(let i=0;i<30;i++){const code=String(100000+i);const x=await pair(code,{kind:'rotator',name:'Bar'});links.push(x.link);ids.add(/sid=([0-9a-f]{12})/.exec(x.link)[1])}
ok('30 pairings with the same name get 30 different IDs',ids.size===30);
ok('screen labels differ even with the same name',new Set(links.map(l=>/screen=([^&]*)/.exec(l)[1])).size>=29);
// list
r=await F('/api/screens');ok('list needs the PIN (redirect or 401)',r.status===401||r.status===303,r.status);
r=await F('/api/screens',J('POST',{id:'x',action:'kick'},false));ok('kick without PIN refused',r.status===401);
r=await F('/api/screens',J('GET',null));let j=await r.json();
ok('list shows paired screens, newest first',j.ok&&j.screens.length===30&&j.screens[0].at>=j.screens[29].at&&/^Bar [0-9a-f]{4}$/.test(j.screens[0].label),JSON.stringify(j.screens[0]));
const id=[...ids][0],link=links.find(l=>l.includes(id));
// not kicked: pages and rotator load
r=await F(link);ok('a live screen loads its rotator',r.status===200);
r=await F('/?view=stack&layout=tv&sid='+id);ok('a live screen loads a page (not redirected)',r.status!==302);
// kick
r=await F('/api/screens',J('POST',{id,action:'remove'}));ok('remove before kick refused',r.status===400);
r=await F('/api/screens',J('POST',{id:'zzzzzzzzzzzz',action:'kick'}));ok('unknown ID is 404',r.status===404);
r=await F('/api/screens',J('POST',{id,action:'nope'}));ok('unknown action refused',r.status===400);
r=await F('/api/screens',J('POST',{id,action:'kick'}));ok('kick ok',(await r.json()).ok);
r=await F(link,{redirect:'manual'});ok('kicked rotator is sent to /setup?reset=1',r.status===302&&r.headers.get('location')==='/setup?reset=1',r.status+' '+r.headers.get('location'));
r=await F('/ivybridge/tv?sid='+id,{redirect:'manual'});ok('kicked: also on the /<club>/tv address',r.status===302);
r=await F('/tv?sid='+id,{redirect:'manual'});ok('kicked: also on /tv',r.status===302);
r=await F('/?view=stack&layout=tv&sid='+id,{redirect:'manual'});ok('kicked Match Centre is sent to setup',r.status===302&&r.headers.get('location')==='/setup?reset=1');
r=await F('/?view=stack&layout=tv&sid='+id+'&_sr=1',{redirect:'manual'});let h=await r.text();ok('kicked refresh frame tells the page (rfu-kicked), no redirect',r.status===200&&/rfu-kicked/.test(h),r.status);
r=await F('/api/pair?c=000000',{});
const other=[...ids][1],olink=links.find(l=>l.includes(other));r=await F(olink);ok('other screens are not affected',r.status===200);
r=await F('/?sid=not-an-id&view=stack&layout=tv',{redirect:'manual'});ok('a malformed ID is ignored',r.status!==302);
// remove
r=await F('/api/screens',J('POST',{id,action:'remove'}));ok('remove after kick ok',(await r.json()).ok);
j=await (await F('/api/screens',J('GET'))).json();ok('removed screen gone from the list',!j.screens.some(s=>s.id===id)&&j.screens.length===29);
// admin page
h=await (await F('/admin',{headers:{Cookie:ck}})).text();
ok('Admin has a Paired screens section and menu entry',/id="s-paired"/.test(h)&&/data-s="paired"/.test(h)&&/"paired"/.test(h));
{const sc=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);let bad='';sc.forEach((s,i)=>{try{new vm.Script(s)}catch(e){bad+=' #'+i+' '+e.message}});ok('Admin scripts compile',!bad,bad)}
// phone page: names for the duplicate hint
h=await (await F('/p/222222',{headers:{Cookie:ck}})).text();ok('phone page carries the names in use',/NAMES=\["Bar"/.test(h),(/NAMES=[^;]*/.exec(h)||[''])[0]);
// v3.39.1: a team switched off in Our teams can still be sent to a screen as one page; the phone page says teams come from Admin
{const save=await F('/api/admin',J('POST',{club:{teams:[{team:'11039',competition:'1699',division:'75791',name:'Ivybridge 1XV',teamName:'Ivybridge'},{team:'11063',competition:'1700',division:'75800',name:'Ivybridge 2XV',teamName:'Ivybridge 2nd XV',hidden:true}]}}));
 const ph=await (await F('/pair/777777',{headers:{Cookie:ck}})).text();
 ok('phone page lists a hidden team, marked',/<option value="11063">Ivybridge 2XV \(hidden from screens\)<\/option>/.test(ph)&&/<option value="11039">Ivybridge 1XV<\/option>/.test(ph),save.status+' '+(ph.match(/<option value="\d+">[^<]*/g)||[]).join('|'));
 ok('phone page says teams come from Admin, Our teams',/Admin, Our teams: add a team there first/.test(ph));
 const x=await pair('777777',{kind:'page',team:'11063',page:'table',name:'Lobby'});
 ok('a hidden team can be sent as a single page',x.ok&&x.link.includes('team=11063')&&x.link.includes('competition=1700')&&!x.link.includes('view='),JSON.stringify(x));
 const y=await pair('777778',{kind:'page',team:'99999',page:'table'});ok('a team that is not in the list is still refused',!y.ok)}
// limit
{for(let i=0;i<40;i++)await pair(String(300000+i),{kind:'centre',name:'N'});const x=await pair('399999',{kind:'centre',name:'Over'});ok('too many screens: refused with a message',!x.ok&&/Too many/.test(x.error||''),JSON.stringify(x))}
// v3.39.1: the screen list is cached for 60 seconds for kick checks; Admin reads fresh
{let reads=0;const g=kv.get;kv.get=async function(k,o){if(k==='screens')reads++;return g.call(this,k,o)};
 const lk=links.find(l=>l.includes([...ids][5]));
 await F(lk);await F(lk);await F(lk);ok('kick checks share one read within 60 seconds (at most 1 in 3 loads)',reads<=1,reads);
 const before=reads;await F('/api/screens',J('GET'));await F('/api/screens',J('GET'));ok('Admin list reads fresh each time',reads===before+2,reads-before);
 kv.get=g}
console.log(pass+' pass, '+fail+' fail');process.exit(fail?1:0);
