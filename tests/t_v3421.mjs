// v3.40.1: DEV probe "ID check" card compares team-sheet person numbers (individualId) with the squad list (_id).
const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c,x)=>{c?pass++:(fail++,console.log('FAIL',n,x||''))};
const urls=[];
const spec={openapi:'3.0.0',info:{title:'RFU API',version:'1.2'},paths:{
 '/players/playersByTeam':{get:{summary:'Players by team',tags:['players'],parameters:[{name:'teamId',in:'query',required:true}],responses:{'200':{content:{'application/json':{schema:{type:'array',items:{$ref:'#/components/schemas/PlayerLite'}}}}}}}},
 '/individuals/{id}/registration':{get:{summary:'Registration of one individual',parameters:[{name:'id',in:'path',required:true}],responses:{'200':{content:{'application/json':{schema:{$ref:'#/components/schemas/Registration'}}}}}}},
 '/fixtures-and-results/seasons':{get:{summary:'Seasons',responses:{}}},
 '/standings':{get:{summary:'League table',responses:{}}}},
 components:{schemas:{PlayerLite:{properties:{_id:{},source:{},player_name:{}}},Registration:{properties:{individualId:{},registrationStatus:{type:'string',enum:['PENDING','ACTIVE','LAPSED']},expiryDate:{}}},Standing:{properties:{points:{}}}}}};
let specStatus=200;
globalThis.fetch=async u=>{u=String(u);urls.push(u);
 if(/api\.england-rfu\.com\/openapi\.json/.test(u))return {ok:specStatus===200,status:specStatus,headers:new Map(),text:async()=>JSON.stringify(spec)};
 if(/players\/playersByTeam/.test(u))return {ok:true,status:200,headers:new Map(),text:async()=>JSON.stringify([{_id:1,source:'gms',player_name:'Secret Name'}])};
 return {ok:true,status:200,headers:new Map(),text:async()=>'{}'}};
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',ENV_LABEL:'DEV',DEV_PIN:'1234'};const D='https://dev.thestatsboard.co.uk';let ck=null;
const get=async p=>{if(!ck){const r=await w.fetch(new Request(D+'/unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),env,ctx);ck=(r.headers.get('set-cookie')||'').split(';')[0]}return w.fetch(new Request(D+p,{headers:{Cookie:ck}}),env,ctx)};
let r=await get('/api/probe?ep=specplayers&teamId=11039');const j=(await r.json()).json||{};
ok('the API description is read from the RFU API address',urls.some(x=>/api\.england-rfu\.com\/openapi\.json/.test(x)),urls.join(' '));
ok('size, title and paths counted',j.specBytes>100&&j.title==='RFU API'&&j.pathsInSpec===4,JSON.stringify(j).slice(0,200));
ok('only player or registration endpoints are listed',j.matchingEndpoints===2&&j.endpoints.every(e=>/player|registration/i.test(e.path)),JSON.stringify(j.endpoints));
ok('parameters shown',j.endpoints.find(e=>/playersByTeam/.test(e.path)).params[0]==='teamId (query) required');
ok('returned field names are resolved through the type reference',JSON.stringify(j.endpoints.find(e=>/registration/.test(e.path)).returns)===JSON.stringify(['individualId','registrationStatus','expiryDate']),JSON.stringify(j.endpoints));
ok('an array answer shows the fields of one item',j.endpoints.find(e=>/playersByTeam/.test(e.path)).returns.join()==='_id,source,player_name');
ok('matching types listed with fields',j.matchingSchemas===2&&j.schemas.some(x=>x.name==='Registration'&&x.fields.includes('registrationStatus')),JSON.stringify(j.schemas));
ok('fields called status, active or pending are listed with their allowed values',j.statusFields===1&&j.statusFieldList[0].type==='Registration'&&j.statusFieldList[0].values.join()==='PENDING,ACTIVE,LAPSED',JSON.stringify(j.statusFieldList));
ok('no player names in the answer',!JSON.stringify(j).includes('Secret Name'));
ok('says how to read it',/registered|registration/i.test(j.howToRead||''));
r=await get('/api/probe?ep=specplayers');const k=await r.json();ok('without a team ID it says what is needed',k.skipped===true&&/teamId/.test(k.error||''));
specStatus=403;r=await get('/api/probe?ep=specplayers&teamId=11039');const m=(await r.json()).json||{};ok('description refused: says so',/403/.test(m.specError||''),JSON.stringify(m));
console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);
