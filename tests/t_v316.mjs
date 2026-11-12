const FILE=process.argv[2];
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const T=(id,n)=>({id,commonId:id,name:n,score:null});
const fut=new Date(Date.now()+3*864e5).toISOString().replace(/T.*/,'T14:00:00.000Z');
const fx={id:1279215,type:'fixture',date:fut,matchNotSetup:false,homeTeam:T(15342,'Okehampton'),awayTeam:T(11039,'Ivybridge')};
const GMS_OK={matchDate:fut,groundAddress1:'Showfield',groundAddress2:'Oaklands',groundCity:'Okehampton',groundPostalCode:'EX20 1LN',groundXCoordinate:'-4.00763',groundYCoordinate:'50.740831'};
const ENV={ENV_LABEL:'DEV',DEV_PIN:'1'};
let n=0;
async function run(gms,{web='<html>nothing</html>',qs='&debug=venue'}={}){
 const w=(await import(FILE+'?c='+(n++))).default;const urls=[];
 globalThis.fetch=async u=>{const s=String(u);urls.push(s);
  if(s.includes('/gms/matches/'))return gms===null?{ok:false,status:500,text:async()=>''}:{ok:true,status:200,text:async()=>JSON.stringify(gms)};
  if(s.includes('cluster.england-rfu.com/fixtures-and-results/seasons'))return {ok:true,status:200,text:async()=>JSON.stringify([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}])};
  if(s.includes('cluster.england-rfu.com'))return {ok:true,status:200,text:async()=>JSON.stringify({results:[],fixtures:[fx]})};
  if(s.includes('match-centre-community'))return {ok:true,status:200,text:async()=>web};
  if(s.includes('api.open-meteo.com/v1/forecast')){const x=new URL(s),d=x.searchParams.get('start_date'),t=[],a=[];for(let k=0;k<24;k++){t.push(d+'T'+String(k).padStart(2,'0')+':00');a.push(10)}return {ok:true,status:200,text:async()=>JSON.stringify({hourly:{time:t,temperature_2m:a,precipitation_probability:a,wind_speed_10m:a,wind_direction_10m:a,cloud_cover:a}})}}
  if(s.includes('postcodes.io'))return {ok:true,status:200,text:async()=>JSON.stringify({result:{latitude:51,longitude:-3}})};
  if(s.includes('geocoding-api'))return {ok:true,status:200,text:async()=>JSON.stringify({results:[{country_code:'GB',latitude:52,longitude:-2}]})};
  return {ok:false,status:404,text:async()=>''}};
 const ck=(await w.fetch(new Request('https://x.test/unlock',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:'pin=1&next=/'}),ENV,{})).headers.get('Set-Cookie').split(';')[0];
 const base='?season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&friendlyName=Ivybridge%201XV';
 const r=await w.fetch(new Request('https://x.test/'+base+qs+'&n='+n,{headers:{cookie:ck}}),ENV,{waitUntil(){}});
 return {urls,body:await r.text()};}
// 1. data service has the ground
let o=await run(GMS_OK);let d=JSON.parse(o.body);
ok('venue read from the RFU match record','Showfield, Oaklands, Okehampton'===d.venue);
ok('trace shows rfu-match-record with coordinates',d.trace.some(t=>t.step==='rfu-match-record'&&t.ok&&t.coordinates));
ok('website match page not called when the record has a ground',!o.urls.some(u=>u.includes('match-centre-community')));
ok('record fetched once for the right match id',o.urls.filter(u=>u.endsWith('/gms/matches/1279215')).length===1);
// 2. forecast uses the coordinates: no postcode or place lookups
o=await run(GMS_OK,{qs:'&format=summary&detail=match'});
const fc=o.urls.find(u=>u.includes('api.open-meteo.com/v1/forecast'));
ok('forecast asked for at the record coordinates',!!fc&&/latitude=50\.741/.test(fc)&&/longitude=-4\.008/.test(fc));
ok('no postcode or place lookup for the forecast',!o.urls.some(u=>u.includes('postcodes.io')||u.includes('geocoding-api')));
// 3. record has no ground -> website fallback
o=await run({matchDate:fut,groundAddress1:null,groundCity:''},{web:'<div>Location</div><div> Hartley Park, Plymouth </div>'});d=JSON.parse(o.body);
ok('empty ground falls back to the website page',o.urls.some(u=>u.includes('match-centre-community'))&&/Hartley Park/.test(d.venue||''));
// 4. data service down -> website fallback
o=await run(null,{web:'<div>Location</div><div> Hartley Park, Plymouth </div>'});d=JSON.parse(o.body);
ok('service error falls back to the website page',/Hartley Park/.test(d.venue||''));
// 5. silly coordinates are ignored but the ground text is still used
o=await run({...GMS_OK,groundXCoordinate:'0',groundYCoordinate:'0'},{qs:'&format=summary&detail=match'});
const fc5=o.urls.find(u=>u.includes('api.open-meteo.com/v1/forecast'));
ok('out-of-range coordinates are not used',!fc5||!/latitude=0\.000/.test(fc5));
// 6. DEV-only switch to compare with the website
o=await run(GMS_OK,{web:'<div>Location</div><div>Website Park</div>',qs:'&debug=venue&venueweb=1'});d=JSON.parse(o.body);
ok('venueweb=1 skips the record on DEV',!o.urls.some(u=>u.includes('/gms/matches/'))&&/Website Park/.test(d.venue||''));
// 7. directions link uses the ground and postcode from the record, and the page has a visible Get directions button
o=await run(GMS_OK,{qs:'&view=match&layout=tv&force=1'});
ok('directions link points at the ground and postcode',o.body.includes('destination=Showfield%2C%20Oaklands%2C%20Okehampton%2C%20EX20%201LN'));
ok('Match Stats has a Get directions button and no clipped hint',/class="dbtn"[^>]*>[^<]*Get directions/.test(o.body)&&!/Tap for directions/.test(o.body.split('</style>').pop()));
console.log(pass+' pass, '+fail+' fail');
