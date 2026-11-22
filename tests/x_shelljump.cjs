const {chromium}=require('playwright');
(async()=>{
const mod=await import(process.cwd()+'/t_worker.mjs');const w=mod.default;
const U='https://x.test/?season=2026-2027&competition=2388&division=77306&team=11057&teamName=Ivybridge+Colts&friendlyName=Colts&app=1';
const r=await w.fetch(new Request(U),{},{waitUntil(){}});const html=await r.text();
const b=await chromium.launch();let bad=0;
const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});const p=await c.newPage();
await p.route('**/*',async rt=>{const u=new URL(rt.request().url());
 if(u.pathname==='/api/builder/team')return rt.fulfill({contentType:'application/json',body:'{"leagues":[]}'});
 if(u.searchParams.get('embed')==='1')return rt.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><nav><a id="j" href="#g2">Jump</a></nav><div style="height:1800px">top</div><section id="g2"><h2>Their form</h2></section><div style="height:1800px">end</div></body></html>'});
 if(u.pathname==='/'&&u.searchParams.get('app')==='1')return rt.fulfill({contentType:'text/html',body:html});
 return rt.fulfill({status:404,body:''})});
await p.goto(U);await p.waitForSelector('.sbx-fr',{timeout:4000});await p.waitForTimeout(500);
const fr=p.frames().find(f=>f!==p.mainFrame()&&/embed=1/.test(f.url()));
if(!fr){console.log('no frame');process.exit(1)}
const before=p.url();
await fr.click('#j');await p.waitForTimeout(1200);
const y=await fr.evaluate(()=>Math.round(scrollY));
const ok=y>1000&&p.url()===before;console.log('in-page link scrolls the frame, page unchanged:',ok,'scrollY',y);
if(!ok)bad++;
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
