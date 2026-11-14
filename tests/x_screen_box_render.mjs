import fs from 'fs';
globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
const w=(await import(process.argv[2])).default;
const kv={get:async()=>null,put:async()=>{},delete:async()=>{}};const env={CLUB_PIN:'1234',SETTINGS:kv},ctx={waitUntil(){}};const O='https://thestatsboard.co.uk';
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),env,ctx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(new Request(O+'/',{headers:{Cookie:ck,'User-Agent':'Mozilla/5.0'}}),env,ctx);
fs.writeFileSync('/tmp/bld.html',await r.text());
