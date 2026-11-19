const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const api=JSON.parse(fs.readFileSync('w/usage_api.json','utf8'));const b=await chromium.launch();let bad=0;
for(const days of [1,7,30]){
 const p=await b.newPage({viewport:{width:1200,height:900}});
 p.on('pageerror',e=>{console.log('PAGEERROR',e.message);bad++});
 await p.route('https://x.test/usage',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('w/usage_page.html','utf8')}));
 await p.route('**/api/cflimits*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({ok:false,setup:true})}));
 await p.route('**/api/usage*',r=>{const d=Number(new URL(r.request().url()).searchParams.get('days'))||7;r.fulfill({contentType:'application/json',body:JSON.stringify(api[d]||api[7])})});
 await p.goto('https://x.test/usage',{waitUntil:'load'});await p.waitForTimeout(500);await p.click('.rng button[data-d="'+days+'"]');await p.waitForTimeout(500);
 const t=await p.innerText('body');
 const good=/People per/.test(t)&&!/could not be loaded|Loading…/.test(t)&&new RegExp('Outside calls per '+(days===1?'hour':'day')).test(t)&&/website calls and/.test(t)&&/Address checks/.test(t)&&/Wrong part: /.test(t);
 console.log('days',days,good?'rendered':'NOT RENDERED',JSON.stringify(t.slice(0,160)));if(!good)bad++;
 if(days===7){await (await p.$('.cd:has(h2:text-is("Outside calls per day"))')).screenshot({path:'w/usage_outside.png'})}
 await p.close()}
await b.close();console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0)})();
