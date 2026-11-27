// v3.77.0: Club sponsors section, sponsor descriptions (hub and API)
import fs from 'fs';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const w=(await import(process.argv[2]+'?p377')).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};const O='https://thestatsboard.co.uk';
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/sponsor-players'})}),env,cx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(new Request(O+'/sponsor-players',{headers:{Cookie:ck}}),env,cx);const html=await r.text();
const seasons={prev:'2025-2026',cur:'2026-2027',next:'2027-2028'};
let sponsors=[{id:'aaaaaaa1',name:'Thatchers',desc:'Cider partner for the seniors.',logo:{v:'v1',bg:'l',w:480,h:220}},{id:'aaaaaaa2',name:'KPT Timber',club:1,desc:'Local timber merchant backing the club.',logo:{v:'v1',bg:'l',w:520,h:180}},{id:'aaaaaaa3',name:'Vets4Pets',logo:{v:'v1',bg:'l',w:300,h:300}},{id:'aaaaaaa4',name:'Moor Motors',club:1,desc:'Match day partner.',logo:{v:'v1',bg:'l',w:560,h:200}}];
const S1='Ivybridge 1XV',S2='Ivybridge 2nd XV',V='The Vandals';
let P=[{no:'100',name:'Owen Garner',teams:[S1,S2],sids:['aaaaaaa1','aaaaaaa2'],cur:true,team:'11039'},{no:'101',name:'Aaron Williams',teams:[S2],sids:['aaaaaaa2'],cur:true,team:'11063'},{no:'102',name:'Ben Burgess',teams:[V],sids:[],cur:true,team:'11070'},{no:'103',name:'Hamish Harris',teams:[S1,V],sids:[],cur:true,team:'11039'},{no:'104',name:'Zed Rush',teams:[S2],sids:[],cur:true,team:'11063'}];
const T1={team:'11039',name:S1},T2={team:'11063',name:S2},T3={team:'11070',name:V};
const row=p=>({no:p.no,name:p.name,hid:false,teams:p.teams,sponsor:p.sids.map(i=>sponsors.find(s=>s.id===i).name).join(' + '),sponsors:p.sids.map(i=>sponsors.find(s=>s.id===i).name),sids:p.sids,cur:p.cur,team:p.team,n:p.name,own:p.own||'',alt:[]});
let ZED=false;const ALL=(tm)=>({ok:true,team:tm||'',season:'2026-2027',seasons,teams:[T1,T2,T3],sponsors,sponsored:P.filter(p=>p.sids.length).map(row),avail:P.filter(p=>!p.sids.length&&p.cur).map(row).concat(!ZED?[{no:'200',name:'Zed Squad',hid:false,teams:[S1],sponsor:'',sponsors:[],sids:[],cur:false,team:'11039',n:'Zed Squad',own:'',alt:[]}]:[])});
const TEAM={ok:true,teams:[T1,T2],team:'11039',season:'2026-2027',seasons,sponsors,rows:[],tot:{},played:9,squadError:''};
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();const ctxb=await br.newContext({acceptDownloads:true,viewport:{width:1200,height:1000}});const p=await ctxb.newPage();
const posts=[],sp=[];let removeInUse=true;
await p.route('https://x.test/sponsor-players',x=>x.fulfill({contentType:'text/html',body:html}));
await p.route('https://x.test/api/logo/**',x=>{const id=x.request().url().split('/api/logo/')[1].split('?')[0];const nm={aaaaaaa1:'THATCHERS',aaaaaaa2:'KPT TIMBER',aaaaaaa3:'Vets4Pets',aaaaaaa4:'MOOR MOTORS'}[id]||'';const col={aaaaaaa1:'#b8860b',aaaaaaa2:'#2e6b3a',aaaaaaa3:'#c0392b',aaaaaaa4:'#1f4e79'}[id]||'#333';x.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120"><text x="150" y="72" font-family="Arial Black,Arial" font-weight="900" font-size="34" fill="'+col+'" text-anchor="middle">'+nm+'</text></svg>'})});
await p.route('https://x.test/api/sponsor-players**',x=>{const u=new URL(x.request().url());const J=o=>x.fulfill({contentType:'application/json',body:JSON.stringify(o)});if(x.request().method()==='POST'){const b=JSON.parse(x.request().postData());posts.push(b);
 if((b.act==='assign'&&b.nos[0]==='200')||(b.act==='set'&&b.no==='200')){ZED=true;P.push({no:'200',name:'Zed Squad',teams:[S1],sids:[b.s],cur:b.act==='set'?b.cur:true,team:'11039'});return J({ok:true,copied:0,changed:1,marked:0,added:0,missed:0,total:0})}
 if(b.act==='set'){const q=P.find(z=>z.no===b.no);q.sids=[b.s,b.s2].filter(Boolean);q.cur=b.cur;q.own=b.nm}
 if(b.act==='addplayer'){P.push({no:'9912345678',name:b.name,teams:[b.team==='11070'?V:S1],sids:b.s?[b.s]:[],cur:true,team:b.team});return J({ok:true,no:'9912345678'})}
 if(b.act==='removeplayer'){P=P.filter(z=>z.no!==b.no);return J({ok:true})}
 if(b.act==='assign'){let ch=0,full=0;for(const no of b.nos){const q=P.find(z=>z.no===no);if(!b.s){q.sids=q.sids.filter(i=>i!==b.from);ch++}else if(q.sids.includes(b.s)){}else if(q.sids.length>=2)full++;else{q.sids.push(b.s);ch++}}return J({ok:true,changed:ch,full,copied:0})}
 return J({ok:true,copied:0,changed:1,marked:0,added:0,missed:0,total:0})}
 return J(u.searchParams.get('all')==='1'?ALL(u.searchParams.get('team')):TEAM)});
await p.route('https://x.test/api/sponsors',x=>{if(x.request().method()==='GET')return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,items:sponsors,lastBackup:new Date(Date.now()-3*86400000).toISOString()})});const b=JSON.parse(x.request().postData()||'{}');sp.push(b);const J=(o,s)=>x.fulfill({contentType:'application/json',status:s||200,body:JSON.stringify(o)});if(b.act==='rename')sponsors.find(s=>s.id===b.id).name=b.name;if(b.act==='add')sponsors.push({id:'aaaaaaa9',name:b.name});if(b.act==='bulk'){sponsors.push({id:'aaaaaab1',name:'Paste One'});return J({ok:true,added:1,skipped:0})}if(b.act==='remove'&&P.some(z=>z.sids.includes(b.id))&&!b.force)return J({ok:false,error:'in use',inUse:['x'],count:1},409);if(b.act==='remove'){sponsors=sponsors.filter(s=>s.id!==b.id);P.forEach(z=>z.sids=z.sids.filter(i=>i!==b.id))}if(b.act==='backup')return J({ok:true,file:{exported:'2026-11-26T10:00:00Z'}});return J({ok:true})});
await p.goto('https://x.test/sponsor-players');await p.waitForSelector('#ls .pr');
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const q=s=>p.$$eval(s,l=>l.length);const txt=s=>p.$eval(s,e=>e.textContent);const vis=s=>p.$eval(s,e=>!e.hidden&&getComputedStyle(e).display!=='none');
const sp2=[];const t_png_b64='iVBORw0KGgoAAAANSUhEUgAAAHgAAAA8CAYAAACtrX6oAAAApUlEQVR4nO3RMQ0AIADAMPygAPc4Axkko0f/JRt7zUPXeB2AwRiMwZ8yOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjLk0ZG+U4iBknAAAAAElFTkSuQmCC';
await p.route('https://x.test/api/sponsors',x=>{if(x.request().method()!=='POST')return x.fallback();const b=JSON.parse(x.request().postData()||'{}');if(b.act==='add'&&b.club===true){sp2.push(b);sponsors.push({id:'aaaaaaa9',name:b.name,club:1});return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,added:1,items:sponsors})})}if(b.act==='rename'){sp2.push(b);const it=sponsors.find(z=>z.id===b.id);it.name=b.name;return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,items:sponsors})})}if(b.act==='logo'){sp2.push(b);return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,items:sponsors})})}if(b.act==='desc'||b.act==='club'){sp2.push(b);const it=sponsors.find(z=>z.id===b.id);if(b.act==='desc'){if(b.desc)it.desc=b.desc;else delete it.desc}else{if(b.on)it.club=1;else delete it.club}return x.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,items:sponsors})})}return x.fallback()});
// Players tab: no club section
c('Club section hidden on the Players tab',!(await vis('#cl')));
await p.click('#t2');await p.waitForTimeout(300);
c('Club section shows on the Sponsors tab',await vis('#cl'));
c('lists the two club sponsors as slim rows with logos',await q('#cl .k4')===2&&/KPT Timber/.test(await txt('#cl'))&&/Moor Motors/.test(await txt('#cl'))&&await q('#cl .k4 img')===2);
c('rows start closed: no description boxes yet',await q('#cl textarea')===0);
c('KPT Timber says it also sponsors 2 players, Moor Motors does not',/Also sponsors 2 players/.test(await txt('#cl'))&&(await p.$$eval('#cl .tg3',l=>l.length))===1);
c('a one-line preview of the description is shown',/Local timber merchant backing the club\./.test(await p.$eval('#cl [data-ck="aaaaaaa2"] .pv',e=>e.textContent)));
await p.click('#cl [data-ck="aaaaaaa2"]');
c('Edit opens the row with the description and the logo controls',await p.$eval('#cl textarea[data-d="aaaaaaa2"]',e=>e.value)==='Local timber merchant backing the club.'&&await q('#cl [data-a=lgbg]')===3&&await q('#cl [data-a=lgup]')===1&&await q('#cl [data-cx="aaaaaaa2"]')===1);
c('the row shows the logo size and the dark and light previews',/520 x 180 px/.test(await txt('#cl'))&&await q('#cl .lgt')===2);
await p.click('#cl [data-ck="aaaaaaa4"]');
c('only one row is open at a time',await q('#cl textarea')===1&&await q('#cl textarea[data-d="aaaaaaa4"]')===1);
c('an open row has a Name box with the current name',await p.$eval('#cl [data-rn="aaaaaaa4"]',e=>e.value)==='Moor Motors');
sp2.length=0;await p.fill('#cl [data-rn="aaaaaaa4"]','Moor Motors Ltd');await p.click('#cl [data-rnb="aaaaaaa4"]');await p.waitForTimeout(400);
c('Save name posts a rename and the new name shows everywhere',sp2.some(b=>b.act==='rename'&&b.id==='aaaaaaa4'&&b.name==='Moor Motors Ltd')&&/Moor Motors Ltd/.test(await txt('#cl'))&&/Moor Motors Ltd/.test(await txt('#ls')),JSON.stringify(sp2));
sp2.length=0;await p.fill('#cl [data-rn="aaaaaaa4"]','   ');await p.click('#cl [data-rnb="aaaaaaa4"]');
c('an empty name is refused',/Type the sponsor/.test(await txt('#ms'))&&!sp2.length);
await p.click('#cl [data-ck="aaaaaaa4"]');
c('Close shuts it',await q('#cl textarea')===0);
c('the Looks best on choice posts from inside the row',await(async()=>{await p.click('#cl [data-ck="aaaaaaa2"]');sp2.length=0;await p.click('#cl [data-a=lgbg][data-b=d]');await p.waitForTimeout(300);return true})());
await p.click('#cl [data-ck="aaaaaaa2"]');
c('the section has no way to add or change a player',!(await q('#cl [data-act],#cl #adpl,#cl [data-rmp]')));
c('only sponsors not yet in the section can be added',await p.$$eval('#cas option',l=>l.map(o=>o.textContent).join('|'))==='Or choose one of your sponsors|Thatchers|Vets4Pets');
c('list tags the club sponsors',await p.$$eval('#ls .pr',l=>l.filter(r=>/Club sponsor/.test(r.textContent)).map(r=>r.querySelector('.pn b').textContent).join())==='KPT Timber,Moor Motors Ltd');
c('No players chip leaves out club-only sponsors',/No players 1/.test(await txt('#ch')),await txt('#ch'));
await p.click('#ch [data-sf=nop]');c('No players lists Vets4Pets only',(await p.$$eval('#ls .pr .pn b',l=>l.map(b=>b.textContent))).join()==='Vets4Pets');
await p.click('#ch [data-sf=all]');
// add / remove club sponsor
await p.selectOption('#cas','aaaaaaa3');await p.click('#cab');await p.waitForTimeout(400);
c('Add club sponsor posts club on',sp2.some(b=>b.act==='club'&&b.id==='aaaaaaa3'&&b.on===true),JSON.stringify(sp2));
c('Vets4Pets joins the section and its row opens ready for a logo',await q('#cl .k4')===3&&await q('#cl textarea[data-d="aaaaaaa3"]')===1&&await q('#cl [data-a=lgup]')===1&&/Club sponsors/.test(await txt('#cl h3')));
c('choosing nothing asks first',(await(async()=>{await p.selectOption('#cas','');sp2.length=0;await p.click('#cab');return /Choose a sponsor/.test(await txt('#ms'))&&!sp2.length})()));
await p.click('#cl [data-cx="aaaaaaa3"]');await p.waitForTimeout(400);
c('Remove from this section posts club off and keeps the sponsor',sp2.some(b=>b.act==='club'&&b.id==='aaaaaaa3'&&b.on===false)&&await q('#cl .k4')===2&&/Vets4Pets/.test(await txt('#ls')));
// edit description in the section
await p.click('#cl [data-ck="aaaaaaa4"]');sp2.length=0;await p.fill('#cl textarea[data-d="aaaaaaa4"]','Our match day partner for 2026-27.');
c('character count follows typing',/^34$/.test(await p.$eval('#cl [data-c="aaaaaaa4"]',e=>e.textContent)),await p.$eval('#cl [data-c="aaaaaaa4"]',e=>e.textContent));
await p.press('#cl textarea[data-d="aaaaaaa4"]','Tab');await p.waitForTimeout(400);
c('description saved when you leave the box',sp2.some(b=>b.act==='desc'&&b.id==='aaaaaaa4'&&b.desc==='Our match day partner for 2026-27.'),JSON.stringify(sp2));
c('saved message shown',/Description saved/.test(await txt('#ms')));
// sponsor panel
await p.click('#ls .pr[data-go="s:aaaaaaa1"] .pn');
c('sponsor panel has a description box with the text',await p.$eval('#sdesc',e=>e.value)==='Cider partner for the seniors.');
c('box is limited to 300 characters',await p.$eval('#sdesc',e=>e.maxLength)===300);
sp2.length=0;await p.fill('#sdesc','');await p.press('#sdesc','Tab');await p.waitForTimeout(400);
c('clearing it posts an empty description',sp2.some(b=>b.act==='desc'&&b.id==='aaaaaaa1'&&b.desc===''),JSON.stringify(sp2));
c('the panel still has its players and logo block',/Owen Garner/.test(await txt('#det'))&&/Logo/.test(await txt('#det')));
// brand-new club sponsor typed into the section
sp2.length=0;await p.click('#cnb');c('empty name asks first',/Type the sponsor/.test(await txt('#ms'))&&!sp2.length);
await p.fill('#cnn','Dart Dental');await p.click('#cnb');await p.waitForTimeout(500);
c('Add new club sponsor posts add with club on',sp2.some(b=>b.act==='add'&&b.name==='Dart Dental'&&b.club===true),JSON.stringify(sp2));
c('new sponsor appears in the section, open and ready for its logo',/Dart Dental/.test(await txt('#cl'))&&await q('#cl textarea[data-d="aaaaaaa9"]')===1);
{const pngc=Buffer.from(t_png_b64,'base64');sp2.length=0;await p.setInputFiles('#lgfc',{name:'a.png',mimeType:'image/png',buffer:pngc});await p.waitForSelector('#cl button[data-a=lgsave]',{timeout:8000}).catch(()=>{});
c('choosing a logo inside the club row shows the preview and Save logo',await q('#cl button[data-a=lgsave]')===1,(await txt('#cl')).slice(-200));
if(await q('#cl button[data-a=lgsave]')===1){await p.click('#cl button[data-a=lgsave]');await p.waitForTimeout(500)}
c('Save logo from the club row posts the logo for that sponsor',sp2.some(b=>b.act==='logo'&&b.id==='aaaaaaa9'&&b.data&&b.w>0),JSON.stringify(sp2).slice(0,160))}
// sponsor panel button to add to Club sponsors
await p.click('#t2');await p.waitForTimeout(300);await p.click('#ls .pr[data-go="s:aaaaaaa1"] .pn');await p.waitForTimeout(300);
c('panel offers Add to Club sponsors for a sponsor that is not one',await q('#det [data-cadd="aaaaaaa1"]')===1);
sp2.length=0;await p.click('#det [data-cadd="aaaaaaa1"]');await p.waitForTimeout(400);
c('button posts club on and the sponsor joins the section',sp2.some(b=>b.act==='club'&&b.id==='aaaaaaa1'&&b.on===true)&&/Thatchers/.test(await txt('#cl')));
c('panel then offers Remove from Club sponsors',await q('#det [data-cx="aaaaaaa1"]')===1&&/Club sponsor/.test(await txt('#det')));
await p.click('#det [data-cx="aaaaaaa1"]');await p.waitForTimeout(400);
// logo upload (broken since v3.73.0: the page forgot which sponsor it was for)
await p.click('#t2');await p.waitForTimeout(300);await p.click('#ls .pr[data-go="s:aaaaaaa3"] .pn');await p.waitForTimeout(300);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAHgAAAA8CAYAAACtrX6oAAAApUlEQVR4nO3RMQ0AIADAMPygAPc4Axkko0f/JRt7zUPXeB2AwRiMwZ8yOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjDI4zOM7gOIPjLk0ZG+U4iBknAAAAAElFTkSuQmCC','base64');
sp2.length=0;await p.setInputFiles('#lgf',{name:'a.png',mimeType:'image/png',buffer:png});
await p.waitForSelector('#det button[data-a=lgsave]',{timeout:8000}).catch(()=>{});
c('choosing a logo file shows the preview and a Save logo button',await q('#det button[data-a=lgsave]')===1,(await txt('#det')).slice(0,200));
if(await q('#det button[data-a=lgsave]')===1){await p.click('#det button[data-a=lgsave]');await p.waitForTimeout(500)}
c('Save logo posts the logo for that sponsor',sp2.some(b=>b.act==='logo'&&b.id==='aaaaaaa3'&&b.data&&b.w>0),JSON.stringify(sp2).slice(0,200));
// player panel read only
await p.click('#t1');await p.waitForTimeout(300);await p.click('#ch [data-f=has]');await p.click('#ls .pr[data-go="p:100"] .pn');
c('club section not on the player page',!(await vis('#cl')));
const pd=await txt('#det');
c('player panel shows KPT Timber description read-only with the club note',/KPT Timber/.test(pd)&&/Local timber merchant backing the club\./.test(pd)&&/also sponsors the club/i.test(pd)&&!(await q('#det textarea')));
c('Thatchers has no description now, so only one block',await q('#det .ds3')===1);
// server side
const O2='https://thestatsboard.co.uk';
const J2=async(b)=>{const r=await w.fetch(new Request(O2+'/api/sponsors',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(b)}),env,cx);return r.json()};
store.sponsors=JSON.stringify({v:1,items:[{id:'aaaaaaa1',name:'Thatchers'},{id:'aaaaaaa2',name:'KPT Timber'}]});
let j=await J2({act:'desc',id:'aaaaaaa1',desc:'  Hello   <b>there</b>\n friends '});
c('API: description is cleaned and saved',j.ok&&j.items.find(x=>x.id==='aaaaaaa1').desc==='Hello b there /b friends',JSON.stringify(j));
j=await J2({act:'desc',id:'aaaaaaa1',desc:'x'.repeat(500)});c('API: description cut at 300',j.items.find(x=>x.id==='aaaaaaa1').desc.length===300);
j=await J2({act:'club',id:'aaaaaaa2',on:true});c('API: club on',j.ok&&j.items.find(x=>x.id==='aaaaaaa2').club===1);
j=await J2({act:'add',name:'Brand New Club Co',club:true});c('API: add with club creates a club sponsor',j.ok&&j.items.find(x=>x.name==='Brand New Club Co').club===1);j=await J2({act:'add',name:'Plain Co'});c('API: plain add is not a club sponsor',j.ok&&!j.items.find(x=>x.name==='Plain Co').club);j=await J2({act:'club',id:'zzzzzzzz',on:true});c('API: unknown sponsor refused',!j.ok);
let b0=await J2({act:'backup'});const f0=b0.file;
c('API: backup carries club and descriptions',b0.ok&&f0.sponsors.find(x=>x.id==='aaaaaaa2').club===1&&f0.sponsors.find(x=>x.id==='aaaaaaa1').desc.length===300);
store.sponsors=JSON.stringify({v:1,items:[{id:'aaaaaaa1',name:'Thatchers'}]});
const rs=await J2({act:'restore',file:f0,confirm:true});
const back=JSON.parse(store.sponsors).items;
c('API: restore brings them back',rs.ok&&back.find(x=>x.id==='aaaaaaa2')&&back.find(x=>x.id==='aaaaaaa2').club===1&&back.find(x=>x.id==='aaaaaaa1').desc.length===300,JSON.stringify(rs).slice(0,200));
j=await J2({act:'club',id:'aaaaaaa2',on:false});c('API: club off clears it, name and others stay',j.ok&&!j.items.find(x=>x.id==='aaaaaaa2').club&&j.items.length===4);
j=await J2({act:'desc',id:'aaaaaaa1',desc:''});c('API: empty description removes it',!('desc' in j.items.find(x=>x.id==='aaaaaaa1')));
c('no page errors',!errs.length,errs.join('|'));
console.log(ok+' pass, '+bad+' fail');await br.close();
