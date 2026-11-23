// v3.64.0: logo sizes recorded, Check logo sizes, total line on the Sponsors page
const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
const mk=()=>{const o={store:{},meta:{},gets:0,puts:0,dels:0};o.kv={
 get:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return null;if(v instanceof Uint8Array)return t&&t.type==='arrayBuffer'?v.buffer:v;return t&&t.type==='json'?JSON.parse(v):v},
 getWithMetadata:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return{value:null,metadata:null};return{value:v instanceof Uint8Array?v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength):v,metadata:o.meta[k]||null}},
 put:async(k,v,opt)=>{o.puts++;o.store[k]=typeof v==='string'?v:new Uint8Array(v);if(opt&&opt.metadata)o.meta[k]=opt.metadata},
 delete:async k=>{o.dels++;delete o.store[k];delete o.meta[k]}};return o};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const ctx={waitUntil(){}};
const w=(await import(src+'?ls=1')).default;
const login=async env=>{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);return (r0.headers.get('Set-Cookie')||'').split(';')[0]};
const api=async(env,ck,o,host='thestatsboard.co.uk')=>{const r=await w.fetch(new Request('https://'+host+'/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck,Origin:'https://'+host},body:JSON.stringify(o)}),env,ctx);return {s:r.status,j:await r.json().catch(()=>null)}};
const get=async(env,path)=>w.fetch(new Request('https://thestatsboard.co.uk'+path),env,ctx);
const A=mk(),env={CLUB_PIN:'1',SETTINGS:A.kv,ENV_LABEL:''};const ck=await login(env);
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'Vets4Pets'},{id:'00000002',name:'Dart Motors'}]});
const PNG1='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const b64=u8=>Buffer.from(u8).toString('base64');
const png=(wd,ht)=>{const b=Buffer.from(PNG1,'base64');b.writeUInt32BE(wd,16);b.writeUInt32BE(ht,20);return b};
const idOf=(r,id)=>r.j.items.find(x=>x.id===id);
let r=await api(env,ck,{act:'logo',id:'00000001',t:'png',w:1,h:1,data:b64(png(300,120))});
c('upload records the size in bytes',r.j.ok&&idOf(r,'00000001').logo.n===png(300,120).length,JSON.stringify(idOf(r,'00000001').logo));
// older logos: marker without n
const ids=[];const items=[];for(let i=1;i<=45;i++){const id=('0000000'+i.toString(16)).slice(-8);ids.push(id);items.push({id,name:'S'+i,logo:{v:1700000000000+i,t:'png',w:300,h:120}});A.store['splogo:'+id]=new Uint8Array(1000+i)}
A.store['sponsors']=JSON.stringify({v:1,items});
let g0=A.gets,p0=A.puts;
r=await api(env,ck,{act:'logo-sizes'});
const have=r.j.items.filter(x=>x.logo&&x.logo.n).length;
c('one press fills at most 40 sizes',r.j.ok&&have===40,String(have));
c('that was at most 40 logo reads and one write',A.puts-p0===1&&(A.gets-g0)<=44,(A.puts-p0)+' w '+(A.gets-g0)+' r');
c('sizes are the real byte counts',idOf(r,'00000001').logo.n===1001&&idOf(r,'00000005').logo.n===1005);
r=await api(env,ck,{act:'logo-sizes'});
c('second press does the remaining 5',r.j.items.filter(x=>x.logo&&x.logo.n).length===45);
g0=A.gets;p0=A.puts;r=await api(env,ck,{act:'logo-sizes'});
c('when every logo has a size a press reads and writes nothing',r.j.ok&&A.puts===p0&&(A.gets-g0)<=3,(A.puts-p0)+' w '+(A.gets-g0)+' r');
const noPin=await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({act:'logo-sizes'})}),env,ctx);
c('needs the PIN',noPin.status===401||noPin.status===403||noPin.status===302,String(noPin.status));
r=await api(env,ck,{act:'logo-bg',id:'00000001',bg:'l',au:0});
c('changing the tile keeps the size',idOf(r,'00000001').logo.n===1001);
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'A',logo:{v:1700000000001,t:'png',w:3,h:3,n:-5}},{id:'00000002',name:'B',logo:{v:1700000000002,t:'png',w:3,h:3,n:999999999}}]});
r=await api(env,ck,{act:'logo-bg',id:'00000001',bg:'d',au:0});
c('junk sizes are dropped',r.j.ok&&idOf(r,'00000001').logo.n===undefined&&idOf(r,'00000002').logo.n===undefined,JSON.stringify(r.j.items));
const pg=await w.fetch(new Request('https://thestatsboard.co.uk/sponsors',{headers:{Cookie:ck}}),env,ctx).then(x=>x.text());
const scr=[...pg.matchAll(/<script>([^]*?)<\/script>/g)].map(m=>m[1]);let syn=0;for(const x of scr){try{new Function(x)}catch(e){syn++;console.log(e.message)}}c('the sponsors page script parses',syn===0&&scr.length>0);
c('the page has the total line and the button',/id="lgsum"/.test(pg)&&/Check logo sizes/.test(pg)&&/total, largest/.test(pg));
const src_=(await import('fs')).readFileSync(src,'utf8');
c('the Usage page no longer asks Cloudflare for stored data',!/kvStorageAdaptiveGroups/.test(src_)&&!/Stored data \(settings stores\)/.test(src_));
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
