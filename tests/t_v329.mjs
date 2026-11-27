// v3.29 Our teams: saved team list, names used site-wide, a name in the link still wins.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
let pts=[];const env={CLUB_PIN:'1',SETTINGS:kv,USAGE:{writeDataPoint:o=>(o.blobs[1]!=='start'&&o.blobs[1]!=='done'&&pts.push(o))}};
const pend=[];const ctx={waitUntil:p=>pend.push(p)};
let ck='';const get=async(w,p)=>{const r=await w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',Cookie:ck}}),env,ctx);await Promise.all(pend.splice(0));return r};
const post=(w,b)=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
const nameSeen=async(w,q)=>{pts=[];await get(w,'/?'+q);const p=pts.find(x=>x.blobs[1]==='page'||x.blobs[1]==='tv');return p?p.blobs[4]:null};
const TQ='competition=1699&division=75791&team=11039';
let w=await load();{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0];c('cookie',ck.startsWith('rfuClub'))}
// 1. default list
c('default: name from default list',await nameSeen(w,TQ+'&teamName=Ivybridge')==='Ivybridge 1XV');
c('default: link name wins',await nameSeen(w,TQ+'&teamName=Ivybridge&friendlyName=Custom')==='Custom');
c('default: name equal to RFU name is not a choice',await nameSeen(w,TQ+'&teamName=Ivybridge&friendlyName=Ivybridge')==='Ivybridge 1XV');
c('default: other team untouched',await nameSeen(w,'competition=1699&division=75791&team=555&teamName=Rivals')==='Rivals');
let t=await (await get(w,'/?view=teams')).text();
c('links page lists default names',/Ivybridge 1XV/.test(t)&&/The Vandals/.test(t));
c('links page carries no friendlyName for club teams',!/friendlyName=/.test(t)&&/team=11039/.test(t));
t=await (await get(w,'/admin')).text();
c('admin has Our teams in the Club set-up group',/Club set-up<\/div>\s*(?:<a href="\/games-off">Games called off<\/a>\s*)?<a href="\/\?view=teams">Link builder<\/a>\s*<a href="#teams" data-s="teams">Our teams<\/a>/.test(t));
c('admin has Our teams section',/id="s-teams"/.test(t)&&/id="tml"/.test(t)&&/id="tgo"/.test(t));
{const sc=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);let comp=true;for(const s of sc){try{new Function(s)}catch(e){comp=false;console.log(e.message)}}c('admin script compiles',comp);}
c('admin carries the list',/club=\[\{"name":"Ivybridge 1XV"/.test(t));
// 2. save a new list
const mine=[{team:'11039',teamName:'Ivybridge',name:'First XV',short:'1st',accent:'#112233',league:'Regional 2',competition:'1699',division:'75791'},
 {team:'11063',teamName:'Ivybridge',name:'Vandals <b>',short:'V',accent:'bad',league:'Counties 3',competition:'1699',division:'75801'},
 {team:'11039',teamName:'Dup',name:'Duplicate',competition:'1',division:'2'},
 {team:'abc',name:'Bad id',competition:'1',division:'2'},
 {team:'777',teamName:'Newcomers',name:'',competition:'5',division:'6',league:'New league'}];
let r=await post(w,{club:{teams:mine}});let j=await r.json();c('save ok',j.ok===true);
c('same worker sees new name at once',await nameSeen(w,TQ+'&teamName=Ivybridge')==='First XV');
w=await load();
c('fresh worker (from storage) sees new name',await nameSeen(w,TQ+'&teamName=Ivybridge')==='First XV');
c('link name still wins',await nameSeen(w,TQ+'&teamName=Ivybridge&friendlyName=Old%20TV%20name')==='Old TV name');
c('added team named from RFU name',await nameSeen(w,'competition=5&division=6&team=777&teamName=Newcomers')==='Newcomers');
t=await (await get(w,'/?view=teams')).text();
c('links page shows First XV first',t.indexOf('First XV')>0&&t.indexOf('First XV')<t.indexOf('Newcomers'));
c('removed team gone from links page',!/The Vandals/.test(t)&&/Newcomers/.test(t));
c('markup stripped from names',!/Vandals <b>/.test(t)&&/Vandals b/.test(t));
const sv=JSON.parse(store['club:ivybridge']);
c('stored: duplicate and bad id dropped',sv.club.teams.length===3&&sv.club.teams.map(x=>x.team).join()==='11039,11063,777');
c('stored: bad colour replaced',/^#[0-9a-f]{6}$/.test(sv.club.teams[1].accent)&&sv.club.teams[0].accent==='#112233');
c('stored: empty name falls back to RFU name',sv.club.teams[2].name==='Newcomers');
c('stored: no short label kept',sv.club.teams.every(x=>x.short===''));
// 3. an older Admin page that does not send the list keeps it
r=await post(w,{features:{around:false}});c('older admin save ok',(await r.json()).ok===true);
w=await load();c('list kept when not sent',await nameSeen(w,TQ+'&teamName=Ivybridge')==='First XV');
// 4. empty or junk list falls back to the defaults, never leaves the site with no teams
r=await post(w,{club:{teams:[{team:'x'}]}});c('junk list save ok',(await r.json()).ok===true);
w=await load();c('junk list gives defaults',await nameSeen(w,TQ+'&teamName=Ivybridge')==='Ivybridge 1XV');
// 5. page store key follows the list
{const src2=await (await import('fs')).promises.readFile(src.replace('file://',''),'utf8');c('page key includes the team list stamp',/"&_tm=" \+ String\(TEAMS_STAMP\)/.test(src2));}
// 6. notices team ticks follow the saved list
r=await post(w,{club:{teams:mine},notices:{tv:{on:true,text:'Hi',applies:'chosen',teams:['777','11039','999']}}});await r.json();
w=await load();const s2=JSON.parse(store['club:ivybridge']);c('notice teams filtered to the saved list',s2.notices.tv.teams.join()==='777,11039');
// 7. welcome page redirect carries no baked-in name for club teams
t=await (await get(w,'/')).text();c('welcome redirect knows club teams',/var CT=\["11039","11063","777"\]/.test(t)&&/if\(CT\.indexOf\(r\.team\)<0\)p\.set\("friendlyName",r\.name\)/.test(t));
// 8. the phone app carries the saved names and looks them up
t=await (await get(w,'/?app=1&force=1&season=2026-2027&'+TQ+'&teamName=Ivybridge')).text();
c('app shell has the saved names',/"name":"Plymouth|"name":"First XV"/.test(t)&&/function cfgName/.test(t));
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
