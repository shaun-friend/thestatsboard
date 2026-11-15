// v3.30 win chance: model, switch, summary, pages, check page.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
const DAY=864e5,now=Date.now(),iso=n=>new Date(now+n*DAY).toISOString();
const T=(id,n,sc)=>({id:id*7,commonId:id,name:n,score:sc});
const TEAMSL=[[11039,'Ivybridge',14],[15342,'Okehampton',-6],[2001,'Alpha RFC',6],[2002,'Beta RFC',0],[2003,'Gamma RFC',-10],[2004,'Delta RFC',8],[2005,'Epsilon RFC',-2],[2006,'Zeta RFC',-8]];
let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
let gid=100;const mk=(h,a,d,ha)=>{const m=h[2]-a[2]+ha+(rnd()-0.5)*18;const hs=Math.max(3,Math.round(28+m/2)),as=Math.max(3,Math.round(28-m/2));return {id:gid++,type:'result',date:iso(d),time:'14:00',homeTeam:T(h[0],h[1],hs),awayTeam:T(a[0],a[1],as),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}}};
const res=[];let day=-80;for(const h of TEAMSL)for(const a of TEAMSL)if(h!==a&&!(h[0]===15342&&a[0]===11039)){if((h[0]+a[0])%3!==0||true){res.push(mk(h,a,day,4));day+=1.3}}
const past=[];for(const h of TEAMSL.slice(0,5))for(const a of TEAMSL.slice(0,5))if(h!==a)past.push({...mk(h,a,-400,4),id:gid++});
const ivy=TEAMSL[0],okeh=TEAMSL[1];
const fut=(oid,on,home,d)=>({id:900+oid%100,type:'fixture',date:iso(d),time:'14:00',homeTeam:home?T(11039,'Ivybridge',null):T(oid,on,null),awayTeam:home?T(oid,on,null):T(11039,'Ivybridge',null),competition:{name:'Regional 2'},group:{name:'Regional 2 South West'}});
let nextFx=fut(15342,'Okehampton',true,3);
const J=o=>({ok:true,status:200,text:async()=>JSON.stringify(o)});
let calls=[];
globalThis.fetch=async u=>{const s=String(u);calls.push(s);
 if(s.includes('/seasons'))return J([{name:'2026-2027',startDate:'2026-08-31',endDate:'2027-05-23'}]);
 if(s.includes('full-matches')&&/season=2025-2026|season=2024-2025/.test(s))return J({results:past,fixtures:[],leagueTables:[]});
 if(s.includes('cluster.england-rfu.com'))return J({results:res,fixtures:[nextFx]});
 return {ok:false,status:404,text:async()=>''}};
let n=0;const load=async()=>(await import(src+'?i='+(++n))).default;
const env={CLUB_PIN:'1',SETTINGS:kv};const ctx={waitUntil(){}};
let w=await load();let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const base='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge';
const get=(p)=>w.fetch(new Request('https://x.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',Cookie:ck}}),env,ctx);
const sumM=async()=>(await (await get('/?'+base+'&format=summary&detail=match')).json());
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx);
const opp=async()=>await (await get('/?view=opposition&'+base)).text();
const oppJ=async()=>await (await get('/?'+base+'&format=summary&detail=opposition')).json();

