import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>{const s=String(u);if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);if(s.includes('full-matches'))return J({results:[],fixtures:[],leagueTables:[]});return {ok:false,status:500,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};let w=await load();
const get=(p,h={},e=env)=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',...h}}),e,{});
const ck=((await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,{})).headers.get('Set-Cookie')||'').split(';')[0];
let r=await get('/');let t=await r.text();
c('welcome tagline',t.includes('Your club’s rugby fixtures, results and tables at a glance.'));c('welcome logo',t.includes('class="sblg"')&&t.includes('STATS <span'));
c('welcome og',/property="og:image" content="https:\/\/x\.co\.uk\/og-image\.jpg"/.test(t)&&/og:title/.test(t));
c('welcome docs link, no duplicate footer',!t.includes('class="sbft"')&&t.includes('href="/docs"'));c('powered line on',/Powered by The Stats Board v3/.test(t)||/class="ver"/.test(t));
r=await get('/?team=11039&friendlyName=Test%20U18%20%3Cb%3E');t=await r.text();
c('team og title',t.includes('property="og:title" content="Test U18 b · Fixtures and results"'));c('team no raw tag in og',!/og:title" content="[^"]*<b>/.test(t));
for(const [f,ty,min] of [['/og-image.jpg','image/jpeg',5000],['/icon-192.png','image/png',1000],['/icon-512.png','image/png',1000],['/apple-touch-icon.png','image/png',1000],['/favicon.ico','image/png',1000]]){r=await get(f);const b=Buffer.from(await r.arrayBuffer());c('file '+f,r.status===200&&r.headers.get('Content-Type')===ty&&b.length>min)}
{const b=Buffer.from(await (await get('/icon-512.png')).arrayBuffer());c('512 dims',b.readUInt32BE(16)===512&&b.readUInt32BE(20)===512);const a=Buffer.from(await (await get('/apple-touch-icon.png')).arrayBuffer());c('apple 180',a.readUInt32BE(16)===180);const j=Buffer.from(await (await get('/og-image.jpg')).arrayBuffer());c('jpeg magic',j[0]===0xff&&j[1]===0xd8)}
r=await get('/?view=teams',{Cookie:ck});t=await r.text();c('links footer',t.includes('class="sbft"'));
r=await get('/admin',{Cookie:ck});t=await r.text();c('admin footer',t.includes('class="sbft"'));c('admin powered switch',t.includes('id="fp"'));
r=await get('/club-unlock');t=await r.text();c('pin logo',t.includes('class="sblg"'));
// powered off
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify({features:{powered:false}})}),env,{});
w=await load();r=await get('/?team=11039');t=await r.text();c('powered off hides line',!/Powered by/.test(t));
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify({features:{},maintenance:{on:true,pin:'x'}})}),env,{});
const bj=JSON.stringify({features:{powered:true},maintenance:{on:true,pun:'random',lines:['A'],extra:''},pin:'1'});
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:bj}),env,{});
w=await load();r=await get('/?team=1');t=await r.text();c('maint branded',r.status===503&&t.includes('class="sblg"')&&!/Ivybridge/i.test(t));
r=await get('/og-image.jpg');c('og open in maintenance',r.status===200);
r=await get('/icon-192.png');c('icon open in maintenance',r.status===200);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
