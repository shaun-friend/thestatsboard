const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [w,h] of [[1920,1080],[2000,1080],[1366,768],[1280,720],[1024,768]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.setContent(fs.readFileSync('w/foot_stack.html','utf8'),{waitUntil:'load'});await p.waitForTimeout(600);
 const m=await p.evaluate(()=>{const s=document.getElementById('sbv');if(!s)return {none:true};const r=s.getBoundingClientRect();let low=0;
  document.querySelectorAll('body *').forEach(e=>{if(e===s||s.contains(e)||['SCRIPT','STYLE'].includes(e.tagName))return;const q=e.getBoundingClientRect();if(q.height>0&&q.width>0&&q.bottom<=innerHeight+1&&q.bottom>low)low=q.bottom});
  return {pos:getComputedStyle(s).position,stampTop:Math.round(r.top),contentBottom:Math.round(low),rows:document.querySelectorAll('.rw').length}});
 console.log(w+'x'+h,JSON.stringify(m));if(m.stampTop<m.contentBottom){bad++;console.log(' OVERLAP')}
 await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
