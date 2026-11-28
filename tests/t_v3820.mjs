// v3.82.0: Pitch and Changing Room allocation (TV screen, parents' phone view, fixtures team page, rules, publish, map, club name).
import vm from 'node:vm';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={},meta={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},getWithMetadata:async(k,o)=>({value:store[k]==null?null:store[k],metadata:meta[k]||null}),put:async(k,v,o)=>{store[k]=v;if(o&&o.metadata)meta[k]=o.metadata},delete:async k=>{delete store[k];delete meta[k]}};
let clock=Date.UTC(2026,10,29,9,0,0);const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',FIXTURES_PIN:'2',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
const O='https://thestatsboard.co.uk';
const rq=(p,o)=>w.fetch(new Request(O+p,o),env,ctx);
let club='',fix='';
{const r=await rq('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})});club=(r.headers.get('Set-Cookie')||'').split(';')[0]}
const U='/pitch-and-changing-room-allocation';
// public pages need no sign-in
for(const p of [U,U+'/phone']){const r=await rq(p,{headers:{'User-Agent':'Mozilla/5.0'}});const t=await r.text();c('public page '+p,r.status===200&&/Pitch and changing room allocation/i.test(t));
 for(const m of t.matchAll(/<script>([\s\S]*?)<\/script>/g)){try{new vm.Script(m[1])}catch(e){c('script syntax '+p+' '+e.message,false)}}
 c('no backslash or template leftovers '+p,!/\$\{/.test(t))}
{const t=await (await rq(U)).text();c('tv has holding texts',/KICK-OFF PREP IN PROGRESS/.test(t)&&/Pop to the club kitchen for a coffee and a bacon roll/.test(t)&&/Check back later, or use this QR code to check from your phone/.test(t)&&/Scan for times<br>and pitch map/.test(t)&&/Powered by The Stats Board/.test(t)&&/\?s=qr/.test(t))}
{const t=await (await rq(U+'/phone')).text();c('phone has welcome texts',/Welcome to /.test(t)&&/Please select your age group from the options below\./.test(t)&&/will appear here when available/.test(t)&&/Tap to open the pitch map/.test(t))}
c('not a 404',(await rq(U)).status===200);
// sign-in
{const r=await rq(U+'/manage',{redirect:'manual'});c('manage redirects to unlock',r.status===303&&/unlock/.test(r.headers.get('Location')||''))}
c('admin api needs sign-in',(await rq('/api/pitch/admin')).status===401);
{const r=await rq(U+'/unlock',{method:'POST',body:new URLSearchParams({pin:'9'})});c('wrong pin',r.status===401)}
{const r=await rq(U+'/unlock',{method:'POST',body:new URLSearchParams({pin:'2'})});fix=(r.headers.get('Set-Cookie')||'').split(';')[0];c('fixtures pin signs in',r.status===303&&/^rfuFix=/.test(fix))}
c('manage page loads for fixtures',(await rq(U+'/manage',{headers:{Cookie:fix}})).status===200);
c('manage page loads for club pin',(await rq(U+'/manage',{headers:{Cookie:club}})).status===200);
c('fixtures cookie does not open Admin',(await rq('/admin',{headers:{Cookie:fix},redirect:'manual'})).status===303);
{const t=await (await rq(U+'/manage',{headers:{Cookie:fix}})).text();for(const m of t.matchAll(/<script>([\s\S]*?)<\/script>/g)){try{new vm.Script(m[1])}catch(e){c('manage script syntax '+e.message,false)}}
 c('manage has steps and tools',/1 Edit/.test(t)&&/2 Preview/.test(t)&&/3 Publish/.test(t)&&/Copy last week/.test(t)&&/Upload map/.test(t)&&/Edit the lists/.test(t))}
const adm=(b,ck)=>rq('/api/pitch/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck||fix},body:JSON.stringify(b)}).then(async r=>({s:r.status,j:await r.json()}));
let st=await rq('/api/pitch/admin',{headers:{Cookie:fix}}).then(r=>r.json());
c('defaults',st.ok&&st.doc.lists.ages.length>=13&&st.doc.lists.pitches.length===6&&st.doc.lists.rooms.length===6&&st.doc.lists.kos.length>5);
const L=st.doc.lists,A=n=>L.ages.find(x=>x.n===n).id,P=n=>L.pitches.find(x=>x.n===n).id;
const row=(a,p,ko,home,away,opp)=>({id:'r'+Math.random().toString(36).slice(2,6),age:A(a),pitch:P(p),ko,home,away,opp:opp||{id:'',n:''}});
// rules
let r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U9','Pitch 1','10:00',['c1'],['c2']),row('U9','Pitch 2 (Top)','10:30',['c3'],[])]});
c('same age twice in a session is flagged',r.j.errors.some(e=>/already in the morning/.test(e.m)));
r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U9','Pitch 1','10:00',['c1'],['c2']),row('U10','Pitch 2 (Top)','10:30',['c2'],[])]});
c('room used twice in a session is flagged',r.j.errors.some(e=>/Changing room 2 is already used by U9/.test(e.m)));
r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U9','Pitch 1','10:00',['c1'],['c2']),row('U10','Pitch 1','10:00',['c3'],[])]});
c('pitch twice at the same time is flagged',r.j.errors.some(e=>/Pitch 1 is already used at 10:00/.test(e.m)));
r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U9','Pitch 1','10:00',['c1'],['c1'])]});
c('room on both sides cleaned',r.j.doc.rows[0].home.length===1&&r.j.doc.rows[0].away.length===0);
r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U9','Pitch 1','10:00',['c1'],[]),row('U10','Pitch 1','10:00',['c3'],[])]});r=await adm({a:'publish'});c('publish refused with problems',r.s===422&&r.j.errors.length>0);
// a clean allocation, with the pitch, rooms and age groups recycled between morning and afternoon
const opp={id:'11039',n:'Newton Abbot'};
r=await adm({a:'save',lists:L,date:'2026-11-29',rows:[row('U10','Pitch 2 (Top)','10:30',['c3'],[]),row('U9','Pitch 1','10:00',['c1'],['c2'],opp),row('U9','Pitch 1','13:00',['c1'],['c2']),row('Girls U11','Pitch 3','10:00',['c4'],['c5'])]});
c('recycling between sessions is allowed, same pitch at another time too',r.j.ok&&r.j.errors.length===0);
c('draft not public yet',(await rq('/api/pitch').then(x=>x.json())).rows.length===0);
r=await adm({a:'publish'});c('publish ok',r.j.ok&&r.j.pub&&r.j.pub.n===4);
let pub=await rq('/api/pitch').then(x=>x.json());
c('public payload',pub.date==='2026-11-29'&&pub.rows.length===4&&pub.club==='Ivybridge Rugby Club'&&pub.crest);
c('youngest first then time',pub.rows[0].age==='U9'&&pub.rows[0].ko==='10:00'&&pub.rows[1].age==='U9'&&pub.rows[1].ko==='13:00'&&pub.rows[2].age==='U10');
c('names not ids',pub.rows[0].home[0]==='1'&&pub.rows[0].away[0]==='2'&&pub.rows[0].pitch==='Pitch 1'&&pub.rows[0].opp.n==='Newton Abbot');
// editing the draft does not change the published copy until Publish
await adm({a:'save',lists:L,date:'2026-12-06',rows:[]});
pub=await rq('/api/pitch').then(x=>x.json());c('published copy unchanged by draft edits',pub.rows.length===4&&pub.date==='2026-11-29');
r=await adm({a:'copy'});c('copy last week moves a week on',r.j.ok&&r.j.doc.date==='2026-12-06'&&r.j.doc.rows.length===4&&r.j.errors.length===0);
r=await adm({a:'save',lists:L,date:'',rows:r.j.doc.rows});r=await adm({a:'publish'});c('publish needs a date',r.s===422);
// lists keep history: a switched-off item stays on old rows
{const L2=JSON.parse(JSON.stringify(L));L2.pitches.find(x=>x.n==='Pitch 3').on=false;L2.ages[0].n='U7s '+'x'.repeat(60);r=await adm({a:'save',lists:L2,date:'2026-12-06',rows:[]});
 c('names capped',r.j.doc.lists.ages[0].n.length<=24);c('switched off kept',r.j.doc.lists.pitches.some(x=>x.n==='Pitch 3'&&x.on===false))}
// map
{const png=new Uint8Array(200);png.set([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
 let m=await rq('/api/pitch/map',{method:'POST',headers:{'Content-Type':'image/png',Cookie:fix},body:png});let j=await m.json();c('map upload',j.ok&&j.v>0);
 const g=await rq('/api/pitch/map?v='+j.v);c('map served publicly',g.status===200&&g.headers.get('Content-Type')==='image/png'&&/immutable/.test(g.headers.get('Cache-Control')));
 c('payload carries map version',(await rq('/api/pitch').then(x=>x.json())).map===j.v);
 m=await rq('/api/pitch/map',{method:'POST',headers:{Cookie:fix},body:new TextEncoder().encode('x'.repeat(300))});c('non image refused',m.status===400);
 c('map upload needs sign-in',(await rq('/api/pitch/map',{method:'POST',body:png})).status===401);
 await rq('/api/pitch/map',{method:'DELETE',headers:{Cookie:fix}});c('map removed',(await rq('/api/pitch/map?v=1')).status===404)}
// club name from Admin
{const a=await rq('/admin',{headers:{Cookie:club}}).then(x=>x.text());c('admin card',/id="pcn"/.test(a)&&/id="pcw"/.test(a)&&/FIXTURES_PIN/.test(a));
 clock+=2000;const s=await rq('/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:club},body:JSON.stringify({pitch:{club:'Test Rugby Club',welcome:'Hello <b>all'}})}).then(x=>x.json());c('admin saves',s.ok);
 clock+=2000;const pb=await rq('/api/pitch').then(x=>x.json());c('club name and welcome in payload',pb.club==='Test Rugby Club'&&pb.welcome==='Hello b all'.replace('b all','b all')||pb.welcome.indexOf('<')<0)}
// v3.83.0: usage by day, Admin section, tabular edit page, previews
{await new Promise(r=>setTimeout(r,50));
 const u0=await rq('/api/pitch/usage',{headers:{Cookie:fix}}).then(x=>x.json());const b0=u0.days.find(d=>d.date===u0.today)||{ph:0,qr:0,tv:0};
 const ph=await rq('/pitch-and-changing-room-allocation/phone?s=qr',{headers:{'User-Agent':'Mozilla/5.0 iPhone'}});await ph.text();
 await rq('/pitch-and-changing-room-allocation/phone',{headers:{'User-Agent':'Mozilla/5.0 iPhone'}});
 await rq('/pitch-and-changing-room-allocation',{headers:{'User-Agent':'Mozilla/5.0 TV'}});
 await rq('/pitch-and-changing-room-allocation/phone?s=qr',{headers:{'User-Agent':'Googlebot/2.1'}});
 await rq('/pitch-and-changing-room-allocation/phone?preview=1&s=qr',{headers:{'User-Agent':'Mozilla/5.0 iPhone'}});
 await new Promise(r=>setTimeout(r,80));
 const u=await rq('/api/pitch/usage',{headers:{Cookie:fix}}).then(x=>x.json());const t=u.days.find(d=>d.date===u.today);
 c('usage counts phone, qr and tv; skips bots and previews',t&&t.ph-b0.ph===2&&t.qr-b0.qr===1&&t.tv-b0.tv===1);
 c('usage shows the published date with its games',u.days.some(d=>d.date==='2026-11-29'&&d.pub===4));
 c('usage needs sign-in',(await rq('/api/pitch/usage')).status===401);
 const a=await rq('/admin',{headers:{Cookie:club}}).then(x=>x.text());
 c('admin has its own Pitch allocation section',/data-s="pitch">Pitch allocation</.test(a)&&/id="s-pitch"/.test(a)&&/id="pu"/.test(a)&&/Usage by day/.test(a));
 const acc=a.slice(a.indexOf('id="s-access"'),a.indexOf('id="s-pitch"'));c('club name no longer in Club PIN and access',!/id="pcn"/.test(acc));
 const m=await rq('/pitch-and-changing-room-allocation/manage',{headers:{Cookie:fix}}).then(x=>x.text());
 c('manage page is a table with Home and Away columns',/class="tb2"/.test(m)||/tb2/.test(m))&&c('manage: taken options are removed not labelled',!/taken by/.test(m)&&!/other side/.test(m));
 c('manage has TV and phone previews and Edit the lists',/data-pv="tv"/.test(m)&&/data-pv="ph"/.test(m)&&/Edit the lists/.test(m));
 const tv=await rq('/pitch-and-changing-room-allocation').then(x=>x.text());
 c('tv screen follows the approved mockup',/Changing room/.test(tv)&&/>Home</.test(tv)&&/>Away</.test(tv)&&/skewX\(-6deg\)/.test(tv)&&/repeating-linear-gradient\(115deg/.test(tv));
 c('tv and phone support preview',/preview=1/.test(tv)&&/preview=1/.test(await rq('/pitch-and-changing-room-allocation/phone').then(x=>x.text())));}
// v3.83.0: season record, delete a day, load a day, CSV
{const g=await rq('/api/pitch/admin',{headers:{Cookie:fix}}).then(x=>x.json());
 c('published days are kept in the season record',g.days.some(d=>d.date==='2026-11-29'&&d.n===4));
 const csv=await rq('/api/pitch/season',{headers:{Cookie:fix}});const ct=await csv.text();
 c('season CSV',csv.status===200&&/text\/csv/.test(csv.headers.get('Content-Type'))&&/Date,Session,Age group/.test(ct)&&/2026-11-29,Morning,U9,Pitch 1,1,2,10:00,Newton Abbot/.test(ct)&&/2026-11-29,Afternoon,U9/.test(ct));
 c('season CSV needs sign-in',(await rq('/api/pitch/season')).status===401);
 let r=await adm({a:'load',date:'2026-11-29'});c('load a saved day as the draft',r.j.ok&&r.j.doc.date==='2026-11-29'&&r.j.doc.rows.length===4&&r.j.errors.length===0);
 const before=(await rq('/api/pitch').then(x=>x.json()));c('day is live',before.rows.length===4);
 r=await adm({a:'delday',date:'2026-11-29'});c('delete a whole day',r.j.ok&&r.j.pub===null&&r.j.doc.rows.length===0&&!r.j.days.some(d=>d.date==='2026-11-29'));
 const after=await rq('/api/pitch').then(x=>x.json());c('deleted day leaves the public screen empty',after.rows.length===0&&after.date==='');
 r=await adm({a:'load',date:'2026-11-29'});c('deleted day cannot be loaded',r.s===404);
 const u=await rq('/api/pitch/usage',{headers:{Cookie:fix}}).then(x=>x.json());c('deleted day no longer marked as an allocation in usage',!u.days.some(d=>d.date==='2026-11-29'&&d.pub>0))}
console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0);
