const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const c=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}};
const get=async(n,w,h)=>{const p=await b.newPage({viewport:{width:w,height:h}});
 await p.route('**/*',r=>r.request().resourceType()==='document'&&r.request().url().startsWith('https://sb.test/')?r.fulfill({status:200,contentType:'text/html',body:fs.readFileSync('w/nm_'+n+'.html','utf8')}):r.abort());
 await p.goto('https://sb.test/x');await p.waitForTimeout(500);
 const o=await p.evaluate(()=>({stats:!!document.querySelector('.stats'),tvbody:!!document.querySelector('.tvbody'),pill:(document.querySelector('.nextm')||{}).textContent||'',rows:document.querySelectorAll('tr.nextrow').length,tag:!!document.querySelector('tr.nextrow .nmtag'),heads:[...document.querySelectorAll('.panel h2')].filter(e=>e.offsetParent).map(e=>e.textContent),txt:document.body.innerText,over:document.documentElement.scrollHeight>innerHeight+2}));
 await p.close();return o};
const tv=await get('tv',1920,1080),ph=await get('ph',390,844);
c('tv no tiles',!tv.stats);c('tv body',tv.tvbody);c('pill',/Next match/.test(tv.pill)&&/Cullompton/.test(tv.pill)&&/Home|Away/.test(tv.pill)&&/Today|Tomorrow|This|Next|\d/.test(tv.pill));
c('one next row',tv.rows===1&&tv.tag);c('only snapshot panel',tv.heads.length===1&&tv.heads[0]==='Season snapshot');
c('no recent form',!/Recent form/.test(tv.txt));c('no next fixture panel',!/Next fixture/.test(tv.txt));c('no averages',!/AVERAGE SCORED|AVERAGE CONCEDED/i.test(tv.txt.split('SEASON SNAPSHOT')[1]||''));
c('tv no scroll',!tv.over);
c('phone keeps tiles',ph.stats&&!ph.tvbody&&ph.rows===0&&!ph.pill);c('phone keeps panels',['Recent form • last five','Latest results','Next fixture'].every(h=>ph.heads.includes(h)));
await b.close();console.log(bad?'FAILED':'ALL OK')})()
