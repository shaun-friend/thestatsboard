// v3.75.0: a player who is not current can be given a sponsor (it makes them current); TV sponsor tiles keep names on one line
import fs from 'fs';
let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const store={};const kv={async get(k,o){const v=store[k];return v==null?null:(o&&o.type==='json'?JSON.parse(v):v)},async put(k,v){store[k]=v},async delete(k){delete store[k]}};
const env={CLUB_PIN:'1234',SETTINGS:kv,USAGE:{writeDataPoint(){}}},cx={waitUntil(){}};
globalThis.fetch=async u=>{const s=String(u);if(/playersByTeam/.test(s))return new Response(JSON.stringify([{_id:'500',player_name:'Zed Squad'},{_id:'501',player_name:'Harry Newman-Wild'},{_id:'100',player_name:'Owen Garner'}]),{headers:{'content-type':'application/json'}});return new Response('',{status:404})};
const w=(await import(process.argv[2]+'?p375')).default;const O='https://thestatsboard.co.uk';
const yr=new Date().getMonth()>=6?new Date().getFullYear():new Date().getFullYear()-1;const SEASON=yr+'-'+(yr+1);
store['sponsors']=JSON.stringify({v:1,items:[{id:'a0000001',name:'Thatchers',logo:{v:'v1',t:'image/png',w:10,h:5,n:1,bg:'l'}}]});
store['sponsor-links:'+SEASON]=JSON.stringify({v:1,t:{'11039':{'100':{n:'Owen Garner',nm:'',s:'a0000001',s2:'',a:[],c:0,l:0,ld:'',lo:''}}}});
const club={club:{teams:[{name:'Ivybridge 1XV',short:'1XV',team:'11039',teamName:'Ivybridge 1XV',competition:'1',division:'1',league:'L',accent:'#2f9d57'}],saved:true}};
const tv={items:[{page:'sponsors',team:'all',secs:15,on:true}],order:['all'],off:[],theme:'dark',name:false,dots:false,auto:false,seen:[]};
store['club:ivybridge']=JSON.stringify({...club,tv});
let r=await w.fetch(new Request(O+'/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/sponsor-players'})}),env,cx);const ck=(r.headers.get('set-cookie')||'').split(';')[0];
const get=async q=>await (await w.fetch(new Request(O+'/api/sponsor-players?'+q,{headers:{Cookie:ck}}),env,cx)).json();
const post=async b=>await (await w.fetch(new Request(O+'/api/sponsor-players',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(b)}),env,cx)).json();
let j=await get('all=1&season='+SEASON);
c('all teams: the squad is listed too, not only current players',j.sponsored.length===1&&j.avail.length===2&&j.avail.every(x=>!x.cur),JSON.stringify(j.avail));
const names=j.avail.map(x=>x.name).sort().join();
c('team picked: the whole squad and the not-current record are listed',names==='Harry Newman-Wild,Zed Squad'&&j.avail.every(x=>!x.cur),names);
c('squad rows carry the team to save on',j.avail.every(x=>x.team==='11039'));
let a=await post({act:'assign',team:'11039',season:SEASON,nos:['500'],s:'a0000001'});
c('assign ok',a.ok===true,JSON.stringify(a));
j=await get('all=1&team=11039&season='+SEASON);
c('both are sponsored and current now',j.sponsored.filter(x=>/Zed/.test(x.name)).length===1&&j.sponsored.every(x=>x.cur),JSON.stringify(j.sponsored.map(x=>[x.name,x.cur])));
c('only the unsponsored squad player is left',j.avail.map(x=>x.name).join()==='Harry Newman-Wild');
// TV tiles: one line, logo keeps its share
await post({act:'assign',team:'11039',season:SEASON,nos:['501'],s:'a0000001'});
r=await w.fetch(new Request(O+'/sponsors-tv?g=0&p=1'),env,cx);const t=await r.text();
c('names never wrap',/\.n\{[^}]*white-space:nowrap/.test(t)&&!/\.n\.tl/.test(t));
c('name size set per tile',/class="n[^"]*" style="font-size:[0-9.]+cqw"/.test(t));
c('logo keeps a minimum share',/\.lg\{[^}]*min-height:40%/.test(t));
c('page shrinks a name that would be cut off',/function fit\(\)/.test(t)&&/scrollWidth>/.test(t)&&/scrollHeight>/.test(t));
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
