const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x)ok++;else{bad++;console.log('FAIL',n)}};
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>String(u).includes('/seasons')?J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]):({ok:false,status:500,text:async()=>''});
const pts=[];const env={USAGE:{writeDataPoint:d=>(d.blobs[1]!=='start'&&d.blobs[1]!=='done'&&pts.push(d))},SETTINGS:{get:async()=>null,put:async()=>{},delete:async()=>{}}};
const w=(await import(src)).default;const ctxs=[];const ctx={waitUntil:p=>ctxs.push(p)};
const get=async q=>{const r=await w.fetch(new Request('https://x.co.uk/'+q,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0)'}}),env,ctx);await Promise.all(ctxs);return r};
await get('?view=stack&layout=tv&screen=Clubhouse%20Bar%3Cb%3E');
await get('?view=stack&layout=tv');
await get('?view=match&screen=Bar&team=11039');
const tv=pts.filter(p=>p.blobs[1]==='tv');
c('tv view recorded',tv.length>=2);
c('label recorded, tags stripped',tv.some(p=>p.blobs[14]==='Clubhouse Barb'));
c('no label is empty',tv.some(p=>p.blobs[14]===''));
c('page views never carry a label',pts.filter(p=>p.blobs[1]==='page').every(p=>(p.blobs[14]||'')===''));
const k=(await import(src+'?i=s')).__t;
c('screen does not change the page key',k.pageKeySearch(new URLSearchParams('view=stack&screen=A'))===k.pageKeySearch(new URLSearchParams('view=stack')));
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
