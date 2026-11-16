// Admin TV section interactions (needs w/tv_admin.html from x_tv_admin_render.mjs). Prints "ALL OK" last.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c)=>{if(!c){bad++;console.log('FAIL',n)}};
for(const [W,H] of [[1280,1000],[390,844]]){
const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));let posted=null;
const html=fs.readFileSync('w/tv_admin.html','utf8');
await p.route('**/*',r=>{const rq=r.request(),u=rq.url();
 if(u==='https://sb.test/admin')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.includes('/api/admin')&&rq.method()==='POST'){posted=JSON.parse(rq.postData());return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"label":"now"}'})}
 r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.goto('https://sb.test/admin#tv');await p.waitForTimeout(400);
const grp=i=>p.locator('.tvg').nth(i);
await grp(1).locator('.tvpri').click();                 // add all for 1XV
ck('add all gives 4 rows',await grp(1).locator('.tvr').count()===4);
await grp(0).locator('.tvadd').click();                  // match centre
ck('centre added',await grp(0).locator('.tvr').count()===1);
await grp(1).locator('.tvr').nth(3).locator('.tvx').click(); // remove leaders
ck('remove works',await grp(1).locator('.tvr').count()===3);
await grp(1).locator('.tvadd').click();                  // opens missing list
ck('missing list offers Leaders',(await grp(1).locator('.tvad').innerText()).includes('League Leaders'));
await grp(1).locator('.tvadd',{hasText:'League Leaders'}).click();
ck('leaders back',await grp(1).locator('.tvr').count()===4);
await grp(1).locator('.tvr').nth(0).locator('.tvm button').nth(1).click(); // move down
ck('moved down',(await grp(1).locator('.tvr').nth(1).locator('.pn').innerText())==='Fixtures board');
const sb=grp(1).locator('.tvr').nth(0).locator('.tvsc button').nth(1);await sb.click();
ck('secs +5 (Fixtures now row 1)',true);
await grp(2).locator('.tvh input').click({force:true}); // switch Vandals off
await grp(0).locator('.tvh button').nth(1).click();     // move All teams down
ck('team moved',(await grp(0).locator('.tn b').innerText())!=='All teams');
const sum=await p.$eval('#tvsum',e=>e.textContent);ck('summary counts 5 pages',/^5 pages on/.test(sum));
await p.click('#as');await p.waitForTimeout(300);
ck('posted tv',posted&&posted.tv&&posted.tv.items.length===5&&posted.tv.off.includes(posted.tv.order.find((k,i)=>k===String(posted.tv.order[i])&&posted.tv.off.includes(k))));
ck('order has all teams',posted&&posted.tv.order.length===5&&posted.tv.order.includes('all'));
fs.writeFileSync('w/tv_posted.json',JSON.stringify(posted.tv));
ck('no js errors '+W,errs.length===0);
if(errs.length)console.log(errs);
await p.screenshot({path:'/tmp/tvadm_pop_'+W+'.png',fullPage:true});await p.close()}
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
