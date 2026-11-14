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
 c('match centre '+n+': heading reads Win Predictor',(await p.locator('.wc:visible .wch').first().innerText()).toLowerCase()==='win predictor');
 c('match centre '+n+': no team names repeated in the bar',await p.locator('.wc:visible .wcn').count()===0);
 c('match centre '+n+': how-it-works hidden on a big screen',await p.locator('.wcx:visible').count()===0);
 const wb=await p.$eval('.wc:visible',e=>{const r=e.getBoundingClientRect(),q=e.closest('.cnx,.hero,.bx').getBoundingClientRect();return r.top>=q.top&&r.bottom<=q.bottom+1&&r.left>=q.left&&r.right<=q.right+1});
 c('match centre '+n+': bar sits inside its card',wb);
 c('match centre '+n+': nothing clipped past the screen',await p.evaluate(()=>document.documentElement.scrollHeight<=window.innerHeight+1&&document.documentElement.scrollWidth<=window.innerWidth+1));
 c('match centre '+n+': a team without a prediction shows no bar and no gap',await p.locator('.wc:visible').count()<await p.locator(n==='modern'?'.cw':'.rw').count());
 c('match centre '+n+': no page errors',errs.length===0);
 await p.screenshot({path:__dirname+'/w/wc_mc_'+n+'.png'});await p.close();
}
({p,errs}=await open('wc_mc_classic.html',390,844));
c('match centre phone: bar fits the width',await p.evaluate(()=>{const e=document.querySelector('.wc');if(!e)return false;const r=e.getBoundingClientRect();return r.left>=0&&r.right<=391}));
c('match centre phone: how-it-works shown',await p.locator('.wcx:visible').count()>=1);
c('match centre phone: no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
await p.close();
console.log(bad?'FAILED '+bad:'ALL OK');await b.close();process.exit(bad?1:0)})()
