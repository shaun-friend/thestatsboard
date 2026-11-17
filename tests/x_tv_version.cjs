// A page that reports a newer version makes the rotator refresh the other pages at once (v3.37.18), instead of one by one every 5 minutes.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c)=>{if(!c){bad++;console.log('FAIL',n)}};
const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const html=fs.readFileSync('w/tv_screen.html','utf8');let ver='v3.37.16',hits=[];
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/ivybridge/tv')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/'){const v=u.searchParams.get('view')||'table';hits.push(v);
  return r.fulfill({status:200,contentType:'text/html',body:`<body style="margin:0"><h1>${v}</h1><script>setTimeout(function(){parent.postMessage("rfu-ver|${ver}","*");parent.postMessage("rfu-sr-ready","*")},200)</script></body>`})}
 r.fulfill({status:200,body:''})});
await p.clock.install();await p.goto('https://sb.test/ivybridge/tv');
const adv=async(ms,step)=>{for(let t=0;t<ms;t+=step){await p.clock.runFor(step);await p.waitForTimeout(120)}};
await adv(20000,1000);await p.waitForTimeout(300);ck('all four pages loaded once',hits.length===4,hits.join());
// the first page's own refresh (5 minutes) now returns a newer version
ver='v3.37.17';hits=[];
let t=0;while(hits.length<1&&t<330000){await adv(1000,1000);t+=1000}
ck('first page refreshed on its own timer',hits.length>=1,hits.join());
let after=0;while(new Set(hits).size<4&&after<60000){await adv(1000,1000);after+=1000}
ck('all four pages refreshed within 16 seconds of the first one reporting the newer version (was 45+)',new Set(hits).size===4&&after<=16000,after+'s '+hits.join());
// no loop: once everything is on the newer version the normal 5 minute timers apply
const n2=hits.length;await adv(60000,3000);await p.waitForTimeout(300);ck('no repeat refreshing once all are current',hits.length===n2,hits.slice(n2).join());
// older page after newer: a late slow page that comes back older is re-requested quickly
ck('no script errors',errs.length===0,errs.join('|'));
await b.close();console.log(bad?'FAILED':'ALL OK')})()
