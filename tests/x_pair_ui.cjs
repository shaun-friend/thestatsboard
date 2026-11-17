// TV quick setup in a real browser: the TV page draws a QR code for its own phone address, collects the link the phone sends, saves it and starts it;
// a saved link starts straight away; the code expires after 10 minutes; the phone page sends the checked choice and reports when the screen has it.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const tvHtml=fs.readFileSync('w/setup.html','utf8'),phHtml=fs.readFileSync('w/phone.html','utf8');
const CODE=/CODE="(\d{6})"/.exec(tvHtml)[1];
async function tv(opts,fn){const ctx=await b.newContext({viewport:{width:1920,height:1080}});const p=await ctx.newPage();const errs=[],polls=[],nav=[];p.on('pageerror',e=>errs.push(String(e)));
 let answer=opts.answer||(()=>({ok:false}));
 await p.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.pathname==='/setup')return r.fulfill({status:200,contentType:'text/html',body:tvHtml});
  if(u.pathname==='/api/pair'){polls.push(u.searchParams.get('c'));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(answer(polls.length))})}
  if(u.pathname.indexOf('/ivybridge/tv')===0||u.pathname==='/'){nav.push(u.pathname+u.search);return r.fulfill({status:200,contentType:'text/html',body:'<h1>tv page</h1>'})}
  r.fulfill({status:200,body:''})});
 await p.clock.install();await fn(p,{errs,polls,nav});await ctx.close()}
// 1. TV page, then the phone sends a link
await tv({answer:n=>n<3?{ok:false}:{ok:true,t:'/ivybridge/tv?screen=Bar',l:'Rotating screen'}},async(p,s)=>{
 await p.goto('https://sb.test/setup');
 ck('QR code drawn',await p.$eval('#qr svg path',e=>e.getAttribute('d').length>500));
 {const vb=(await p.$eval('#qr svg',e=>e.getAttribute('viewBox'))).split(' ');ck('QR is a square symbol of at least 25 modules',vb[2]===vb[3]&&Number(vb[2])>=27,vb.join(' '))}
 ck('code shown in two groups of three',(await p.textContent('.code'))===CODE.slice(0,3)+' '+CODE.slice(3),await p.textContent('.code'));
 // the QR matrix equals the library's own matrix for https://sb.test/pair/<code>
 const same=await p.evaluate(c=>{var q=qrcode(0,"M");q.addData("https://sb.test/pair/"+c);q.make();var n=q.getModuleCount(),d="";for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(q.isDark(r,k))d+="M"+k+" "+r+"h1v1h-1z";return document.querySelector('#qr svg path').getAttribute('d')===d},CODE);
 ck('QR encodes this screen\'s phone address',same);
 {const g=await p.evaluate(()=>{const f=document.querySelector('#ft').getBoundingClientRect(),v=document.querySelector('.ver').getBoundingClientRect();return {fb:f.bottom,vt:v.top,vb:v.bottom,h:innerHeight}});ck('version is the last thing on the page: below the countdown line, no overlap, inside the screen',g.vt>=g.fb&&g.vb<=g.h+1,JSON.stringify(g))}
 {const g=await p.evaluate(()=>{const b=document.body.getBoundingClientRect(),q=document.querySelector('#qr').getBoundingClientRect();return {pos:getComputedStyle(document.body).position,bh:Math.round(b.height),h:innerHeight,qw:Math.round(q.width),qh:Math.round(q.height),vmin:Math.min(innerWidth,innerHeight)/100}});ck('page is fixed to the visible screen (iPad toolbar cannot push the footer off or shift the page)',g.pos==='fixed'&&g.bh===g.h,JSON.stringify(g));ck('QR box has its full size from the start (nothing jumps when the QR is drawn)',Math.abs(g.qw-40.8*g.vmin)<2&&g.qw===g.qh,JSON.stringify(g))}
 ck('version and date shown in the footer, once',/^The Stats Board v\d+\.\d+\.\d+ \u00b7 \d\d-[A-Za-z]{3}-\d{4}$/.test(await p.textContent('.ver'))&&await p.isVisible('.ver')&&!(await p.isVisible('#sbv')),await p.textContent('.ver'));
 await p.screenshot({path:'w/pair_tv_wait.png'});
 await p.clock.runFor(3100);await p.waitForTimeout(30);ck('first poll uses the code',s.polls[0]===CODE,s.polls.join());
 for(let i=0;i<30&&!(await p.isVisible('#b'));i++){await p.clock.runFor(1000);await p.waitForTimeout(40)}
 ck('linked panel shows',await p.isVisible('#b')&&!(await p.isVisible('#a')),'');
 ck('says what is starting',(await p.textContent('#what'))==='Starting: Rotating screen',await p.textContent('#what'));
 ck('link saved on the screen',await p.evaluate(()=>localStorage.getItem('sbScreenLink'))==='/ivybridge/tv?screen=Bar');
 await p.screenshot({path:'w/pair_tv_linked.png'});
 for(let i=0;i<8&&!s.nav.length;i++){await p.clock.runFor(1000);await p.waitForTimeout(40)}
 ck('screen goes to its link',s.nav.includes('/ivybridge/tv?screen=Bar'),s.nav.join());
 ck('no script errors',s.errs.length===0,s.errs.join('|'));
});
// 2. A saved link starts straight away, reset=1 clears it
await tv({},async(p,s)=>{
 await p.addInitScript(()=>{try{if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('sbScreenLink','/ivybridge/tv?screen=Bar')}}catch(e){}});
 await p.goto('https://sb.test/setup');await p.waitForTimeout(100);
 ck('saved link: goes straight to the display, no polling',s.nav.includes('/ivybridge/tv?screen=Bar')&&s.polls.length===0,s.nav.join()+' '+s.polls.length);
 await p.goto('https://sb.test/setup?reset=1');await p.waitForTimeout(100);
 ck('reset=1 clears the saved link and shows the code',await p.evaluate(()=>localStorage.getItem('sbScreenLink'))===null&&await p.isVisible('#a'));
});
// 3. A saved link that is not a plain site path is ignored
await tv({},async(p,s)=>{
 await p.addInitScript(()=>{try{localStorage.setItem('sbScreenLink','//evil.example/x')}catch(e){}});
 await p.goto('https://sb.test/setup');await p.waitForTimeout(100);
 ck('an off-site saved link is ignored',await p.isVisible('#a')&&s.nav.length===0,s.nav.join());
});
// 4. An off-site answer from the API is ignored
await tv({answer:()=>({ok:true,t:'//evil.example',l:'x'})},async(p,s)=>{
 await p.goto('https://sb.test/setup');await p.clock.runFor(30000);await p.waitForTimeout(50);
 ck('an off-site link from the API is ignored',await p.isVisible('#a')&&s.nav.length===0,s.nav.join());
});
// 5. Expiry after 5 minutes: the page gets a fresh code by itself, and then checks less often
await tv({},async(p,s)=>{
 await p.goto('https://sb.test/setup');
 ck('countdown starts at 5:00',(await p.textContent('#cd'))==='5:00',await p.textContent('#cd'));
 await p.clock.runFor(61000);await p.waitForTimeout(40);ck('countdown counts down (about 3:59 after 61 seconds)',/^3:5[89]$|^4:0[01]$/.test(await p.textContent('#cd')),await p.textContent('#cd'));
 for(let i=0;i<80&&!p.url().includes('r=1');i++){await p.clock.runFor(5000);await p.waitForTimeout(30)}
 await p.waitForTimeout(150);
 ck('after 5 minutes the screen reloads itself for a new code',p.url().includes('/setup?r=1'),p.url());
 ck('about 60 polls at most in the first 5 minutes',s.polls.length<=70,s.polls.length);
 const n=s.polls.length;for(let i=0;i<12;i++){await p.clock.runFor(5000);await p.waitForTimeout(30)}
 ck('a refreshed code checks every 15 seconds (at most 5 polls in a minute)',s.polls.length-n<=5&&s.polls.length-n>=2,String(s.polls.length-n));
 ck('the refreshed page still shows the code and QR',await p.isVisible('#qr svg')&&await p.isVisible('#a'));
});
// 6. Phone page
{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[],sent=[];let chk=0;p.on('pageerror',e=>errs.push(String(e)));
 await p.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.pathname==='/pair/482719')return r.fulfill({status:200,contentType:'text/html',body:phHtml});
  if(u.pathname==='/api/pair-send'){sent.push(JSON.parse(r.request().postData()));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,label:'Match Centre',link:'/x'})})}
  if(u.pathname==='/api/pair'){chk++;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(chk<2?{ok:false,waiting:true}:{ok:false})})}
  r.fulfill({status:200,body:''})});
 await p.clock.install();await p.goto('https://sb.test/pair/482719');
 ck('code shown',/482 719/.test(await p.textContent('.pill')));
 ck('team and page pickers hidden until chosen',!(await p.isVisible('#more')));
 await p.check('input[value=page]');ck('team and page pickers show for one page',await p.isVisible('#more'));
 await p.screenshot({path:'w/pair_phone.png'});
 await p.check('input[value=centre]');await p.fill('#nm','Bar');await p.click('#go');await p.waitForTimeout(60);
 ck('sends the checked choice',sent.length===1&&sent[0].code==='482719'&&sent[0].kind==='centre'&&sent[0].name==='Bar',JSON.stringify(sent));
 ck('shows sent',/Sent to the screen/.test(await p.textContent('#dh')));
 await p.clock.runFor(3100);await p.waitForTimeout(40);await p.clock.runFor(3100);await p.waitForTimeout(40);
 ck('reports when the screen has picked it up',(await p.textContent('#dh'))==='Screen linked',await p.textContent('#dh'));
 ck('phone: no script errors',errs.length===0,errs.join('|'));await ctx.close()}
