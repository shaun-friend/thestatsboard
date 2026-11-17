const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const rows=[];const USAGE={writeDataPoint:d=>(d.blobs[1]!=='start'&&d.blobs[1]!=='done'&&rows.push(d))};
const mk=(o={})=>({CLUB_PIN:'club-pass-1',SETTINGS:kv,USAGE,PIN_DELAY_MS:'0',CF_ACCOUNT_ID:'',...o});
let env=mk();let w=await load();
const req=(p,init={},ip='1.1.1.1')=>w.fetch(new Request('https://x.co.uk'+p,{...init,headers:{'User-Agent':'Mozilla/5.0','CF-Connecting-IP':ip,...(init.headers||{})}}),env,{});
const login=(pin,ip,next)=>req('/club-unlock',{method:'POST',body:new URLSearchParams({pin,next:next||'/?view=teams'})},ip);
const ck=r=>(r.headers.get('Set-Cookie')||'').split(';')[0];
// cookie format
let r=await login('club-pass-1');c('login 303',r.status===303);const c1=ck(r);
c('v2 cookie',/^rfuClub=v2\.\d+\.[0-9a-f]{24}\.[0-9a-f]{64}$/.test(c1));
const sha=async s=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))).toString('hex');
c('cookie is not the old hash',!c1.includes(await sha('rfu-club-v1|club-pass-1')));
c('cookie does not contain the pin',!c1.includes('club-pass-1'));
c('max-age set',/Max-Age=2592000/.test(r.headers.get('Set-Cookie')));
r=await req('/?view=teams',{headers:{Cookie:c1}});c('cookie works',r.status===200);
const c2=ck(await login('club-pass-1'));c('cookies differ each sign-in',c1!==c2);
r=await req('/?view=teams',{headers:{Cookie:c2}});c('second cookie works',r.status===200);
// tamper
const parts=c1.split('.');const tam=parts.slice(0,3).join('.')+'.'+'0'.repeat(64);
r=await req('/?view=teams',{headers:{Cookie:tam}});c('tampered signature refused',r.status===303);
const exp2=c1.replace(/^rfuClub=v2\.(\d+)\./,(m,e)=>'rfuClub=v2.'+(Number(e)+99999)+'.');
r=await req('/?view=teams',{headers:{Cookie:exp2}});c('extended expiry refused',r.status===303);
r=await req('/?view=teams',{headers:{Cookie:'rfuClub='+await sha('rfu-club-v1|club-pass-1')}});c('old hash cookie refused',r.status===303);
// expiry
const realNow=Date.now;Date.now=()=>realNow()+31*86400e3;
r=await req('/?view=teams',{headers:{Cookie:c1}});c('expired cookie refused',r.status===303);Date.now=realNow;
// pin change signs out
{const e0=env;env=mk({CLUB_PIN:'another-pin-9'});r=await req('/?view=teams',{headers:{Cookie:c1}});c('pin change signs out',r.status===303);env=e0;}
// no kv: falls back but still works
{const e0=env;env=mk({SETTINGS:undefined});const w0=w;w=await load();let rr=await login('club-pass-1','9.9.9.9');const k=ck(rr);rr=await req('/?view=teams',{headers:{Cookie:k}});c('works without settings store',rr.status===200);env=e0;w=w0;}
// SESSION_SECRET env wins
{const e0=env;env=mk({SESSION_SECRET:'0123456789abcdef-secret'});const w0=w;w=await load();let rr=await login('club-pass-1','9.9.9.8');const k=ck(rr);rr=await req('/?view=teams',{headers:{Cookie:k}});c('session secret env works',rr.status===200);env=mk({SESSION_SECRET:'zzzzzzzzzzzzzzzz-other'});w=await load();rr=await req('/?view=teams',{headers:{Cookie:k}});c('other secret refuses',rr.status===303);env=e0;w=w0;}
// lockout
const A='2.2.2.2',B='3.3.3.3';
for(let i=1;i<=4;i++){r=await login('nope',A);c('wrong '+i+' is 401',r.status===401)}
r=await login('nope',A);c('5th wrong triggers pause (429)',r.status===429&&/wait 15 minutes/.test(await r.text()));
c('retry-after 900',Number(r.headers.get('Retry-After'))>=890&&Number(r.headers.get('Retry-After'))<=900);
r=await login('club-pass-1',A);c('correct pin refused while paused',r.status===429);
r=await req('/club-unlock',{},A);c('pause page has no form',r.status===429&&!/<form/.test(await r.text()));
r=await login('club-pass-1',B);c('other address unaffected',r.status===303);
// restart (fresh module): pause held in the settings store
w=await load();r=await login('club-pass-1',A);c('pause survives a new instance',r.status===429);
// time passes
Date.now=()=>realNow()+16*60e3;r=await login('club-pass-1',A);c('pause ends after 15 minutes',r.status===303);Date.now=realNow;
// second pause is longer, correct pin cleared strikes? (correct pin clears, so check escalation separately)
const C='4.4.4.4';
for(let i=0;i<5;i++)await login('bad',C);
Date.now=()=>realNow()+16*60e3;
for(let i=0;i<5;i++){r=await login('bad',C)}
c('second pause is 1 hour',r.status===429&&/1 hour/.test(await r.text()));
Date.now=()=>realNow()+(16+30)*60e3;r=await login('club-pass-1',C);c('still paused at 46 minutes',r.status===429);
Date.now=()=>realNow()+(16+61)*60e3;r=await login('club-pass-1',C);c('open after the hour',r.status===303);Date.now=realNow;
// correct pin clears the count
const D='5.5.5.5';for(let i=0;i<4;i++)await login('bad',D);await login('club-pass-1',D);for(let i=0;i<4;i++)r=await login('bad',D);c('count cleared by a correct pin',r.status===401);
// window: old failures expire
const E='6.6.6.6';for(let i=0;i<4;i++)await login('bad',E);Date.now=()=>realNow()+16*60e3;r=await login('bad',E);c('failures older than 15 minutes do not add up',r.status===401);Date.now=realNow;
// maintenance box counts
{const F='7.7.7.7';const ck0=ck(await login('club-pass-1','8.8.8.8'));let last;
 for(let i=0;i<5;i++)last=await req('/api/admin',{method:'POST',headers:{Cookie:ck0,'Content-Type':'application/json'},body:JSON.stringify({maintenance:{on:true,pun:'random',lines:['A'],extra:''},pin:'bad'})},F);
 c('maintenance box pause (429)',last.status===429);
 const l2=await req('/api/admin',{method:'POST',headers:{Cookie:ck0,'Content-Type':'application/json'},body:JSON.stringify({maintenance:{on:true,pun:'random',lines:['A'],extra:''},pin:'club-pass-1'})},F);c('right pin refused while paused',l2.status===429);
 const l3=await req('/api/admin',{method:'POST',headers:{Cookie:ck0,'Content-Type':'application/json'},body:JSON.stringify({maintenance:{on:true,pun:'random',lines:['A'],extra:''},pin:'club-pass-1'})},'8.8.8.8');c('maintenance with right pin from another address ok',(await l3.json()).ok===true);}
