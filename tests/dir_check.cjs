const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [n,w,h,hasBtn] of [['phone',390,800,true],['phone',360,640,true],['tv',1920,1080,false]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
 await p.route('https://x.test/m',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('w/dir_'+n+'.html','utf8')}));
 await p.goto('https://x.test/m');await p.waitForTimeout(500);
 const m=await p.evaluate(()=>{const q=document.querySelector('.vb a.dbtn');const v=document.querySelector('.vn');const r=q&&q.getBoundingClientRect(),vr=v&&v.getBoundingClientRect();
  return {btn:!!q,visible:!!q&&getComputedStyle(q.parentElement).display!=='none'&&r.width>0,left:r&&Math.round(r.left),right:r&&Math.round(r.right),vw:innerWidth,vnRight:vr&&Math.round(vr.right),vnScroll:v&&v.scrollWidth>v.clientWidth+1,hscroll:document.documentElement.scrollWidth>innerWidth+1,text:q&&q.textContent}});
 console.log(n,w+'x'+h,JSON.stringify(m));
 const ok=hasBtn?(m.visible&&m.left>=0&&m.right<=m.vw&&!m.hscroll&&!m.vnScroll):!m.visible;
 if(!ok){bad++;console.log(' PROBLEM')}
 if(n==='phone'&&w===390)await p.screenshot({path:'w/dir_phone.png',clip:{x:0,y:0,width:390,height:420}});
 await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
