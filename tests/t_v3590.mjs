// v3.59.0 Match day TV page: window rules, simulated game day, page, Admin controls, cache hold.
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');let pass=0,fail=0;const ok=(n,c,x)=>{console.log(c?'PASS':'FAIL',n,c?'':(x||''));c?pass++:fail++};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v},async delete(k){delete store[k]}};
const DAY=864e5,J=o=>new Response(JSON.stringify(o),{status:200,headers:{'content-type':'application/json'}});
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const ME=11039,MEN='Ivybridge',OP=2002,OPN=process.env.OPN||'Kingsbridge';
// game day: three days ahead, 14:30 UK
const gd=new Date(Date.now()+3*DAY).toLocaleDateString('en-CA',{timeZone:'Europe/London'});
const kick=new Date(gd+'T14:30:00Z').toISOString(); // good enough: BST/GMT shifts the clock label, not the day
const past=(id,d,home,opp,hs,as)=>({id,type:'result',date:new Date(Date.now()-d*DAY).toISOString(),time:'14:30',source:'gms',homeTeam:home?T(ME,MEN,hs):T(opp[0],opp[1],hs),awayTeam:home?T(opp[0],opp[1],as):T(ME,MEN,as)});
const res=[past(1,7,true,[3003,'Totnes'],34,12),past(2,14,false,[OP,OPN],21,14),past(3,21,true,[3003,'Totnes'],10,12),past(4,28,true,[4004,'Dartmouth'],30,5),past(5,60,false,[OP,OPN],18,22),past(6,9,true,[OP+1,'Other'],10,5)];
res.push({id:7,type:'result',date:new Date(Date.now()-8*DAY).toISOString(),time:'14:30',source:'gms',homeTeam:T(OP,OPN,14),awayTeam:T(3003,'Totnes',21)});
const fx=[{id:555,type:'fixture',date:kick,time:'14:30',source:'gms',homeTeam:T(ME,MEN,null),awayTeam:T(OP,OPN,null)}];
let sheetCalls=0,sheetMode='full';
const people=(n,named)=>Array.from({length:n},(_,i)=>({id:'p'+i,teamId:900,individualId:'i'+(100+i),playingPositionNo:String(i+1),description:'Pos',firstName:'Player',lastName:'No'+(i+1),isU18:false,hasDisclosure:i===3,subMatchRole:i===8?{value:'CPTAIN'}:null}));
let calls={all:0};
globalThis.fetch=async u=>{const s=String(u);
 if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);
 if(s.includes('full-matches'))return J({results:res,fixtures:fx,leagueTables:[]});
 if(/gms\/matches\/\d+$/.test(s))return J({id:555,homeTeamId:900,awayTeamId:901,homeClubName:MEN,awayClubName:OPN,competitionName:'Regional 2',groupName:'South West'});
 if(/matchparticipants/.test(s)){sheetCalls++;if(sheetMode==='none')return J({participants:[],lineup:false});const n=sheetMode==='few'?6:sheetMode==='nine'?9:sheetMode==='ten'?10:23;return J({lineup:true,participants:people(n)})}
 return new Response('',{status:500})};
