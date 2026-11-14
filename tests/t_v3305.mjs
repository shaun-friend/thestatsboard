// v3.30.5: working-time savings: formatter reuse gives identical dates; shared summary cache on the Match Centre.
import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
const od=Date.prototype.toLocaleDateString,ot=Date.prototype.toLocaleTimeString,os=Date.prototype.toLocaleString;
const text=fs.readFileSync(src,'utf8');const m=text.match(/\(function \(\) \{\n  const D = Date\.prototype[\s\S]*?\n\}\)\(\);/);c('formatter patch present',!!m);
const mine={d:null,t:null,s:null};{const D=Date.prototype;const sd=D.toLocaleDateString,st=D.toLocaleTimeString,ss=D.toLocaleString;(0,eval)(m[0]);mine.d=D.toLocaleDateString;mine.t=D.toLocaleTimeString;mine.s=D.toLocaleString;D.toLocaleDateString=sd;D.toLocaleTimeString=st;D.toLocaleString=ss}
const ds=[new Date(Date.UTC(2026,10,14,19,26,5)),new Date(Date.UTC(2026,2,29,0,30,0)),new Date(Date.UTC(2026,9,25,0,30,0)),new Date(Date.UTC(2027,0,1,23,59,59)),new Date(NaN)];
const L='Europe/London';const cases=[['d','en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:L}],['d','en-CA',{timeZone:L}],['d','en-GB',{weekday:'long',timeZone:'UTC'}],['d','en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:L}],['d','en-GB',{timeZone:L,hour:'2-digit',minute:'2-digit'}],['t','en-GB',{hour:'2-digit',minute:'2-digit',timeZone:L}],['t','en-GB',{timeZone:L}],['t','en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:L}],['s','en-GB',{timeZone:L}],['s','en-GB',{weekday:'short',hour:'2-digit',minute:'2-digit',timeZone:L}],['s','en-GB',{dateStyle:'medium',timeZone:L}],['d','en-GB',{month:'short',timeZone:L}],['d','en-GB',undefined],['d',undefined,undefined],['s','en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:L}]];
let diff=0;for(const d of ds)for(const [k,l,o] of cases){const a=(k==='d'?od:k==='t'?ot:os).call(d,l,o),b=mine[k].call(d,l,o);if(a!==b){diff++;console.log('DIFF',k,l,JSON.stringify(o),a,b)}}
c('dates and times identical to the built-in calls ('+ds.length*cases.length+' compared)',diff===0);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
