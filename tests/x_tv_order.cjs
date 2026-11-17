// Order and timing: the first round follows the list even when the Match Centre (2nd) is the slowest to load, and each page stays its set time.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const html=fs.readFileSync('w/tv_screen.html','utf8');
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/ivybridge/tv')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/'){const v=u.searchParams.get('view')||'table';const delay={fixtures:200,match:14000,table:300,leaders:300}[v];
  return r.fulfill({status:200,contentType:'text/html',body:`<body style="margin:0"><h1>${v}</h1><script>setTimeout(function(){parent.postMessage("rfu-sr-ready","*")},${delay})</script></body>`})}
 r.fulfill({status:200,body:''})});
await p.clock.install();await p.goto('https://sb.test/ivybridge/tv');
const on=()=>p.$$eval('iframe.on',f=>f.map(x=>x.src.match(/view=(\w+)|$/)[1]||'table').join());
const seq=[];let last='';const t0=await p.evaluate(()=>Date.now());
for(let i=0;i<110;i++){await p.clock.runFor(1000);await p.waitForTimeout(40);const o=await on();if(o&&o!==last){last=o;seq.push([o,Math.round((await p.evaluate(()=>Date.now())-t0)/1000)])}}
const names=seq.map(x=>x[0]);
ck('first round follows the list, Match Centre not skipped',names.slice(0,5).join()==='fixtures,match,table,leaders,fixtures',names.join());
const gaps=[];for(let i=1;i<seq.length-1;i++)gaps.push(seq[i+1][1]-seq[i][1]);
ck('after the start each page stays its set 10 seconds (within 2)',gaps.slice(1).every(g=>g>=8&&g<=12),gaps.join());
ck('no script errors',errs.length===0,errs.join('|'));
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
