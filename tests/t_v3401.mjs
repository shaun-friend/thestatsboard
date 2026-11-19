// v3.40.1: DEV probe "ID check" card compares team-sheet person numbers (individualId) with the squad list (_id).
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c,x)=>{c?pass++:(fail++,console.log('FAIL',n,x||''))};
const urls=[];
const sheet={lineup:true,participants:[
 {teamId:8595,clubName:'Ivybridge RFC',firstName:'Harry',lastName:'Newman-Wild',individualId:1704351,hasDisclosure:false,isU18:false},
 {teamId:8595,clubName:'Ivybridge RFC',firstName:'Angus',lastName:'Harris',individualId:1704348,hasDisclosure:false,isU18:false},
 {teamId:8595,clubName:'Ivybridge RFC',firstName:'Adam',lastName:'Lilley',individualId:1313523,hasDisclosure:false,isU18:false},
 {teamId:8595,clubName:'Ivybridge RFC',firstName:'',lastName:'Name withheld',individualId:2649651,hasDisclosure:true,isU18:false},
 {teamId:8595,clubName:'Ivybridge RFC',firstName:'Sam',lastName:'Swapped',individualId:555,hasDisclosure:false,isU18:false},
 {teamId:8621,clubName:'Okehampton RFC',firstName:'Other',lastName:'Person',individualId:900001,hasDisclosure:false,isU18:false}]};
const squad=[{_id:1704351,source:'gms',player_name:'Harry Newman-Wild'},{_id:1704348,source:'gms',player_name:'Angus Harris'},{_id:2380102,source:'gms',player_name:'Adam Lilley'},{_id:2649651,source:'gms',player_name:'******* *******'},{_id:555,source:'gms',player_name:'Someone Else'}];
let squadStatus=200;
globalThis.fetch=async u=>{u=String(u);urls.push(u);
 if(/gms\/matchparticipants/.test(u))return {ok:true,status:200,headers:new Map(),text:async()=>JSON.stringify(sheet)};
 if(/players\/playersByTeam/.test(u))return {ok:squadStatus===200,status:squadStatus,headers:new Map(),text:async()=>JSON.stringify(squad)};
 return {ok:true,status:200,headers:new Map(),text:async()=>'{}'}};
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',ENV_LABEL:'DEV',DEV_PIN:'1234'};const D='https://dev.thestatsboard.co.uk';let ck=null;
const get=async p=>{if(!ck){const r=await w.fetch(new Request(D+'/unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),env,ctx);ck=(r.headers.get('set-cookie')||'').split(';')[0]}return w.fetch(new Request(D+p,{headers:{Cookie:ck}}),env,ctx)};
let r=await get('/api/probe?ep=idcheck&matchId=1279215&teamId=11039');const j=(await r.json()).json||{};
ok('asks for the team sheet and the squad list',urls.some(x=>/matchparticipants\?matchId=1279215/.test(x))&&urls.some(x=>/playersByTeam\?teamId=11039/.test(x)),urls.join(' '));
ok('squad list size and hidden names counted',j.squadListSize===5&&j.squadListHiddenNames===1,JSON.stringify(j).slice(0,200));
const ours=(j.bySide||[]).find(s=>s.teamId==='8595')||{},other=(j.bySide||[]).find(s=>s.teamId==='8621')||{};
ok('two sides found',(j.bySide||[]).length===2);
ok('our side: people and numbers found in the squad list',ours.people===5&&ours.inSquadList===4,JSON.stringify(ours));
ok('same number and same name counted',ours.sameName===2,JSON.stringify(ours));
ok('a hidden name still has its number found but its name is not compared',ours.nameHidden===1);
ok('a same number with a different name is listed',ours.differentName.length===1&&ours.differentName[0].teamSheet==='Sam Swapped'&&ours.differentName[0].squadList==='Someone Else',JSON.stringify(ours.differentName));
ok('a number missing from the squad list is listed with the same-name entry (possible duplicate)',ours.notInSquadList.length===1&&ours.notInSquadList[0].name==='Adam Lilley'&&ours.notInSquadList[0].sameNameInSquadList[0].squadNumber===2380102,JSON.stringify(ours.notInSquadList));
ok('the other club shows as not in the squad list',other.inSquadList===0&&other.notInSquadList.length===1);
ok('a hidden name is never printed',!JSON.stringify(j).includes('Name withheld'));
// needs both ids
r=await get('/api/probe?ep=idcheck&matchId=1279215');const k=await r.json();ok('without a team ID it says what is needed',k.skipped===true&&/teamId/.test(k.error||''),JSON.stringify(k).slice(0,120));
// squad list refused
squadStatus=403;r=await get('/api/probe?ep=idcheck&matchId=1279215&teamId=11039');const m=(await r.json()).json||{};ok('squad list refused: says so and still reports the sheet',/403/.test(m.squadListError||'')&&m.participantsOnSheet===6,JSON.stringify(m).slice(0,160));
console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);
