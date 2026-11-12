const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [w,h] of [[1920,1080],[2000,1000],[1366,768]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.setContent(fs.readFileSync('w/foot_page.html','utf8'),{waitUntil:'load'});await p.waitForTimeout(600);
 const m=await p.evaluate(()=>{const s=document.getElementById('sbv');if(!s)return {none:true};const r=s.getBoundingClientRect();
  let low=0;document.querySelectorAll('body *').forEach(e=>{if(e===s||s.contains(e)||e.tagName==='SCRIPT'||e.tagName==='STYLE')return;const q=e.getBoundingClientRect();if(q.height>0&&q.width>0&&q.bottom<=innerHeight+1&&q.bottom>low)low=q.bottom});
  return {fixed:getComputedStyle(s).position,stampTop:Math.round(r.top),contentBottom:Math.round(low),scroll:document.documentElement.scrollHeight>innerHeight+2}});
 console.log(w+'x'+h,JSON.stringify(m));
 if(m.stampTop<m.contentBottom){bad++;console.log('  OVERLAP')}
 if(w===1920)await p.screenshot({path:'w/foot_'+w+'.png',clip:{x:0,y:h-140,width:w,height:140}});
 await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
