const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [w,h] of [[2576,858],[2576,923],[1920,1080],[1366,768],[1280,720],[1024,600]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.setContent(fs.readFileSync(process.argv[2]||'w/ly_next.html','utf8'),{waitUntil:'load'});await p.waitForTimeout(3000);
 const m=await p.evaluate(()=>{let c=0,t=0;document.querySelectorAll('.cnx,.cls').forEach(e=>{if(e.scrollHeight>e.clientHeight+1)c++});
  document.querySelectorAll('.cw').forEach(cw=>{const x=cw.querySelector('.ctb');if(x&&x.getBoundingClientRect().bottom>cw.getBoundingClientRect().bottom+1)t++});
  const ys=[...document.querySelectorAll('.cw .wcm .wcb')].map(e=>e.getBoundingClientRect().top),al=ys.length>1&&Math.max(...ys)-Math.min(...ys)>1?1:0;return {clipped:c,tableCut:t,misaligned:al,bars:ys.length,fs:getComputedStyle(document.documentElement).fontSize,docH:document.documentElement.scrollHeight,vh:innerHeight}});
 const e=(m.clipped||m.tableCut||m.misaligned||m.docH>m.vh+2)?' CLIPPED':'';if(e)bad++;console.log(w+'x'+h,JSON.stringify(m),e||'ok');await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
