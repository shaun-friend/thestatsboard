// v3.71.0: Players and sponsors hub: Players / Sponsors / Admin, team picker, linked panels, bulk give, sponsor-side edits
import fs from 'fs';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const w=(await import(process.argv[2]+'?p371')).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};const O='https://thestatsboard.co.uk';
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/sponsor-players'})}),env,cx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(new Request(O+'/sponsor-players',{headers:{Cookie:ck}}),env,cx);const html=await r.text();
const seasons={prev:'2025-2026',cur:'2026-2027',next:'2027-2028'};
let sponsors=[{id:'aaaaaaa1',name:'Thatchers',logo:{v:'v1',bg:'l'}},{id:'aaaaaaa2',name:'Vets4Pets'},{id:'aaaaaaa3',name:'Moor Motors'}];
const S1='Ivybridge 1XV',S2='Ivybridge 2nd XV',V='The Vandals';
let P=[{no:'100',name:'Owen Garner',teams:[S1,S2],sids:['aaaaaaa1','aaaaaaa2'],cur:true,team:'11039'},{no:'101',name:'Aaron Williams',teams:[S2],sids:['aaaaaaa2'],cur:true,team:'11063'},{no:'102',name:'Ben Burgess',teams:[V],sids:[],cur:true,team:'11070'},{no:'103',name:'Hamish Harris',teams:[S1,V],sids:[],cur:true,team:'11039'},{no:'104',name:'Zed Rush',teams:[S2],sids:[],cur:true,team:'11063'}];
const row=p=>({no:p.no,name:p.name,hid:false,teams:p.teams,sponsor:p.sids.map(i=>sponsors.find(s=>s.id===i).name).join(' + '),sponsors:p.sids.map(i=>sponsors.find(s=>s.id===i).name),sids:p.sids,cur:p.cur,team:p.team,n:p.name,own:'',alt:[]});
const ALL=()=>({ok:true,season:'2026-2027',seasons,sponsors,sponsored:P.filter(p=>p.sids.length).map(row),avail:P.filter(p=>!p.sids.length&&p.cur).map(row)});
const TEAM={ok:true,teams:[{team:'11039',name:S1},{team:'11063',name:S2}],team:'11039',season:'2026-2027',seasons,sponsors,rows:[],tot:{},played:9,squadError:''};
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();const ctxb=await br.newContext({acceptDownloads:true,viewport:{width:1200,height:1000}});const p=await ctxb.newPage();
const posts=[],sp=[];
await p.route('https://x.test/sponsor-players',x=>x.fulfill({contentType:'text/html',body:html}));
await p.route('https://x.test/api/logo/**',x=>x.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64')}));
await p.route('https://x.test/api/sponsor-players**',x=>{const u=new URL(x.request().url());if(x.request().method()==='POST'){const b=JSON.parse(x.request().postData());posts.push(b);
 if(b.act==='set'){const q=P.find(z=>z.no===b.no);q.sids=[b.s,b.s2].filter(Boolean);q.cur=b.cur}
 if(b.act==='assign'){let ch=0,full=0;for(const no of b.nos){const q=P.find(z=>z.no===no);if(!b.s){q.sids=q.sids.filter(i=>i!==b.from);ch++}else if(q.sids.includes(b.s)){}else if(q.sids.length>=2)full++;else{q.sids.push(b.s);ch++}}return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,changed:ch,full,copied:0})})}
 return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,copied:0,changed:1})})}
 return x.fulfill({contentType:'application/json',body:JSON.stringify(u.searchParams.get('all')==='1'?ALL():TEAM)})});
