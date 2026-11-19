const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const g=JSON.parse(fs.readFileSync('w/sponsors_gate.json','utf8'));let f=0;const ck=(n,o,d)=>{console.log((o?'ok  ':'FAIL')+' '+n+(o?'':' '+(d||'')));if(!o)f++};
ck('page and API are behind the club PIN',g.gateOk&&g.apiGate);
const html=fs.readFileSync('w/sponsors_page.html','utf8');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:800}});
let items=[],n=0;const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/sponsors')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/api/sponsors'){if(r.request().method()==='GET')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,items,max:300})});
  const o=JSON.parse(r.request().postData());let msg={ok:true,added:0,skipped:0};
  if(o.act==='add'){if(items.some(x=>x.name.toLowerCase()===o.name.toLowerCase()))return r.fulfill({status:409,contentType:'application/json',body:JSON.stringify({ok:false,error:o.name+' is already in the list.'})});items.push({id:('0000000'+(++n)).slice(-8),name:o.name});msg.added=1}
  if(o.act==='bulk'){o.text.split(String.fromCharCode(10)).forEach(function(l){l=l.trim();if(!l)return;if(items.some(x=>x.name===l))msg.skipped++;else{items.push({id:('0000000'+(++n)).slice(-8),name:l});msg.added++}})}
  if(o.act==='rename'){items.find(x=>x.id===o.id).name=o.name}
  if(o.act==='remove'){items=items.filter(x=>x.id!==o.id)}
  items.sort((a,c)=>a.name<c.name?-1:1);msg.items=items;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(msg)})}
 r.fulfill({status:200,body:'{}'})});
await p.goto('https://thestatsboard.co.uk/sponsors');await p.waitForTimeout(300);
const t=async()=>p.innerText('body');
ck('empty list message',/No sponsors yet/.test(await t()));
await p.fill('#nm','Dart Motors');await p.click('#ad');await p.waitForTimeout(300);
ck('add shows the sponsor and the count',/Dart Motors/.test(await t())&&/1 of 300/.test(await t()),await t());
await p.fill('#nm','dart motors');await p.press('#nm','Enter');await p.waitForTimeout(300);
ck('duplicate shows the reason',/already in the list/.test(await p.innerText('#ms')));
await p.click('summary');await p.fill('#bk','Brook Dental\nDart Motors\nTamar Print');await p.click('#ab');await p.waitForTimeout(300);
ck('paste reports added and skipped',/Added 2, skipped 1/.test(await p.innerText('#ms')),await p.innerText('#ms'));
await p.fill('#fq','tam');ck('search filters',/Tamar Print/.test(await p.innerText('#ls'))&&!/Brook/.test(await p.innerText('#ls')));await p.fill('#fq','');
await p.click('button[data-a=edit]');await p.fill('#ei','Brook Dental Ltd');await p.click('button[data-a=save]');await p.waitForTimeout(300);
ck('rename',/Brook Dental Ltd/.test(await t()));
await p.click('button[data-a=rm]');ck('remove asks first',/Remove this sponsor/.test(await t()));
await p.click('button[data-a=yes]');await p.waitForTimeout(300);ck('remove after confirming',!/Brook Dental Ltd/.test(await t())&&/2 of 300/.test(await t()),await t());
ck('no script errors',errs.length===0,errs.join(';'));
const wide=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ck('fits a phone',!wide);
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0)})();
