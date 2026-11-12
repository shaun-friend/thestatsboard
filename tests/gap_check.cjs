const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [w,h] of [[1920,1080],[1280,720],[1366,768]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.route('https://x.test/m',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('w/dir_tv.html','utf8')}));
await p.goto('https://x.test/m');await p.waitForTimeout(400);
const m=await p.evaluate(()=>{const u=document.querySelector('.upd'),s=document.getElementById('sbv');return {gap:Math.round(s.getBoundingClientRect().top-u.getBoundingClientRect().bottom)}});
const ok=m.gap>=8;console.log(w+'x'+h,JSON.stringify(m),ok?'ok':'TOO TIGHT');if(!ok)bad++;await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