await p.route('https://x.test/api/sponsors',x=>{const b=JSON.parse(x.request().postData()||'{}');sp.push(b);if(b.act==='rename')sponsors.find(s=>s.id===b.id).name=b.name;if(b.act==='add')sponsors.push({id:'aaaaaaa9',name:b.name});if(b.act==='remove'&&P.some(z=>z.sids.includes(b.id)))return x.fulfill({contentType:'application/json',status:409,body:JSON.stringify({ok:false,error:'Used by 1 player in 2026-2027.'})});if(b.act==='remove')sponsors=sponsors.filter(s=>s.id!==b.id);return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true})})});
await p.goto('https://x.test/sponsor-players');await p.waitForSelector('#ls .pr');
const q=s=>p.$$eval(s,l=>l.length);const vis=s=>p.$eval(s,e=>!e.hidden&&getComputedStyle(e).display!=='none');const txt=s=>p.$eval(s,e=>e.textContent);
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'hub1.png'});
c('three tabs: Players, Sponsors, Admin; Players is on',await p.$$eval('.tb a',l=>l.map(a=>a.querySelector('b').textContent).join())==='Players,Sponsors,Admin'&&await p.$eval('#t1',e=>e.className)==='on');
c('opens on Needs a sponsor, each player once with the Needs one tag',await q('#ls .pr[data-go]')===3&&await p.$$eval('#ls .pr[data-go] .tg',l=>l.length)===3);
c('tally is for all teams',/All teams.*2 of 5 current players have a sponsor, 3 still need one/.test(await txt('#sm2')),await txt('#sm2'));
c('team box lists the teams from the data',(await p.$$eval('#ft option',l=>l.map(o=>o.textContent))).join()==='All teams,'+[S1,S2,V].sort().join());
// team filter
await p.selectOption('#ft',S1);
c('Ivybridge 1XV: only its players, tally follows the team',await q('#ls .pr[data-go]')===1&&/Ivybridge 1XV.*1 of 2 current players have a sponsor, 1 still need one/.test(await txt('#sm2')),await txt('#sm2'));
await p.selectOption('#ft',S2);await p.click('#ch button[data-f="all"]');
c('Everyone in a team includes the sponsored ones',await q('#ls .pr[data-go]')===3);
await p.selectOption('#ft','');await p.click('#ch button[data-f="need"]');
// open player
await p.click('#ls .pr[data-go="p:103"] .pn');
c('opening a player fills the panel: name, both teams, add-sponsor box, no sponsors yet',/Hamish Harris/.test(await txt('#det'))&&/Ivybridge 1XV/.test(await txt('#det'))&&/The Vandals/.test(await txt('#det'))&&await q('#adsp')===1&&/No sponsor yet/.test(await txt('#det')));
await p.selectOption('#adsp','aaaaaaa1');await p.waitForTimeout(300);
c('adding a sponsor posts set with the player, team record and the sponsor',posts.length===1&&posts[0].act==='set'&&posts[0].team==='11039'&&posts[0].no==='103'&&posts[0].s==='aaaaaaa1'&&posts[0].s2===''&&posts[0].cur===true,JSON.stringify(posts));
// still on the panel; add a second then the box goes
await p.selectOption('#adsp','aaaaaaa2');await p.waitForTimeout(300);
c('a second sponsor is accepted and then no add box, with the two-is-the-most note',await q('#adsp')===0&&/Two is the most/.test(await txt('#det'))&&posts[1].s==='aaaaaaa1'&&posts[1].s2==='aaaaaaa2',JSON.stringify(posts[1]));
posts.length=0;await p.fill('#dn','Hammy Harris');await p.uncheck('#dc');await p.click('#det button[data-act="psave"]');await p.waitForTimeout(300);
c('Save details posts the own name, the Current tick and the sponsors unchanged',posts.length===1&&posts[0].act==='set'&&posts[0].nm==='Hammy Harris'&&posts[0].cur===false&&posts[0].s==='aaaaaaa1'&&posts[0].s2==='aaaaaaa2'&&posts[0].no==='103',JSON.stringify(posts));
// jump to sponsor
await p.click('#det .ch2[data-go="s:aaaaaaa1"]');await p.waitForTimeout(200);
c('clicking a sponsor chip jumps to that sponsor: tab changes, players listed',await p.$eval('#t2',e=>e.className)==='on'&&/Thatchers/.test(await txt('#det'))&&/Hamish Harris/.test(await txt('#det'))&&/Owen Garner/.test(await txt('#det'))&&/3 players|2 players/.test(await txt('#det')),await txt('#det'));
c('a Back button names where you came from',/Back to Hamish Harris/.test(await txt('#det')));
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'hub2.png'});
// jump to another player from the sponsor
await p.click('#det .ch2[data-go="p:100"] ');await p.waitForTimeout(200);
c('clicking a player there jumps to that player',await p.$eval('#t1',e=>e.className)==='on'&&/Owen Garner/.test(await txt('#det'))&&/Back to Thatchers/.test(await txt('#det')));
await p.click('#det button[data-act="back"]');await p.waitForTimeout(200);
c('Back returns to the sponsor',/Thatchers/.test(await txt('#det'))&&await p.$eval('#t2',e=>e.className)==='on');
// sponsor side: remove a player, add by team
posts.length=0;await p.click('#det .ch2[data-go="p:103"] .x');await p.waitForTimeout(300);
c('x on a player takes that one sponsor off: assign with from',posts.length===1&&posts[0].act==='assign'&&posts[0].s===''&&posts[0].from==='aaaaaaa1'&&posts[0].nos[0]==='103'&&posts[0].team==='11039',JSON.stringify(posts));
await p.selectOption('#ft',V);
c('with a team picked the Add a player box lists only that team and says so',/Add a player from The Vandals/.test(await txt('#adpl'))&&(await p.$$eval('#adpl option',l=>l.map(o=>o.textContent))).every(t=>/Add a player|Ben Burgess|Hamish Harris|Callum/.test(t)),await p.$$eval('#adpl option',l=>l.map(o=>o.textContent).join('|')));
await p.click('#ls .pr[data-go="s:aaaaaaa1"] .pn');
posts.length=0;await p.selectOption('#adpl','102');await p.waitForTimeout(300);
c('adding a player posts assign for their team record',posts.length===1&&posts[0].act==='assign'&&posts[0].team==='11070'&&posts[0].s==='aaaaaaa1'&&posts[0].nos[0]==='102',JSON.stringify(posts));
// rename + remove-in-use
sp.length=0;await p.fill('#rn','Thatchers Cider');await p.click('#det button[data-act="ren"]');await p.waitForTimeout(300);
c('rename posts to the sponsors API and the list shows it',sp[0]&&sp[0].act==='rename'&&sp[0].name==='Thatchers Cider'&&/Thatchers Cider/.test(await txt('#ls')));
await p.click('#det button[data-act="del"]');c('remove asks twice',/Press again/.test(await txt('#det')));await p.click('#det button[data-act="del"]');await p.waitForTimeout(300);
c('removing a sponsor in use is refused with the reason',/Used by 1 player/.test(await txt('#ms'))&&sp.some(b=>b.act==='remove'),await txt('#ms'));
// new sponsor
await p.selectOption('#ft','');await p.fill('#nsn','Dart Dental');await p.click('#nsb');await p.waitForTimeout(300);
c('Add sponsor posts add and the list gains it',sp.some(b=>b.act==='add'&&b.name==='Dart Dental')&&/Dart Dental/.test(await txt('#ls')));
// players: bulk
await p.evaluate(()=>{location.hash='#players'});await p.waitForTimeout(200);await p.click('#ch button[data-f="need"]');await p.selectOption('#ft',S2);
c('need + team: Zed Rush and Ben is not here',(await p.$$eval('#ls .pr[data-go] .pn b',l=>l.map(b=>b.textContent))).join()==='Zed Rush'||(await p.$$eval('#ls .pr[data-go] .pn b',l=>l.map(b=>b.textContent))).includes('Zed Rush'));
await p.selectOption('#ft','');await p.check('#sa');
c('tick all selects every shown player and shows the bar',await q('#ls input[data-k]:checked')===await q('#ls .pr[data-go]')&&/selected/.test(await txt('#bk'))&&await q('#bs')===1);
posts.length=0;await p.selectOption('#bs','aaaaaaa3');await p.click('#bg');await p.waitForTimeout(500);
c('Give sponsor posts one assign per team record with all ticked numbers',posts.length>=1&&posts.every(b=>b.act==='assign'&&b.s==='aaaaaaa3')&&posts.reduce((n,b)=>n+b.nos.length,0)>=1,JSON.stringify(posts));
c('bar clears and players move out of Needs a sponsor',await q('#bk .bulk')===0&&!/Needs one/.test(await txt('#ls'))||await q('#ls .pr[data-go]')<3);
// download follows the team
await p.selectOption('#ft',S2);const dl=p.waitForEvent('download');await p.click('#wx');const d=await dl;const t=fs.readFileSync(await d.path(),'utf8');
c('download is named for the team and holds only its players',/^sponsored-players-ivybridge-2nd-xv-2026-2027\.csv$/.test(d.suggestedFilename())&&/Aaron Williams/.test(t)&&!/Ben Burgess/.test(t),d.suggestedFilename());
// admin
await p.evaluate(()=>{location.hash='#admin'});await p.waitForTimeout(300);
c('Admin: set-up card, copy, backup links shown; list hidden; team box for set-up',await vis('#sc')&&await vis('#ad')&&!(await vis('#hub'))&&await vis('#tm')&&!(await vis('#ft'))&&await p.$eval('#h1',e=>e.textContent)==='Admin'&&await p.$$eval('#ad a',l=>l.map(a=>a.getAttribute('href')).join())==='/sponsors,/sponsor-list');
await p.evaluate(()=>{location.hash='#check'});await p.waitForTimeout(300);
c('old #check address still opens Players',await p.$eval('#t1',e=>e.className)==='on'&&await vis('#hub'));
// narrow: list then panel
await p.setViewportSize({width:390,height:800});await p.evaluate(()=>{location.hash='#players'});await p.waitForTimeout(300);
c('phone: detail hidden until something is chosen',!(await vis('#det'))&&await vis('#lc'));
await p.click('#ch button[data-f="all"]');await p.click('#ls .pr[data-go] .pn');
c('phone: panel replaces the list with a List button',await vis('#det')&&!(await vis('#lc'))&&await vis('#det .mob'));
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'hub3.png'});
await p.click('#det .mob');c('phone: List button returns',await vis('#lc')&&!(await vis('#det')));
const sc=await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);c('phone: no sideways scroll',sc);
await br.close();
c('Sponsors page tabs point at the hub',/href="\/sponsor-players#sponsors"/.test(src)&&/Logos and backup/.test(src));
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
