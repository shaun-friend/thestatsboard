const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const ly of ['next','board','classic']){for(const [w,h] of [[1920,1080],[1366,768],[1280,720],[390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.setContent(fs.readFileSync('w/ly_'+ly+'.html','utf8'),{waitUntil:'load'});await p.waitForTimeout(400);
 const m=await p.evaluate(()=>{const o=[];document.querySelectorAll('.ly *').forEach(e=>{const s=getComputedStyle(e);if(e.clientWidth>0&&e.scrollWidth>e.clientWidth+2&&s.overflow==='visible')o.push(e.className)});
  const rw=document.querySelector('.rw'),ly=document.querySelector('.ly');
  const low=[...document.querySelectorAll('.cw,.bwr')].reduce((a,e)=>Math.max(a,e.getBoundingClientRect().bottom),0);
  const clip=[...document.querySelectorAll('.cn,.cl,.on,.lo,.bnm,.bso')].filter(e=>e.clientWidth>0&&e.clientHeight<parseFloat(getComputedStyle(e).fontSize)*1.2).length;
  return {clip,over:o.length,rw:getComputedStyle(rw).display,ly:ly?getComputedStyle(ly).display:'none',docH:document.documentElement.scrollHeight,vh:innerHeight,low:Math.round(low)}});
 const phone=w<800;let e='';
 if(m.over)e+=' OVERFLOW';if(m.clip)e+=' TEXT TOO TIGHT (descenders)';
 if(ly==='classic'){if(m.rw==='none')e+=' ROWS HIDDEN'}
 else if(phone){if(m.ly!=='none'||m.rw==='none')e+=' PHONE SHOULD SHOW CARDS'}
 else{if(m.rw!=='none'||m.ly==='none')e+=' DESKTOP SHOULD SHOW LAYOUT';if(m.docH>m.vh+2)e+=' PAGE SCROLLS';if(m.low>m.vh)e+=' CUT OFF'}
 console.log(ly,w+'x'+h,JSON.stringify(m),e||'ok');if(e)bad++;await p.close()}}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
