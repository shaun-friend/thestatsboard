const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [w,h] of [[1366,650],[1280,650],[1440,700]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.addInitScript(()=>{const r=n=>({team:String(1000+n),name:['Ivybridge 1XV','Ivybridge Women','Ivybridge U18s'][n],competition:'1699',division:'75791',season:'2026-2027',league:'Counties 1 Devon'});localStorage.setItem('statsBoardRecent',JSON.stringify([0,1,2].map(r)))});
await p.route('https://x.test/m',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('w/welcome_b.html','utf8')}));
await p.goto('https://x.test/m');await p.waitForTimeout(400);
const m=await p.evaluate(()=>({sh:document.documentElement.scrollHeight,vh:innerHeight,rec:document.querySelectorAll('.recrow').length}));
const ok=m.rec===3&&m.sh<=m.vh+1;console.log(w+'x'+h,JSON.stringify(m),ok?'ok':'SCROLLS');if(!ok)bad++;await p.close()}
// new visitor still sees the full intro
const p=await b.newPage({viewport:{width:1366,height:650}});await p.route('https://x.test/m',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('w/welcome_b.html','utf8')}));await p.goto('https://x.test/m');
const full=await p.evaluate(()=>[...document.querySelectorAll('#intro p')].every(e=>getComputedStyle(e).display!=='none'));console.log('new visitor full intro',full);if(!full)bad++;
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
