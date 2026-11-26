// Admin TV section interactions (needs w/tv_admin.html from x_tv_admin_render.mjs). Prints "ALL OK" last.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c)=>{if(!c){bad++;console.log('FAIL',n)}};
for(const [W,H] of [[1280,1000],[390,844]]){
const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));let posted=null;
const html=fs.readFileSync('w/tv_admin.html','utf8');
await p.route('**/*',r=>{const rq=r.request(),u=rq.url();
 if(u==='https://sb.test/admin')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.includes('/api/admin')&&rq.method()==='POST'){posted=JSON.parse(rq.postData());return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"label":"now"}'})}
 if(u.includes('/api/crest?id=11039'))return r.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64')});
 if(u.includes('/api/crest'))return r.fulfill({status:404,body:'no'});
 r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.goto('https://sb.test/admin#tv');await p.waitForTimeout(400);
const grp=i=>p.locator('.tvg').nth(i);
ck('team with a crest shows it in its header',await p.locator('.tvg .tvh img.tvcr').count()>=1&&(await p.locator('.tvg').nth(1).locator('.tvh img.tvcr').count())===1);
ck('team whose crest is missing keeps its badge',(await p.locator('.tvg .tvh .tvb2').count())>=1);
await grp(1).locator('.tvpri').click();                 // add all for 1XV
ck('add all gives 4 rows',await grp(1).locator('.tvr').count()===4);
await grp(0).locator('.tvadd',{hasText:'Match Centre'}).click();                  // match centre
ck('centre added',await grp(0).locator('.tvr').count()===1);
await grp(1).locator('.tvr').nth(3).locator('.tvx').click(); // remove leaders
ck('remove works',await grp(1).locator('.tvr').count()===3);
ck('by default no day buttons show, only Shows every day',await grp(1).locator('.tvdb').count()===0&&(await grp(1).locator('.tvdl').first().innerText())==='Shows every day');
await grp(1).locator('.tvlk').first().click();
ck('Choose days opens the day buttons and presets',await grp(1).locator('.tvdb').count()===9);
await grp(1).locator('.tvdb.pre',{hasText:'Weekends'}).first().click();
ck('a limited page says so and stays open',(await grp(1).locator('.tvdl').first().innerText())==='Weekends only'&&await grp(1).locator('.tvdb').count()===9);
await grp(1).locator('.tvlk').first().click();
ck('Done closes it and keeps the limit',await grp(1).locator('.tvdb').count()===0&&(await grp(1).locator('.tvlk').first().innerText())==='Change');
await grp(1).locator('.tvlk').first().click();await grp(1).locator('.tvdb.pre',{hasText:'Every day'}).first().click();ck('Every day goes back to the default line',(await grp(1).locator('.tvdl').first().innerText())==='Shows every day');await grp(1).locator('.tvlk').first().click();
await grp(1).locator('.tvadd').click();                  // opens missing list
ck('missing list offers Leaders',(await grp(1).locator('.tvad').innerText()).includes('League Leaders'));
await grp(1).locator('.tvadd',{hasText:'League Leaders'}).click();
ck('leaders back',await grp(1).locator('.tvr').count()===4);
await grp(1).locator('.tvr').nth(0).locator('.tvm button').nth(1).click(); // move down
ck('moved down',(await grp(1).locator('.tvr').nth(1).locator('.pn').innerText())==='Fixtures board');
const sb=grp(1).locator('.tvr').nth(0).locator('.tvsc button').nth(1);await sb.click();
ck('secs +5 (Fixtures now row 1)',true);
await grp(2).locator('.tvh input').evaluate(e=>e.click()); // switch Vandals off
await grp(0).locator('.tvh button').nth(1).click();     // move All teams down
ck('team moved',(await grp(0).locator('.tn b').innerText())!=='All teams');
const sum=await p.$eval('#tvsum',e=>e.textContent);ck('summary counts 5 pages',/^5 pages on/.test(sum));
const tot=await p.$eval('#tvtot',e=>e.textContent);const tm=/\((\d+) seconds\) · 5 pages/.exec(tot),sm=/about (?:(\d+) min )?(\d+) s/.exec(sum);ck('total box shows seconds and pages',!!tm,tot);ck('total box matches the summary',!!(tm&&sm&&Number(tm[1])===Number(sm[1]||0)*60+Number(sm[2])),tot+' | '+sum);ck('total box visible',await p.isVisible('#tvtot'));
await p.click('#as');await p.waitForTimeout(300);
ck('posted tv',posted&&posted.tv&&posted.tv.items.length===5&&posted.tv.off.includes(posted.tv.order.find((k,i)=>k===String(posted.tv.order[i])&&posted.tv.off.includes(k))));
ck('order has all teams',posted&&posted.tv.order.length===5&&posted.tv.order.includes('all'));
fs.writeFileSync('w/tv_posted.json',JSON.stringify(posted.tv));
ck('no js errors '+W,errs.length===0);
if(errs.length)console.log(errs);
await p.screenshot({path:'/tmp/tvadm_pop_'+W+'.png',fullPage:true});await p.close()}
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
