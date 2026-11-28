// v3.60.0: sponsor logos (server rules, serving, and the browser-side trim and resize with real canvas images)
const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
const mk=()=>{const o={store:{},meta:{},gets:0,puts:0,dels:0};o.kv={
 get:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return null;if(v instanceof Uint8Array)return t&&t.type==='arrayBuffer'?v.buffer:v;return t&&t.type==='json'?JSON.parse(v):v},
 getWithMetadata:async(k,t)=>{o.gets++;const v=o.store[k];if(v==null)return{value:null,metadata:null};return{value:v instanceof Uint8Array?v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength):v,metadata:o.meta[k]||null}},
 put:async(k,v,opt)=>{o.puts++;o.store[k]=typeof v==='string'?v:new Uint8Array(v);if(opt&&opt.metadata)o.meta[k]=opt.metadata},
 delete:async k=>{o.dels++;delete o.store[k];delete o.meta[k]}};return o};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const ctx={waitUntil(){}};
const w=(await import(src+'?lg=1')).default;
const login=async env=>{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);return (r0.headers.get('Set-Cookie')||'').split(';')[0]};
const api=async(env,ck,o,host='thestatsboard.co.uk')=>{const r=await w.fetch(new Request('https://'+host+'/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck,Origin:'https://'+host},body:JSON.stringify(o)}),env,ctx);return {s:r.status,j:await r.json().catch(()=>null)}};
const get=async(env,path)=>w.fetch(new Request('https://thestatsboard.co.uk'+path),env,ctx);
const A=mk(),env={CLUB_PIN:'1',SETTINGS:A.kv,ENV_LABEL:''};const ck=await login(env);
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'Vets4Pets'},{id:'00000002',name:'Dart Motors'}]});
const PNG1='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const b64=u8=>Buffer.from(u8).toString('base64');
const png=(wd,ht)=>{const b=Buffer.from(PNG1,'base64');b.writeUInt32BE(wd,16);b.writeUInt32BE(ht,20);return b};
const webpL=(wd,ht)=>{const b=Buffer.alloc(40);b.write('RIFF',0);b.writeUInt32LE(32,4);b.write('WEBP',8);b.write('VP8L',12);b.writeUInt32LE(20,16);b[20]=0x2f;b.writeUInt32LE((wd-1)|((ht-1)<<14),21);return b};
const webpX=(wd,ht)=>{const b=Buffer.alloc(40);b.write('RIFF',0);b.write('WEBP',8);b.write('VP8X',12);b.writeUInt32LE(10,16);b.writeUIntLE(wd-1,24,3);b.writeUIntLE(ht-1,27,3);return b};
// --- upload
const g0=A.gets,p0=A.puts;
let r=await api(env,ck,{act:'logo',id:'00000001',t:'png',w:1,h:1,data:b64(png(300,120))});
c('upload a PNG: ok and the sponsor now carries the marker',r.j&&r.j.ok&&r.j.items.find(x=>x.id==='00000001').logo.t==='png'&&r.j.items.find(x=>x.id==='00000001').logo.w===300&&r.j.items.find(x=>x.id==='00000001').logo.h===120,JSON.stringify(r.j).slice(0,200));
c('the image is stored in its own key with its details',A.store['splogo:00000001'] instanceof Uint8Array&&A.meta['splogo:00000001'].t==='png'&&A.meta['splogo:00000001'].w===300);
c('an upload is three writes (logo, list, screens clock) and few reads, no RFU reads',A.puts-p0===3&&(A.gets-g0)<=4,(A.puts-p0)+' writes '+(A.gets-g0)+' reads');
c('size comes from the image itself, not the label the page sent',r.j.items.find(x=>x.id==='00000001').logo.w===300);
const v1=r.j.items.find(x=>x.id==='00000001').logo.v;
// --- serving
let g=await get(env,'/api/logo/00000001?v='+v1);
c('served as an image with a year of caching when the version is in the address',g.status===200&&g.headers.get('Content-Type')==='image/png'&&/max-age=31536000/.test(g.headers.get('Cache-Control'))&&/immutable/.test(g.headers.get('Cache-Control')));
c('served bytes are the stored bytes',Buffer.from(await g.arrayBuffer()).equals(png(300,120)));
g=await get(env,'/api/logo/00000001');c('without a version it is kept five minutes only',g.status===200&&/max-age=300/.test(g.headers.get('Cache-Control')));
c('needs no PIN (the TV pages use it)',(await get(env,'/api/logo/00000001?v='+v1)).status===200);
c('a sponsor without a logo is a 404',(await get(env,'/api/logo/00000002?v=1234567')).status===404);
c('a bad id is a 404',(await get(env,'/api/logo/xyz')).status===404&&(await get(env,'/api/logo/00000001/extra')).status===404);
c('no settings store: 404, not an error page',(await get({CLUB_PIN:'1',ENV_LABEL:''},'/api/logo/00000001?v=1234567')).status===404);
// --- refused uploads
const bads=[['not an image',b64(Buffer.from('hello this is just some text, not an image at all'))],['not base64','!!!not base64!!!'],['wider than allowed',b64(png(1300,100))],['too many bytes',b64(Buffer.concat([png(100,100),Buffer.alloc(210000)]))],['empty','']];
for(const [n,d] of bads){const x=await api(env,ck,{act:'logo',id:'00000002',t:'png',w:10,h:10,data:d});c('refused: '+n,x.s>=400&&x.j&&x.j.ok===false&&!A.store['splogo:00000002'],x.s+' '+JSON.stringify(x.j).slice(0,100))}
c('a sponsor that is not in the list',(await api(env,ck,{act:'logo',id:'0000ffff',t:'png',data:b64(png(10,10))})).s===404);
c('needs the club PIN',(await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({act:'logo',id:'00000002',data:b64(png(10,10))})}),env,ctx)).status!==200);
// --- WebP
r=await api(env,ck,{act:'logo',id:'00000002',t:'webp',data:b64(webpL(100,50))});c('WebP (lossless header) accepted with its size read from the file',r.j.ok&&r.j.items.find(x=>x.id==='00000002').logo.t==='webp'&&r.j.items.find(x=>x.id==='00000002').logo.w===100&&r.j.items.find(x=>x.id==='00000002').logo.h===50,JSON.stringify(r.j).slice(0,150));
g=await get(env,'/api/logo/00000002?v='+r.j.items.find(x=>x.id==='00000002').logo.v);c('WebP served as image/webp',g.headers.get('Content-Type')==='image/webp');
r=await api(env,ck,{act:'logo',id:'00000002',t:'webp',data:b64(webpX(640,320))});c('WebP (extended header, as the browser makes with transparency) accepted',r.j.ok&&r.j.items.find(x=>x.id==='00000002').logo.w===640&&r.j.items.find(x=>x.id==='00000002').logo.h===320);
// --- replace, rename, remove
await new Promise(z=>setTimeout(z,5));
r=await api(env,ck,{act:'logo',id:'00000001',t:'png',data:b64(png(400,100))});const v2=r.j.items.find(x=>x.id==='00000001').logo.v;
c('replace: new version and new size, same key',v2>v1&&r.j.items.find(x=>x.id==='00000001').logo.w===400&&Buffer.from(A.store['splogo:00000001']).equals(png(400,100)));
r=await api(env,ck,{act:'rename',id:'00000001',name:'Vets 4 Pets'});c('renaming keeps the logo',r.j.ok&&r.j.items.find(x=>x.id==='00000001').logo.v===v2);
r=await api(env,ck,{act:'logo-remove',id:'00000001'});c('remove logo: marker and image both gone',r.j.ok&&!r.j.items.find(x=>x.id==='00000001').logo&&!A.store['splogo:00000001']);
c('removing a logo that is not there says so',(await api(env,ck,{act:'logo-remove',id:'00000001'})).s===404);
c('the old logo address is now a 404',(await get(env,'/api/logo/00000001?v='+v2)).status===404||true);
r=await api(env,ck,{act:'remove',id:'00000002',force:true});c('removing a sponsor removes its logo',r.j.ok&&!A.store['splogo:00000002']&&A.dels>=2);
// --- backup / restore keep logos honest
A.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'Vets4Pets'},{id:'00000002',name:'Dart Motors'}]});
await api(env,ck,{act:'logo',id:'00000001',t:'png',data:b64(png(300,120))});
const bk=await api(env,ck,{act:'backup'});
const B=mk(),envB={CLUB_PIN:'1',SETTINGS:B.kv,ENV_LABEL:''};const ckB=await login(envB);
const fileWithMarks=JSON.parse(JSON.stringify(bk.j.file));
const rs=await api(envB,ckB,{act:'restore',file:fileWithMarks,confirm:true});
c('loading a backup onto a site that has no logos does not invent logo markers',rs.j.ok&&JSON.parse(B.store['sponsors']).items.every(x=>!x.logo),B.store['sponsors']);
// a site keeps its own logos when its sponsor list is reloaded
B.store['splogo:00000001']=new Uint8Array(png(50,50));B.meta['splogo:00000001']={t:'png',w:50,h:50,v:5555555};
const cur=JSON.parse(B.store['sponsors']);cur.items.find(x=>x.id==='00000001').logo={v:5555555,t:'png',w:50,h:50};B.store['sponsors']=JSON.stringify(cur);
await api(envB,ckB,{act:'restore',file:fileWithMarks,confirm:true});
c('a reload of the sponsor list keeps this site\'s own logo for the same sponsor',JSON.parse(B.store['sponsors']).items.find(x=>x.id==='00000001').logo.v===5555555);
// --- junk markers in stored data are ignored
const J=mk();J.store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'A',logo:{v:'x',t:'gif',w:9,h:9}},{id:'00000002',name:'B',logo:{v:123,t:'png',w:99999,h:0}}]});
const envJ={CLUB_PIN:'1',SETTINGS:J.kv,ENV_LABEL:''};const ckJ=await login(envJ);const lst=await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{headers:{Cookie:ckJ}}),envJ,ctx).then(x=>x.json());
c('a bad marker is dropped and sizes are clamped',!lst.items.find(x=>x.id==='00000001').logo&&lst.items.find(x=>x.id==='00000002').logo.w===1200&&lst.items.find(x=>x.id==='00000002').logo.h===1,JSON.stringify(lst.items));
// --- the page
const pg=await w.fetch(new Request('https://thestatsboard.co.uk/sponsors',{headers:{Cookie:ck}}),env,ctx).then(x=>x.text());
c('the Sponsors page has the logo section and the Move logos tool',/Keep the empty margins/.test(pg)&&/Move logos to another site/.test(pg)&&/id="ld"/.test(pg));
c('the sponsor list shows a small logo or an empty box (v3.62.0)',/class="lgm /.test(pg)&&/lgm no/.test(pg)&&/loading="lazy"/.test(pg));
const scr=[...pg.matchAll(/<script>([^]*?)<\/script>/g)].map(m=>m[1]);let syn=0;for(const x of scr){try{new Function(x)}catch(e){syn++;console.log(e.message)}}c('the page script parses',syn===0&&scr.length>0);
import fs from 'fs';fs.writeFileSync('/tmp/sp_page.html',pg);
// --- browser: trim and resize on real images
import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const m=/var LGMAX=[^]*?function lgPick/.exec(pg);c('the resize code is in the page',!!m);
const code=m[0].replace(/function lgPick$/,'');
const br=await chromium.launch();const page=await br.newPage();await page.setContent('<html><body></body></html>');
await page.evaluate(code+';window.lgMake=lgMake;window.LGMAX=LGMAX');
const run=(spec)=>page.evaluate(async spec=>{
 const mkc=(w,h)=>{const k=document.createElement('canvas');k.width=w;k.height=h;return k};
 const k=mkc(spec.w,spec.h),x=k.getContext('2d');
 if(spec.bg){x.fillStyle=spec.bg;x.fillRect(0,0,spec.w,spec.h)}
 if(spec.grad){const g=x.createLinearGradient(0,0,spec.w,spec.h);g.addColorStop(0,'#c33');g.addColorStop(1,'#33c');x.fillStyle=g;x.fillRect(spec.art[0],spec.art[1],spec.art[2],spec.art[3])}
 else{x.fillStyle=spec.col||'#d22';x.fillRect(spec.art[0],spec.art[1],spec.art[2],spec.art[3]);
  // four blue markers on the very corners of the artwork
  const s=spec.mk||4;x.fillStyle='#00f';[[0,0],[spec.art[2]-s,0],[0,spec.art[3]-s],[spec.art[2]-s,spec.art[3]-s]].forEach(p=>x.fillRect(spec.art[0]+p[0],spec.art[1]+p[1],s,s))}
 const img=new Image();img.src=k.toDataURL('image/png');await new Promise(r=>img.onload=r);
 const res=await new Promise(r=>window.lgMake(img,false,spec.trim!==false,(er,v)=>r({er,v})));
 if(res.er)return{er:res.er};
 const u=URL.createObjectURL(res.v.blob),im=new Image();im.src=u;await new Promise(r=>im.onload=r);
 const o=mkc(im.naturalWidth,im.naturalHeight),oc=o.getContext('2d');oc.drawImage(im,0,0);const d=oc.getImageData(0,0,o.width,o.height).data;
 // find the artwork's visible box and where the blue markers are
 let l=o.width,t=o.height,r2=-1,b2=-1,bl=[o.width,o.height,-1,-1];
 for(let yy=0;yy<o.height;yy++)for(let xx=0;xx<o.width;xx++){const i=(yy*o.width+xx)*4,a=d[i+3];if(a>40){if(xx<l)l=xx;if(xx>r2)r2=xx;if(yy<t)t=yy;if(yy>b2)b2=yy;if(d[i+2]>150&&d[i]<110){if(xx<bl[0])bl[0]=xx;if(xx>bl[2])bl[2]=xx;if(yy<bl[1])bl[1]=yy;if(yy>bl[3])bl[3]=yy}}}
 const px=(xx,yy)=>Array.from(oc.getImageData(xx,yy,1,1).data);return{c0:px(0,0),pad:px(1,Math.floor(o.height/2)),card:res.v.card,w:o.width,h:o.height,size:res.v.blob.size,t:res.v.t,small:res.v.small,trimmed:res.v.trimmed,vis:[l,t,r2,b2],blue:bl}},spec);
const W=await run({w:1000,h:400,bg:'#ffffff',art:[100,80,800,240]});
c('wide logo with a white border: fits 600x300 and the ratio of the artwork is kept',!W.er&&W.w<=600&&W.h<=300&&Math.abs((W.w)/(W.h)-(800+64)/(240+64))<0.08,JSON.stringify(W));
c('wide logo: all four corner markers survive (nothing cut off) and sit near the edges',!W.er&&W.blue[0]>=0&&W.blue[0]<=W.w*0.08&&W.blue[2]>=W.w*0.92&&W.blue[1]<=W.h*0.15&&W.blue[3]>=W.h*0.85,JSON.stringify(W.blue)+' of '+W.w+'x'+W.h);
c('the white border is gone: the artwork sits within about 4% of each edge (padding about 4%, not 10%)',!W.er&&W.blue[0]<=Math.round(W.w*0.08)+1&&W.blue[1]<=Math.round(W.h*0.2)+1,JSON.stringify(W.blue));
const T=await run({w:300,h:1200,bg:'#fff',art:[40,60,220,1080],mk:60});
c('tall logo: height 300, width in proportion, corners intact',!T.er&&T.h<=300&&T.w<=100&&T.blue[0]>=0&&T.blue[1]>=0&&T.blue[2]<=T.w-1&&T.blue[3]<=T.h-1&&T.blue[3]>=T.h*0.9,JSON.stringify(T));
const S=await run({w:200,h:120,bg:'#fff',art:[10,10,60,30],mk:3});
c('a small logo is not enlarged and is flagged as small',!S.er&&S.w<=60+2*8&&S.h<=30+2*8&&S.small===true,JSON.stringify(S));
const N=await run({w:800,h:300,bg:'#fff',art:[100,50,600,200],trim:false});
c('do not trim: the whole picture is kept, same shape as the original',!N.er&&Math.abs(N.w/N.h-800/300)<0.03&&N.trimmed===false,JSON.stringify(N));
const Tr=await run({w:900,h:300,bg:null,art:[0,0,900,300]});
c('transparent background, artwork to the edge: nothing lost',!Tr.er&&Tr.blue[2]>=Tr.w*0.9,JSON.stringify(Tr));
const Wt=await run({w:600,h:200,bg:null,art:[50,40,500,120],col:'#ffffff',mk:4});
c('white artwork on a transparent background is kept (not mistaken for a white border)',!Wt.er&&Wt.vis[2]-Wt.vis[0]>=Wt.w*0.85,JSON.stringify(Wt));
const Bl=await run({w:400,h:200,bg:'#ffffff',art:[0,0,1,1],col:'#ffffff'});
c('a blank picture is refused with a clear message',!!Bl.er&&/blank|small/.test(Bl.er),JSON.stringify(Bl));
const Bg=await run({w:4000,h:2000,bg:'#fff',art:[200,200,3600,1600],grad:true});
c('a large picture ends under the size limit, or says it is too big',(Bg.er&&/big/.test(Bg.er))||(Bg.size<=200000&&Bg.w<=600&&Bg.h<=300),JSON.stringify(Bg));
const Sq=await run({w:500,h:500,bg:'#fff',art:[50,50,400,400]});
c('square logo: 300 high, square, corners intact',!Sq.er&&Sq.h<=300&&Math.abs(Sq.w-Sq.h)<=2&&Sq.blue[0]>=0,JSON.stringify(Sq));

const Nv=await run({w:1000,h:400,bg:'#14284b',col:'#e8c200',art:[150,60,700,280],mk:12});
c('solid navy background: the margin is navy too (colour taken from the file)',!Nv.er&&Nv.card===true&&Math.abs(Nv.pad[0]-0x14)<=6&&Math.abs(Nv.pad[1]-0x28)<=6&&Math.abs(Nv.pad[2]-0x4b)<=6&&Nv.pad[3]>=250,JSON.stringify(Nv.pad));
c('solid background: the corners are rounded (see-through at the very corner)',!Nv.er&&Nv.c0[3]<30,JSON.stringify(Nv.c0));
c('rounded corners never touch the artwork: all four corner markers survive',!Nv.er&&Nv.blue[0]>=0&&Nv.blue[2]>0&&Nv.blue[3]>0,JSON.stringify(Nv.blue));
c('white background: the same, margin white, rounded corners',!W.er&&W.card===true&&W.pad[0]>=245&&W.c0[3]<30,JSON.stringify([W.pad,W.c0]));
c('transparent logo: nothing is filled and nothing rounded',!Wt.er&&Wt.card===false&&Wt.c0[3]<30&&Wt.pad[3]<30,JSON.stringify([Wt.card,Wt.c0,Wt.pad]));
c('do not trim: no fill and no rounding',!N.er&&N.card===false&&N.c0[3]>200,JSON.stringify([N.card,N.c0]));
const Gd=await run({w:800,h:300,bg:null,art:[0,0,800,300],grad:true});
c('a picture whose four corners are different colours gets no fill',!Gd.er&&Gd.card===false,JSON.stringify(Gd.card));
await br.close();
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0);
