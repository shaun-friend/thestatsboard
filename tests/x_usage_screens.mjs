// Renders the Usage page for the browser test: w/usage.html
import fs from 'fs';
const store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const w=(await import(process.argv[2]+'?u=1')).default;const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
const q=await w.fetch(new Request('https://thestatsboard.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);const ck=(q.headers.get('Set-Cookie')||'').split(';')[0];
fs.mkdirSync('w',{recursive:true});
fs.writeFileSync('w/usage.html',await (await w.fetch(new Request('https://sb.test/usage',{headers:{Cookie:ck}}),env,ctx)).text());console.log('rendered');
