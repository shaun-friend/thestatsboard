import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');
let pass=0,fail=0;const c=(n,ok)=>{if(ok)pass++;else{fail++;console.log('FAIL',n)}};
const grab=n=>{const k=src.indexOf('function '+n+'(');const i=src.lastIndexOf('async function '+n+'(')===src.indexOf('async function '+n+'(')&&src.indexOf('async function '+n+'(')>=0?src.indexOf('async function '+n+'('):k;let d=0,j=src.indexOf('{',i);for(let q=j;q<src.length;q++){if(src[q]==='{')d++;if(src[q]==='}'){d--;if(!d)return src.slice(i,q+1)}}};
const code=[grab('shirtGroup'),grab('oppDangerCore'),grab('oppCheck')].join('\n');
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
const mk=(a,b,c2,d)=>new Function('cachedText','sheetJson','walkoverInfo','PROBE_BASE','sharedGet','sharedPut',code+'\nreturn oppCheck')(a,b,c2,d,async()=>null,async()=>{});
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
c('opponent side picked by id',/match record team id|side number seen in most games \(500\)/.test(j.games[0].opponentSideBy)&&j.games[0].players===16);
c('game with no sheet is reported, not an error',j.games[3].sheetFound===false&&j.games[3].players===0);
c('position fields shown',Object.keys(j.positionFieldsOnASheet).length>0);
c('endpoint is registered and DEV-only probe uses it',/k: "oppcheck"/.test(src)&&/ep\.custom === "oppcheck"/.test(src));
c('opposition check helper present',/async function oppCheck\(/.test(src));
// sheet side numbers do not match the record: ours is 'A' in every game, the other side changes
{
 const mkSide=(tid,pre)=>Array.from({length:16},(_,i)=>({id:pre+'pp'+(i+1),individualId:pre+(i+1),firstName:pre+'F'+(i+1),lastName:pre+'L'+(i+1),playingPositionNo:String(i+1),teamId:tid}));
 const ids=['1','2','3'];
 const res2={results:ids.map((id,k)=>({id,date:'2026-11-0'+(k+1),homeTeam:{id:'500',name:'Opp',score:20},awayTeam:{id:'6'+k,name:'X'+k,score:10}}))};
 const sh2=Object.fromEntries(ids.map((id,k)=>[id,{participants:[...mkSide('A','a'),...mkSide('B'+k,'b'+k+'_')]}]));
 const ev2=Object.fromEntries(ids.map((id,k)=>[id,[{eventSubType:{value:'SCORETRY'},matchParticipantId:'app7',teamId:'A'},{eventSubType:{value:'SCORETRY'},matchParticipantId:'b'+k+'_pp9',teamId:'B'+k}]]));
 const sj2=async u=>{const id=/matchId=(\d+)/.exec(u)[1];return /participants/.test(u)?sh2[id]:ev2[id]};
 const o2=mk(async u=>({ok:true,text:JSON.stringify(res2)}),sj2,walkoverInfo,PROBE_BASE);
 const r2=await o2({k:'oppcheck',label:'x'},{teamId:'500',season:'2026-2027'});
 c('picks the side seen in every game',r2.json.games.every(g=>/side number seen in most games \(A\)/.test(g.opponentSideBy)));
 c('top try scorer belongs to that side',r2.json.topTryScorers[0]==='a Fa7'.replace('a Fa7','aF7 aL7').replace('aF7 aL7','a aL7')+': 3'||/aL7: 3/.test(r2.json.topTryScorers[0]));
 c('other sides scorers not counted',!r2.json.topTryScorers.some(x=>/bk?\d?_?L9|b\d_L9/.test(x)));
}
console.log(pass+' passed, '+fail+' failed');process.exit(fail?1:0);
