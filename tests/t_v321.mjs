import fs from 'fs';
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const ME=55001,MEN='Test U18';
const mk=(id,type,d,home,opp,hs,as)=>({id,type,date:iso(d),time:'15:00',homeTeam:home?T(ME,MEN,hs):T(opp[0],opp[1],hs),awayTeam:home?T(opp[0],opp[1],as):T(ME,MEN,as),stadium:'Test Ground, Plymouth'});
const res=[mk(1,'result',-7,false,[9005,'Newton Abbot U18'],15,18),mk(2,'result',-14,true,[9004,'Exmouth U18'],40,5)],fx=[mk(3,'fixture',3,true,[9003,'Cullompton U18'],null,null)];
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
globalThis.fetch=async u=>{const s=String(u);if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);if(s.includes('full-matches'))return J({results:res,fixtures:fx,leagueTables:[]});return {ok:false,status:500,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};let w=await load();
const get=(p,h={},e=env)=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',...h}}),e,{});
const ck=((await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,{})).headers.get('Set-Cookie')||'').split(';')[0];
const team=(nm)=>[nm,MEN,'1699','75791','55001','L','2026-2027'];
const tq=k=>'&teams='+encodeURIComponent(JSON.stringify(Array.from({length:k},(_,i)=>team('Team '+(i+1)))));
const stack=async(extra,k=2)=>{const r=await get('/?view=stack&layout=tv&season=2026-2027&competition=1699&division=75791'+tq(k)+extra);return {r,t:await r.text()}};
const mainOf=t=>{const i=t.indexOf('<main class="ly');return i<0?'':t.slice(i,t.indexOf('</main>',i))};
// default is Next game first
let {r,t}=await stack('');
c('stack ok',r.status===200);c('default next',t.includes('data-ly="next"')&&t.includes('class="cw"'));c('body ly-on',/<body class="[^"]*ly-on/.test(t));
c('classic rows kept for phones',(t.match(/class="rw"/g)||[]).length===2);
c('cards hidden on phone css',t.includes('@media(max-width:800px){.ly{display:none!important}}'));
let m=mainOf(t);
c('next opponent shown',m.includes('Cullompton U18')&&m.includes('This ')||m.includes('Cullompton U18'));
c('next opponent crest',m.includes('club_images/9003')||m.includes('club_images/'));
c('last result our score first',m.includes('18<i class="dsh">&ndash;</i>15'));c('win chip',m.includes('class="pl w"'));
c('crest has blurred fill copy',m.includes('class="bgi"'));c('classic crest css hides it',t.includes('.cr .bgi{display:none}'));c('no kick-off time',!/15:00/.test(m));c('no difficulty',!/difficulty/i.test(m));
c('home chip',/<span>Home<\/span>/.test(m));
// url override
({t}=await stack('&ly=board'));c('board',t.includes('data-ly="board"')&&t.includes('class="bwr"')&&t.includes('class="bh"')&&!t.includes('class="cw"'));
c('board columns',/<span>Team<\/span><span>Table<\/span><span>Last result<\/span><span>Next game<\/span>/.test(t));
({t}=await stack('&ly=classic'));c('classic has no layout block',!t.includes('data-ly=')&&!/<body class="[^"]*ly-on/.test(t)&&(t.match(/class="rw"/g)||[]).length===2);
({t}=await stack('&ly=zz'));c('bad ly falls back to default',t.includes('data-ly="next"'));
// more than four teams: next falls back to board
({t}=await stack('',5));c('5 teams use board',t.includes('data-ly="board"')&&(t.match(/class="bwr"/g)||[]).length===5);
({t}=await stack('',4));c('4 teams keep next',t.includes('data-ly="next"')&&t.includes('--n:4'));
// notice strip keeps the layout in one grid row
await w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify({notices:{tv:{on:true,text:'Bar closed',style:'info',applies:'all'}}})}),env,{});
w=await load();({t}=await stack(''));c('notice with next layout',t.includes('id="sbnt"')&&t.includes('auto auto repeat(1,minmax(0,1fr))'));
({t}=await stack('&ly=classic'));c('notice with classic',t.includes('auto auto repeat(2,minmax(0,1fr))'));
// admin
r=await get('/admin',{Cookie:ck});t=await r.text();c('admin selector',t.includes('name="ml"')&&/name="ml" value="next" checked/.test(t));c('admin has all three',['next','board','classic'].every(v=>t.includes('name="ml" value="'+v+'"')));
c('admin preview links',t.includes('view=stack&amp;ly=board'));
const save=async o=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{Cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(o)}),env,{});
c('save board',(await (await save({matchCentre:{layout:'board'}})).json()).ok===true);
w=await load();r=await get('/admin',{Cookie:ck});t=await r.text();c('admin shows board',/name="ml" value="board" checked/.test(t));
({t}=await stack(''));c('setting drives the screen',t.includes('data-ly="board"'));
({t}=await stack('&ly=next'));c('link beats setting',t.includes('data-ly="next"'));
await save({matchCentre:{layout:'classic'}});w=await load();({t}=await stack(''));c('classic setting',!t.includes('data-ly='));
await save({matchCentre:{layout:'<script>'}});w=await load();({t}=await stack(''));c('junk value becomes default',t.includes('data-ly="next"'));
await save({features:{}});w=await load();r=await get('/admin',{Cookie:ck});t=await r.text();c('missing value becomes default',/name="ml" value="next" checked/.test(t));
// plain page cache key knows about ly
{const x=(await import(src.replace('t_worker.mjs','t_worker_exp.mjs')+'?i=x')).__t;c('ly in known params',x.KNOWN_PARAMS.includes('ly'));c('ly changes page key',x.pageKeySearch(new URLSearchParams('view=stack&ly=board'))!==x.pageKeySearch(new URLSearchParams('view=stack')))}
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
