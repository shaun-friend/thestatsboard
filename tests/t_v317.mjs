import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async()=>store.v?JSON.parse(store.v):null,put:async(k,v)=>{store.v=v}};
globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};
const club='rfuClub=';
async function tok(w){const r=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,{});return (r.headers.get('Set-Cookie')||'').split(';')[0]}
let w=await load();const ck=await tok(w);c('cookie',ck.startsWith('rfuClub'));
const get=(w,p,h={})=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',...h}}),env,{});
let r=await get(w,'/?view=teams',{Cookie:ck});c('off: normal',r.status===200);
const save=async(w,m,pin)=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify({maintenance:m,pin})}),env,{});
r=await save(w,{on:true,pun:'none',extra:'',lines:['One']});{const j=await r.json();c('on needs pin',r.status===403&&j.needPin===true);}
w=await load();r=await get(w,'/?view=teams',{Cookie:ck});c('still off after refusal',r.status===200);
r=await save(w,{on:true,pun:'none',extra:'',lines:['One']},'999');{const j=await r.json();c('wrong pin refused',r.status===403&&j.needPin===true&&/not right/.test(j.error));}
w=await load();r=await get(w,'/?view=teams',{Cookie:ck});c('still off after wrong pin',r.status===200);
r=await save(w,{on:true,pun:'none',extra:'Back at <b>8pm</b>',lines:['One','Two','One','<x>Three']},'1');c('save ok',(await r.json()).ok);
w=await load();
r=await get(w,'/?team=1');let t=await r.text();
c('page 503',r.status===503);c('retry',r.headers.get('Retry-After')==='600');c('no-store',r.headers.get('Cache-Control')==='no-store');c('noindex',/noindex/.test(t)&&r.headers.get('X-Robots-Tag')==='noindex');
c('text',/Back soon/.test(t)&&/Undergoing maintenance/.test(t)&&/>BOARD</.test(t));c('no club',!/Ivybridge/i.test(t));
c('extra escaped',t.includes('Back at &lt;b&gt;8pm&lt;/b&gt;'));c('no pun',!/class="p"/.test(t));
r=await get(w,'/calendar.ics');c('cal 503',r.status===503&&!/<html/.test(await r.text()));
r=await get(w,'/api/builder/search?q=x');c('api 503',r.status===503);
r=await get(w,'/?view=stack&format=json');c('format 503',r.status===503);
r=await get(w,'/admin',{Cookie:ck});t=await r.text();c('admin open',r.status===200&&/Maintenance mode/.test(t));
const sc=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);let comp=true;for(const s of sc){try{new Function(s)}catch(e){comp=false;console.log(e.message)}}c('admin script compiles',comp);c('pin field present',/id="mpin"/.test(t));
c('lines cleaned',(t.match(/<option value="One"/g)||[]).length===1&&!/<x>/.test(t)&&/<option value="xThree"/.test(t));
r=await get(w,'/club-unlock');c('pin open',r.status===200);
r=await get(w,'/maintenance-preview',{Cookie:ck});c('preview 200',r.status===200);
r=await get(w,'/maintenance-preview');c('preview needs pin',r.status===303||r.status===401);
r=await save(w,{on:true,pun:'Two',extra:'',lines:['One','Two']});w=await load();
r=await get(w,'/?team=1');t=await r.text();c('chosen pun',/class="p">Two</.test(t));
r=await save(w,{on:true,pun:'random',extra:'',lines:['One','Two']});w=await load();
const seen=new Set();for(let i=0;i<30;i++){t=await (await get(w,'/?team=1')).text();const m=t.match(/class="p">([^<]*)</);if(m)seen.add(m[1])}c('random varies',seen.size===2);
r=await save(w,{on:true,pun:'Gone',extra:'',lines:[]});w=await load();t=await (await get(w,'/?team=1')).text();c('empty list ok',!/class="p"/.test(t));
r=await save(w,{on:false,lines:'bad'});w=await load();r=await get(w,'/?view=teams',{Cookie:ck});c('off again',r.status===200);
t=await (await get(w,'/admin',{Cookie:ck})).text();c('bad lines keep defaults',/Held up over the line/.test(t));
{w=await load();const pv=async q=>(await (await get(w,'/maintenance-preview'+q,{Cookie:ck})).text());
let x=await pv('?pun='+encodeURIComponent('Unsaved line')+'&extra=Soon&l=Unsaved%20line&l=B');c('preview unsaved pun',/class="p">Unsaved line</.test(x)&&/class="x">Soon</.test(x));
x=await pv('?pun=none&extra=&l=A');c('preview none',!/class="p"/.test(x));
x=await pv('?pun=%3Cb%3E&extra=%3Ci%3Ex&l=A');c('preview safe',!/class="x"><i>/.test(x)&&!/class="p"><b>/.test(x));
x=await pv('');c('preview plain still works',/Back soon/.test(x));}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
