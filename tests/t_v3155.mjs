const w=(await import(process.argv[2])).default;
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const urls=[];
globalThis.fetch=async u=>{urls.push(String(u));return {ok:true,status:200,headers:new Map(),text:async()=>JSON.stringify({id:1,data:{ground:'Test Park',town:'Plymouth',lat:50.1}})}};
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',ENV_LABEL:'DEV',DEV_PIN:'1234'};
const D='https://dev.thestatsboard.co.uk';
let ck=null;
const get=async(p)=>{
  if(!ck){const r=await w.fetch(new Request(D+'/unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),env,ctx);ck=(r.headers.get('set-cookie')||'').split(';')[0]}
  return w.fetch(new Request(D+p,{headers:{Cookie:ck}}),env,ctx)};
let r=await get('/api/probe?ep=gms_match&matchId=1279215');
let j=await r.json().catch(()=>({}));
ok('gms_match builds the match URL',/cluster\.england-rfu\.com\/gms\/matches\/1279215$/.test(j.url||''));
ok('venue scan finds ground, town and lat',j.found&&Object.keys(j.found.venueFields).length>=3);
r=await get('/api/probe?ep=gms_match');j=await r.json().catch(()=>({}));
ok('gms_match without matchId is skipped',j.skipped===true&&/matchId/.test(j.error||''));
r=await get('/api/probe?ep=find_id&clubId=1486');j=await r.json().catch(()=>({}));
ok('find_id uses the club id and type=clubs',/find-rugby\/entity\/1486\?type=clubs$/.test(j.url||''));
r=await get('/api/probe?ep=club_team&teamId=11039');j=await r.json().catch(()=>({}));
ok('club_team uses /clubs/{teamId}',/cluster\.england-rfu\.com\/clubs\/11039$/.test(j.url||''));
r=await get('/api/probe?ep=club_id&clubId=abc');j=await r.json().catch(()=>({}));
ok('non-numeric clubId is dropped',j.skipped===true);
r=await get('/probe?team=11039&season=2026-2027');const h=await r.text();
ok('probe page has matchId and clubId boxes',h.includes('id="f_matchId"')&&h.includes('id="f_clubId"'));
ok('probe page lists the nine venue checks',(h.match(/Venue check \d/g)||[]).length>=9);
console.log(pass+' pass, '+fail+' fail');
