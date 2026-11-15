const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let bad=0;
for(const [name,file,vw,vh] of [['phone','w/opp_v3330p.html',390,900],['wide','w/opp_v3330w.html',1280,900]]){
 const p=await b.newPage({viewport:{width:vw,height:vh},deviceScaleFactor:1});
 await p.goto('file://'+process.cwd()+'/'+file+'?app=1');
 const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
  boxes:[...document.querySelectorAll('.gb')].map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY),Math.round(r.width),Math.round(r.height)]})}));
 console.log(name,JSON.stringify(o));
 if(o.sw>o.cw+1){console.log('H-SCROLL',name);bad++}
 if(name==='wide'){const bx=o.boxes;if(bx.length===4){const [a,b2,c2,d2]=bx;if(a[3]!==b2[3]||c2[3]!==d2[3]||a[1]!==b2[1]||c2[1]!==d2[1]||a[2]!==b2[2]){console.log('WIDE NOT ALIGNED');bad++}}else{console.log('WIDE BOX COUNT',bx.length);bad++}}
 await p.screenshot({path:'w/opp_'+name+'.png',fullPage:true});await p.close()}
await b.close();console.log(bad?'FAIL':'ALL OK');process.exit(bad?1:0)})();
