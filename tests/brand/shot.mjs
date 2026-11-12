import fs from 'fs';
globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
const w=(await import(process.argv[2])).default;
const r=await w.fetch(new Request('https://x.co.uk/',{headers:{'User-Agent':'Mozilla/5.0'}}),{CLUB_PIN:'1'},{});
fs.writeFileSync('w/welcome_b.html',await r.text());
