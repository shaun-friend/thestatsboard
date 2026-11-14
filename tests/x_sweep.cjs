const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const html=fs.readFileSync(__dirname+'/w/wc_mc_next.html','utf8');
for(const [w,h] of [[1920,1080],[1366,768],[1280,800],[1180,820],[1180,700],[1149,640],[1024,768],[1024,600],[900,600],[2560,1440]]){
 const p=await b.newPage({viewport:{width:w,height:h}});await p.setContent(html);
 const r=await p.evaluate(()=>{const cs=[...document.querySelectorAll('.cnx')];return {n:cs.length,over:cs.map(c=>c.scrollHeight-c.clientHeight),cols:document.querySelectorAll('.cw').length}});
 console.log(w+'x'+h,JSON.stringify(r));await p.close()}
await b.close()})()
