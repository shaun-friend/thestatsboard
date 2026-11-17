// Strip options: page name and dots+progress are separate; strip never overlaps the pages; none = no band.
const {chromium}=require('playwright');const {execSync}=require('child_process');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const mkHtml=(name,dots)=>{let src=fs.readFileSync('x_tv_rotate_render.mjs','utf8').replace('tv:{name:true,dots:true,','tv:{name:'+name+',dots:'+dots+',');fs.writeFileSync('_strip_r.mjs',src);execSync('node _strip_r.mjs ./t_worker.mjs');return fs.readFileSync('w/tv_screen.html','utf8')};
for(const [name,dots,vp] of [[true,false,[1280,720]],[false,true,[1280,720]],[true,true,[390,844]],[false,false,[1280,720]]]){
 const html=mkHtml(name,dots);const p=await b.newPage({viewport:{width:vp[0],height:vp[1]}});
 await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.pathname==='/ivybridge/tv')return r.fulfill({status:200,contentType:'text/html',body:html});
  if(u.pathname==='/')return r.fulfill({status:200,contentType:'text/html',body:'<body><h1>x</h1><script>setTimeout(function(){parent.postMessage("rfu-sr-ready","*")},100)</script></body>'});r.fulfill({status:200,body:''})});
 await p.goto('https://sb.test/ivybridge/tv');await p.waitForTimeout(1200);
 const g=await p.evaluate(()=>{const v=id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return {vis:!e.hidden&&getComputedStyle(e).display!=='none'&&r.height>0,t:r.top,b:r.bottom}};return {st:v('st'),bt:v('bt'),dots:v('dots'),pg:v('pg'),lab:document.getElementById('lab').textContent,n:document.querySelectorAll('#dots i').length,h:innerHeight}});
 const tag=name+'/'+dots+'/'+vp[0];
 ck(tag+' name only when asked',(g.lab.length>0)===name,g.lab);
 ck(tag+' dots+progress only when asked',(g.dots.vis&&g.pg.vis)===dots&&(g.n>0)===dots,JSON.stringify(g));
 ck(tag+' band only when something is on',g.bt.vis===(name||dots),JSON.stringify(g.bt));
 if(name||dots)ck(tag+' pages end where the strip starts',g.st.b<=g.bt.t+1,JSON.stringify(g));else ck(tag+' pages fill the screen',Math.abs(g.st.b-g.h)<2);
 if(name&&dots&&vp[0]===1280)await p.screenshot({path:'w/strip.png'});await p.close()}
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
