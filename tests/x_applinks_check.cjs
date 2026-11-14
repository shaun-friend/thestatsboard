// v3.30.18: every link in the phone app's Links sheet follows Admin: no friendlyName for a club team, a typed name is kept
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const c=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}};
const shell=fs.readFileSync(__dirname+'/w/app_shell.html','utf8'),frame=fs.readFileSync(__dirname+'/w/app_frame.html','utf8');
async function sheetLinks(addr,pre){const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await p.route('https://thestatsboard.co.uk/**',r=>{const u=r.request().url();if(/embed=1/.test(u))return r.fulfill({contentType:'text/html',body:frame});if(/format=|api\//.test(u))return r.fulfill({json:{}});return r.fulfill({contentType:'text/html',body:shell})});
 await p.addInitScript(()=>{window.__shared=[];navigator.share=function(o){window.__shared.push(o.url);return Promise.resolve()}});
 if(pre)await p.addInitScript(pre);
 await p.goto('https://thestatsboard.co.uk'+addr);await p.waitForTimeout(900);
 await p.click('.sbx-rt .sbx-ic:last-child');await p.waitForTimeout(300);
 const n=await p.$$eval('.sbx-b.go',a=>a.length);for(const e of await p.$$('.sbx-b.go')){await e.click();await p.waitForTimeout(60)}
 const urls=await p.evaluate(()=>window.__shared);await p.close();return {n,urls}}
const base='/?season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&theme=dark&force=1&app=1';
let r=await sheetLinks(base);c('sheet offers links',r.n>=6);c('a plain address: no friendlyName in any link',r.urls.length===r.n&&r.urls.every(u=>!/friendlyName/.test(u)));
r=await sheetLinks(base+'&friendlyName=Ivybridge+1XV');c('address carrying the Admin name: links drop it',r.urls.length===r.n&&r.urls.every(u=>!/friendlyName/.test(u)));
r=await sheetLinks(base,()=>{try{localStorage.setItem('statsBoardRecent',JSON.stringify([{team:'11042',name:'The Vandals',competition:'1699',division:'75791',season:'2026-2027',league:'R2',tn:'Ivybridge'},{team:'11039',name:'Ivybridge 1XV',competition:'1699',division:'75791',season:'2026-2027',league:'R2',tn:'Ivybridge'}]))}catch(e){}});
c('with recent teams remembered: no friendlyName',r.urls.length===r.n&&r.urls.every(u=>!/friendlyName/.test(u)));
r=await sheetLinks(base+'&friendlyName=Seniors');c('a typed name is kept in the links',r.urls.length>=6&&r.urls.every(u=>/friendlyName=Seniors/.test(u)));
await b.close();console.log(bad?'FAILED '+bad:'ALL OK');process.exit(bad?1:0)})()
