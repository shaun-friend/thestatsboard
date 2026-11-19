// v3.40.2: Teams people look up fills in a missing team name from any other record of that team
import fs from 'fs';import vm from 'vm';
const src=fs.readFileSync(process.argv[2],'utf8');
const a=src.indexOf('async function nameTeamRows(');const b=src.indexOf('async function usageQuery(');
if(a<0||b<0){console.log('FAIL function not found');process.exit(1)}
let pass=0,fail=0;const c=(n,ok,d)=>{if(ok)pass++;else{fail++;console.log('FAIL',n,d||'')}};
const sqls=[];
const ctx={String,Number,Array,JSON,Object,TEAMS:[{team:'11039',name:'Ivybridge 1XV'}],usageQuery:async q=>{sqls.push(q);if(ctx.boom)throw new Error('x');return [{team:'3314',name:'Plymouth Albion',n:5},{team:'3314',name:'Plym',n:1}]}};
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.f=nameTeamRows',ctx);
const W="FROM ds WHERE blob1='x'";
let r=await ctx.f([{team:'3314',name:'',n:2},{team:'11039',name:'',n:1},{team:'555',name:'Named FC',n:3}],W);
c('unnamed team gets its busiest name',r[0].name==='Plymouth Albion',JSON.stringify(r));
c('our own team falls back to the list name',r[1].name==='Ivybridge 1XV');
c('a named row is untouched',r[2].name==='Named FC');
c('one extra question, only for the unnamed numbers',sqls.length===1&&/IN \('3314','11039'\)/.test(sqls[0])&&!/555/.test(sqls[0]),sqls[0]);
sqls.length=0;await ctx.f([{team:'555',name:'Named FC',n:3}],W);
c('nothing asked when every row has a name',sqls.length===0);
ctx.boom=1;r=await ctx.f([{team:'3314',name:'',n:2}],W);
c('a refused question leaves the rows as they were',r[0].name==='');
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0)
