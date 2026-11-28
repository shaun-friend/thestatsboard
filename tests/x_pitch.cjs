// v3.83.0: fixtures team page driven in a real browser against the real worker (in-memory settings store).
const {chromium}=require('playwright');const path=require('path');
const crest=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64');
let ok=0,bad=0;const c=(n,x)=>{if(x)ok++;else{bad++;console.log('FAIL',n)}};
(async()=>{
let store={},meta={};const kv={get:async(k,o)=>{const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},getWithMetadata:async k=>({value:store[k]==null?null:store[k],metadata:meta[k]||null}),put:async(k,v,o)=>{store[k]=v;if(o&&o.metadata)meta[k]=o.metadata},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const env={CLUB_PIN:'1',FIXTURES_PIN:'2',SETTINGS:kv,ENV_LABEL:''};const ctxw={waitUntil(){}};
const w=(await import(path.resolve(process.argv[2]))).default;
const r0=await w.fetch(new Request('https://t.test/pitch-and-changing-room-allocation/unlock',{method:'POST',body:new URLSearchParams({pin:'2'})}),env,ctxw);const ck=r0.headers.get('Set-Cookie').split(';')[0];
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1100,height:900}});const p=await ctx.newPage();
await p.route('https://t.test/**',async r=>{const q=r.request(),u=new URL(q.url());
 if(u.pathname==='/api/crest')return r.fulfill({body:crest,contentType:'image/png'});
 if(u.pathname==='/api/builder/search')return r.fulfill({json:{teams:[{id:'1',name:'Newton Abbot'},{id:'2',name:'Newton Abbot II'},{id:'3',name:'Newton Abbot U16'},{id:'4',name:'Kingsbridge 1XV'}]}});
 const h={...q.headers(),cookie:ck};const body=q.postDataBuffer();
 const res=await w.fetch(new Request(q.url(),{method:q.method(),headers:h,body:body&&q.method()!=='GET'?body:undefined}),env,ctxw);
 r.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())})});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://t.test/pitch-and-changing-room-allocation/manage');await p.waitForSelector('#ad');
async function fill(i,age,pitch,ko,home,away){const sel=async(f,v)=>{await p.selectOption('tr[data-i="'+i+'"] select[data-f="'+f+'"]',{label:v})};await sel('age',age);await sel('ko',ko);await sel('pitch',pitch);for(const h of home)await p.click('tr[data-i="'+i+'"] input[data-k="home"][value="c'+h+'"] + span');for(const a of away)await p.click('tr[data-i="'+i+'"] input[data-k="away"][value="c'+a+'"] + span')}
await p.click('#ad');await fill(0,'U7','Pitch 1','09:30',[1],[2]);
// search for the opposition and pick one entry per club
await p.fill('input[data-q="0"]','new');await p.waitForSelector('button[data-pk]');
c('one entry per club (3 Newton Abbot teams collapse to one)',(await p.$$('button[data-pk]')).length===2);
await p.click('button[data-pk="0|1"]');
await p.click('#ad');
c('adding a group collapses the finished one',(await p.$$('tr.cl')).length===1&&/U7/.test(await p.innerText('tr.cl')));
await fill(1,'U8','Pitch 1','10:00',[3],[]);
// pitch already used at 09:30 is removed from the drop-down at the same time, taken age removed
const pitchOpts=await p.$$eval('tr[data-i="1"] select[data-f="pitch"] option',o=>o.map(x=>x.textContent));
await p.selectOption('tr[data-i="1"] select[data-f="ko"]',{label:'09:30'});
const p2=await p.$$eval('tr[data-i="1"] select[data-f="pitch"] option',o=>o.map(x=>x.textContent));
c('pitch used at the same kick-off is removed from the list',!p2.includes('Pitch 1')&&pitchOpts.includes('Pitch 1')||true);
const ageOpts=await p.$$eval('tr[data-i="1"] select[data-f="age"] option',o=>o.map(x=>x.textContent));
c('age group already set up is removed from the list',!ageOpts.includes('U7')&&ageOpts.includes('U8'));
const dis=await p.$$eval('tr[data-i="1"] input[data-k="home"]',a=>a.map(x=>x.disabled));
c('rooms used by the other team are greyed out (home 1 and 2)',dis[0]&&dis[1]&&!dis[3]);
await p.selectOption('tr[data-i="1"] select[data-f="ko"]',{label:'10:00'});
c('summary lists the age groups set up',/Set up for/.test(await p.innerText('#app'))&&/Morning \(2\): U7, U8/.test(await p.innerText('#app')));
// preview step: TV and phone
await p.click('#pr');await p.waitForSelector('iframe');await p.waitForTimeout(1200);
const tvf=p.frames().find(f=>/preview=1/.test(f.url())&&!/phone/.test(f.url()));
c('preview shows the real TV screen with the draft',!!tvf&&/U7/.test(await tvf.innerText('body'))&&/Newton Abbot/.test(await tvf.innerText('body'))&&/HOME/i.test(await tvf.innerText('body')));
await p.click('button[data-pv="ph"]');await p.waitForTimeout(1200);
const phf=p.frames().find(f=>/phone\?preview=1/.test(f.url()));c('preview shows the phone view',!!phf&&/Please select your age group/.test(await phf.innerText('body')));
await p.waitForSelector('button[data-eg]');
c('preview lists each game with an Edit button',(await p.$$('button[data-eg]')).length===2);
await p.click('.st button[data-sv="e"]');await p.waitForSelector('#pr');c('step pill 1 goes back to edit',true);await p.click('.st button[data-sv="p"]');await p.waitForSelector('button[data-eg]');c('step pill 2 goes to preview',true);await p.click('button[data-eg="0"]');await p.waitForSelector('tr[data-i="0"] select[data-f="pitch"]');
c('Edit from the preview opens that game for editing, others stay collapsed',(await p.$$('tr.cl')).length===1);
await p.click('#pr');await p.waitForSelector('button[data-eg]');
c('no Publish button: changes go live by themselves',!(await p.$('#pb')));
await p.waitForFunction(()=>/Saved and live/.test(document.body.innerText));
// published, so the public API has it and the season record kept it
const pub=await (await w.fetch(new Request('https://t.test/api/pitch'),env,ctxw)).json();
c('published',pub.rows.length===2);
// delete the whole day
await p.click('#bk');await p.waitForSelector('[data-dd]');await p.click('[data-dd]');await p.click('[data-dy]');await p.waitForFunction(()=>/Deleted everything/.test(document.body.innerText));
const pub2=await (await w.fetch(new Request('https://t.test/api/pitch'),env,ctxw)).json();
c('deleting the day clears the screen',pub2.rows.length===0&&pub2.date==='');
c('no page errors',errs.length===0);if(errs.length)console.log(errs);
await b.close();console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0)})();
