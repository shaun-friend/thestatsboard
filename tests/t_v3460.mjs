// v3.46.0: Match day page: the sheet a team has submitted for a chosen day, with sponsors, available players, withheld names and new players
import fs from 'fs';import vm from 'vm';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
const code=fs.readFileSync(src,'utf8');
const a=code.indexOf('async function matchDayApi'),b=code.indexOf('function matchDayPage');
const fn=code.slice(a,b);
const pick=n=>{const i=code.indexOf(n);const m=code.slice(i).match(/^[\s\S]*?\n\}\n|^[^\n]*\n/);return i};
const grab=(start)=>{const i=code.indexOf(start);let d=0,j=code.indexOf('{',i),k=j;for(;k<code.length;k++){if(code[k]==='{')d++;else if(code[k]==='}'){d--;if(!d)break}}return code.slice(i,k+1)};
const helpers=[grab('const SHEET_U18_RE'),'',grab('function sheetOrder'),"const personNo = v => /^\\d{1,10}$/.test(String(v == null ? \"\" : v)) ? String(v) : \"\";"].join('\n').replace(/^const SHEET_U18_RE[^\n]*\n[\s\S]*$/,m=>m);
const u18=code.match(/const SHEET_U18_RE = [^\n]*/)[0],hid=code.match(/const sheetHidesNames = [^\n]*/)[0],ord=code.match(/function sheetOrder[^\n]*/)[0],pno=code.match(/const personNo = [^\n]*/)[0];
let hits=[];const sheets={};
const ctx={TEAMS:[{team:'11039',name:'Ivybridge 1XV',league:'L',teamName:'Ivybridge',season:'2026-2027',competition:'c',division:'d'},{team:'9',name:'Colts U15',league:'',teamName:'Colts U15',season:'2026-2027',competition:'c',division:'d',hidden:false}],AUTO:{season:'2026-2027'},londonTime:()=>'12:00',
 sheetJson:async u=>{hits.push(u);return sheets[u]===undefined?null:sheets[u]},cleanSponsors:x=>(x&&x.items)||[],SPONSOR_KEY:'sponsors',dateSeasonName:()=> '2026-2027',URLSearchParams,Request,Response,URL,Date,
 kvOf:()=>({get:async()=>({items:[{id:'aaaa1111',name:'Vets4Pets'}]})}),splinkRead:async()=>rec};
