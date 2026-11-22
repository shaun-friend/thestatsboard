// v3.59.0 simulated game day: the real window, hold and decision code on a fake clock with a counting fake sheet feed.
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');let pass=0,fail=0;const ok=(n,c,x)=>{console.log(c?'PASS':'FAIL',n,c?'':(x||''));c?pass++:fail++};
const a=src.indexOf('const MD_MIN_PLAYERS'),b=src.indexOf('function mdLegible');
let blk=src.slice(a,b).replace(/async function mdLoadSheet\([\s\S]*?\n\}\n\/\/ Decides/,'// Decides');
const ps=src.match(/function pageState\(builtAt, now, hold\) \{[\s\S]*?\n\}/)[0];
const consts=src.match(/const MD_ENDS = [^\n]*\n/)[0];
const mk=new Function('ctl','londonDay',consts+blk+ps+';async function mdLoadSheet(){return ctl.sheet()};return {mdDecide,pageState,mdEpoch}');
const day='2026-11-28',dayAfter='2026-11-29',ep=(hm)=>m.mdEpoch(day,hm);
const ctl={calls:0,pub:0,sheet(){ctl.calls++;return ctl.now>=ctl.pub?{count:23,starters:[],subs:[]}:null}};
const m=mk(ctl,(ms)=>new Date(ms).toLocaleDateString('en-CA',{timeZone:'Europe/London'}));
const tm={team:'1',matchday:true};
const games=[{id:'555',iso:day+'T14:00:00Z',status:'upcoming'}];
// async-friendly runner
async function sim({pubHm,scoreHm,endHm}){
  const T={...tm,...(endHm?{mdEnd:endHm}:{})};ctl.calls=0;ctl.pub=ep(pubHm);const score=scoreHm?ep(scoreHm)+20*60e3:Infinity;
  let cache=null,firstShow=null,lastShow=null,earlyCalls=0;const screens=[0,2.5,5,7.5].map(o=>o*60e3);
  for(let t=ep('09:00');t<=ep('18:30');t+=30e3){
    const n=Math.round((t-ep('09:00'))/30e3);
    for(const o of screens){const k=(t-ep('09:00')-o);if(k<0||k%600e3!==0)continue;
      ctl.now=t;let st=cache?m.pageState(cache.at,t,cache.hold):'old';
      if(st!=='fresh'){const iso=t>=score?dayAfter+'T14:00:00Z':day+'T14:00:00Z';const c0=ctl.calls;const r=await m.mdDecide(T,games,iso,new URL('https://x.test/?view=match'),false,t);if(t<ep('10:00'))earlyCalls+=ctl.calls-c0;cache={at:t,hold:r.hold,show:r.show}}
      if(cache.show){firstShow=firstShow??t;lastShow=t}
    }}
  return {calls:ctl.calls,firstShow,lastShow,earlyCalls};
}
let r=await sim({pubHm:'11:20',scoreHm:'16:10'});
ok('no sheet call before 10:00',r.earlyCalls===0,JSON.stringify(r));
ok('first shows within 15 minutes of the sheet appearing at 11:20',r.firstShow>=ep('11:20')&&r.firstShow<=ep('11:20')+15*60e3,new Date(r.firstShow).toISOString());
ok('sheet calls on the day stay low (spec figure 26 for one team; four screens)',r.calls<=30,r.calls);
console.log('  calls with score at 16:10:',r.calls,'first show',new Date(r.firstShow).toISOString().slice(11,16),'last show',new Date(r.lastShow).toISOString().slice(11,16));
r=await sim({pubHm:'11:20'});
ok('no score: the line-up is still there until 17:59 and gone at 18:00',r.lastShow>=ep('17:50')&&r.lastShow<ep('18:00'),new Date(r.lastShow).toISOString());
r=await sim({pubHm:'11:20',endHm:'16:30'});
ok('end time 16:30 stops it then',r.lastShow<ep('16:30')&&r.lastShow>=ep('16:20'),new Date(r.lastShow).toISOString());
r=await sim({pubHm:'09:00',scoreHm:'16:10'});
ok('a sheet published before 10:00 shows as soon as checking starts',r.firstShow>=ep('10:00')&&r.firstShow<=ep('10:12'),new Date(r.firstShow).toISOString());
r=await sim({pubHm:'23:00'});
ok('no sheet all day: never shows',r.firstShow===null);
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0);
