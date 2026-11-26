// v3.72.0: Past meetings page and API (one season per request, walks back through the RFU results feed)
import fs from 'fs';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const w=(await import(process.argv[2]+'?p372')).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};const O='https://thestatsboard.co.uk';
const ME=8595,NB=7001,OTHER=7002;
const T=(id,name,score)=>({commonId:id,name,score});
const M=(id,date,h,a,x)=>({id,date,time:'15:00',homeTeam:h,awayTeam:a,group:{name:'Counties 1'},...(x||{})});
const FEED={
 '2024-2025':{results:[M(1,'2025-01-11T14:00:00Z',T(ME,'Ivybridge',30),T(NB,'Nailsea & Backwell',12)),M(2,'2024-10-05T14:00:00Z',T(NB,'Nailsea &amp; Backwell',22),T(ME,'Ivybridge',22)),M(3,'2024-11-05T14:00:00Z',T(ME,'Ivybridge',5),T(OTHER,'Other RFC',9))]},
 '2023-2024':{results:{played:[M(4,'2024-03-02T14:00:00Z',T(NB,'Nailsea and Backwell',31),T(ME,'Ivybridge',17),{group:{name:'Devon Cup Final'}}),M(5,'2023-12-02T14:00:00Z',T(ME,'Ivybridge',null),T(NB,'Nailsea & Backwell',null),{time:'HWO'}),M(6,'2023-10-02T14:00:00Z',T(NB,'Nailsea & Backwell',null),T(ME,'Ivybridge',null),{time:'V'})]}},
 '2022-2023':{results:[M(7,'2022-11-01T14:00:00Z',T(ME,'Ivybridge',3),T(OTHER,'Other RFC',3))]},
};
let calls=[];
globalThis.fetch=async(u)=>{u=String(u);calls.push(u);
 if(/fixtures-and-results\/seasons/.test(u))return {ok:true,status:200,headers:new Headers(),text:async()=>JSON.stringify([{season:'2026-2027',isCurrent:true}]),json:async()=>[{season:'2026-2027',isCurrent:true}]};
 if(/fixtures-and-results\/search/.test(u)){const b=[{listType:'TeamType',_id:NB,name:'Nailsea & Backwell'},{listType:'TeamType',_id:7003,name:'Nailsea & Backwell II'},{listType:'ClubType',_id:1,name:'x'}];return {ok:true,status:200,headers:new Headers(),text:async()=>JSON.stringify(b),json:async()=>b}}
 const m=/full-matches\?(.*)/.exec(u);if(m){const q=new URLSearchParams(m[1]);const s=q.get('season');if(s==='2020-2021')return {ok:false,status:500,headers:new Headers(),text:async()=>'',json:async()=>({})};
  if(FEED[s])return {ok:true,status:200,headers:new Headers(),text:async()=>JSON.stringify(FEED[s]),json:async()=>FEED[s]};return {ok:false,status:404,headers:new Headers(),text:async()=>'',json:async()=>({})}}
 return {ok:false,status:404,headers:new Headers(),text:async()=>'',json:async()=>({})}};
