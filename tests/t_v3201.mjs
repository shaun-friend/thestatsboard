import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>{const s=String(u);if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);if(s.includes('full-matches'))return J({results:[],fixtures:[],leagueTables:[]});return {ok:false,status:500,text:async()=>''}};
const mod=await import(src);const w=mod.default,T=mod.__t;
const K=(q)=>T.pageKeySearch(new URL('https://x.co.uk/?'+q).searchParams);
const base='season=2026-2027&competition=1699&division=75791&team=11039';
c('extras ignored',K(base+'&sillylink=here')===K(base)&&K(base+'&utm_source=x&fbclid=abc')===K(base));
c('order ignored',K('team=11039&division=75791&competition=1699&season=2026-2027')===K(base));
c('real differences kept',K(base+'&theme=light')!==K(base)&&K(base.replace('11039','11063'))!==K(base)&&K(base+'&layout=tv')!==K(base)&&K(base+'&friendlyName=A')!==K(base+'&friendlyName=B'));
c('empty is empty',K('')===''&&K('zzz=1')==='');
c('values encoded',K('friendlyName=a%26b%3Dc').includes('friendlyName=a%26b%3Dc'));
// every setting the code reads is on the list
const code=fs.readFileSync(src,'utf8');const read=new Set([...code.matchAll(/\b(?:searchParams|q)\.(?:get|has|getAll)\("([A-Za-z]+)"\)/g)].map(m=>m[1]));
const miss=[...read].filter(k=>!T.KNOWN_PARAMS.includes(k));c('no setting read by the code is missing from the list'+(miss.length?': '+miss.join(','):''),miss.length===0);
// end to end on PROD: an extra made-up setting is served from the stored page
const stored=new Map();globalThis.caches={default:{match:async r=>{const v=stored.get(r.url);return v?v.clone():undefined},put:async(r,res)=>{stored.set(r.url,res.clone())}}};
const req=p=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0','CF-Connecting-IP':'1.1.1.1'}}),{CLUB_PIN:'1'},{waitUntil(p2){return p2}});
let r=await req('/?'+base);c('first request builds the page',r.status===200&&r.headers.get('X-Page-Cache')!=='HIT');
await new Promise(r2=>setTimeout(r2,50));
r=await req('/?'+base+'&sillylink=here');c('extra setting is served from the stored page',r.status===200&&r.headers.get('X-Page-Cache')==='HIT');
r=await req('/?team=11039&season=2026-2027&division=75791&competition=1699');c('different order is served from the stored page',r.headers.get('X-Page-Cache')==='HIT');
r=await req('/?'+base+'&theme=light');c('a real difference builds its own page',r.headers.get('X-Page-Cache')!=='HIT');
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
