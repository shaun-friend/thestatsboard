// Renders the TV quick setup pages from the worker for the browser test: w/setup.html (TV) and w/phone.html (phone, code 482719).
import fs from 'fs';
const store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const w=(await import(process.argv[2]+'?p=1')).default;const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
const q=await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);const ck=(q.headers.get('Set-Cookie')||'').split(';')[0];
fs.mkdirSync('w',{recursive:true});
fs.writeFileSync('w/setup.html',await (await w.fetch(new Request('https://sb.test/setup'),env,ctx)).text());
fs.writeFileSync('w/phone.html',await (await w.fetch(new Request('https://sb.test/pair/482719',{headers:{Cookie:ck}}),env,ctx)).text());
console.log('rendered');
