// v3.40.0: Cloudflare limits (server side). Cloudflare's own figures for the Usage page, three separate questions, kept 5 minutes.
import fs from 'fs';import vm from 'vm';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,y)=>{if(x){ok++}else{bad++;console.log('FAIL',n,y||'')}};
const m=/const CFL_FREE[\s\S]*?(?=function usagePage\()/.exec(src);c('Cloudflare limits code found',!!m);
c('the route is behind the club PIN',/path === "\/api\/cflimits"/.test(src));c('the route is served',/url\.pathname === "\/api\/cflimits"\) return cflLimitsApi/.test(src));
if(!m){console.log(`${ok} passed, ${bad} failed`);process.exit(1)}
const today=new Date().toISOString().slice(0,10),yest=new Date(Date.now()-86400000).toISOString().slice(0,10);
const calls=[];
const reply=q=>{
 if(/kvOperationsAdaptiveGroups/.test(q))return {data:{viewer:{accounts:[{kv:[
   {sum:{requests:1500},dimensions:{date:today,actionType:'read'}},{sum:{requests:40},dimensions:{date:today,actionType:'write'}},{sum:{requests:3},dimensions:{date:today,actionType:'delete'}},
   {sum:{requests:9000},dimensions:{date:yest,actionType:'read'}},{sum:{requests:300},dimensions:{date:yest,actionType:'write'}}]}]}}};
 if(/pagesFunctionsInvocationsAdaptiveGroups/.test(q))return {data:null,errors:[{message:'unknown field "pagesFunctionsInvocationsAdaptiveGroups"'}]};
 return {data:{viewer:{accounts:[{w:[
   {sum:{requests:900,errors:0,subrequests:2000},quantiles:{cpuTimeP50:2500,cpuTimeP99:9000},dimensions:{scriptName:'stats-board',status:'success'}},
   {sum:{requests:4,errors:4,subrequests:10},quantiles:{cpuTimeP50:11000,cpuTimeP99:12000},dimensions:{scriptName:'stats-board',status:'exceededResources'}}]}]}}};
};
const ctx={URL,Response,Date,JSON,AbortSignal,Object,Array,Number,String,Math,Promise,SITE_ENV:{CF_ACCOUNT_ID:'acct123',CF_API_TOKEN:'SECRET-TOKEN'}};
ctx.fetch=async(u,o)=>{calls.push({u:String(u),h:o.headers,b:JSON.parse(o.body).query});const j=reply(JSON.parse(o.body).query);return {ok:true,status:200,text:async()=>JSON.stringify(j)}};
vm.createContext(ctx);vm.runInContext(m[0]+';this.api=cflLimitsApi',ctx);
const get=async q=>{const r=await ctx.api(new URL('https://x.test/api/cflimits'+(q||'')));return r.json()};
// not connected
ctx.SITE_ENV={};let r=await get();c('no secrets: says not connected and asks nothing',r.setup===true&&calls.length===0,JSON.stringify(r));
ctx.SITE_ENV={CF_ACCOUNT_ID:'acct123',CF_API_TOKEN:'SECRET-TOKEN'};
r=await get();
c('three separate questions asked',calls.length===3,String(calls.length));
c('they go to the Cloudflare GraphQL address with the token',calls.every(x=>x.u==='https://api.cloudflare.com/client/v4/graphql'&&x.h.Authorization==='Bearer SECRET-TOKEN'));
c('every question names the account',calls.every(x=>x.b.includes('"acct123"')));
c('the KV question covers the last 7 days up to today',calls.some(x=>/kvOperationsAdaptiveGroups/.test(x.b)&&x.b.includes('date_leq:"'+today+'"')));
c('the token is never in the answer',!JSON.stringify(r).includes('SECRET-TOKEN'));
c('KV today: reads, writes, deletes added up',r.kv.ok&&r.kv.today.read===1500&&r.kv.today.write===40&&r.kv.today['delete']===3,JSON.stringify(r.kv));
c('KV busiest day in the 7 is found',r.kv.peak.read.n===9000&&r.kv.peak.write.n===300&&r.kv.peak.write.date===yest,JSON.stringify(r.kv.peak));
c('a refused question loses only itself and keeps the reason',r.pages.ok===false&&/unknown field/.test(r.pages.error)&&r.kv.ok&&r.workers.ok,JSON.stringify(r.pages));
c('workers: requests and errors added up',r.workers.requests===904&&r.workers.errors===4,JSON.stringify(r.workers));
c('workers: requests by status',r.workers.byStatus.success===900&&r.workers.byStatus.exceededResources===4);
c('processing time comes from the busiest row, in ms (Cloudflare gives microseconds)',r.workers.scripts[0].p50ms===2.5&&r.workers.scripts[0].p99ms===9,JSON.stringify(r.workers.scripts));
c('the free limits are sent for the page to draw',r.free.read===100000&&r.free.write===1000&&r.free.requests===100000&&r.free.cpuMs===10);
// kept 5 minutes
const n0=calls.length;const r2=await get();c('a second look within 5 minutes asks Cloudflare nothing',calls.length===n0&&r2.cached===true);
const r3=await get('?fresh=1');c('Refresh within a minute is also served from memory',calls.length===n0&&r3.cached===true);
// whole service down
{const x={URL,Response,Date,JSON,AbortSignal,Object,Array,Number,String,Math,Promise,SITE_ENV:{CF_ACCOUNT_ID:'a',CF_API_TOKEN:'bad'}};
 x.fetch=async()=>({ok:false,status:403,text:async()=>'Forbidden'});vm.createContext(x);vm.runInContext(m[0]+';this.api=cflLimitsApi',x);
 const q=await(await x.api(new URL('https://x.test/api/cflimits'))).json();
 c('token refused: each part says so, the page still answers',q.ok===true&&!q.kv.ok&&/HTTP 403/.test(q.kv.error)&&!q.pages.ok&&!q.workers.ok,JSON.stringify(q).slice(0,200));
 x.fetch=async()=>{throw new Error('network down')};vm.runInContext('CFL_MEM=null',x);
 const q2=await(await x.api(new URL('https://x.test/api/cflimits'))).json();c('Cloudflare unreachable: no crash, reasons given',q2.ok===true&&/network down/.test(q2.kv.error),JSON.stringify(q2).slice(0,200))}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
