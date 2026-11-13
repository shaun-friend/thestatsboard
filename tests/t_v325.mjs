const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x)ok++;else{bad++;console.log('FAIL',n)}};
const run=async(web)=>{
  const calls=[];
  globalThis.fetch=async u=>{const s=String(u);calls.push(s);if(s.includes('/seasons'))return {ok:true,status:200,text:async()=>JSON.stringify([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}])};return {ok:false,status:500,text:async()=>''}};
  const env={SETTINGS:{get:async()=>({features:{webfallback:web}}),put:async()=>{},delete:async()=>{}}};
  const w=(await import(src+'?i='+web)).default;
  const r=await w.fetch(new Request('https://x.co.uk/?season=2026-2027&competition=5&division=77026&team=41&teamName=A&friendlyName=A&format=summary',{headers:{'User-Agent':'Mozilla/5.0'}}),env,{waitUntil(){}});
  const b=await w.fetch(new Request('https://x.co.uk/api/builder/search?name=exeter',{headers:{'User-Agent':'Mozilla/5.0'}}),env,{waitUntil(){}});
  return {calls,bj:await b.json().catch(()=>({}))};
};
const on=await run(true),off=await run(false);
c('on: website is tried when the feed has nothing',on.calls.some(u=>u.includes('englandrugby.com')));
c('off: no englandrugby.com call at all',!off.calls.some(u=>u.includes('englandrugby.com')));
c('off: search says website off',off.bj.via==='website-off');
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
