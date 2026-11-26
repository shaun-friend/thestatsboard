const {chromium}=require('playwright');const fs=require('fs');
(async()=>{let f=0;const ck=(n,o,d)=>{console.log((o?'ok  ':'FAIL')+' '+n+(o?'':' '+(d||'')));if(!o)f++};
ck('page and API are behind the club PIN',JSON.parse(fs.readFileSync('w/splayers_gate.json','utf8')).g);
const html=fs.readFileSync('w/splayers_page.html','utf8');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const rows=()=>rows0().map(r=>({cur:true,last:-1,...r}));const rows0=()=>[{no:'1530430',rfu:'Wesley Vermigle',hidden:false,left:false,nm:'Wes Vermigle',own:true,sid:'aaaa1111',sponsor:'Smith Plumbing',alt:[]},{no:'5',rfu:'Aled Price',hidden:false,left:false,nm:'',own:false,sid:'',sponsor:'',alt:[]},{no:'2649651',rfu:'',hidden:true,left:false,nm:'',own:false,sid:'',sponsor:'',alt:[]},{no:'1313523',rfu:'Adam Lilley',hidden:false,left:false,nm:'',own:false,sid:'bbbb2222',sponsor:'Dart Motors',alt:['2380102']}];
let calls=[],posts=[];
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/sponsor-players')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/api/sponsor-players'){if(r.request().method()==='GET'){calls.push(u.search);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,teams:[{team:'11039',name:'Ivybridge 1XV'},{team:'11063',name:'The Vandals'}],team:u.searchParams.get('team')||'11039',season:u.searchParams.get('season')||'2026-2027',seasons:{prev:'2025-2026',cur:'2026-2027',next:'2027-2028'},sponsors:[{id:'aaaa1111',name:'Smith Plumbing'},{id:'bbbb2222',name:'Dart Motors'}],rows:rows(),squadError:''})})}
  posts.push(JSON.parse(r.request().postData()));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,copied:3})})}
 r.fulfill({status:200,body:'{}'})});
await p.goto('https://thestatsboard.co.uk/sponsor-players#admin');await p.waitForTimeout(400);
const t=()=>p.innerText('body');let x=await t();
ck('Admin tab shows Season set-up: scan button visible, list hidden',(await p.locator('#scb').isVisible())&&!(await p.locator('#hub').isVisible())&&/Admin/.test(await p.innerText('#h1')),x.slice(0,300));
ck('Admin has backup, logos and exports in the page and no links off it',await p.locator('#bd').count()===1&&await p.locator('#ld').count()===1&&await p.locator('#adm a').count()===0);
await p.click('#scb');await p.waitForTimeout(300);
ck('the scan button asks to read the team sheets from the start',posts.length===1&&posts[0].act==='scan'&&posts[0].offset===0&&posts[0].team==='11039',JSON.stringify(posts));posts.length=0;
await p.selectOption('#sa','2027-2028');await p.waitForTimeout(300);ck('changing season asks for that season',/season=2027-2028/.test(calls[calls.length-1]),calls.join());
await p.selectOption('#tm','11063');await p.waitForTimeout(300);ck('changing team asks for that team',/team=11063/.test(calls[calls.length-1]));
const cp=await p.locator('#cpb');ck('copy button offers last season',/Copy from 2026-2027/.test(await cp.innerText()));
await cp.click();ck('copy asks first',/Yes, copy from/.test(await cp.innerText()));
await cp.click();await p.waitForTimeout(300);ck('copy sends the request',posts.some(o=>o.act==='copy'&&o.from==='2026-2027'),JSON.stringify(posts));
await p.selectOption('#sa','2025-2026');await p.waitForTimeout(300);ck('no copy button on the oldest season',await p.locator('#cpb').isHidden());
ck('no script errors',errs.length===0,errs.join(';'));
ck('fits a phone',!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)));
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0)})();
