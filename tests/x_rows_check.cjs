// v3.30.16: Match Centre rows with 5 and 6 teams and the Win Predictor on: nothing is cut off in any box, at TV and iPad sizes
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;
for(const N of [5,6]){const html=fs.readFileSync(__dirname+'/w/rows_'+N+'.html','utf8');
 for(const [w,h] of [[1920,1080],[1366,768],[1280,800],[1180,820],[1180,700],[1149,640],[1024,768]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.setContent(html);await p.waitForTimeout(500);
  const r=await p.evaluate(()=>({cut:[...document.querySelectorAll('.rw>.bx,.rw>.stab')].filter(e=>e.offsetParent&&e.scrollHeight>e.clientHeight+1).length,bars:document.querySelectorAll('.rw .wc').length,many:document.body.classList.contains('rows-many')}));
  if(r.cut||r.bars!==N||!r.many){bad++;console.log('FAIL',N,w+'x'+h,JSON.stringify(r))}await p.close()}}
await b.close();console.log(bad?'FAILED '+bad:'ALL OK');process.exit(bad?1:0)})()
