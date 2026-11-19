// v3.40.0: Cloudflare limits (server side). Cloudflare's own figures for the Usage page, three separate questions, kept 5 minutes.
import fs from 'fs';import vm from 'vm';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,y)=>{if(x){ok++}else{bad++;console.log('FAIL',n,y||'')}};
const m=/const CFL_FREE[\s\S]*?(?=function usagePage\()/.exec(src);c('Cloudflare limits code found',!!m);
c('the route is behind the club PIN',/path === "\/api\/cflimits"/.test(src));c('the route is served',/url\.pathname === "\/api\/cflimits"\) return cflLimitsApi/.test(src));
if(!m){console.log(`${ok} passed, ${bad} failed`);process.exit(1)}
const today=new Date().toISOString().slice(0,10),yest=new Date(Date.now()-86400000).toISOString().slice(0,10);
const calls=[];
let nsRefused=false,pagesMode='error';
const reply=q=>{
 if(/kvOperationsAdaptiveGroups/.test(q)){
  if(/namespaceId/.test(q)&&nsRefused)return {data:null,errors:[{message:'unknown field "namespaceId"'}]};
  const ns=/namespaceId/.test(q);const d=(date,act,n,id)=>({sum:{requests:n},dimensions:Object.assign({date,actionType:act},ns?{namespaceId:id}:{})});
  return {data:{viewer:{accounts:[{kv:[
   d(today,'read',1000,'aaaa1111-0000-0000-0000-000000000000'),d(today,'read',500,'bbbb2222-0000-0000-0000-000000000000'),d(today,'write',30,'aaaa1111-0000-0000-0000-000000000000'),d(today,'write',10,'bbbb2222-0000-0000-0000-000000000000'),d(today,'delete',3,'aaaa1111-0000-0000-0000-000000000000'),
   d(yest,'read',9000,'aaaa1111-0000-0000-0000-000000000000'),d(yest,'write',300,'aaaa1111-0000-0000-0000-000000000000')]}]}}}}
 if(/pagesFunctionsInvocationsAdaptiveGroups/.test(q)){
  if(pagesMode==='error')return {data:null,errors:[{message:'unknown field "pagesFunctionsInvocationsAdaptiveGroups"'}]};
  if(/scriptName/.test(q)){if(pagesMode==='nosite')return {data:null,errors:[{message:'unknown field "scriptName"'}]};
   return {data:{viewer:{accounts:[{p:[{sum:{requests:4000,errors:0,subrequests:1},quantiles:{cpuTimeP50:1800,cpuTimeP99:24000},dimensions:{scriptName:'irfu-prod',status:'success'}},{sum:{requests:600,errors:0,subrequests:1},quantiles:{cpuTimeP50:1500,cpuTimeP99:4000},dimensions:{scriptName:'irfu-dev',status:'success'}}]}]}}}}
  return {data:{viewer:{accounts:[{p:[{sum:{requests:4600,errors:0,subrequests:1},quantiles:{cpuTimeP50:1800,cpuTimeP99:24000},dimensions:{status:'success'}}]}]}}}}
 return {data:{viewer:{accounts:[{w:[
   {sum:{requests:900,errors:0,subrequests:2000},quantiles:{cpuTimeP50:2500,cpuTimeP99:9000},dimensions:{scriptName:'stats-board',status:'success'}},
   {sum:{requests:4,errors:4,subrequests:10},quantiles:{cpuTimeP50:11000,cpuTimeP99:12000},dimensions:{scriptName:'stats-board',status:'exceededResources'}}]}]}}};
};
const ctx={URL,Response,Date,JSON,AbortSignal,Object,Array,Number,String,Math,Promise,SITE_ENV:{CF_ACCOUNT_ID:'acct123',CF_API_TOKEN:'SECRET-TOKEN',CF_KV_LABELS:'aaaa1111=PROD'}};
ctx.fetch=async(u,o)=>{calls.push({u:String(u),h:o.headers,b:JSON.parse(o.body).query});const j=reply(JSON.parse(o.body).query);return {ok:true,status:200,text:async()=>JSON.stringify(j)}};
vm.createContext(ctx);vm.runInContext(m[0]+';this.api=cflLimitsApi',ctx);
const get=async q=>{const r=await ctx.api(new URL('https://x.test/api/cflimits'+(q||'')));return r.json()};
// not connected
ctx.SITE_ENV={};let r=await get();c('no secrets: says not connected and asks nothing',r.setup===true&&calls.length===0,JSON.stringify(r));
ctx.SITE_ENV={CF_ACCOUNT_ID:'acct123',CF_API_TOKEN:'SECRET-TOKEN',CF_KV_LABELS:'aaaa1111=PROD'};
r=await get();
c('KV and Workers asked once each, Pages asked with the site then without it when refused',calls.length===4,String(calls.length));
c('they go to the Cloudflare GraphQL address with the token',calls.every(x=>x.u==='https://api.cloudflare.com/client/v4/graphql'&&x.h.Authorization==='Bearer SECRET-TOKEN'));
c('every question names the account',calls.every(x=>x.b.includes('"acct123"')));
c('the KV question covers the last 7 days up to today',calls.some(x=>/kvOperationsAdaptiveGroups/.test(x.b)&&x.b.includes('date_leq:"'+today+'"')));
c('the token is never in the answer',!JSON.stringify(r).includes('SECRET-TOKEN'));
c('KV today: reads, writes, deletes added up across stores',r.kv.ok&&r.kv.today.read===1500&&r.kv.today.write===40&&r.kv.today['delete']===3,JSON.stringify(r.kv));
c('KV split by store, busiest first, with a label where one is set',r.kv.byStore.length===2&&r.kv.byStore[0].id==='aaaa1111'&&r.kv.byStore[0].label==='PROD'&&r.kv.byStore[0].today.read===1000&&r.kv.byStore[1].label===''&&r.kv.byStore[1].today.write===10,JSON.stringify(r.kv.byStore));
c('KV busiest day in the 7 is found',r.kv.peak.read.n===9000&&r.kv.peak.write.n===300&&r.kv.peak.write.date===yest,JSON.stringify(r.kv.peak));
c('a refused question loses only itself and keeps the reason',r.pages.ok===false&&/unknown field/.test(r.pages.error)&&r.kv.ok&&r.workers.ok,JSON.stringify(r.pages));
c('workers: requests and errors added up',r.workers.requests===904&&r.workers.errors===4,JSON.stringify(r.workers));
c('workers: requests by status',r.workers.byStatus.success===900&&r.workers.byStatus.exceededResources===4);
c('processing time comes from the busiest row, in ms (Cloudflare gives microseconds)',r.workers.scripts[0].p50ms===2.5&&r.workers.scripts[0].p99ms===9,JSON.stringify(r.workers.scripts));
c('the free limits are sent for the page to draw',r.free.read===100000&&r.free.write===1000&&r.free.requests===100000&&r.free.cpuMs===10);
// kept 5 minutes
const n0=calls.length;const r2=await get();c('a second look within 5 minutes asks Cloudflare nothing',calls.length===n0&&r2.cached===true);
const r3=await get('?fresh=1');c('Refresh within a minute is also served from memory',calls.length===n0&&r3.cached===true);
// store split refused: asked again without it, combined figures kept, reason kept
{const y={...ctx,SITE_ENV:{CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'}};nsRefused=true;pagesMode='nosite';y.fetch=ctx.fetch;vm.createContext(y);vm.runInContext(m[0]+';this.api=cflLimitsApi',y);
 const q=await(await y.api(new URL('https://x.test/api/cflimits'))).json();
 c('store split refused: KV still answers with the combined figures and says why',q.kv.ok&&q.kv.today.read===1500&&q.kv.byStore.length===0&&/namespaceId/.test(q.kv.splitError),JSON.stringify(q.kv).slice(0,200));
 c('site split refused: Pages still answers without it and says why',q.pages.ok&&q.pages.requests===4600&&/scriptName/.test(q.pages.splitError),JSON.stringify(q.pages).slice(0,200));
 nsRefused=false;pagesMode='sites';const y2={...ctx,SITE_ENV:{CF_ACCOUNT_ID:'a',CF_API_TOKEN:'t'}};y2.fetch=ctx.fetch;vm.createContext(y2);vm.runInContext(m[0]+';this.api=cflLimitsApi',y2);
 const q2=await(await y2.api(new URL('https://x.test/api/cflimits'))).json();
 c('site split works: requests by site, busiest first, with processing time',q2.pages.ok&&q2.pages.requests===4600&&q2.pages.scripts[0].name==='irfu-prod'&&q2.pages.scripts[0].requests===4000&&q2.pages.scripts[1].name==='irfu-dev'&&q2.pages.scripts[0].p99ms===24,JSON.stringify(q2.pages.scripts));
 c('no labels set: stores are shown by the start of their number',q2.kv.byStore[0].id==='aaaa1111'&&q2.kv.byStore[0].label==='')}
// whole service down
{const x={URL,Response,Date,JSON,AbortSignal,Object,Array,Number,String,Math,Promise,SITE_ENV:{CF_ACCOUNT_ID:'a',CF_API_TOKEN:'bad'}};
 x.fetch=async()=>({ok:false,status:403,text:async()=>'Forbidden'});vm.createContext(x);vm.runInContext(m[0]+';this.api=cflLimitsApi',x);
 const q=await(await x.api(new URL('https://x.test/api/cflimits'))).json();
 c('token refused: each part says so, the page still answers',q.ok===true&&!q.kv.ok&&/HTTP 403/.test(q.kv.error)&&!q.pages.ok&&!q.workers.ok,JSON.stringify(q).slice(0,200));
 x.fetch=async()=>{throw new Error('network down')};vm.runInContext('CFL_MEM=null',x);
 const q2=await(await x.api(new URL('https://x.test/api/cflimits'))).json();c('Cloudflare unreachable: no crash, reasons given',q2.ok===true&&/network down/.test(q2.kv.error),JSON.stringify(q2).slice(0,200))}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
