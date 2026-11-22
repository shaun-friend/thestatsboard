const {chromium}=require('playwright');
(async()=>{
const mod=await import(process.cwd()+'/t_worker.mjs');const w=mod.default;
const base='https://x.test/?season=2026-2027&competition=2388&division=77306&team=11057&teamName=Ivybridge+Colts&friendlyName=Colts&app=1';
const get=async u=>(await (await w.fetch(new Request(u),{},{waitUntil(){}})).text());
const home=await get(base), nextv=await get(base+'&view=match');
const b=await chromium.launch();let bad=0;const ck=(n,v)=>{console.log((v?'ok  ':'FAIL')+' '+n);if(!v)bad++};
async function open(ctxOpts,url,html){const c=await b.newContext(ctxOpts);const p=await c.newPage();
 await p.route('**/*',async rt=>{const u=new URL(rt.request().url());
  if(u.pathname==='/api/builder/team')return rt.fulfill({contentType:'application/json',body:'{"leagues":[]}'});
  if(u.searchParams.get('embed')==='1')return rt.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><div style="height:1800px">x</div></body></html>'});
  if(u.pathname==='/'&&u.searchParams.get('app')==='1')return rt.fulfill({contentType:'text/html',body:html});
  return rt.fulfill({status:404,body:''})});
 await p.goto(url);return p}
// laptop: stays in the app view (no bounce), one page at a time, centred column
let p=await open({viewport:{width:1440,height:900}},base+'&view=match',nextv);
await p.waitForSelector('.sbx-fr',{timeout:4000});await p.waitForTimeout(400);
ck('laptop stays in the app view (not bounced out)',/app=1/.test(p.url()));
ck('laptop Next game shows one page, not two side by side',await p.evaluate(()=>document.querySelectorAll('.sbx-fr').length)===1);
ck('laptop page column is capped and centred',await p.evaluate(()=>{const f=document.querySelector('.sbx-fr').getBoundingClientRect();return f.width<=1041&&f.left>150}));
ck('laptop has the Match Stats / Opposition switch',await p.evaluate(()=>getComputedStyle(document.querySelector('.sbx-seg')).display!=='none'));
// iPad on its side (touch, no hover): keeps the side-by-side panes
p=await open({viewport:{width:1180,height:820},hasTouch:true,isMobile:true},base+'&view=match',nextv);
await p.waitForSelector('.sbx-fr',{timeout:4000});await p.waitForTimeout(400);
ck('tablet on its side still shows two panes',await p.evaluate(()=>document.querySelectorAll('.sbx-fr').length)===2);
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
