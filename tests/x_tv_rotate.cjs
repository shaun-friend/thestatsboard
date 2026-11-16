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
ck('no js errors',errs.length===0);if(errs.length)console.log(errs);
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
