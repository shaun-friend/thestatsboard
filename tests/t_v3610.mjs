// v3.61.0: logo tile choice; no logos on Match day
const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
const mk=()=>{const o={store:{},meta:{},gets:0,puts:0,dels:0};o.kv={
 get:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return null;if(v instanceof Uint8Array)return t&&t.type==='arrayBuffer'?v.buffer:v;return t&&t.type==='json'?JSON.parse(v):v},
 getWithMetadata:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return{value:null,metadata:null};return{value:v instanceof Uint8Array?v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength):v,metadata:o.meta[k]||null}},
 put:async(k,v,opt)=>{o.puts++;o.store[k]=typeof v==='string'?v:new Uint8Array(v);if(opt&&opt.metadata)o.meta[k]=opt.metadata},
 delete:async k=>{o.dels++;delete o.store[k];delete o.meta[k]}};return o};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const ctx={waitUntil(){}};
const w=(await import(src+'?lt=1')).default;
const login=async env=>{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);return (r0.headers.get('Set-Cookie')||'').split(';')[0]};
const api=async(env,ck,o,host='thestatsboard.co.uk')=>{const r=await w.fetch(new Request('https://'+host+'/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck,Origin:'https://'+host},body:JSON.stringify(o)}),env,ctx);return {s:r.status,j:await r.json().catch(()=>null)}};
const get=async(env,path)=>w.fetch(new Request('https://thestatsboard.co.uk'+path),env,ctx);
const A=mk(),env={CLUB_PIN:'1',SETTINGS:A.kv,ENV_LABEL:''};const ck=await login(env);
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'Vets4Pets'},{id:'00000002',name:'Dart Motors'}]});
const PNG1='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const b64=u8=>Buffer.from(u8).toString('base64');
const png=(wd,ht)=>{const b=Buffer.from(PNG1,'base64');b.writeUInt32BE(wd,16);b.writeUInt32BE(ht,20);return b};
const idOf=(r,id)=>r.j.items.find(x=>x.id===id);
let r=await api(env,ck,{act:'logo',id:'00000001',t:'png',w:1,h:1,bg:'l',au:1,data:b64(png(300,120))});
c('upload with a tile choice keeps it and that it was automatic',r.j.ok&&idOf(r,'00000001').logo.bg==='l'&&idOf(r,'00000001').logo.au===1);
r=await api(env,ck,{act:'logo',id:'00000002',t:'png',w:1,h:1,bg:'zzz',data:b64(png(300,120))});
c('upload with a junk tile value stores no tile',r.j.ok&&idOf(r,'00000002').logo.bg===undefined);
const v1=idOf(r,'00000001').logo.v,p0=A.puts;
r=await api(env,ck,{act:'logo-bg',id:'00000001',bg:'d',au:0});
c('changing the tile: ok, saved as chosen by hand, one write, image and version untouched',r.j.ok&&idOf(r,'00000001').logo.bg==='d'&&idOf(r,'00000001').logo.au===0&&idOf(r,'00000001').logo.v===v1&&A.puts-p0===1,JSON.stringify(r.j));
for(const b of ['c','l']){r=await api(env,ck,{act:'logo-bg',id:'00000001',bg:b,au:1});c('tile '+b+' accepted',r.j.ok&&idOf(r,'00000001').logo.bg===b)}
r=await api(env,ck,{act:'logo-bg',id:'00000001',bg:'x'});c('a bad tile value is refused',r.s===400&&r.j.ok===false);
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000003',name:'No Logo Ltd'}]});
r=await api(env,ck,{act:'logo-bg',id:'00000003',bg:'d'});c('tile for a sponsor with no logo is refused',r.s===404&&r.j.ok===false);
r=await api(env,ck,{act:'logo-bg',id:'99999999',bg:'d'});c('tile for an unknown sponsor is refused',r.s===404);
const noPin=await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({act:'logo-bg',id:'00000003',bg:'d'})}),env,ctx);
c('tile change needs the PIN',noPin.status===401||noPin.status===403||noPin.status===302,String(noPin.status));
const pg=await w.fetch(new Request('https://thestatsboard.co.uk/sponsors',{headers:{Cookie:ck}}),env,ctx).then(x=>x.text());
const scr=[...pg.matchAll(/<script>([^]*?)<\/script>/g)].map(m=>m[1]);let syn=0;for(const x of scr){try{new Function(x)}catch(e){syn++;console.log(e.message)}}c('the sponsors page script parses',syn===0&&scr.length>0);
c('Admin has the three tile buttons',/Dark tile/.test(pg)&&/Light tile/.test(pg)&&/As supplied/.test(pg)&&/data-a="lgbg"/.test(pg));
const src_=(await import('fs')).readFileSync(src,'utf8');
c('Match day rows carry no logo tiles (the bar is separate)',!/\.rw \.sl/.test(src_));
// --- browser: tone choice on real images
import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const m=/function lgTone[^]*?function lgMake/.exec(pg),m2=/function lgCorner[^]*?function lgMake/.exec(pg);c('tone code is in the page',!!m&&!!m2);
const br=await chromium.launch();const page=await br.newPage();await page.setContent('<html><body></body></html>');
await page.addScriptTag({content:m2[0].replace(/function lgMake$/,'')+';window.lgTone=lgTone;window.lgCorner=lgCorner'});
const tone=(fn)=>page.evaluate(f=>{const c=document.createElement('canvas');c.width=80;c.height=40;const q=c.getContext('2d',{willReadFrequently:true});eval('('+f+')')(q);return lgTone(q,80,40)},fn.toString());
c('white lettering on transparent goes on a dark tile',await tone(q=>{q.fillStyle='#fff';q.fillRect(10,10,60,20)})==='d');
c('black lettering on transparent goes on a light tile',await tone(q=>{q.fillStyle='#000';q.fillRect(10,10,60,20)})==='l');
c('navy lettering on transparent goes on a light tile',await tone(q=>{q.fillStyle='#1a2a5a';q.fillRect(10,10,60,20)})==='l');
c('bright yellow lettering goes on a dark tile',await tone(q=>{q.fillStyle='#ffd400';q.fillRect(10,10,60,20)})==='d');
c('an empty picture falls back to dark',await tone(q=>{})==='d');
const corner=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=80;c.height=40;const q=c.getContext('2d',{willReadFrequently:true});q.fillStyle='#fff';q.fillRect(0,0,80,40);q.fillStyle='#c00';q.fillRect(20,10,40,20);return !!lgCorner(q,80,40)});
c('a solid-background picture is detected as as supplied (corners agree)',corner===true);
await br.close();
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
