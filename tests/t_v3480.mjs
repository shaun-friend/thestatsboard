const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let calls=0;globalThis.fetch=async()=>{calls++;return {ok:false,status:404,text:async()=>''}};
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const rep=async()=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify({act:'report'})}),env,ctx);return {s:r.status,j:await r.json()}};
const today=new Date();const yr=today.getUTCMonth()>=6?today.getUTCFullYear():today.getUTCFullYear()-1;const season=yr+'-'+(yr+1);
store['sponsors']=JSON.stringify({v:1,items:[{id:'00000001',name:'Vets4Pets'},{id:'00000002',name:'Dart Motors'}]});
let x=await rep();
c('empty record: every sponsor listed with no players',x.s===200&&x.j.ok&&x.j.sponsors.length===2&&x.j.sponsors.every(s=>s.players.length===0)&&x.j.teams.length>0,JSON.stringify(x));
store['sponsor-links:'+season]=JSON.stringify({v:1,t:{'11039':{'5':{n:'Aled Price',nm:'Al',s:'00000001'},'6':{n:'Ben Bee',s:'00000001'},'7':{n:'No Sponsor'}}},g:'',i:''});
x=await rep();const v=x.j.sponsors.find(s=>s.id==='00000001');
c('players come back under their sponsor with our own name first',v&&v.players.length===2&&v.players[0].name==='Al'&&v.players[1].name==='Ben Bee'&&v.players[0].teamName&&v.players[0].team==='11039',JSON.stringify(v));
c('a player with no sponsor is not listed and a sponsor with none stays',x.j.sponsors.find(s=>s.id==='00000002').players.length===0&&!JSON.stringify(x.j).includes('No Sponsor'));
c('needs the club PIN',(await w.fetch(new Request('https://thestatsboard.co.uk/api/sponsors',{method:'POST',body:'{"act":"report"}'}),env,ctx)).status!==200);
c('no RFU reads',calls===0,calls);
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
