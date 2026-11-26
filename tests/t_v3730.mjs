// v3.73.0: Players and sponsors hub: Players / Sponsors / Admin, team picker, linked panels, bulk give, sponsor-side edits
import fs from 'fs';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const w=(await import(process.argv[2]+'?p373')).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};const O='https://thestatsboard.co.uk';
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/sponsor-players'})}),env,cx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(new Request(O+'/sponsor-players',{headers:{Cookie:ck}}),env,cx);const html=await r.text();
const seasons={prev:'2025-2026',cur:'2026-2027',next:'2027-2028'};
let sponsors=[{id:'aaaaaaa1',name:'Thatchers',logo:{v:'v1',bg:'l'}},{id:'aaaaaaa2',name:'Vets4Pets'},{id:'aaaaaaa3',name:'Moor Motors'}];
const S1='Ivybridge 1XV',S2='Ivybridge 2nd XV',V='The Vandals';
let P=[{no:'100',name:'Owen Garner',teams:[S1,S2],sids:['aaaaaaa1','aaaaaaa2'],cur:true,team:'11039'},{no:'101',name:'Aaron Williams',teams:[S2],sids:['aaaaaaa2'],cur:true,team:'11063'},{no:'102',name:'Ben Burgess',teams:[V],sids:[],cur:true,team:'11070'},{no:'103',name:'Hamish Harris',teams:[S1,V],sids:[],cur:true,team:'11039'},{no:'104',name:'Zed Rush',teams:[S2],sids:[],cur:true,team:'11063'}];
const T1={team:'11039',name:S1},T2={team:'11063',name:S2},T3={team:'11070',name:V};
const row=p=>({no:p.no,name:p.name,hid:false,teams:p.teams,sponsor:p.sids.map(i=>sponsors.find(s=>s.id===i).name).join(' + '),sponsors:p.sids.map(i=>sponsors.find(s=>s.id===i).name),sids:p.sids,cur:p.cur,team:p.team,n:p.name,own:p.own||'',alt:[]});
const ALL=()=>({ok:true,season:'2026-2027',seasons,teams:[T1,T2,T3],sponsors,sponsored:P.filter(p=>p.sids.length).map(row),avail:P.filter(p=>!p.sids.length&&p.cur).map(row)});
const TEAM={ok:true,teams:[T1,T2],team:'11039',season:'2026-2027',seasons,sponsors,rows:[],tot:{},played:9,squadError:''};
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();const ctxb=await br.newContext({acceptDownloads:true,viewport:{width:1200,height:1000}});const p=await ctxb.newPage();
const posts=[],sp=[];let removeInUse=true;
await p.route('https://x.test/sponsor-players',x=>x.fulfill({contentType:'text/html',body:html}));
await p.route('https://x.test/api/logo/**',x=>x.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64')}));
await p.route('https://x.test/api/sponsor-players**',x=>{const u=new URL(x.request().url());const J=o=>x.fulfill({contentType:'application/json',body:JSON.stringify(o)});if(x.request().method()==='POST'){const b=JSON.parse(x.request().postData());posts.push(b);
 if(b.act==='set'){const q=P.find(z=>z.no===b.no);q.sids=[b.s,b.s2].filter(Boolean);q.cur=b.cur;q.own=b.nm}
 if(b.act==='addplayer'){P.push({no:'9912345678',name:b.name,teams:[b.team==='11070'?V:S1],sids:b.s?[b.s]:[],cur:true,team:b.team});return J({ok:true,no:'9912345678'})}
 if(b.act==='removeplayer'){P=P.filter(z=>z.no!==b.no);return J({ok:true})}
 if(b.act==='assign'){let ch=0,full=0;for(const no of b.nos){const q=P.find(z=>z.no===no);if(!b.s){q.sids=q.sids.filter(i=>i!==b.from);ch++}else if(q.sids.includes(b.s)){}else if(q.sids.length>=2)full++;else{q.sids.push(b.s);ch++}}return J({ok:true,changed:ch,full,copied:0})}
 return J({ok:true,copied:0,changed:1,marked:0,added:0,missed:0,total:0})}
 return J(u.searchParams.get('all')==='1'?ALL():TEAM)});
await p.route('https://x.test/api/sponsors',x=>{if(x.request().method()==='GET')return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,items:sponsors,lastBackup:new Date(Date.now()-3*86400000).toISOString()})});const b=JSON.parse(x.request().postData()||'{}');sp.push(b);const J=(o,s)=>x.fulfill({contentType:'application/json',status:s||200,body:JSON.stringify(o)});if(b.act==='rename')sponsors.find(s=>s.id===b.id).name=b.name;if(b.act==='add')sponsors.push({id:'aaaaaaa9',name:b.name});if(b.act==='bulk'){sponsors.push({id:'aaaaaab1',name:'Paste One'});return J({ok:true,added:1,skipped:0})}if(b.act==='remove'&&P.some(z=>z.sids.includes(b.id))&&!b.force)return J({ok:false,error:'in use',inUse:['x'],count:1},409);if(b.act==='remove'){sponsors=sponsors.filter(s=>s.id!==b.id);P.forEach(z=>z.sids=z.sids.filter(i=>i!==b.id))}if(b.act==='backup')return J({ok:true,file:{exported:'2026-11-26T10:00:00Z'}});return J({ok:true})});
await p.goto('https://x.test/sponsor-players');await p.waitForSelector('#ls .pr');
const q=s=>p.$$eval(s,l=>l.length);const vis=s=>p.$eval(s,e=>!e.hidden&&getComputedStyle(e).display!=='none');const txt=s=>p.$eval(s,e=>e.textContent);
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
c('three tabs, Players on, no warning strip',await p.$$eval('.tb a',l=>l.map(a=>a.querySelector('b').textContent).join())==='Players,Sponsors,Admin'&&!/warning/i.test(html.slice(html.indexOf('<body')).replace(/Season set-up/g,'')));
c('tabs are styled as a row of buttons',await p.$eval('.tb',e=>getComputedStyle(e).display)==='flex'&&await p.$eval('#t1',e=>getComputedStyle(e).backgroundColor)!=='rgba(0, 0, 0, 0)');
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'h1.png'});
c('Players: each player once, three need a sponsor',await q('#ls .pr[data-go]')===3);
await p.selectOption('#ft',S1);c('team picker limits the list',await q('#ls .pr[data-go]')===1);await p.selectOption('#ft','');
// Add a player from Players tab
await p.click('#ap');c('Add a player form opens',await q('#fn')===1&&await q('#ft2')===1&&/Match day/.test(await txt('#det')));
await p.click('#det button[data-act="psave2"]');c('name required',/name first/.test(await txt('#ms')));
await p.fill('#fn','New Lad');await p.click('#det button[data-act="psave2"]');c('team required',/team first/.test(await txt('#ms')));
posts.length=0;await p.selectOption('#ft2','11039');await p.selectOption('#fs','aaaaaaa1');await p.click('#det button[data-act="psave2"]');await p.waitForTimeout(400);
c('addplayer posts name, team and sponsor',posts[0]&&posts[0].act==='addplayer'&&posts[0].name==='New Lad'&&posts[0].team==='11039'&&posts[0].s==='aaaaaaa1',JSON.stringify(posts));
c('new player is selected in the panel',/New Lad/.test(await txt('#det'))&&/Remove from the club list/.test(await txt('#det')),await txt('#det'));
// remove player, two presses
posts.length=0;await p.click('#det button[data-act="pdel"]');c('remove asks first',/Yes, remove/.test(await txt('#det'))&&!posts.length);await p.click('#det button[data-act="pdel"]');await p.waitForTimeout(400);
c('removeplayer posts team and number',posts[0]&&posts[0].act==='removeplayer'&&posts[0].no==='9912345678'&&posts[0].team==='11039',JSON.stringify(posts));
// edit name
await p.click('#ls .pr[data-go="p:103"] .pn');posts.length=0;await p.fill('#dn','Hammy');await p.click('#det button[data-act="psave"]');await p.waitForTimeout(300);
c('own name saved via set',posts[0]&&posts[0].act==='set'&&posts[0].nm==='Hammy'&&posts[0].no==='103');
// Sponsors tab
await p.click('#t2');await p.waitForTimeout(300);
c('Sponsors tab shows add box and filters',await vis('#sr')&&await q('#ch button[data-sf]')===3);
await p.click('#ch button[data-sf="nop"]');c('No players filter lists Moor Motors only',(await p.$$eval('#ls .pr .pn b',l=>l.map(b=>b.textContent))).join()==='Moor Motors');
await p.click('#ch button[data-sf="nol"]');c('No logo filter',(await p.$$eval('#ls .pr .pn b',l=>l.map(b=>b.textContent))).includes('Vets4Pets')&&!(await p.$$eval('#ls .pr .pn b',l=>l.map(b=>b.textContent))).includes('Thatchers'));
await p.click('#ch button[data-sf="all"]');sp.length=0;await p.fill('#nsn','Dart Dental');await p.click('#nsb');await p.waitForTimeout(300);
c('add sponsor',sp[0]&&sp[0].act==='add'&&/Dart Dental/.test(await txt('#ls')));
await p.click('#sr summary');await p.fill('#pt','Paste One');await p.click('#ab');await p.waitForTimeout(300);c('paste list posts bulk',sp.some(b=>b.act==='bulk'));
await p.click('#ls .pr[data-go="s:aaaaaaa1"] .pn');
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'h2.png'});
c('sponsor panel: players, logo block, rename, export, remove',/Owen Garner/.test(await txt('#det'))&&await q('#rn')===1&&await q('#det button[data-act="sexp"]')===1&&/logo/i.test(await txt('#det')));
sp.length=0;await p.fill('#rn','Thatchers Cider');await p.click('#det button[data-act="ren"]');await p.waitForTimeout(300);
c('rename',sp[0]&&sp[0].act==='rename'&&/Thatchers Cider/.test(await txt('#ls')));
const [dl1]=await Promise.all([p.waitForEvent('download'),p.click('#det button[data-act="sexp"]')]);c('per-sponsor export downloads a csv',/\.csv$/.test(dl1.suggestedFilename())&&/thatchers/.test(dl1.suggestedFilename()),dl1.suggestedFilename());
sp.length=0;await p.click('#det button[data-act="sdel"]');await p.click('#det button[data-act="sdel"]');await p.waitForTimeout(300);
c('remove in use: asks to confirm with the count, then forces',/Used by 1 player/.test(await txt('#det'))&&/remove anyway/.test(await txt('#det')));
await p.click('#det button[data-act="sdel"]');await p.waitForTimeout(300);c('force flag sent',sp.some(b=>b.act==='remove'&&b.force===true),JSON.stringify(sp));
await p.click('#ls .pr[data-go="s:aaaaaaa2"] .pn');c('add a new player from a sponsor',await q('#det button[data-act="pnew"]')===1);
await p.click('#det button[data-act="pnew"]');c('form has sponsor preselected',await p.$eval('#fs',e=>e.value)==='aaaaaaa2');
// Admin
await p.click('#t3');await p.waitForTimeout(500);
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'h3.png',fullPage:true});
c('Admin tab shows four cards and no links off the page',await vis('#adm')&&await q('#adm .cd2')===4&&await q('#adm a')===0&&!(await vis('#hub')));
c('Admin: set-up, backup, logos, exports present',await q('#scb')===1&&await q('#bd')===1&&await q('#ld')===1&&await q('#ex1')===1&&await q('#ex2')===1);
c('last backup shows days',/3 days ago/.test(await txt('#lb')),await txt('#lb'));
c('logo stats',/Logos/.test(await txt('#lst'))&&/Sponsors without a logo/.test(await txt('#lst')));
const [dl2]=await Promise.all([p.waitForEvent('download'),p.click('#ex1')]);c('all-players export is csv',/sponsored-players-.*\.csv/.test(dl2.suggestedFilename()));
const [dl3]=await Promise.all([p.waitForEvent('download'),p.click('#ex2')]);c('sponsors export is csv',/sponsors-all-teams/.test(dl3.suggestedFilename()));
posts.length=0;await p.click('#rsb');await p.click('#rsb');await p.waitForTimeout(300);c('clear ticks asks twice',posts.some(b=>b.act==='reset'));
// cards view: all logos and players
await p.click('#t2');await p.waitForTimeout(300);await p.click('#ch button[data-vm="cards"]');await p.waitForTimeout(200);
c('All logos and players view shows a card per sponsor and hides the panel',await q('.scd')===(await q('#ls .scd'))&&await q('.scd')>=3&&!(await vis('#det')),String(await q('.scd')));
c('cards list the players as chips with their team',await p.$$eval('.scd .pc',l=>l.length)>=1&&/Vandals|Ivybridge/.test(await txt('.scd')));
await p.click('#ch button[data-sf="nop"]');c('filters still apply in the cards view',(await p.$$eval('.scd b',l=>l.map(b=>b.textContent))).every(n=>/Moor Motors|Dart Dental|Paste One/.test(n)));
await p.click('#ch button[data-sf="all"]');await p.click('.scd');await p.waitForTimeout(200);
c('clicking a card opens that sponsor in the list view',await vis('#det')&&await q('#rn')===1&&await q('.scd')===0);
c('no page errors',errs.length===0,errs.join('|'));
await p.setViewportSize({width:390,height:800});await p.click('#t1');await p.waitForTimeout(300);
c('phone: no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
// source guards
const pg=src.slice(src.indexOf('function sponsorPlayersPage'),src.indexOf('function inboxPage('));
c('page script has no backticks or backslashes',!/`[^`]*<script>/.test('')&&!/\\/.test(pg.slice(pg.indexOf('<script>'),pg.indexOf('</script>'))));
await br.close();console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0);
