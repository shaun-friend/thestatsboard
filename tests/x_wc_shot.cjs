const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const c=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}else console.log('ok  ',n)};
async function open(file,w,h){const html=fs.readFileSync(__dirname+'/w/'+file,'utf8');const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route('https://thestatsboard.co.uk/**',r=>{const u=r.request().url();if(u.includes('/api/crest')||/\.(png|jpg|svg)/.test(u))return r.fulfill({status:204,body:''});return r.fulfill({contentType:'text/html',body:html})});
await p.goto('https://thestatsboard.co.uk/?x');await p.waitForTimeout(1800);return {p,errs}}
const box=async(p,sel)=>p.$eval(sel,e=>{const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,h:r.height}});
// Match Stats at TV size
let {p,errs}=await open('wc_match.html',1920,1080);
c('match stats: no page errors',errs.length===0);
let bx=await box(p,'.wc');c('match stats: bar is on screen at 1080p',bx.t>0&&bx.b<=1080&&bx.r<=1920);
c('match stats: nothing scrolls',await p.evaluate(()=>document.documentElement.scrollHeight<=window.innerHeight+2));
c('match stats: how-it-works hidden on a big screen',!(await p.isVisible('.wcx')));
await p.screenshot({path:__dirname+'/w/wc_match_tv.png'});await p.close();
// Match Stats on a phone
({p,errs}=await open('wc_match.html',390,844));
bx=await box(p,'.wc');c('match stats phone: bar fits the width',bx.l>=0&&bx.r<=391);
c('match stats phone: how-it-works shown',await p.isVisible('.wcx'));
c('match stats phone: no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
await p.screenshot({path:__dirname+'/w/wc_match_phone.png',fullPage:true});await p.close();
// Dashboard TV
({p,errs}=await open('wc_tv.html',1920,1080));
c('dashboard tv: no page errors',errs.length===0);
bx=await box(p,'.wc');const pn=await box(p,'.next-fixture-panel');c('dashboard tv: bar sits inside its panel',bx.t>=pn.t&&bx.b<=pn.b+1);
c('dashboard tv: venue line still inside the panel',await p.evaluate(()=>{const v=document.querySelector('.next-venue');if(!v)return true;const r=v.getBoundingClientRect(),q=document.querySelector('.next-fixture-panel').getBoundingClientRect();return r.bottom<=q.bottom+1}));
await p.screenshot({path:__dirname+'/w/wc_dash_tv.png'});await p.close();
// Dashboard TV on a smaller screen
({p,errs}=await open('wc_tv.html',1366,768));
bx=await box(p,'.wc');const pn2=await box(p,'.next-fixture-panel');c('dashboard tv 768p: bar sits inside its panel',bx.t>=pn2.t&&bx.b<=pn2.b+1);
c('dashboard tv 768p: venue line still inside the panel',await p.evaluate(()=>{const v=document.querySelector('.next-venue');if(!v)return true;const r=v.getBoundingClientRect(),q=document.querySelector('.next-fixture-panel').getBoundingClientRect();return r.bottom<=q.bottom+1}));
await p.screenshot({path:__dirname+'/w/wc_dash_tv768.png'});await p.close();
// Dashboard phone
({p,errs}=await open('wc_mobile.html',390,844));
bx=await box(p,'.wc');c('dashboard phone: bar fits the width',bx.l>=0&&bx.r<=391);
c('dashboard phone: how-it-works shown and opens',await p.isVisible('.wcx')&&(await p.click('.wcx summary'),await p.waitForTimeout(150),await p.isVisible('.wcx p')));
c('dashboard phone: no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
await p.locator('.wc:visible').first().scrollIntoViewIfNeeded();await p.screenshot({path:__dirname+'/w/wc_dash_phone.png'});await p.close();
// Match Centre: Modern and Classic on a TV, and the stacked cards on a phone
for(const [f,n] of [['wc_mc_next.html','modern'],['wc_mc_classic.html','classic']]){
 ({p,errs}=await open(f,1920,1080));
 c('match centre '+n+': Win Predictor bar shown',await p.locator('.wc:visible').count()>=1);
 c('match centre '+n+': heading reads Win Predictor',(await p.locator('.wc:visible .wch').first().innerText()).toLowerCase()==='win predictor / game difficulty');
 c('match centre '+n+': each side of the bar says whose it is',(await p.locator('.wc:visible .wcb i em').count())>=1);
 c('match centre '+n+': how-it-works hidden on a big screen',await p.locator('.wcx:visible').count()===0);
 const wb=await p.$eval('.wc:visible',e=>{const r=e.getBoundingClientRect(),q=e.closest('.cnx,.hero,.bx').getBoundingClientRect();return r.top>=q.top&&r.bottom<=q.bottom+1&&r.left>=q.left&&r.right<=q.right+1});
 c('match centre '+n+': bar sits inside its card',wb);
 c('match centre '+n+': nothing clipped past the screen',await p.evaluate(()=>document.documentElement.scrollHeight<=window.innerHeight+1&&document.documentElement.scrollWidth<=window.innerWidth+1));
 c('match centre '+n+': a team without a prediction shows no bar and no gap',await p.locator('.wc:visible').count()<await p.locator(n==='modern'?'.cw':'.rw').count());
 c('match centre '+n+': no page errors',errs.length===0);
 await p.screenshot({path:__dirname+'/w/wc_mc_'+n+'.png'});await p.close();
}
// Match Centre Modern: the columns line up whether or not a team has a bar, a ground line or a "2nd v 3rd" line, and whatever the name length
({p,errs}=await open('wc_mc_next.html',1920,1080));
await p.evaluate(()=>{const cols=[...document.querySelectorAll('.cw')];
 const w2=cols[1].querySelector('.nw');if(w2)w2.innerHTML='';
 const q3=cols[2].querySelector('.oq');if(q3)q3.innerHTML='';
 const n1=cols[0].querySelector('.on');if(n1)n1.textContent='Okehampton';});
const tops=await p.evaluate(()=>{const cols=[...document.querySelectorAll('.cw')].slice(0,3);const t=s=>cols.map(c=>{const e=c.querySelector(s);return e?Math.round(e.getBoundingClientRect().top):null});return {od:t('.od'),oc:t('.oc'),og:t('.og'),cr:t('.cnx .cr'),k:t('.cnx .k')}});
const same=a=>a.every(v=>v!==null&&Math.abs(v-a[0])<=1);
c('modern: NEXT GAME heading lines up',same(tops.k));c('modern: crest lines up',same(tops.cr));
c('modern: date lines up whatever the name length',same(tops.od));c('modern: Home/Away row lines up',same(tops.oc));
c('modern: ground line lines up with no bar or no clash line in some columns',same(tops.og));
await p.screenshot({path:__dirname+'/w/wc_mc_align.png'});await p.close();
({p,errs}=await open('wc_mc_next.html',1366,768));
c('modern 1366x768: nothing in the coloured block is cut off at the bottom',await p.evaluate(()=>[...document.querySelectorAll('.cnx')].every(b=>{const r=b.getBoundingClientRect();return [...b.children].every(ch=>ch.getBoundingClientRect().bottom<=r.bottom+1)})));
c('modern 1366x768: name and date do not overlap',await p.evaluate(()=>[...document.querySelectorAll('.cnx')].every(b=>{const n=b.querySelector('.onw'),d=b.querySelector('.od');return !n||!d||n.getBoundingClientRect().bottom<=d.getBoundingClientRect().top+1})));
// Match Centre Modern: nothing overflows the coloured block at any common screen size
for(const [w,h] of [[1920,1080],[1366,768],[1280,800],[1180,820],[1180,700],[1149,640],[1024,768],[1024,600],[2560,1440]]){
 await p.setViewportSize({width:w,height:h});
 c('modern '+w+'x'+h+': nothing overflows the coloured block',await p.evaluate(()=>[...document.querySelectorAll('.cnx')].every(b=>b.scrollHeight<=b.clientHeight)))}
await p.screenshot({path:__dirname+'/w/wc_mc_align768.png'});await p.close();
({p,errs}=await open('wc_mc_classic.html',390,844));
c('match centre phone: bar fits the width',await p.evaluate(()=>{const e=document.querySelector('.wc');if(!e)return false;const r=e.getBoundingClientRect();return r.left>=0&&r.right<=391}));
c('match centre phone: how-it-works shown',await p.locator('.wcx:visible').count()>=1);
c('match centre phone: no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
await p.close();
console.log(bad?'FAILED '+bad:'ALL OK');await b.close();process.exit(bad?1:0)})()
