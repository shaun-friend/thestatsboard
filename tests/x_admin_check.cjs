const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();let bad=0;const c=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}};
const html=require('fs').readFileSync(__dirname+'/x_admin.html','utf8');
async function open(w,h,hash){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route('https://thestatsboard.co.uk/**',r=>{const u=r.request().url();if(u.includes('/api/usage'))return r.fulfill({json:{perDay:[{d:'x',people:'30'}],tvDay:[{d:'x',screens:'5'}]}});return r.fulfill({contentType:'text/html',body:html})});
await p.goto('https://thestatsboard.co.uk/admin'+(hash||''));await p.waitForTimeout(500);return {p,errs}}
// desktop
let {p,errs}=await open(1280,900);
c('no page errors',errs.length===0);
c('desktop opens on Overview',await p.isVisible('#s-home')&&!(await p.isVisible('#s-screens')));
c('overview shows visitors and screens',(await p.textContent('#ovp'))==='30'&&(await p.textContent('#ovs'))==='5');
await p.click('.adn a[data-s="screens"]');await p.waitForTimeout(200);
c('menu opens Screens only',await p.isVisible('#s-screens')&&!(await p.isVisible('#s-home'))&&(await p.getAttribute('.adn a[data-s="screens"]','class')).includes('on'));
c('save bar clean at first',!(await p.isVisible('#dirty')));
await p.click('#fa+span');await p.waitForTimeout(100);
c('unsaved marker after a change',await p.isVisible('#dirty')&&await p.isVisible('#dis'));
await p.screenshot({path:__dirname+'/x_admin_desktop.png'});
// every setting id still exists exactly once
for(const id of ['hon','ht','hu','ton','tt','tu','fa','fw','fc','fp','fo','fb','fv','fs','mon','mpun','mex','mpin','as','am']){c('id '+id,(await p.$$('#'+id)).length===1)}
c('sections hold the right controls',await p.$('#s-screens #fa')&&await p.$('#s-data #fb')&&await p.$('#s-privacy #fv')&&await p.$('#s-status #mon')&&await p.$('#s-notices #ht')&&await p.$('#s-access input[name="sd"]')&&await p.$('#s-match a[href="/matchsheet"]'));
c('tools links present',(await p.$$eval('.adn a',a=>a.map(x=>x.getAttribute('href')))).filter(h=>['/usage','/docs','/release-notes','/matchsheet','/?view=teams'].includes(h)).length===5);
await p.close();
// phone
({p,errs}=await open(390,844));
c('phone: no page errors',errs.length===0);
c('phone opens on the menu list',await p.isVisible('#adn')&&!(await p.isVisible('#s-home')));
await p.click('.adn a[data-s="status"]');await p.waitForTimeout(200);
c('phone: section replaces menu',await p.isVisible('#s-status')&&!(await p.isVisible('#adn')));
c('phone: back link visible',await p.isVisible('#s-status .sback'));
await p.screenshot({path:__dirname+'/x_admin_phone.png'});
await p.click('#s-status .sback');await p.waitForTimeout(200);
c('phone: back returns to menu',await p.isVisible('#adn'));
await p.close();
({p,errs}=await open(390,844,'#data'));
c('deep link opens the section',await p.isVisible('#s-data')&&await p.isVisible('#fb'));
console.log(bad?'FAILED '+bad:'ALL OK');await b.close();process.exit(bad?1:0)})()