const fs=await import('fs');
const waText=h=>{const m=/class="wabtn"[^>]*href="([^"]+)"/.exec(h);return m?decodeURIComponent(m[1].replace(/&amp;/g,'&').split('text=')[1]):''};
let t=await opp();const nostyle=t.replace(/<style>[\s\S]*?<\/style>/g,'');
fs.writeFileSync(new URL('./w/opp_v3330.html',import.meta.url),t);fs.writeFileSync(new URL('./w/opp_v3330p.html',import.meta.url),t.replace(/<script>[^<]*app=1[^<]*<\/script>/g,''));
c('glance card present',/class="glc" id="glance"/.test(nostyle)&&/At a glance/.test(nostyle));
c('glance has difficulty, form and head to head rows',/<small>Difficulty<\/small>/.test(nostyle)&&/<small>Their form<\/small>/.test(nostyle)&&/<small>Head to head<\/small>/.test(nostyle));
c('glance rows have a dot colour and link to a section',(nostyle.match(/<a class="gr" href="#g\d"><i class="dot [gar]">/g)||[]).length>=3);
c('key names your team',/Good for Ivybridge 1XV/.test(nostyle)&&/Bad for Ivybridge 1XV/.test(nostyle));
c('jump links to the four sections',/<nav class="jmp"/.test(nostyle)&&['g1','g2','g3'].every(i=>nostyle.includes('href="#'+i+'"'))&&/id="g1"/.test(nostyle)&&/id="g2"/.test(nostyle)&&/id="g3"/.test(nostyle));
c('numbered badges on the sections',/<span class="nb">1<\/span>This game/.test(nostyle)&&/<span class="nb">2<\/span>Their form/.test(nostyle)&&/<span class="nb">3<\/span>You v them/.test(nostyle));
c('takeaway lines on the sections',(nostyle.match(/class="tk"/g)||[]).length>=2);
c('phone: season section folded',/<details class="gfold">/.test(nostyle));
c('their results labelled their win / their loss',/Their (win|loss) \d+/.test(nostyle));
c('their loss is green, their win is red',!/chip w">Their win/.test(nostyle)&&!/chip l">Their loss/.test(nostyle));
c('form chips say whose results and show the key',/Okehampton's last 3 results \(oldest to latest\)/.test(nostyle)&&/Green: good for Ivybridge 1XV \(they lost\)/.test(nostyle)&&/Red: bad for Ivybridge 1XV \(they won\)/.test(nostyle));
// wide
let tw=await (await get('/?view=opposition&layout=wide&'+base)).text();let nw=tw.replace(/<style>[\s\S]*?<\/style>/g,'');
fs.writeFileSync(new URL('./w/opp_v3330w.html',import.meta.url),tw);
c('wide: four sections as equal grid items, season open (not folded)',/id="g4"/.test(nw)&&!/<details class="gfold">/.test(nw)&&/\.gc\{display:contents\}/.test(tw)&&/align-items:stretch/.test(tw));
// whatsapp
let wa=waText(t);fs.writeFileSync(new URL('./w/opp_wa.txt',import.meta.url),wa);
c('wa: title and team line',/^\u{1F3C9} \*OPPOSITION REPORT\*\n\*Okehampton\*/u.test(wa));
c('wa: date line and venue line',/\u{1F4C5} .+\n[\u{1F3E0}\u{1F68C}] (Home|Away)/u.test(wa));
c('wa: every heading has an emoji and its lines directly beneath',['VERDICT','THEIR FORM'].every(h=>new RegExp('\\p{Extended_Pictographic} \\*'+h+'\\*\\n[^\\n*]','u').test(wa)));
c('wa: head to head uses team names and scores from your side',/HEAD TO HEAD\*\nIvybridge 1XV won/.test(wa)&&/\n\d+–\d+/.test(wa));
c('wa: common opponents sentence',/COMMON OPPONENTS\*\nIvybridge 1XV did better than Okehampton against \d+ of the \d+ clubs/.test(wa));
c('wa: directions always there, with a link',/\u{1F9ED} Directions[^\n]*:\nhttps:\/\/www\.google\.com\/maps\/dir\//u.test(wa));
c('wa: report link last',/\u{1F517} Full report \(needs signal\):\nhttps?:\/\/[^\n]+view=opposition[^\n]*$/u.test(wa));
c('wa: no blank heading, no double blank lines',!/\n\n\n/.test(wa)&&!/\*\n\n/.test(wa));
// away game: directions to the opposition's ground
nextFx=fut(15342,'Okehampton',false,3);w=await load();t=await opp();wa=waText(t);
c('away: venue line says away and directions still present',/\u{1F68C} Away/u.test(wa)&&/\u{1F9ED}/u.test(wa)&&/maps\/dir|ground to be confirmed/.test(wa));
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
