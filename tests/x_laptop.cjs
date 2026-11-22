const {chromium}=require('playwright');
(async()=>{
const mod=await import(process.cwd()+'/t_worker.mjs');const w=mod.default;
const base='https://x.test/?season=2026-2027&competition=2388&division=77306&team=11057&teamName=Ivybridge+Colts&friendlyName=Colts&app=1';
const get=async u=>(await (await w.fetch(new Request(u),{},{waitUntil(){}})).text());
const SRC=require('fs').readFileSync(process.cwd()+'/t_worker.mjs','utf8');const EMB=SRC.match(/const EMBED_CSS = `([\s\S]*?)`;/)[1];
const home=await get(base), nextv=await get(base+'&view=match');
const b=await chromium.launch();let bad=0;const ck=(n,v)=>{console.log((v?'ok  ':'FAIL')+' '+n);if(!v)bad++};
async function open(ctxOpts,url,html){const c=await b.newContext(ctxOpts);const p=await c.newPage();
 await p.route('**/*',async rt=>{const u=new URL(rt.request().url());
  if(u.pathname==='/api/builder/team')return rt.fulfill({contentType:'application/json',body:'{"leagues":[]}'});
  if(u.searchParams.get('embed')==='1')return rt.fulfill({contentType:'text/html',body:'<html class="layout-mobile"><head>'+EMB+'</head><body style="margin:0;background:#101614"><div style="height:1800px">x</div></body></html>'});
  if(u.pathname==='/'&&u.searchParams.get('app')==='1')return rt.fulfill({contentType:'text/html',body:html});
  return rt.fulfill({status:404,body:''})});
 await p.goto(url);return p}
// laptop: stays in the app view (no bounce), one page at a time, centred column
let p=await open({viewport:{width:1440,height:900}},base+'&view=match',nextv);
await p.waitForSelector('.sbx-fr',{timeout:4000});await p.waitForTimeout(400);
ck('laptop stays in the app view (not bounced out)',/app=1/.test(p.url()));
ck('laptop Next game shows one page, not two side by side',await p.evaluate(()=>document.querySelectorAll('.sbx-fr').length)===1);
ck('laptop frame is full width so its scrollbar sits at the window edge',await p.evaluate(()=>{const f=document.querySelector('.sbx-fr').getBoundingClientRect();return f.right>=innerWidth-1&&f.width>1200}));
const fr=p.frames().find(f=>f!==p.mainFrame()&&/embed=1/.test(f.url()));
ck('laptop page content is one centred column no wider than 820px, never two columns',await fr.evaluate(()=>{const b=document.body.getBoundingClientRect(),cs=getComputedStyle(document.body);return b.width<=821&&b.left>100&&(cs.columnCount==='1'||cs.columnCount==='auto')}));
ck('laptop scrollbar follows the dark theme',await fr.evaluate(()=>getComputedStyle(document.documentElement).colorScheme==='dark'));
ck('laptop has the Match Stats / Opposition switch',await p.evaluate(()=>getComputedStyle(document.querySelector('.sbx-seg')).display!=='none'));
// iPad on its side (touch, no hover): keeps the side-by-side panes
p=await open({viewport:{width:1180,height:820},hasTouch:true,isMobile:true},base+'&view=match',nextv);
await p.waitForSelector('.sbx-fr',{timeout:4000});await p.waitForTimeout(400);
ck('tablet on its side still shows two panes',await p.evaluate(()=>document.querySelectorAll('.sbx-fr').length)===2);
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
