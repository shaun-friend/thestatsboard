// Rotation logic with a fake clock: fixtures ready at once, match slow (8 s), table never ready, leaders ready.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c)=>{if(!c){bad++;console.log('FAIL',n)}};
const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const html=fs.readFileSync('w/tv_screen.html','utf8');const hits=[];
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/ivybridge/tv')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/'){const v=u.searchParams.get('view')||'table';hits.push(v+'@'+Date.now());
  const delay={fixtures:200,match:8000,table:-1,leaders:300}[v];
  return r.fulfill({status:200,contentType:'text/html',body:`<body style="margin:0"><h1 id=n>${v}</h1><script>${delay<0?'':`setTimeout(function(){parent.postMessage("rfu-sr-ready","*")},${delay})`}</script></body>`})}
 r.fulfill({status:200,body:''})});
await p.clock.install();await p.goto('https://sb.test/ivybridge/tv');
const on=()=>p.$$eval('iframe.on',f=>f.map(x=>x.src.match(/view=(\w+)|$/)[1]||'table'));
await p.clock.runFor(1500);ck('first ready page shows (fixtures)',(await on()).join()==='fixtures');
await p.waitForTimeout(300);ck('not all frames requested at once',hits.length<=2);
await p.clock.runFor(3000);await p.waitForTimeout(400);ck('others start staggered',hits.length>=2&&hits.length<4);
await p.clock.runFor(7000);let o=await on();ck('nothing else ready yet, so it stays on the current page (no gap)',o.length===1&&o[0]==='fixtures',o.join());
const seen=new Set();for(let i=0;i<12;i++){await p.clock.runFor(5000);(await on()).forEach(x=>seen.add(x))}
ck('never showed the unready table',!seen.has('table'));ck('shows the others in turn',seen.has('fixtures')&&seen.has('match')&&seen.has('leaders'),[...seen].join());
ck('only one frame visible at a time',(await p.$$eval('iframe.on',f=>f.length))===1);
ck('dots strip present',(await p.$$eval('#dots i',e=>e.length))===4);

// phone-size window: frames must still get a TV-width window (1920) and the stage is scaled down
const q=await b.newPage({viewport:{width:390,height:844}});await q.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/ivybridge/tv')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/')return r.fulfill({status:200,contentType:'text/html',body:'<body><h1>x</h1><script>setTimeout(function(){parent.postMessage("rfu-sr-ready","*")},100)</script></body>'});r.fulfill({status:200,body:''})});
await q.goto('https://sb.test/ivybridge/tv');await q.waitForTimeout(1500);
const fw=await q.evaluate(()=>{const f=document.querySelector('iframe');return f?f.contentWindow.innerWidth:0});
const tr=await q.evaluate(()=>getComputedStyle(document.getElementById('st')).transform);
ck('phone: pages get a 1920 wide window',fw===1920,fw);ck('phone: stage is scaled down',/matrix\(0\.2/.test(tr),tr);
const L=await q.evaluate(()=>{const r=document.getElementById('st').getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),Math.round(r.width)]});ck('phone: stage fits the screen width',L[2]>=388&&L[2]<=392&&L[0]>=0,L.join());
await q.setViewportSize({width:1280,height:720});await q.waitForTimeout(200);
ck('TV size: stage not scaled',await q.evaluate(()=>getComputedStyle(document.getElementById('st')).transform==='none'));
ck('loading screen shows the logo and name',/<div id="ld"><img src="\/icon-192\.png"[^>]*><b>The Stats Board<\/b><span>Loading<\/span>/.test(html));
ck('no js errors',errs.length===0);if(errs.length)console.log(errs);
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
