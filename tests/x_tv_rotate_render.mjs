import fs from 'fs';
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const w=(await import(process.argv[2]+'?r=2')).default;const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
const q=await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);const ck=(q.headers.get('Set-Cookie')||'').split(';')[0];
await w.fetch(new Request('https://thestatsboard.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify({tv:{dots:true,items:[{page:'fixtures',team:'11039',secs:10},{page:'match',team:'11039',secs:10},{page:'table',team:'11039',secs:10},{page:'leaders',team:'11039',secs:10}]}})}),env,ctx);
const r=await w.fetch(new Request('https://thestatsboard.co.uk/ivybridge/tv'),env,ctx);fs.writeFileSync('w/tv_screen.html',await r.text());console.log(r.status);