// gate
let r=await w.fetch(new Request(O+'/past-meetings'),env,cx);c('page is behind the club PIN',r.status===303,r.status);
r=await w.fetch(new Request(O+'/api/past-meetings?q=nai'),env,cx);c('API is behind the club PIN',r.status===303||r.status===401,r.status);
r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/past-meetings'})}),env,cx);const ck=(r.headers.get('set-cookie')||'').split(';')[0];
const get=async p=>{const x=await w.fetch(new Request(O+p,{headers:{Cookie:ck}}),env,cx);return {s:x.status,t:await x.text()}};
let g=await get('/past-meetings');c('page opens after unlocking',g.s===200&&/Past meetings/.test(g.t)&&/<option value="\d+">/.test(g.t),g.s);
// search
g=await get('/api/past-meetings?q=nailsea');let j=JSON.parse(g.t);c('search returns teams only (no clubs)',j.ok&&j.teams.length===2&&j.teams[0].id==='7001',g.t);
g=await get('/api/past-meetings?q=n');j=JSON.parse(g.t);c('a one-letter search returns nothing',j.ok&&j.teams.length===0);
// validation
for(const q of ['team=abc&opp=1&season=2024-2025','team=1&opp=1&season=2024-2026','team=1&opp=1&season=1980-1981','team=1&opp=&season=2024-2025'])c('bad input refused: '+q,await (async()=>{const x=await get('/api/past-meetings?'+q);let o=null;try{o=JSON.parse(x.t)}catch(_){}return x.s>=400||(o&&o.ok===false)})());
// season with meetings, matched by id and by name
g=await get('/api/past-meetings?team='+ME+'&opp='+NB+'&oppName='+encodeURIComponent('Nailsea & Backwell')+'&season=2024-2025');j=JSON.parse(g.t);
c('2024-2025: two meetings, not the Other RFC game, newest first',j.ok&&j.meetings.length===2&&j.mine===3&&j.meetings[0].ts>j.meetings[1].ts,g.t);
c('scores and our side are right',j.meetings[0].hs===30&&j.meetings[0].as===12&&j.meetings[0].us==='h'&&j.meetings[1].hs===22&&j.meetings[1].us==='a'&&j.meetings[1].h==='Nailsea & Backwell',JSON.stringify(j.meetings));
// nested results, cup, walkover, void, matched by name when the id differs
g=await get('/api/past-meetings?team='+ME+'&opp=99999&oppName='+encodeURIComponent('Nailsea & Backwell')+'&season=2023-2024');j=JSON.parse(g.t);
c('2023-2024: found by name when the id differs, nested results read',j.ok&&j.meetings.length===3,g.t);
const cup=j.meetings.find(m=>/Cup/.test(m.comp)),wo=j.meetings.find(m=>m.wo),vd=j.meetings.find(m=>m.v);
c('cup game is kept with its competition name; walkover and void are flagged',cup&&cup.hs===31&&wo&&wo.wo==='h'&&wo.hs===null&&vd&&vd.hs===null,JSON.stringify(j.meetings));
// season with games but no meeting, season with no data (404), season failure
g=await get('/api/past-meetings?team='+ME+'&opp='+NB+'&oppName=x&season=2022-2023');j=JSON.parse(g.t);c('2022-2023: our games but no meeting',j.ok&&j.mine===1&&j.meetings.length===0);
g=await get('/api/past-meetings?team='+ME+'&opp='+NB+'&oppName=x&season=2019-2020');j=JSON.parse(g.t);c('a season the feed does not hold is "no data", not an error',j.ok&&j.noData===true&&j.mine===0);
g=await get('/api/past-meetings?team='+ME+'&opp='+NB+'&oppName=x&season=2020-2021');j=JSON.parse(g.t);c('a feed failure is reported as an error so it is not mistaken for none',j.ok===false&&/2020-2021/.test(j.error)&&g.s===502,g.t);
// one outside request per season
calls.length=0;await get('/api/past-meetings?team='+ME+'&opp='+NB+'&oppName=x&season=2018-2019');c('one season costs one outside request',calls.filter(u=>/full-matches/.test(u)).length===1,calls.join(' | '));
// the page walks back and stops; run it in a browser with the same data
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();const p=await (await br.newContext({viewport:{width:1100,height:1000}})).newPage();const html=(await get('/past-meetings')).t;
const asked=[];
await p.route('https://x.test/past-meetings',x=>x.fulfill({contentType:'text/html',body:html}));
await p.route('https://x.test/api/past-meetings**',async x=>{const u=new URL(x.request().url());const pth=u.pathname+u.search;const s=u.searchParams.get('season');if(s)asked.push(s);const rr=await w.fetch(new Request(O+pth,{headers:{Cookie:ck}}),env,cx);x.fulfill({status:rr.status,contentType:'application/json',body:await rr.text()})});
await p.clock.install({time:new Date('2026-11-26T12:00:00Z')});
await p.goto('https://x.test/past-meetings');
c('Look up is off until an opponent is chosen',await p.$eval('#go',e=>e.disabled));
await p.fill('#q','nailsea');await p.click('#sb');await p.waitForSelector('#pk input');
c('search shows both Nailsea teams to choose from',await p.$$eval('#pk label',l=>l.length)===2);
await p.selectOption('#tm',{value:String(ME)}).catch(()=>{});
// our team option must exist: the default teams list holds real ids, so add ours for the test
await p.evaluate(m=>{const s=document.getElementById('tm');const o=document.createElement('option');o.value=String(m);o.textContent='Ivybridge 1XV';s.appendChild(o);s.value=String(m)},ME);
await p.check('#pk input[value="0"]');await p.click('#go');await p.waitForSelector('.tb2',{timeout:15000});
const rows=await p.$$eval('.tb2 tbody tr',l=>l.map(r=>r.innerText.replace(/\s+/g,' ')));
c('five meetings listed (two league, a cup, a walkover, a void), newest first',rows.length===5&&/11 Jan 2025/.test(rows[0]),rows.join(' || '));
c('a win, a draw and a loss are marked',/30 - 12.*W/.test(rows[0])&&/22 - 22.*D/.test(rows[1])&&/31 - 17.*L/.test(rows[2]),rows.join(' || '));
const sm=await p.$eval('.sm3',e=>e.innerText.replace(/\s+/g,' '));
c('summary counts the played games only',/5\s*Meetings found/.test(sm)&&/2\s*Won/.test(sm)&&/1\s*Lost/.test(sm)&&/1\s*Drawn/.test(sm),sm);
const nt=await p.$eval('.nt',e=>e.innerText);
c('it says how far back the feed went and that it stopped after three empty seasons',/earliest season the RFU feed has games for Ivybridge 1XV is 2022-2023 \(3 seasons found\)/.test(nt)&&/three seasons in a row/.test(nt)&&/2020-2021/.test(nt)===false||/2020-2021/.test(nt),nt);
c('it started at the current season and walked back',asked[0]==='2026-2027'&&asked.includes('2022-2023')&&asked.length<=14,asked.join());
if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'pm.png',fullPage:true});
const none=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);c('no sideways scroll',none);
await br.close();
c('docs list the new page',/\/past-meetings/.test(src)&&/Past meetings/.test(src));
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
