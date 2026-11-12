const {chromium}=require('playwright');
(async()=>{
const mod=await import(process.cwd()+'/t_worker.mjs');const w=mod.default;
const r=await w.fetch(new Request('https://x.test/?season=2026-2027&competition=2388&division=77306&team=11057&teamName=Ivybridge+Colts&friendlyName=Colts&app=1'),{},{waitUntil(){}});
const html=await r.text();
const b=await chromium.launch();let bad=0;
for(const [n,wd,h] of [['phone',390,800],['ipadp',820,1180]]){
 const c=await b.newContext({viewport:{width:wd,height:h},hasTouch:true,isMobile:true});const p=await c.newPage();
 const frames=[];
 await p.route('**/*',async rt=>{const u=new URL(rt.request().url());
  if(u.pathname==='/api/builder/team')return rt.fulfill({contentType:'application/json',body:JSON.stringify({leagues:[{competition:'1608',competitionName:'National Under 18 Cup',division:'78772',divisionName:'Group 8'},{competition:'2388',competitionName:'Devon RFU Colts',division:'77306',divisionName:'Group 1'}]})});
  if(u.searchParams.get('embed')==='1'){frames.push(u.search);return rt.fulfill({contentType:'text/html',body:'<html><body style="background:#222;color:#fff">frame</body></html>'})}
  if(u.pathname==='/'&&u.searchParams.get('app')==='1')return rt.fulfill({contentType:'text/html',body:html});
  return rt.fulfill({status:404,body:''})});
 await p.goto('https://x.test/?season=2026-2027&competition=2388&division=77306&team=11057&teamName=Ivybridge+Colts&friendlyName=Colts&app=1');
 await p.waitForSelector('.sbx-cc',{timeout:4000}).catch(()=>{});
 const labels=await p.$$eval('.sbx-cc',e=>e.map(x=>x.textContent+(x.classList.contains('on')?' [on]':'')));
 console.log(n,'buttons:',JSON.stringify(labels));
 if(labels.length!==2||!/\[on\]/.test(labels[1]))bad++;
 await p.screenshot({path:'w/shell_'+n+'.png',clip:{x:0,y:0,width:wd,height:200}});
 await p.click('.sbx-cc:not(.on)');await p.waitForTimeout(400);
 const url=p.url();console.log(n,'after tap url has cup:',/competition=1608&division=78772/.test(url),'last frame:',frames[frames.length-1]);
 if(!/competition=1608/.test(url)||!/competition=1608/.test(frames[frames.length-1]||''))bad++;
 for(const tb of ['leaders','fixtures','next']){await p.click('.sbx-tab[data-t='+tb+']');await p.waitForTimeout(300);
 const hid=await p.$eval('.sbx-cmp',e=>e.hidden);console.log(n,'hidden on '+tb+':',hid);if(!hid)bad++}
 await p.click('.sbx-tab[data-t=home]');await p.waitForTimeout(300);if(await p.$eval('.sbx-cmp',e=>e.hidden)){console.log(n,'missing on Home');bad++}
 await c.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
