const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
const feed=[];globalThis.fetch=async u=>{feed.push(String(u));return {ok:false,status:500,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const rows=[];const USAGE={writeDataPoint:d=>(d.blobs[1]!=='start'&&d.blobs[1]!=='done'&&rows.push(d))};
const store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const env={CLUB_PIN:'pin-1234',SETTINGS:kv,USAGE,PIN_DELAY_MS:'0'};let w=await load();
const get=(p,ip='1.1.1.1')=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0','CF-Connecting-IP':ip}}),env,{});
const st=async p=>(await get(p)).status;
// rejected before reaching the RFU
const before=feed.length;
for(const [p,part] of [['/?team=abc','team'],['/?team=123456789','team'],['/?team=1;drop','team'],['/?competition=-1','competition'],['/?division=1.5','division'],['/?season=2026','season'],['/?season=2026-2028','season'],['/?season=1999-2000','season'],['/?season=2026-27','season'],['/?team=1%20OR%201=1','team'],['/calendar.ics?team=x','team'],['/api/builder/team?team=zz','team'],['/api/crest?id=12x','id'],['/api/builder/team?id=1x','id']]){
  const r=await get(p);const t=await r.text();c('rejects '+p,r.status===400&&t.includes(part)&&!t.includes('drop')&&r.headers.get('Cache-Control')==='no-store');
}
c('nothing went to the RFU for bad values',feed.length===before);
c('too long',await st('/?teams='+'1'.repeat(4100))===414);
// valid values pass the gate (the worker itself then answers; just not 400/429)
for(const p of ['/','/?team=11039&competition=1699&division=75791&season=2026-2027','/?season=2025-2026&team=1','/?team=&season=','/?view=teams','/api/builder/search?q=exeter']){const s2=await st(p);c('accepts '+p,s2!==400&&s2!==429&&s2!==414)}
// usage rows: part name only, never the value
const sec=rows.filter(d=>d.blobs[1]==='sec');
c('sec rows written',sec.length>=14);c('sec row shape',sec.every(d=>d.blobs[2]==='badreq'||d.blobs[2]==='slow'));
c('part names recorded',sec.some(d=>d.blobs[3]==='team')&&sec.some(d=>d.blobs[3]==='season')&&sec.some(d=>d.blobs[3]==='length'));
c('bad value never stored',!JSON.stringify(rows).includes('drop')&&!JSON.stringify(rows).includes('OR%201')&&!JSON.stringify(rows).includes('abc'));
c('source code present, no address',sec.every(d=>/^[0-9a-f]{16}$/.test(d.blobs[11])&&!JSON.stringify(d).includes('1.1.1.1')));
// different-lookup limit
w=await load();const A='2.2.2.2',B='3.3.3.3';let last;
for(let i=1;i<=30;i++){last=await get('/?team='+(1000+i)+'&competition=1&division=1&season=2026-2027',A);c('lookup '+i+' allowed',last.status!==429)}
last=await get('/?team=2000&competition=1&division=1&season=2026-2027',A);c('31st different lookup slowed',last.status===429&&last.headers.get('Retry-After')==='60'&&/slow down/.test(await last.text()));
last=await get('/?team=1001&competition=1&division=1&season=2026-2027',A);c('repeat of an earlier lookup is also held while slowed',last.status===429);
last=await get('/?team=2001&competition=1&division=1&season=2026-2027',B);c('other visitor unaffected',last.status!==429);
// same lookup repeated does not count
const C='4.4.4.4';let any429=false;for(let i=0;i<80;i++){const r=await get('/?team=11039&competition=1699&division=75791&season=2026-2027',C);if(r.status===429)any429=true}c('same team 80 times is fine',!any429);
// window resets
const realNow=Date.now;Date.now=()=>realNow()+61000;last=await get('/?team=2002&competition=1&division=1&season=2026-2027',A);c('limit resets after a minute',last.status!==429);Date.now=realNow;
// calendar and builder team also count; search has its own larger limit
const D='5.5.5.5';let s429=0;for(let i=1;i<=35;i++){const r=await get('/api/builder/team?team='+(3000+i)+'&season=2026-2027',D);if(r.status===429)s429++}c('builder team lookups counted',s429>=5);
const E='6.6.6.6';let q429=0;for(let i=1;i<=70;i++){const r=await get('/api/builder/search?q=team'+i,E);if(r.status===429)q429++}c('search limited after 60 a minute',q429===10);
const F='7.7.7.7';let n429=0;for(let i=1;i<=50;i++){const r=await get('/api/builder/search?q=team'+i,F);if(r.status===429)n429++}c('50 searches fine',n429===0);
c('slow rows written',rows.some(d=>d.blobs[1]==='sec'&&d.blobs[2]==='slow'&&d.blobs[3]==='lookups')&&rows.some(d=>d.blobs[2]==='slow'&&d.blobs[3]==='search'));
// sec rows are not page views: the usage page counts exclude them
c('sec kind excluded from the visit counts',(await import('fs')).readFileSync(src,'utf8').includes("blob2 NOT IN ('up', 'pinfail', 'sec')"));
// maintenance and PIN pages unaffected
const r=await get('/club-unlock');c('pin page still opens',r.status===200);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
