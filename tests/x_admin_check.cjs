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
c('save bar hidden at first',!(await p.isVisible('#sbar')));
c('menu order',JSON.stringify(await p.$$eval('.adn a[data-s]',a=>a.map(x=>x.dataset.s)))===JSON.stringify(['home','teams','notices','screens','match','status','data','privacy','access']));
await p.click('#fa+span');await p.waitForTimeout(100);
c('unsaved marker after a change',await p.isVisible('#sbar')&&await p.isVisible('#dirty')&&await p.isVisible('#dis'));
await p.screenshot({path:__dirname+'/x_admin_desktop.png'});
// every setting id still exists exactly once
for(const id of ['hon','ht','hu','ton','tt','tu','fa','fw','fc','fp','fo','fb','fv','fs','mon','mpun','mex','mpin','as','am']){c('id '+id,(await p.$$('#'+id)).length===1)}
c('sections hold the right controls',await p.$('#s-screens #fa')&&await p.$('#s-data #fb')&&await p.$('#s-privacy #fv')&&await p.$('#s-status #mon')&&await p.$('#s-notices #ht')&&await p.$('#s-access input[name="sd"]')&&await p.$('#s-match a[href="/matchsheet"]'));
c('tools links present',(await p.$$eval('.adn a',a=>a.map(x=>x.getAttribute('href')))).filter(h=>['/usage','/docs','/matchsheet','/?view=teams'].includes(h)).length===4&&!(await p.$$eval('.adn a',a=>a.some(x=>x.getAttribute('href')==='/release-notes'))));
await p.close();
// phone
({p,errs}=await open(390,844));
c('phone: no page errors',errs.length===0);
c('phone opens on Overview',await p.isVisible('#s-home')&&await p.isVisible('#adn'));
c('phone: tabs are one row',await p.$eval('#adn',e=>e.scrollWidth>e.clientWidth&&getComputedStyle(e).flexDirection==='row'));
c('phone: no back link',(await p.$$('.sback')).length===0);
await p.click('.adn a[data-s="status"]');await p.waitForTimeout(200);
c('phone: tab switches section',await p.isVisible('#s-status')&&!(await p.isVisible('#s-home'))&&await p.isVisible('#adn'));
c('phone: save bar hidden until changed',!(await p.isVisible('#sbar')));
await p.click('.adn a[data-s="notices"]');await p.waitForTimeout(200);
c('phone: date boxes fit their card',await p.$$eval('#hu,#tu',a=>a.every(e=>{var r=e.getBoundingClientRect(),q=e.closest('.card,.nb,section').getBoundingClientRect();return r.right<=q.right+1&&r.width>0})));
await p.screenshot({path:__dirname+'/x_admin_phone.png'});
await p.close();
({p,errs}=await open(390,844,'#data'));
c('deep link opens the section',await p.isVisible('#s-data')&&await p.isVisible('#fb'));

// Our teams (v3.29): rename, reorder, add (search then league), change league, remove, and Save sends the list
{
 const {p,errs}=await open(1280,900);let posted=null;
 await p.route('https://thestatsboard.co.uk/api/builder/search**',r=>r.fulfill({json:{teams:[{id:'555',name:'Plymouth Albion'},{id:'11039',name:'Ivybridge'}]}}));
 await p.route('https://thestatsboard.co.uk/api/builder/team**',r=>r.fulfill({json:{team:'555',name:'Plymouth Albion',leagues:[{competition:'1700',competitionName:'Regional 1',division:'80',divisionName:'Regional 1 South West'},{competition:'1800',competitionName:'Cup',division:'81',divisionName:'Cup Pool A'}]}}));
 await p.route('https://thestatsboard.co.uk/api/admin',r=>{posted=JSON.parse(r.request().postData());return r.fulfill({json:{ok:true,label:'now'}})});
 await p.click('.adn a[data-s="teams"]');await p.waitForTimeout(200);
 c('teams: section opens',await p.isVisible('#s-teams')&&!(await p.isVisible('#s-home')));
 c('teams: four team cards',(await p.$$('#tml .tm')).length===4);
 c('teams: save bar hidden until changed',!(await p.isVisible('#sbar')));
 await p.fill('#tml .tm:nth-child(1) .tn','First XV');
 c('teams: renaming marks unsaved',await p.isVisible('#sbar')&&await p.isVisible('#dirty'));
 await p.click('#tml .tm:nth-child(2) .up');await p.waitForTimeout(100);
 c('teams: move up swaps order',(await p.$$eval('#tml .tn',a=>a.map(x=>x.value))).slice(0,2).join()==='The Vandals,First XV');
 c('teams: first card cannot move up',await p.$eval('#tml .tm:nth-child(1) .up',e=>e.disabled));
 await p.fill('#tq','alb');await p.click('#tgo');await p.waitForTimeout(200);
 c('teams: search results listed',(await p.$$('#tr .tsb')).length===2);
 await p.click('#tr .tsb[data-id="11039"]');await p.waitForTimeout(100);
 c('teams: a team already listed is refused',/already on the list/.test(await p.textContent('#tm1'))&&(await p.$$('#tp .tlg')).length===0);
 await p.click('#tr .tsb[data-id="555"]');await p.waitForTimeout(200);
 c('teams: leagues offered',(await p.$$('#tp .tlg')).length===2);
 await p.click('#tp .tlg[data-k="0"]');await p.waitForTimeout(100);
 c('teams: no short label box',(await p.$$('#tml .ts')).length===0);
 c('teams: new team added with RFU name and league',(await p.$$('#tml .tm')).length===5&&(await p.$eval('#tml .tm:nth-child(5) .tn',e=>e.value))==='Plymouth Albion'&&/Regional 1 South West/.test(await p.textContent('#tml .tm:nth-child(5)')));
 await p.click('#tml .tm:nth-child(5) .ch');await p.waitForTimeout(200);
 await p.click('#tp .tlg[data-k="1"]');await p.waitForTimeout(100);
 c('teams: change league keeps the name, swaps the league',(await p.$$('#tml .tm')).length===5&&(await p.$eval('#tml .tm:nth-child(5) .tn',e=>e.value))==='Plymouth Albion'&&/Cup Pool A/.test(await p.textContent('#tml .tm:nth-child(5)')));
 await p.click('#tml .tm:nth-child(4) .rm');await p.waitForTimeout(100);
 c('teams: remove drops a card',(await p.$$('#tml .tm')).length===4);
 await p.click('#as');await p.waitForTimeout(300);
 const t=posted&&posted.club&&posted.club.teams;
 c('teams: Save sends the list in order',!!t&&t.length===4&&t[0].name==='The Vandals'&&t[1].name==='First XV'&&t[3].team==='555'&&t[3].division==='81'&&t[3].competition==='1800');
 c('teams: Save still sends the other settings',!!posted&&!!posted.notices&&!!posted.features&&!!posted.maintenance);
 c('teams: no page errors',errs.length===0);
 await p.screenshot({path:__dirname+'/x_admin_teams.png'});
 await p.close();
 const o=await open(390,844,'#teams');
 c('teams phone: deep link opens it and cards fit',await o.p.isVisible('#s-teams')&&await o.p.$$eval('#tml .tm',a=>a.every(e=>e.scrollWidth<=e.clientWidth+1)));
 c('teams phone: no sideways scroll',await o.p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
 await o.p.screenshot({path:__dirname+'/x_admin_teams_phone.png'});
 await o.p.close();
}
console.log(bad?'FAILED '+bad:'ALL OK');await b.close();process.exit(bad?1:0)})()
