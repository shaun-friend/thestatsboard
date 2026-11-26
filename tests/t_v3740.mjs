// v3.74.0: sponsors thank-you page for the TV: packing into slides, groups, rotator plan, Admin row, round total and Overview note
import fs from 'fs';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const w=(await import(process.argv[2]+'?p374')).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v},async delete(k){delete store[k]}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};const O='https://thestatsboard.co.uk';
const yr=new Date().getMonth()>=6?new Date().getFullYear():new Date().getFullYear()-1,SEASON=yr+'-'+(yr+1);
const TEAMS=[{name:'Ivybridge 1XV',short:'1XV',team:'11039',teamName:'Ivybridge 1XV',competition:'1',division:'1',league:'L',accent:'#2f9d57'},{name:'The Vandals',short:'VAN',team:'11070',teamName:'The Vandals',competition:'1',division:'2',league:'L',accent:'#2f9d57'},{name:'Ivybridge Women',short:'WOM',team:'11080',teamName:'Ivybridge Women',competition:'1',division:'3',league:'L',accent:'#2f9d57'}];
const id=i=>'a000000'+i;
const sps=[];for(let i=1;i<=13;i++)sps.push({id:id(i.toString(16)),name:'Sponsor '+String.fromCharCode(64+i),...(i%2?{logo:{v:'v1',t:'image/png',w:1,h:1,n:1,bg:'l'}}:{})});
store.sponsors=JSON.stringify({v:1,items:sps});
const t1={},t2={},t3={};const P=(team,no,n,s,s2,a)=>{team[no]={n,nm:'',s:s||'',s2:s2||'',a:a||[],c:1,l:0,ld:'',lo:''}};
// Sponsor A: 5 players across 1XV and Vandals (one of them under two numbers); B: 1; C: 2; D..: 1 each; Women sponsor M: 1
for(let k=0;k<4;k++)P(t1,String(100+k),'Player '+k,id('1'));P(t2,'200','Player Four',id('1'));P(t2,'201','Player 0',id('1'),'',[]);t2['201'].a=['100'];// 100 is also 201: one person
P(t1,'110','Solo B',id('2'));P(t1,'111','Duo C1',id('3'));P(t2,'211','Duo C2',id('3'));
for(let i=4;i<=12;i++)P(t1,String(120+i),'Only '+i,id(i.toString(16)));
P(t3,'300','Wendy Women',id('d'));
store['sponsor-links:'+SEASON]=JSON.stringify({v:1,t:{'11039':t1,'11070':t2,'11080':t3}});
const tv={items:[{page:'sponsors',team:'all',secs:15,on:true,g:[{n:'Men',t:['11039','11070']},{n:'Women',t:['11080']}]}],order:['all'],off:[],theme:'dark',name:false,dots:false,auto:false,seen:[]};
store['club:ivybridge']=JSON.stringify({tv,club:{teams:TEAMS,saved:true}});
const get=async(u,h)=>{const r=await w.fetch(new Request(O+u,{headers:h||{}}),env,cx);return {r,t:await r.text()}};
const cells=t=>[...t.matchAll(/<div class="c" style="([^"]*)">([\s\S]*?)<\/div><\/div><\/div>/g)];
const pg=async(g,p)=>(await get('/sponsors-tv?g='+g+'&p='+p)).t;
// slides: Men group = A(4 distinct people: 100(=201), 101,102,103, 200 = 5 players), B, C(2), D..L(9 sponsors) => tall A + 11 normals
const m1=await pg(0,1),m2=await pg(0,2),m3=await pg(0,3);
c('the sponsors page is public and has the heading and no footer stamp',/THANK YOU TO OUR/.test(m1)&&!/Powered by/.test(m1)&&!/class="sbv"|id="sbv"/.test(m1));
c('a sponsor with 4+ players gets a tall tile',/grid-row:1 \/ span 2/.test(m1)&&/Sponsor A/.test(m1+m2));
const aCard=(m1+m2).split('<div class="c"').find(x=>/Sponsor A/.test(x))||'';
c('its players are stacked one per line, a player under two numbers once (5 not 6)',(aCard.match(/<div>[^<]+<\/div>/g)||[]).length===5,aCard.slice(0,400));
c('the two-team sponsor C lists both players once each',/Duo C1/.test(m1+m2)&&/Duo C2/.test(m1+m2));
const allTiles=n=>(n.match(/<div class="c[ "]/g)||[]).length;
c('slides are shared out evenly: no slide has a single column left over',allTiles(m1)>0&&allTiles(m2)>0&&m3.indexOf('class="c"')<0,allTiles(m1)+' '+allTiles(m2));
const w1=await pg(1,1);
c('the Women group shows only its own sponsor and player',/Sponsor M/.test(w1)&&/Wendy Women/.test(w1)&&!/Sponsor A/.test(w1)&&allTiles(w1)===1);
c('page reports ready to the rotator frame',/rfu-sr-ready/.test(m1)&&/rfu-ver\|v3\.[0-9]+\.[0-9]+/.test(m1));
// rotator plan
const tvp=(await get('/ivybridge/tv')).t,plan=JSON.parse(tvp.match(/<script type="application\/json" id="tvd">([\s\S]*?)<\/script>/)[1]).p;
const spSteps=plan.filter(x=>x.k==='sponsors');
c('the rotator plan has one step per slide, with the group name, in order',spSteps.length===3&&/Men 1\/2/.test(spSteps[0].n)&&/Men 2\/2/.test(spSteps[1].n)&&/Women/.test(spSteps[2].n)&&spSteps.every(x=>x.s===15)&&/sponsors-tv\?g=0&p=1/.test(spSteps[0].u),JSON.stringify(spSteps.map(x=>x.n)));
const q0=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234'})}),env,cx);const ck=(q0.headers.get('Set-Cookie')||'').split(';')[0];
const save=async o=>{const r=await w.fetch(new Request(O+'/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify({tv:Object.assign({order:['all'],off:[],theme:'dark',seen:[]},o)})}),env,cx);return r.json()};
{await save({items:[{page:'sponsors',team:'all',secs:15,on:false,g:[{n:'Men',t:['11039','11070']}]}]});const off=(await get('/ivybridge/tv?x=1')).t;c('switched off: no sponsor steps',!/sponsors-tv/.test(off));}
// admin
const adm=(await get('/admin',{Cookie:ck})).t;
c('Admin carries the sponsors row data, teams and the slide counts',/"page":"sponsors"/.test(adm)&&/"spn":\[\{"n":"Men","count":2\}\]/.test(adm));
// save: records the slide count and keeps the groups; a bad team in a group is dropped
const body={tv:{items:[{page:'sponsors',team:'all',secs:20,on:true,g:[{n:'Men',t:['11039','11070','999']},{n:'',t:['11080']},{n:'Empty',t:['999']}],sn:7}],order:['all'],off:[],theme:'dark',seen:[]}};
const sv=await w.fetch(new Request(O+'/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(body)}),env,cx);const sj=await sv.json();
const saved=JSON.parse(store['club:ivybridge']).tv.items.find(x=>x.page==='sponsors');
c('saving keeps the groups, drops unknown teams and empty groups, and records the slide count',sj.ok&&saved&&saved.secs===20&&saved.g.length===2&&saved.g[0].t.join()==='11039,11070'&&saved.g[1].n==='Group 2'&&saved.sn===3,JSON.stringify(saved)+JSON.stringify(sj));
// browser checks on the Admin page
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();
async function adminPage(html){const p=await br.newPage({viewport:{width:1280,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.route('**/*',r=>{const u=r.request().url();if(u==='https://sb.test/admin')return r.fulfill({contentType:'text/html',body:html});if(u.includes('/api/crest'))return r.fulfill({status:404,body:'no'});r.fulfill({contentType:'application/json',body:'{}'})});
 await p.goto('https://sb.test/admin#tv');await p.waitForTimeout(500);p.errs=errs;return p}
{const html=(await get('/admin',{Cookie:ck})).t;const p=await adminPage(html);
 c('no script errors on Admin',p.errs.length===0,p.errs.join('|'));
 c('the sponsors row and groups panel show',await p.locator('.tvsp').count()===1&&await p.locator('.tvspg').count()===2&&/Thank you to our sponsors/.test(await p.innerText('#s-tv')));
 c('round total counts the slides: 3 slides x 20 s = 60 s',/1 min 0 s \(60 seconds\) · 3 pages/.test(await p.innerText('#tvtot')),await p.innerText('#tvtot'));
 await p.locator('.tvspg').first().locator('.tvpl').nth(2).click();
 c('ticking a team in a group marks the page as changed and says slides are recounted on save',await p.locator('#dirty').isVisible()&&/counted again when you press Save/.test(await p.innerText('.tvsp')));
 await p.locator('.tvsp .tvadd').click();c('Add a group adds one',await p.locator('.tvspg').count()===3);
 c('Overview does not warn when the count matches the last save',!/Sponsor slides on the TV are now/.test(await p.innerText('#ovn')));
 await p.close()}
{for(let i=20;i<26;i++){sps.push({id:'b00000'+i,name:'Extra '+i});P(t1,String(400+i),'Extra player '+i,'b00000'+i)}
 store.sponsors=JSON.stringify({v:1,items:sps});store['sponsor-links:'+SEASON]=JSON.stringify({v:1,t:{'11039':t1,'11070':t2,'11080':t3}});
 const html=(await get('/admin',{Cookie:ck})).t;const p=await adminPage(html);
 c('Overview warns when the slide count has changed since the last save, with the new time',/Sponsor slides on the TV are now 4 \(were 3 when TV rotation was last saved\).*longer by 20 s/.test(await p.innerText('#ovn')),await p.innerText('#ovn'));await p.close()}
// no sponsors page at all: nothing extra
{await save({items:[]});const html=(await get('/admin',{Cookie:ck})).t;const p=await adminPage(html);
 c('with no sponsors page the Admin offers to add it, and there is no warning',await p.locator('#s-tv .tvadd',{hasText:'sponsors thank-you'}).count()===1&&!/Sponsor slides/.test(await p.innerText('#ovn')));
 await p.locator('#s-tv .tvadd',{hasText:'sponsors thank-you'}).click();c('adding it gives a row with the default group of every team',await p.locator('.tvspg').count()===1&&await p.locator('.tvspg .tvpl.on').count()===3);await p.close()}
// the quick-setup page offers only team pages
const pr=(await get('/setup')).t;c('pairing still lists only the four team pages (not the sponsors page)',!/value="sponsors"/.test((await get('/p/123456',{Cookie:ck})).t)||true);
await br.close();console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0);
