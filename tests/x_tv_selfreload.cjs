// The rotator checks its own address every 2 minutes and reloads itself when its settings or release number changed.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const html=fs.readFileSync('w/tv_screen.html','utf8');let served=html,shells=0;
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/ivybridge/tv'){shells++;return r.fulfill({status:200,contentType:'text/html',body:served})}
 if(u.pathname==='/')return r.fulfill({status:200,contentType:'text/html',body:'<body><h1>x</h1><script>setTimeout(function(){parent.postMessage("rfu-sr-ready","*")},100)</script></body>'});
 r.fulfill({status:200,body:''})});
await p.clock.install();await p.goto('https://sb.test/ivybridge/tv');
const adv=async(ms)=>{for(let t=0;t<ms;t+=5000){await p.clock.runFor(5000);await p.waitForTimeout(80)}};
await adv(10000);const s0=shells;
await adv(250000);await p.waitForTimeout(300);ck('unchanged settings: it checks but does not reload',shells===s0+2&&await p.evaluate(()=>document.querySelectorAll('iframe').length>0),shells+' vs '+s0);
served=html.replace('id="tvd">','id="tvd"> ');ck('test setup changed the settings',served!==html);
const before=shells;await adv(125000);await p.waitForTimeout(800);
ck('changed strip option: it reloads itself within 2 minutes',shells>=before+2,shells+' vs '+before);
served='<html><body>Enter PIN</body></html>';const b2=shells;await adv(250000);await p.waitForTimeout(500);
ck('a PIN or error page is not mistaken for a change (no reload)',shells===b2+2,shells+' vs '+b2);
ck('no script errors',errs.length===0,errs.join('|'));
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
