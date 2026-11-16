// v3.36.1: the Message us link sits in the page's own footer: it must not cover any content and must sit above the version line.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const file=process.argv[2]||'w/msg_page.html';
for(const [w,h] of [[390,844],[375,667],[430,932],[768,1024]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
 let html=fs.readFileSync(file,'utf8').replace(/<script>[^<]*location\.(replace|href)[^<]*<\/script>/g,'');
 await p.setContent(html,{waitUntil:'load'});await p.waitForTimeout(500);
 await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await p.waitForTimeout(200);
 const m=await p.evaluate(()=>{const a=document.getElementById('sbmsg'),v=document.getElementById('sbv');if(!a)return {none:true};
  const r=a.getBoundingClientRect(),vr=v?v.getBoundingClientRect():null;let hit=0;
  document.querySelectorAll('body *').forEach(e=>{if(e===a||e.contains(a)||a.contains(e)||e.id==='sbv'||e.tagName==='SCRIPT'||e.tagName==='STYLE'||e.id==='sbmsgw')return;const q=e.getBoundingClientRect();if(q.width<=0||q.height<=0)return;const cs=getComputedStyle(e);if(cs.visibility==='hidden')return;
   if(e.children.length&&!e.textContent.trim())return;if(q.left<r.right&&q.right>r.left&&q.top<r.bottom&&q.bottom>r.top&&e.children.length===0)hit++});
  return {pos:getComputedStyle(a.parentElement).position,top:Math.round(r.top),bottom:Math.round(r.bottom),stampTop:vr?Math.round(vr.top):null,covers:hit,vh:innerHeight,sw:document.documentElement.scrollWidth}});
 console.log(w+'x'+h,JSON.stringify(m));
 if(m.none||m.covers>0||(m.stampTop!=null&&m.bottom>m.stampTop)||m.sw>w+1){bad++;console.log('  FAIL')}
 if(w===390)await p.screenshot({path:'w/msg_'+w+'.png'});
 await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
