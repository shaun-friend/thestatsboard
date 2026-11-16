// v3.36.0: the Welcome page (bare address) is kept at the edge like the other pages.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let clock=Date.UTC(2026,10,11,12,0,0);const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const sc=new Map();globalThis.caches={default:{match:async r=>{const v=sc.get(String(r.url||r));return v?new Response(v.body,{headers:v.h}):undefined},put:async(r,x)=>{sc.set(String(r.url||r),{body:await x.text(),h:[...x.headers]})}}};
const bg=[];const ctx={waitUntil(p){bg.push(p)}};const flush=async()=>{await Promise.all(bg.splice(0))};
const env={CLUB_PIN:'1',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const get=async(p,h)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',...(h||{})}}),env,ctx);const t=await r.text();return {h:r.headers,t,s:r.status}};
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
let a=await get('/');c('first visit builds the Welcome page',a.s===200&&/class="wrap wl"/.test(a.t)&&a.h.get('X-Page-Cache')!=='HIT');await flush();
a=await get('/');c('second visit is the stored copy',a.h.get('X-Page-Cache')==='HIT'&&/class="wrap wl"/.test(a.t));
c('no personal recents are in the page itself',!/Recent<\/span>/.test(a.t.replace(/<script[\s\S]*?<\/script>/g,'')));
a=await get('/?theme=light');c('light theme builds its own page',a.h.get('X-Page-Cache')!=='HIT'&&/class="light"/.test(a.t));await flush();
a=await get('/?theme=light');c('light is then stored',a.h.get('X-Page-Cache')==='HIT'&&/class="light"/.test(a.t));
a=await get('/');c('dark is not replaced by light',a.h.get('X-Page-Cache')==='HIT'&&/class="dark"/.test(a.t)&&!/class="light"/.test(a.t));
// Admin change shows at once
clock+=2000;await post({features:{contact:false},notices:{home:{on:true,text:'Ground closed Sunday',level:'info'}}});
a=await get('/');c('an Admin change rebuilds the Welcome page',a.h.get('X-Page-Cache')!=='HIT'&&/Ground closed Sunday/.test(a.t));await flush();
a=await get('/');c('and the new notice is then stored',a.h.get('X-Page-Cache')==='HIT'&&/Ground closed Sunday/.test(a.t));
clock+=2000;await post({features:{contact:false},notices:{home:{on:false,text:'',level:'info'}}});a=await get('/');c('removing the notice shows at once',!/Ground closed Sunday/.test(a.t));await flush();
// next UK day is rebuilt
clock+=13*3600e3;a=await get('/');c('next UK day is rebuilt',a.h.get('X-Page-Cache')!=='HIT');await flush();clock=Date.UTC(2026,10,11,12,0,0);
// pages with a team are unaffected and still their own pages
a=await get('/?team=11039&teamName=Ivybridge');c('a team link is not the Welcome page',!/class="wrap wl"/.test(a.t));
// maintenance wins over a stored copy
clock+=2000;await post({features:{contact:false}});await get('/');await flush();clock+=2000;a=await get('/');const warm=a.h.get('X-Page-Cache')==='HIT';
let r=await post({maintenance:{on:true,pun:'none',extra:'',lines:['One']},pin:'1'});
a=await get('/');c('maintenance shows the Back soon page even with a stored copy',warm&&r.status===200&&!/class="wrap wl"/.test(a.t)&&a.h.get('X-Page-Cache')!=='HIT');
clock+=2000;r=await post({maintenance:{on:false,pun:'none',extra:'',lines:['One']},features:{contact:false}});a=await get('/');c('switching it off brings the Welcome page back',/class="wrap wl"/.test(a.t));
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
