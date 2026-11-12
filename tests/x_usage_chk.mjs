import fs from 'fs';
const w=(await import(process.argv[2])).default;
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'},ctx={waitUntil(){}};const O='https://thestatsboard.co.uk';
// every column the usage queries can return, with plausible values
const row=i=>({type:i%2?'slow':'badreq',part:['team','season','division','lookups'][i%4],d:'2026-11-'+String(8+i).padStart(2,'0'),people:3+i,kind:['page','tv','cal','club'][i%4],who:2+i,n:10+i,view:['match','fixtures','stack','home'][i%4],team:'1103'+i,name:'Ivybridge '+i,comp:'1699',div:'75791',region:'Devon',country:'GB',device:['mobile','desktop','tv'][i%3],loads:20+i,screens:1+i,known:'1',which:'pin',sources:1,p50:120+i,p95:900+i,slow:i,bad:i,waited:i,src:['RFU results feed','RFU web page','Weather forecast','RFU match record'][i%4],hits:5+i,s:'2026-11-12 00:00:00'});
globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[row(0),row(1),row(2),row(3)]})});
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/usage'})}),env,ctx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(new Request(O+'/usage',{headers:{Cookie:ck}}),env,ctx);
fs.writeFileSync('w/usage_page.html',await r.text());
const out={};
for(const d of [1,7,30]){r=await w.fetch(new Request(O+'/api/usage?days='+d,{headers:{Cookie:ck}}),env,ctx);out[d]=await r.json()}
fs.writeFileSync('w/usage_api.json',JSON.stringify(out));
console.log('api ok:',Object.values(out).every(x=>x.ok));
