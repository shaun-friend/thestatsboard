// v3.28.4: in the Outside calls chart every column's bar-bottom and label sit on one line, even with web calls in some bars
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const api=JSON.parse(fs.readFileSync(__dirname+'/w/usage_api.json','utf8'));const a=JSON.parse(JSON.stringify(api[1]||api[7]));let bad=0;
 a.days=1;a.speed=a.speed||{};a.speed.day=[];for(let h=0;h<=23;h++){const k='2026-11-14 '+String(h).padStart(2,'0')+':00:00';a.speed.day.push({d:k,src:'RFU results feed',n:90+h});a.speed.day.push({d:k,src:'Weather forecast',n:3});if(h===15||h===10)a.speed.day.push({d:k,src:'RFU web page',n:4})}
 const b=await chromium.launch();
 for(const w of [390,1200]){
  const p=await b.newPage({viewport:{width:w,height:900}});p.on('pageerror',e=>{console.log('PAGEERROR',e.message);bad++});
  await p.route('https://x.test/usage',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(__dirname+'/w/usage_page.html','utf8')}));
  await p.route('**/api/usage*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(a)}));
  await p.goto('https://x.test/usage',{waitUntil:'load'});await p.waitForTimeout(600);
  const m=await p.evaluate(()=>{const c=[...document.querySelectorAll('.cd')].find(x=>/Outside calls per/.test(x.querySelector('h2').textContent));const cols=[...c.querySelectorAll('.col')];
   return {n:cols.length,labelTops:[...new Set(cols.map(x=>Math.round(x.querySelector('.bl').getBoundingClientRect().top)))],webRows:[...new Set(cols.map(x=>Math.round(x.lastElementChild.getBoundingClientRect().height)))],lab:cols.slice(0,3).map(x=>x.querySelector('.bl').textContent)}});
  const ok=m.n>0&&m.labelTops.length===1&&m.webRows.length===1;console.log(w,ok?'aligned':'NOT ALIGNED',JSON.stringify(m));if(!ok)bad++;
  if(w===390){const el=await p.$('.cd:has(h2:text("Outside calls"))');await el.screenshot({path:__dirname+'/w/usage_align_phone.png'})}
  await p.close()}
 await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
