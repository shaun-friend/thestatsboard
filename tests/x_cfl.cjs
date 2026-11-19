// v3.40.0: Cloudflare limits card on the Usage page (browser): bars, refused part, refresh, not connected.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const html=fs.readFileSync('w/usage_page.html','utf8');const base=JSON.parse(fs.readFileSync('w/usage_api.json','utf8'));const data=base[7];
const today=new Date().toISOString().slice(0,10),yest=new Date(Date.now()-86400000).toISOString().slice(0,10);
const free={read:100000,write:1000,delete:1000,list:1000,requests:100000,cpuMs:10};
const good=w=>({ok:true,at:new Date().toISOString(),free,day:today,cached:false,
 kv:{ok:true,today:{read:1500,write:w,delete:3},peak:{read:{n:9000,date:yest},write:{n:300,date:yest}},raw:'{"kv":"raw-kv"}'},
 pages:{ok:false,error:'unknown field pagesFunctionsInvocationsAdaptiveGroups',raw:''},
 workers:{ok:true,requests:904,errors:4,subrequests:2010,byStatus:{success:900,exceededResources:4},scripts:[{name:'stats-board',requests:904,p50ms:2.5,p99ms:9}],raw:'{"w":"raw-workers"}'}});
async function run(resp,after){const p=await b.newPage({viewport:{width:900,height:900}});const errs=[],urls=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.pathname==='/usage')return r.fulfill({status:200,contentType:'text/html',body:html});
  if(u.pathname==='/api/usage')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  if(u.pathname==='/api/cflimits'){urls.push(u.search);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(typeof resp==='function'?resp(urls.length):resp)})}
  r.fulfill({status:200,body:'{}'})});
 await p.goto('https://sb.test/usage');await p.waitForTimeout(900);const out=await after(p,urls);ck('no page errors',errs.length===0,errs.join('|'));await p.close();return out}
const text=p=>p.evaluate(()=>{var c=document.getElementById('cfl');return c?c.textContent:''});
// 1 normal
await run(good(40),async(p,urls)=>{const t=await text(p);
 ck('card is shown',/Cloudflare limits/.test(t),t.slice(0,80));
 ck('settings store reads, writes, deletes, lists with limits',/Reads1,500 of 100,000/.test(t)&&/Writes40 of 1,000 \(4%\)/.test(t)&&/Deletes3 of 1,000/.test(t)&&/Lists0 of 1,000/.test(t),t.slice(0,400));
 ck('busiest day note',/Busiest day in the last 7: 9,000/.test(t)&&/Busiest day in the last 7: 300/.test(t));
 ck('requests come from Workers when Pages is refused, with the limit',/Site requests \(Workers\)904 of 100,000/.test(t),t.slice(0,600));
 ck('not-completed requests named in plain words',/Not completed today: Over a resource limit \(includes the 10 ms processing limit\) 4/.test(t),t);
 ck('processing time in ms with the 10 ms limit',/typical 2\.5 ms, slowest 1 in 100 9 ms/.test(t)&&/allows 10 ms of processing per request/.test(t));
 ck('what Cloudflare returned is available (both answers and the refusal)',/raw-kv/.test(t)&&/raw-workers/.test(t)&&/unknown field/.test(t));
 ck('first load asks without the fresh flag',urls[0]==='');
 const col=await p.evaluate(()=>{var d=[].filter.call(document.querySelectorAll('#cfl div'),function(x){return x.style&&x.style.height==='8px'&&x.style.width&&x.parentNode.style.height==='8px'})[0];return d.style.background||getComputedStyle(d).backgroundColor});
 ck('a low figure is green',/63|3f8f62/i.test(col),col);
 await p.click('#cflr');await p.waitForTimeout(500);ck('Refresh asks again with fresh=1',urls.length===2&&urls[1]==='?fresh=1',JSON.stringify(urls))});
// 2 nearly at the limit: red
await run(good(950),async p=>{const col=await p.evaluate(()=>{var bars=[].filter.call(document.querySelectorAll('#cfl div'),function(x){return x.style&&x.style.height==='8px'&&x.parentNode.style.height==='8px'});return bars.map(function(x){return getComputedStyle(x).backgroundColor})});
 ck('writes at 95% turn red',col.indexOf('rgb(214, 90, 74)')>=0,JSON.stringify(col))});
// 3 not connected
await run({ok:false,setup:true},async p=>{const t=await text(p);ck('not connected message names the two secrets',/Not connected/.test(t)&&/CF_ACCOUNT_ID/.test(t)&&/CF_API_TOKEN/.test(t),t)});
// 4 settings store refused: says so, the rest still shows
const part=good(5);part.kv={ok:false,error:'not authorized',raw:''};
await run(part,async p=>{const t=await text(p);ck('refused KV part gives its reason and the rest still shows',/Settings store:.*not authorized/.test(t)&&/Site requests \(Workers\)904/.test(t),t.slice(0,300))});
// 6 split by store and by site
const sp=good(5);sp.kv.byStore=[{id:'aaaa1111',label:'PROD',today:{read:1000,write:30,'delete':3,list:0}},{id:'bbbb2222',label:'',today:{read:500,write:10,'delete':0,list:0}}];
sp.pages={ok:true,requests:4600,errors:0,p50ms:1.8,p99ms:24,scripts:[{name:'irfu-prod',requests:4000,p99ms:24},{name:'irfu-dev',requests:600,p99ms:4}],statuses:[]};
await run(sp,async p=>{const t=await text(p);
 ck('store table with the label and the number start',/PROD/.test(t)&&/aaaa1111/.test(t)&&/bbbb2222/.test(t),t.slice(0,700));
 ck('hint on how to label stores shown for an unlabelled store',/CF_KV_LABELS/.test(t),t.slice(0,700));
 ck('by site line',/By site/.test(t)&&/irfu-prod/.test(t)&&/irfu-dev/.test(t),t.slice(0,900))});
// 7 split refused
const sr=good(5);sr.kv.byStore=[];sr.kv.splitError='unknown field namespaceId';
await run(sr,async p=>{const t=await text(p);ck('split refused says why',/Split by store not available/.test(t)&&/namespaceId/.test(t),t.slice(0,500))});
// 5 the whole answer fails
await run(()=>{return 'not json'},async p=>{const t=await text(p);ck('a broken answer gives a polite message',/could not be loaded|Asking/.test(t)&&!/undefined/.test(t),t)});
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
