const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const g=JSON.parse(fs.readFileSync('w/sponsors_gate.json','utf8'));let f=0;const ck=(n,o,d)=>{console.log((o?'ok  ':'FAIL')+' '+n+(o?'':' '+(d||'')));if(!o)f++};
ck('page and API are behind the club PIN',g.gateOk&&g.apiGate);
const html=fs.readFileSync('w/sponsors_page.html','utf8');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:800}});
let items=[],n=0,posts=[];const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/sponsors')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/api/sponsor-players'){if(r.request().method()==='GET')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,team:'11039',rows:[{no:'5',rfu:'Aled Price',nm:'',own:false,cur:true,sid:'',sponsor:''},{no:'9',rfu:'Zed Retired',nm:'',own:false,cur:false,sid:'',sponsor:''},{no:'7',rfu:'Wesley Vermigle',nm:'Wes Vermigle',own:true,cur:true,sid:'zz',sponsor:'Smith Plumbing'}]})});
  const o=JSON.parse(r.request().postData());posts.push(o);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,changed:o.nos.length})})}
 if(u.pathname==='/api/sponsors'){if(r.request().method()==='GET'){if(u.searchParams.get('id'))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,id:u.searchParams.get('id'),name:'x',players:[{no:'1530430',name:'Wes Vermigle',team:'Ivybridge 1XV'},{no:'2649651',name:'',team:'The Vandals'}],teams:[{team:'11039',name:'Ivybridge 1XV'},{team:'11063',name:'The Vandals'}],season:'2026-2027'})});return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,items,max:300,use:{},season:'2026-2027'})})}
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
await p.click('button[data-a=open] >> nth=0');await p.waitForTimeout(400);
ck('tapping a sponsor opens its players',/players with this sponsor/i.test(await t())&&/Wes Vermigle/.test(await t())&&/Name redacted/.test(await t()),await t());
const rh=await p.evaluate(()=>Math.round(document.querySelectorAll('.sr')[1].getBoundingClientRect().height));ck('each sponsor sits on one line',rh<=56,String(rh));
const lis=await p.evaluate(()=>document.querySelectorAll('.sr').length);ck('every sponsor has a row',lis===3,String(lis));
ck('players to add exclude non-current and show the sponsor they have now',/Aled Price/.test(await p.innerText('#pl'))&&!/Zed Retired/.test(await p.innerText('#pl'))&&/now Smith Plumbing/.test(await p.innerText('#pl')),await p.innerText('#pl'));
await p.uncheck('#ac');ck('untick Current players only shows everyone',/Zed Retired/.test(await p.innerText('#pl')));await p.check('#ac');
ck('add button is off until someone is ticked',await p.locator('#aa').isDisabled());
await p.check('input[data-no="5"]');ck('add button counts the ticks',/Add 1 player/.test(await p.innerText('#aa')));
await p.click('#aa');await p.waitForTimeout(300);
ck('add sends the sponsor and the player numbers',posts.length===1&&posts[0].act==='assign'&&posts[0].nos.join()==='5'&&posts[0].team==='11039'&&/^0+\d$/.test(posts[0].s),JSON.stringify(posts));posts.length=0;
await p.locator('button[data-a=drop]').first().click();await p.waitForTimeout(300);
ck('removing a player sends an empty sponsor',posts.length===1&&posts[0].s===''&&posts[0].nos.join()==='1530430',JSON.stringify(posts));posts.length=0;
await p.fill('#ei','Brook Dental Ltd');await p.click('button[data-a=save]');await p.waitForTimeout(300);
ck('rename',/Brook Dental Ltd/.test(await t()));
await p.click('button[data-a=rm]');ck('remove asks first',/Remove this sponsor/.test(await t()));
await p.click('button[data-a=yes]');await p.waitForTimeout(300);ck('remove after confirming',!/Brook Dental Ltd/.test(await t())&&/2 of 300/.test(await t()),await t());
ck('no script errors',errs.length===0,errs.join(';'));
const wide=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ck('fits a phone',!wide);
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0)})();
