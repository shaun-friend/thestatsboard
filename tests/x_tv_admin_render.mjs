// Renders the Admin page from the worker (signed in) into w/tv_admin.html for the browser checks.
import fs from 'fs';
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const w=(await import(process.argv[2]+'?r=1')).default;const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
const q=await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);const ck=(q.headers.get('Set-Cookie')||'').split(';')[0];
const r=await w.fetch(new Request('https://thestatsboard.co.uk/admin',{headers:{Cookie:ck}}),env,ctx);const t=await r.text();
fs.writeFileSync('w/tv_admin.html',t);console.log(r.status,t.length,/id="s-tv"/.test(t));
