const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const html=fs.readFileSync(__dirname+'/w/opp_wc.html','utf8');
for(const [n,w,h,th] of [['m',390,900,'dark'],['ml',390,900,'light'],['d',1100,900,'dark']]){const p=await b.newPage({viewport:{width:w,height:h}});await p.setContent(html);if(th==='light')await p.evaluate(()=>{document.body.classList.remove('dark');document.body.classList.add('light')});
const el=await p.$('.gb');await el.screenshot({path:__dirname+'/w/opp_'+n+'.png'});
console.log(n,await p.evaluate(()=>({sx:document.documentElement.scrollWidth<=innerWidth+1})));await p.close()}await b.close()})()
