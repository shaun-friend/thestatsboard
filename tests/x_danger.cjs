const fs=require('fs');const {chromium}=require('playwright');
(async()=>{const html=fs.readFileSync('w/opp_v3330p.html','utf8');const b=await chromium.launch();let bad=0;
async function run(name,payload,vw){
 const p=await b.newPage({viewport:{width:vw,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.route('https://x.test/**',rt=>{const u=new URL(rt.request().url());
  if(u.pathname==='/api/danger')return rt.fulfill({contentType:'application/json',body:JSON.stringify(payload)});
  if(u.pathname==='/r')return rt.fulfill({contentType:'text/html',body:html});
  return rt.fulfill({status:404,body:''})});
 await p.goto('https://x.test/r?app=1');await p.waitForTimeout(700);
 const o=await p.evaluate(()=>{const e=document.getElementById('dgc');return e?{hidden:e.hidden,text:e.innerText,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}:null});
 await p.close();return {o,errs}}
const full={ok:true,show:true,games:5,tryNamed:29,tryTotal:30,top:[{name:'J Cantin',n:4},{name:'A Harris',n:3},{name:'A Lilley',n:3}],moved:[{name:'S Jones',usual:'back row',last:'fly half',no:10,d:'2026-11-14'}]};
for(const vw of [390,1280]){
 let {o,errs}=await run('full',full,vw);
 const ok=o&&!o.hidden&&/danger players/i.test(o.text)&&/J Cantin/.test(o.text)&&/4 tries/.test(o.text)&&/Usually back row/.test(o.text)&&/29 of 30/.test(o.text)&&o.sw<=o.cw+1&&!errs.length;
 console.log(vw,'card shown',ok);if(!ok){bad++;console.log(JSON.stringify(o),errs)}
}
let r=await run('hide',{ok:true,show:false,games:5,tryNamed:0,tryTotal:0,top:[],moved:[]},390);
console.log('hidden when not enough data',!!(r.o&&r.o.hidden));if(!(r.o&&r.o.hidden))bad++;
r=await run('fail',{ok:false},390);console.log('hidden when the call fails',!!(r.o&&r.o.hidden));if(!(r.o&&r.o.hidden))bad++;
await b.close();console.log(bad?'FAIL':'ALL OK');process.exit(bad?1:0)})();