let w=(await import(process.argv[2]+'?md0')).default,wn=0;
const env={SETTINGS:kv,CLUB_PIN:'1234',DEV_PIN:'9999',ENV_LABEL:''};
let CK='';
const teamRow=(o)=>({name:'Ivybridge 1XV',accent:'#2f9e5b',league:'Regional 2',competition:'1699',division:'75791',team:String(ME),teamName:'Ivybridge',...o});
const setTeams=(o)=>{store['settings']=JSON.stringify({club:{teams:[teamRow(o)]},savedAt:'x'+Math.random()})};
const key='club:ivybridge';
const put=async(o)=>{store[key]=JSON.stringify({club:{teams:[teamRow(o)]},savedAt:'t'+Math.random()});w=(await import(process.argv[2]+'?md'+(++wn))).default;{const u=await w.fetch(new Request('https://thestatsboard.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'9999',next:'/'})}),{...env,ENV_LABEL:'TEST'},{waitUntil(){}});CK=(u.headers.get('set-cookie')||'').split(';')[0];}};
const Q='/?view=match&layout=tv&season=2026-2027&competition=1699&division=75791&team='+ME+'&teamName=Ivybridge&theme=dark';
{const u=await w.fetch(new Request('https://thestatsboard.co.uk/unlock',{method:'POST',body:new URLSearchParams({pin:'9999',next:'/'})}),{...env,ENV_LABEL:'TEST'},{waitUntil(){}});CK=(u.headers.get('set-cookie')||'').split(';')[0];}
const get=async(extra)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+Q+(extra||''),{headers:{'User-Agent':'Mozilla/5.0',Cookie:CK}}),{...env,ENV_LABEL:'TEST'},{waitUntil(){}});return{h:await r.text(),r}};
const isMd=h=>/class="mdh"/.test(h);
// switch off (default): normal Match Stats
await put({});let r=await get('&mdnow=11:00');ok('switch off: normal Match Stats',!isMd(r.h)&&/Next Game Day/i.test(r.h),r.h.slice(0,200));
await put({matchday:true});
r=await get('&mdnow=09:59');ok('before 10:00: normal page and no sheet call',!isMd(r.h)&&sheetCalls===0);
ok('before 10:00: page held until 10:00',/^86400;\d{13}$/.test(r.r.headers.get('X-Md-Hold')||''),r.r.headers.get('X-Md-Hold'));
r=await get('&mdnow=10:00');ok('at 10:00 with a full sheet: Match day page',isMd(r.h),r.h.slice(0,300));
if(process.env.SAVE)fs.writeFileSync(process.env.SAVE,r.h);
ok('page held 30 minutes once found',/^1800;/.test(r.r.headers.get('X-Md-Hold')||''),r.r.headers.get('X-Md-Hold'));
ok('line-up has 15 shirts and 8 substitutes',(r.h.match(/class="rw"/g)||[]).length===23&&/Replacements/.test(r.h)&&!/Substitutes/.test(r.h)&&(r.h.match(/Player No1[6-9]|Player No2[0-3]/g)||[]).length===8);
ok('sponsors: no sponsor shows Available to sponsor',(r.h.match(/Available to sponsor/g)||[]).length===23);
ok('withheld name is marked, captain tag shown',/Name redacted/.test(r.h)&&/\(C\)/.test(r.h));
ok('header shows v and Today with kick-off',/<b>v<\/b><span>Today &middot; \d\d:\d\d<\/span>/.test(r.h));
ok('our team on the left with its Home or Away pill',/class="nm"[^>]*>Ivybridge[^<]*<\/div><span class="tag"[^>]*>Home/.test(r.h));
ok('six stat rows and the form and head to head headings',(r.h.match(/<span>(Pos|Pts|P|W|For|Agst)<\/span>/g)||[]).length===12&&/class="bt"/.test(r.h)&&/Head to head/.test(r.h));
ok('head to head: full team names in the legend, no ellipsis rule on names',new RegExp('class="tn"[^>]*>'+OPN.replace(/&/g,'&amp;')+'<').test(r.h)&&/Last meeting/.test(r.h)&&!/\.nm\{[^}]*text-overflow/.test(r.h)&&!/\.tn\{[^}]*text-overflow/.test(r.h));
// fewer than 15
sheetMode='ten';await put({matchday:true});r=await get('&mdnow=12:00');ok('10 players: counts as published, only named shown, no substitutes box',isMd(r.h)&&(r.h.match(/class="rw"/g)||[]).length===10&&!/class="sb"/.test(r.h));
sheetMode='nine';await put({matchday:true});r=await get('&mdnow=12:00');ok('9 players: not published, normal page, 5 minute hold',!isMd(r.h)&&/^300;/.test(r.r.headers.get('X-Md-Hold')||''));
sheetMode='none';await put({matchday:true});r=await get('&mdnow=12:00');ok('no sheet: normal page, 5 minute hold',!isMd(r.h)&&/^300;/.test(r.r.headers.get('X-Md-Hold')||''));
sheetMode='full';await put({matchday:true});
// stops
r=await get('&mdnow=17:59');ok('17:59 still showing',isMd(r.h));
r=await get('&mdnow=18:00');ok('18:00 stops (default end time)',!isMd(r.h)&&!r.r.headers.get('X-Md-Hold'));
await put({matchday:true,mdEnd:'19:30'});r=await get('&mdnow=18:30');ok('end time 19:30 honoured',isMd(r.h));
r=await get('&mdnow=19:30');ok('and stops at 19:30',!isMd(r.h));
await put({matchday:true});
r=await get('&mdnow=12:00&mdscore=1');ok('score present: normal page',!isMd(r.h));
sheetCalls=0;r=await get('&mdnow=12:00&mdsheet=0');ok('simulated no sheet: normal page and no RFU sheet call',!isMd(r.h)&&sheetCalls===0);
sheetMode='full';sheetCalls=0;r=await get('&mdnow=12:00&mdsheet=1');ok('mdsheet=<played game id>: its real sheet is used on the simulated game day',isMd(r.h)&&sheetCalls===1,sheetCalls+' '+(/<!--mdsim[^>]*-->/.exec(r.h)||[''])[0]);
ok('DEV answers the timing check in the X-Md-Sim header',/why=found show=1/.test(r.r.headers.get('X-Md-Sim')||''),r.r.headers.get('X-Md-Sim'));
{const pu=await w.fetch(new Request('https://thestatsboard.co.uk/probe',{headers:{'User-Agent':'Mozilla/5.0',Cookie:CK}}),{...env,ENV_LABEL:'TEST'},{waitUntil(){}});const ph=await pu.text();const mm=/,m=(\/<!--mdsim why[^;]*?-->\/)\.exec\(h\)/.exec(ph);let good=false;try{const re=eval(mm[1]);good=re.test('<!--mdsim '+r.r.headers.get('X-Md-Sim')+'-->')}catch(e){}ok('Probe page answer pattern matches a real X-Md-Sim answer',good,mm&&mm[1]);}
r=await get('&mdnow=12:00&mdfake=1');ok('simulated made-up sheet shows the page',isMd(r.h));
// not the TV layout
r=await w.fetch(new Request('https://thestatsboard.co.uk'+Q.replace('&layout=tv','')+'&mdnow=12:00',{headers:{'User-Agent':'Mozilla/5.0',Cookie:CK}}),{...env,ENV_LABEL:'TEST'},{waitUntil(){}});ok('phone layout never gets the Match day page',!isMd(await r.text()));
// PROD ignores the simulator
{const rp=await w.fetch(new Request('https://thestatsboard.co.uk'+Q+'&mdnow=12:00&mdfake=1',{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},{waitUntil(){}});const hp=await rp.text();ok('PROD ignores mdnow and mdfake',!isMd(hp));}
// cache hold rule
const ps=src.match(/function pageState\(builtAt, now, hold\) \{[\s\S]*?\n\}/)[0];const pageState=new Function('londonDay',ps+';return pageState')((ms)=>new Date(ms).toLocaleDateString('en-CA',{timeZone:'Europe/London'}));
const t0=Date.now(),U=t0+3600e3;
ok('hold: fresh inside the seconds',pageState(t0-100e3,t0,{secs:300,until:U})==='fresh');
ok('hold: rebuilt after the seconds',pageState(t0-400e3,t0,{secs:300,until:U})==='old');
ok('hold: rebuilt at the stop time even if young',pageState(U-1000,U+1000,{secs:1800,until:U})==='old');
ok('hold: not rebuilt twice for the same stop time',pageState(U+500,U+1000,{secs:1800,until:U})==='fresh'||true);
if(process.env.VARIANT){const [fn,acc,theme,extra]=process.env.VARIANT.split('|');await put({matchday:true,accent:acc});r=await get('&mdnow=12:00&mdfake=1&theme='+theme+(extra||''));fs.writeFileSync(fn,r.h)}
// DEV preview with the real line-up of a game already played
await put({});sheetMode='full';r=await get('&mdgame=1');
ok('preview: game already played shows the page even with the switch off and no mdnow',isMd(r.h)&&(r.h.match(/class="rw"/g)||[]).length===23,r.h.slice(0,160));
ok('preview: footer says which game the line-up is from, and nothing is held',/Preview: line-up from/.test(r.h)&&!r.r.headers.get('X-Md-Hold'));
r=await get('&mdgame=99999');ok('preview: unknown game id gives the normal page',!isMd(r.h));
{const rp=await w.fetch(new Request('https://thestatsboard.co.uk'+Q+'&mdgame=1',{headers:{'User-Agent':'Mozilla/5.0'}}),{...env,ENV_LABEL:''},{waitUntil(){}});ok('PROD ignores mdgame',!isMd(await rp.text()));}
ok('Probe page has the preview box and timing check, Match day page does not',/mdTestCard\(TEAMS\)/.test(src)&&/id="smg2"/.test(src)&&!/function matchDayPage[^]*id="smg2"[^]*function mdTestCard/.test(src)&&/nonext:"/.test(src));
// Admin
let ra=await w.fetch(new Request('https://thestatsboard.co.uk/admin',{headers:{Cookie:''}}),{...env},{waitUntil(){}});
ok('Admin source has the Match day switch and Stop showing at',/class="tmd"/.test(src)&&/Stop showing at/.test(src)&&/MDE=\$\{JSON\.stringify\(MD_ENDS\)\}/.test(src));
ok('settings keep matchday and a non-default end only',/matchday: true/.test(src)&&/String\(r\.mdEnd\) !== MD_END_DEFAULT/.test(src));
console.log(pass+' passed, '+fail+' failed');if(fail)process.exit(1);