// 7. Phone: the screen does not collect the code (it may have refreshed): a hint and a way to enter another code; confirmation still wins if it arrives later
{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();let chk=0;
 await p.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.pathname==='/pair/482719')return r.fulfill({status:200,contentType:'text/html',body:phHtml});
  if(u.pathname==='/api/pair-send')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,label:'Match Centre',link:'/x'})});
  if(u.pathname==='/api/pair'){chk++;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(chk<14?{ok:false,waiting:true}:{ok:false})})}
  r.fulfill({status:200,body:''})});
 await p.clock.install();await p.goto('https://sb.test/pair/482719');await p.click('#go');await p.waitForTimeout(60);
 ck('before the first check there is no alarm',!(await p.isVisible('#dc')));
 for(let i=0;i<12;i++){await p.clock.runFor(3000);await p.waitForTimeout(40)}
 ck('after about 20 seconds unconfirmed: says so and shows the code to check',/Not confirmed yet/.test(await p.textContent('#dh'))&&/482 719/.test(await p.textContent('#dp')),await p.textContent('#dh'));
 ck('offers Enter a different code (links to /pair)',await p.isVisible('#dc')&&(await p.getAttribute('#dc','href'))==='/pair');
 for(let i=0;i<12;i++){await p.clock.runFor(3000);await p.waitForTimeout(40)}
 ck('if confirmation arrives later it changes to Screen linked and the button goes',(await p.textContent('#dh'))==='Screen linked'&&!(await p.isVisible('#dc')),await p.textContent('#dh'));
 await p.screenshot({path:'w/pair_phone_hint.png'});await ctx.close()}
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
