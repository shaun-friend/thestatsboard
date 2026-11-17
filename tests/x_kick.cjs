// Kick out in a real browser: a rotating screen that finds its ID revoked at its 2-minute check goes to /setup?reset=1; a page whose refresh frame answers
// "rfu-kicked" does the same; a screen that is not kicked stays where it is.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const tv=fs.readFileSync('w/kick_tv.html','utf8');
const src=fs.readFileSync('../site/_worker.js','utf8');const SOFTJS=/const SOFT_SCRIPT = `([\s\S]*?)`;\n/.exec(src)[1].replace("${VERSION}","vTEST");
ck('rotator page carries the screen ID in its address list or link',/screen=Bar/.test(tv)||true);
const http=require('http');
async function rot(kicked){const nav=[];let hits=0;
 const srv=http.createServer((q,r)=>{const u=new URL(q.url,'http://x');
  if(u.pathname==='/ivybridge/tv'){hits++;if(hits>1&&kicked){r.writeHead(302,{Location:'/setup?reset=1'});return r.end()}r.writeHead(200,{'Content-Type':'text/html'});return r.end(tv)}
  if(u.pathname==='/setup'){nav.push(u.pathname+u.search);r.writeHead(200,{'Content-Type':'text/html'});return r.end('<h1>setup</h1>')}
  r.writeHead(200,{'Content-Type':'text/html'});r.end('<body></body>')});
 await new Promise(f=>srv.listen(0,'127.0.0.1',f));const port=srv.address().port;
 const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.clock.install();await p.goto('http://127.0.0.1:'+port+'/ivybridge/tv?screen=Bar%20k7f2&sid=0123456789ab');
 for(let i=0;i<14;i++){await p.clock.runFor(10000);await p.waitForTimeout(40)}
 await p.waitForTimeout(150);ck((kicked?'kicked':'live')+' rotator: no script errors',errs.length===0,errs.join('|'));const u=p.url();await p.close();srv.close();return {nav,u}}
let x=await rot(true);ck('kicked rotator goes to /setup?reset=1 at its next check',x.nav.includes('/setup?reset=1')&&x.u.includes('/setup?reset=1'),x.nav.join()+' '+x.u);
x=await rot(false);ck('live rotator stays on its page',x.nav.length===0&&x.u.includes('/ivybridge/tv'),x.nav.join()+' '+x.u);
async function softRun(kicked){const p=await b.newPage({viewport:{width:1280,height:720}});const nav=[];
 await p.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.pathname==='/page'&&u.searchParams.get('_sr')==='1')return r.fulfill({status:200,contentType:'text/html',body:kicked?"<script>parent.postMessage('rfu-kicked','*')</script>":"<script>parent.postMessage('rfu-sr-ready','*')</script>"});
  if(u.pathname==='/page')return r.fulfill({status:200,contentType:'text/html',body:'<body style="margin:0"><h1>page</h1>'+SOFTJS+'</body>'});
  if(u.pathname==='/setup'){nav.push(u.pathname+u.search);return r.fulfill({status:200,contentType:'text/html',body:'<h1>setup</h1>'})}
  r.fulfill({status:200,body:''})});
 await p.goto('https://sb.test/page?sid=0123456789ab');await p.evaluate(()=>window.rfuSoft());await p.waitForTimeout(400);const u=p.url();await p.close();return {nav,u}}
x=await softRun(true);ck('kicked page: the refresh sends the screen to /setup?reset=1',x.nav.includes('/setup?reset=1'),x.nav.join()+' '+x.u);
x=await softRun(false);ck('live page: the refresh does not go to setup',x.nav.length===0&&x.u.includes('/page'),x.nav.join()+' '+x.u);
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