let rec={t:{'11039':{'1001':{n:'Alan A',nm:'',s:'aaaa1111',a:[],c:1,l:3,ld:'2026-11-07',lo:'X'},'1002':{n:'Bob B',nm:'Bobby',s:'',a:[],c:1,l:3,ld:'2026-11-07',lo:'X'},'1005':{n:'Old Num',nm:'',s:'aaaa1111',a:['1006'],c:1,l:3,ld:'2026-11-07',lo:'X'}}},g:{'11039':3}};
vm.createContext(ctx);vm.runInContext([u18,hid,ord,pno,fn,'this.api=matchDayApi'].join('\n'),ctx);
let games=[];const worker={fetch:async()=>new Response(JSON.stringify({games}),{status:200})};
const call=async o=>{const r=await ctx.api(new Request('https://x.co.uk/api/matchday',{method:'POST',body:JSON.stringify(o)}),new URL('https://x.co.uk/api/matchday'),worker);return {s:r.status,j:await r.json()}};
const nowIso=new Date(Date.now()+2*86400000).toISOString().slice(0,10);
const day=nowIso;
games=[{iso:day+'T14:00:00.000Z',status:'upcoming',home:true,id:'555',oppName:'Exeter Saracens',time:'14:30',comp:'Counties 1'},{iso:'2025-01-01T14:00:00.000Z',status:'done',id:'1',oppName:'Old',home:true}];
let r=await call({team:'11039'});
c('days only: lists the upcoming day with opponent and time',r.j.ok&&r.j.days.length===1&&r.j.days[0].d===day&&r.j.days[0].opp==='Exeter Saracens'&&r.j.days[0].time==='14:30'&&!('players' in r.j),JSON.stringify(r.j));
c('days only costs no match calls',hits.length===0,hits.join());
r=await call({team:'nope'});c('an unknown team is refused',r.s===404);
r=await call({team:'11039',day:'2099-01-01'});c('a day with no game for the team says so',r.j.ok&&r.j.game===null);
// no sheet yet
sheets['https://cluster.england-rfu.com/gms/matches/555']={homeTeamId:50,awayTeamId:60,competitionName:'Counties 1',groupName:'x'};
sheets['https://cluster.england-rfu.com/gms/matchparticipants?matchId=555']={lineup:false,participants:[]};
r=await call({team:'11039',day});c('no sheet submitted: sheet false, no players',r.j.sheet===false&&r.j.players.length===0&&!r.j.unreadable,JSON.stringify(r.j));
sheets['https://cluster.england-rfu.com/gms/matches/555']=null;
r=await call({team:'11039',day});c('match record unreadable is reported',r.j.sheet===false&&r.j.unreadable===true);
// with a sheet: our side is the home side (50)
sheets['https://cluster.england-rfu.com/gms/matches/555']={homeTeamId:50,awayTeamId:60,competitionName:'Counties 1',groupName:'x'};
const P=(id,no,pos,fn,ln,extra)=>({teamId:id,individualId:no,playingPositionNo:pos,description:pos<9?'Forward':'Back',firstName:fn,lastName:ln,startedMatch:true,...extra});
sheets['https://cluster.england-rfu.com/gms/matchparticipants?matchId=555']={lineup:true,participants:[
 P(60,'7777','1','Other','Side'),P(50,'1002','2','Bob','Bee'),P(50,'1001','1','Alan','Aye'),P(50,'1006','3','Alt','Number'),P(50,'1003','16','New','Player'),
 P(50,'1004','4','','Withheld',{hasDisclosure:true}),P(50,'1007','5','Kid','Young',{isU18:true})]};
hits=[];r=await call({team:'11039',day});const pl=r.j.players||[];
c('sheet is read with two calls',hits.length===2,hits.join());
c('only our side is listed, in shirt order',pl.map(x=>x.no).join()==='1,2,3,4,5,16',pl.map(x=>x.no).join());
c('a sponsored player shows the sponsor',pl[0].sponsor==='Vets4Pets'&&pl[0].name==='Alan Aye'&&!pl[0].avail);
c('an own name replaces the RFU name and is starred; no sponsor means available',pl[1].name==='Bobby'&&pl[1].star===true&&pl[1].avail===true);
c('an alternative number finds the player record (sponsor shared)',pl[2].sponsor==='Vets4Pets'&&pl[2].fresh===false,JSON.stringify(pl[2]));
c('a withheld name is redacted and available',pl[3].red===true&&pl[3].name===''&&pl[3].avail===true);
c('an under 18 shows no name and no sponsor',pl[4].hidden===true&&pl[4].name===''&&pl[4].sponsor===''&&pl[4].avail===false);
c('a player not on any earlier sheet is flagged new',pl[5].fresh===true&&pl[5].avail===true&&pl[0].fresh===false);
c('counts add up',r.j.counts.total===6&&r.j.counts.sponsored===2&&r.j.counts.redacted===1&&r.j.counts.fresh===2,JSON.stringify(r.j.counts));
// no scan done: nobody is flagged new
rec={t:rec.t,g:{}};r=await call({team:'11039',day});c('before the season scan nobody is flagged new',r.j.players.every(x=>!x.fresh)&&r.j.counts.fresh===0);
// no private fields
const txt=JSON.stringify(r.j);c('person numbers and ids never leave the server',!/1001|1002|1003|7777|individualId/.test(txt),'');
c('the page and the API only send what the club PIN allows: no wrong method',(await ctx.api(new Request('https://x.co.uk/api/matchday'),new URL('https://x.co.uk/api/matchday'),worker)).status===405);
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
