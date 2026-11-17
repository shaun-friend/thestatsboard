// Usage, Named screens: one line per screen (page shown last, total loads, last seen), not one per screen and page.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const html=fs.readFileSync('w/usage.html','utf8');const p=await b.newPage({viewport:{width:900,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const base=JSON.parse(fs.readFileSync('w/usage_api.json','utf8'));const data=JSON.parse(JSON.stringify(base[1]||base[7]));data.screens=[
 {screen:'My iPad',view:'fixtures',loads:20,last:'2026-11-17T20:19:00'},{screen:'My iPad',view:'leaders',loads:18,last:'2026-11-17T20:26:00'},{screen:'My iPad',view:'stack',loads:14,last:'2026-11-17T20:26:30'},
 {screen:'My iPad 877a',view:'team',loads:6,last:'2026-11-17T20:28:00'},{screen:'My iPad 877a',view:'match',loads:2,last:'2026-11-17T20:28:40'}];
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/usage')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/api/usage')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 r.fulfill({status:200,body:'{}'})});
await p.goto('https://sb.test/usage');await p.waitForTimeout(700);
const card=await p.evaluate(()=>{var c=[].filter.call(document.querySelectorAll('.cd'),function(x){return/Named screens/.test(x.textContent)})[0];return c?[].map.call(c.querySelectorAll('tr'),function(t){return t.textContent.replace(/\s+/g,' ').trim()}):null});
ck('Named screens card shown',!!card,JSON.stringify(card));
ck('one line per screen',card&&card.length===2,JSON.stringify(card));
ck('newest screen first with its last page, total loads and last seen',card&&/^My iPad 877amatch82026-11-17 20:28$/.test(card[0]),card&&card[0]);
ck('the other screen: last page is the most recent one, loads added up',card&&/^My iPadstack522026-11-17 20:26$/.test(card[1]),card&&card[1]);
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
