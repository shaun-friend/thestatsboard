// v3.45.0: TV rotation: days of the week for each page
const src=process.argv[2];let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let clock=Date.UTC(2026,10,18,12,0,0); // Wednesday 18 November 2026
const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
let calls=0;globalThis.fetch=async()=>{calls++;return {ok:false,status:404,text:async()=>''}};
const bg=[];const ctx={waitUntil(p){bg.push(p)}};
const env={CLUB_PIN:'1',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const get=async(p)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx);const t=await r.text();return {h:r.headers,t,s:r.status}};
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx).then(r=>r.json());
const plan=t=>JSON.parse(t.match(/id="tvd">([^<]*)</)[1]);
const items=[{page:'fixtures',team:'11039',secs:20,d:[6,7]},{page:'match',team:'11039',secs:20,d:[3]},{page:'table',team:'11039',secs:20},{page:'leaders',team:'11039',secs:20,d:[1,2,3,4,5,6,7]},{page:'centre',team:'all',secs:25,d:[9,0,'x']}];
let j=await post({tv:{items,order:['11039','all'],off:[],theme:'dark',auto:false}});c('save ok',j.ok===true,JSON.stringify(j));
clock+=2000;let a=await get('/ivybridge/tv');let P=plan(a.t).p.map(x=>x.k);
c('on a Wednesday: Next game, League table, League Leaders and the Match Centre show; the Fixtures board does not',P.join()==='match,table,leaders,centre',P.join());
clock=Date.UTC(2026,10,21,12,0,0);a=await get('/ivybridge/tv');P=plan(a.t).p.map(x=>x.k);
c('on a Saturday: Fixtures board, League table, League Leaders and the Match Centre show; Next game does not',P.join()==='fixtures,table,leaders,centre',P.join());
clock=Date.UTC(2026,10,22,23,30,0);a=await get('/ivybridge/tv');P=plan(a.t).p.map(x=>x.k);
c('Sunday 23:30 UK time is still Sunday',P.join()==='fixtures,table,leaders,centre',P.join());
clock=Date.UTC(2026,5,20,23,30,0);a=await get('/ivybridge/tv');P=plan(a.t).p.map(x=>x.k);
c('in summer time 23:30 UTC on a Saturday is already Sunday in the UK, which still shows the weekend pages',P.join()==='fixtures,table,leaders,centre',P.join());
clock=Date.UTC(2026,10,23,12,0,0);a=await get('/ivybridge/tv');P=plan(a.t).p.map(x=>x.k);
c('on a Monday the weekend page is out',!P.includes('fixtures')&&!P.includes('match'),P.join());
// stored settings
const saved=JSON.parse(store["club:ivybridge"]||"{}");
const it=(saved.tv&&saved.tv.items)||[];
c('limited days are stored, every-day and bad values are not',(it.find(x=>x.page==='fixtures')||{}).d.join()==='6,7'&&!('d' in it.find(x=>x.page==='leaders'))&&!('d' in it.find(x=>x.page==='centre')),JSON.stringify(it));
// nothing due
j=await post({tv:{items:[{page:'fixtures',team:'11039',secs:20,d:[6,7]}],order:['11039','all'],off:[],theme:'dark',auto:false}});clock=Date.UTC(2026,10,23,12,0,0)+1000;a=await get('/ivybridge/tv');
c('when nothing is due today the screen says so',plan(a.t).p.length===0&&/Nothing is due on this screen today/.test(a.t));
// Admin page
a=await get('/admin');
// the admin page is behind the PIN in this harness: use the cookie
const r=await w.fetch(new Request('https://x.co.uk/admin',{headers:{Cookie:ck,'User-Agent':'Mozilla/5.0'}}),env,ctx);const at=await r.text();
c('Admin has the day buttons, the Weekends preset and today',/tvDays\(/.test(at)&&/Weekends/.test(at)&&/"today":1/.test(at),'');
c('no outside calls',calls===0,String(calls));
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
