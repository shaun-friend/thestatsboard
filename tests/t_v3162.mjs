// Compiles every inline <script> on the main pages: a syntax error in any of them stops that whole page working in the browser.
import vm from 'vm';
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}},CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'},ctx={waitUntil(){}};
globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({}),text:async()=>''});
const O='https://thestatsboard.co.uk';
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),env,ctx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
const own='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&friendlyName=Ivybridge%201XV';
const pages=['/usage','/admin','/docs','/?view=teams','/release-notes','/','/?'+own,'/?'+own+'&layout=tv','/?'+own+'&view=match','/?'+own+'&view=fixtures','/?'+own+'&view=fixtures&layout=tv','/?'+own+'&view=opposition','/?view=stack&layout=tv','/?'+own+'&app=1'];
for(const p of pages){
  const res=await w.fetch(new Request(O+p,{headers:{Cookie:ck}}),env,ctx);const h=await res.text();
  const scripts=[...h.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="(?:application\/ld\+json|application\/json)")[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
  let bad='';scripts.forEach((s,i)=>{try{new vm.Script(s)}catch(e){bad+=' script#'+i+': '+e.message}});
  ok('scripts compile on '+p.slice(0,40)+' ('+scripts.length+' scripts)'+bad,!bad);
}
// DEV-only probe page
const D='https://dev.thestatsboard.co.uk',denv={...env,ENV_LABEL:'DEV',DEV_PIN:'1'};
r=await w.fetch(new Request(D+'/unlock',{method:'POST',body:new URLSearchParams({pin:'1',next:'/'})}),denv,ctx);const dck=(r.headers.get('set-cookie')||'').split(';')[0];
const ph=await (await w.fetch(new Request(D+'/probe?team=11039&season=2026-2027',{headers:{Cookie:dck}}),denv,ctx)).text();
let pb='';[...ph.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].forEach((m,i)=>{if(m[1].trim())try{new vm.Script(m[1])}catch(e){pb+=' #'+i+' '+e.message}});
ok('scripts compile on /probe'+pb,!pb);
console.log(pass+' pass, '+fail+' fail');
