import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');
let pass=0,fail=0;const c=(n,ok)=>{if(ok)pass++;else{fail++;console.log('FAIL',n)}};
const grab=n=>{const k=src.indexOf('function '+n+'(');const i=src.lastIndexOf('async function '+n+'(')===src.indexOf('async function '+n+'(')&&src.indexOf('async function '+n+'(')>=0?src.indexOf('async function '+n+'('):k;let d=0,j=src.indexOf('{',i);for(let q=j;q<src.length;q++){if(src[q]==='{')d++;if(src[q]==='}'){d--;if(!d)return src.slice(i,q+1)}}};
const code=[grab('shirtGroup'),grab('oppCheck')].join('\n');
// fake RFU: opponent id 500 played 3 games; a number 9 moves to 10; one try scorer twice; one game has no sheet
const player=(id,fn,ln,no,team,pid)=>({id:pid,individualId:id,firstName:fn,lastName:ln,playingPositionNo:String(no),teamId:team});
const sheet=(team,no9)=>({participants:[...Array.from({length:15},(_,i)=>player(1000+i+1,'P'+(i+1),'Name'+(i+1),i+1,team,'pp'+(i+1))),player(2000,'Sam','Hidden',16,team,'ppx')].map(p=>p.individualId===1009&&no9?{...p,playingPositionNo:String(no9)}:p)});
const res={results:[
 {id:'1',date:'2026-11-14',homeTeam:{id:'500',name:'Opp',score:30},awayTeam:{id:'600',name:'Them A',score:10}},
 {id:'2',date:'2026-11-07',homeTeam:{id:'700',name:'Them B',score:5},awayTeam:{id:'500',name:'Opp',score:25}},
 {id:'3',date:'2026-10-31',homeTeam:{id:'500',name:'Opp',score:12},awayTeam:{id:'800',name:'Them C',score:12}},
 {id:'5',date:'2026-10-24',homeTeam:{id:'500',name:'Opp',score:20},awayTeam:{id:'950',name:'Them D',score:3}},
 {id:'4',date:'2026-12-05',homeTeam:{id:'500',name:'Opp',score:null},awayTeam:{id:'900',name:'Future',score:null}}]};
const sheets={'1':sheet(500,10),'2':sheet(500),'3':sheet(500),'5':null};
const ev=(pp,team)=>({eventSubType:{value:'SCORETRY'},matchParticipantId:pp,teamId:team});
const events={'1':[ev('pp7',500),ev('pp7',500),ev('pp11',500)],'2':[ev('pp7',500)],'3':null,'5':null};
let calls=0;
const cachedText=async u=>({ok:true,text:JSON.stringify(res)});
const sheetJson=async u=>{calls++;const m=/matchId=(\d+)/.exec(u);const id=m[1];return /participants/.test(u)?sheets[id]:events[id]};
const walkoverInfo=()=>false;const PROBE_BASE='https://x.test';
const mk=new Function('cachedText','sheetJson','walkoverInfo','PROBE_BASE',code+'\nreturn oppCheck');
const oppCheck=mk(cachedText,sheetJson,walkoverInfo,PROBE_BASE);
const r=await oppCheck({k:'oppcheck',label:'x'},{teamId:'500',season:'2026-2027'});
const j=r.json;
c('runs ok',r.ok&&j&&!j.error);
c('reads only played games (4, not the future one)',j.gamesRead===4);
c('rfu calls reported as 1 + 2 per game',j.rfuCalls===9&&calls===8);
c('sheets found 3 of 4',j.verdict.sheetsFound==='3 of 4');
c('top try scorer is P7 with 3',j.topTryScorers[0]==='P Name7: 3');
c('second scorer P11',j.topTryScorers[1]==='P Name11: 1');
c('shirt-group move found (9 then 10 = scrum half to fly half)',j.playersWhoMovedShirtGroup.some(x=>/P Name9: usually scrum half/.test(x)&&/fly half/.test(x)));
c('opponent side picked by id',j.games[0].opponentSideBy==='match record team id'&&j.games[0].players===16);
c('game with no sheet is reported, not an error',j.games[3].sheetFound===false&&j.games[3].players===0);
c('position fields shown',Object.keys(j.positionFieldsOnASheet).length>0);
c('endpoint is registered and DEV-only probe uses it',/k: "oppcheck"/.test(src)&&/ep\.custom === "oppcheck"/.test(src));
c('opposition check helper present',/async function oppCheck\(/.test(src));
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0);
