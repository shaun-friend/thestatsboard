const fs=require('fs');const {chromium}=require('playwright');
(async()=>{const src=fs.readFileSync('t_worker.mjs','utf8');
const i=src.indexOf("var imgs={a:document");const st=src.lastIndexOf('<script>',i),en=src.indexOf('</script>',i)+9;
let script=src.slice(st,en);if(/\$\{/.test(script)){console.log('script has template parts');}
const b=await chromium.launch();let bad=0;
async function run(name,fixedA,fixedB,saved,crestRGB){
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',String(e).slice(0,120)));
 await p.route('**/api/crest*',rt=>rt.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="rgb(${crestRGB})"/></svg>`}));
 await p.route('https://x.test/page',rt=>rt.fulfill({contentType:'text/html',body:`<html><head><style>:root{--ca:${saved[0]};--cb:${saved[1]}}</style></head><body><img data-side="a" ${fixedA?'data-fixed="1"':''} src="/api/crest?id=1"><img data-side="b" ${fixedB?'data-fixed="1"':''} src="/api/crest?id=2">${script.replace(/<\/?script>/g,m=>m)}</body></html>`}));await p.goto('https://x.test/page');
 await p.waitForTimeout(600);
 const v=await p.evaluate(()=>[getComputedStyle(document.documentElement).getPropertyValue('--ca').trim(),getComputedStyle(document.documentElement).getPropertyValue('--cb').trim()]);
 console.log(name,JSON.stringify(v));await p.close();return v}
// our side is B (away), saved green; both crests are green: ours must stay green, the other must move away from it
let v=await run('away, ours fixed green, both crests green',false,true,['#4aa3df','#2f9e5b'],'40,160,90');
if(v[1]!=='#2f9e5b'){console.log('OUR COLOUR CHANGED');bad++}
if(v[0].toLowerCase()===v[1].toLowerCase()){console.log('OTHER SIDE NOT MOVED');bad++}
v=await run('home, ours fixed amber, other crest blue',true,false,['#d9a21b','#4aa3df'],'30,100,200');
if(v[0]!=='#d9a21b'){console.log('OUR COLOUR CHANGED');bad++}
await b.close();console.log(bad?'FAIL':'ALL OK');process.exit(bad?1:0)})();