// test-site (DEV) pin
{const e0=env;env=mk({ENV_LABEL:'DEV',DEV_PIN:'dev-pass-7',CLUB_PIN:''});const w0=w;w=await load();
 const dl=(pin,ip)=>req('/unlock',{method:'POST',body:new URLSearchParams({pin,next:'/'})},ip);
 let rr=await dl('dev-pass-7','1.0.0.1');const dk=ck(rr);c('dev login v2 cookie',/^rfuDev=v2\./.test(dk)&&/Max-Age=1800/.test(rr.headers.get('Set-Cookie')));
 rr=await req('/',{headers:{Cookie:dk}},'1.0.0.1');c('dev cookie opens site',rr.status!==303&&rr.status!==401);
 rr=await req('/',{},'1.0.0.1');c('no cookie redirected',rr.status===303);
 for(let i=0;i<5;i++)rr=await dl('x','1.0.0.2');c('dev pause after 5',rr.status===429);
 rr=await dl('dev-pass-7','1.0.0.2');c('dev correct refused while paused',rr.status===429);
 rr=await dl('dev-pass-7','1.0.0.3');c('dev other address fine',rr.status===303);
 env=e0;w=w0;}
// usage rows
const lab=rows.map(d=>d.blobs&&d.blobs[2]);
c('usage: wrong rows',lab.includes('club'));c('usage: pause rows',lab.includes('club-pause'));c('usage: refused rows',lab.includes('club-lock'));c('usage: dev rows',lab.includes('dev')&&lab.includes('dev-pause')&&lab.includes('dev-lock'));
// admin page and usage page scripts still compile
{const ck3=ck(await login('club-pass-1','9.1.1.1'));for(const p of ['/usage','/admin']){const t=await (await req(p,{headers:{Cookie:ck3}},'9.1.1.1')).text();let ok2=true;for(const m of t.matchAll(/<script>([\s\S]*?)<\/script>/g)){try{new Function(m[1])}catch(e){ok2=false;console.log(p,e.message)}}c(p+' scripts compile',ok2&&t.length>1000)}}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
