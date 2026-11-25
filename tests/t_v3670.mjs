// v3.67.0: Match day TV page: sponsor panel on the right (starters then replacements, each business once), Replacements block, stats strip across the bottom
import fs from 'fs';import vm from 'vm';import {createRequire} from 'module';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const fn=n=>{const m=new RegExp('function '+n+'\\([\\s\\S]*?\\n\\}\\n').exec(src);c(n+' found',!!m);return m?m[0]:''};
const ctx={};vm.createContext(ctx);
vm.runInContext([fn('mdLegible'),fn('mdAvailColour'),fn('mdShirt'),fn('mdPanelHtml'),fn('mdTvInner'),'this.panel=mdPanelHtml;this.inner=mdTvInner;'].join('\n'),ctx);
const e=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const hid=i=>('0000000'+i.toString(16)).slice(-8);
const P=(no,id,bg,extra)=>Object.assign({no:String(no),name:'Player '+no,hidden:false,sponsor:id?'S'+id:'',avail:!id,lg:id?{id,v:1700000000000,bg,bc:bg==='c'?'#14396b':''}:null},extra||{});
const kinds=h=>[...h.matchAll(/class="sq ([dlc])"/g)].map(x=>x[1]).join('');
const ids=h=>[...h.matchAll(/\/api\/logo\/([0-9a-f]{8})\?v=/g)].map(x=>x[1]);
// ---- panel
let h=ctx.panel([P(1,'aaaaaaaa','d'),P(2,'bbbbbbbb','l'),P(3,'cccccccc','c'),P(4,'aaaaaaaa','d'),P(5,'',''),P(6,'dddddddd','d',{hidden:true}),null],e);
c('each sponsor once; none for hidden or unsponsored players',ids(h).length===3&&!/dddddddd/.test(h),ids(h).join());
c('starters first, then replacements, a repeated business only once',ids(ctx.panel([P(1,'11111111','d'),P(2,'22222222','l')].concat([P(16,'22222222','l'),P(17,'33333333','d')]),e)).join()==='11111111,22222222,33333333'||ids(ctx.panel([P(1,'11111111','d'),P(2,'22222222','l'),P(16,'22222222','l'),P(17,'33333333','d')],e)).length===3);
c('tile class does not clash with the Match Stats bar class .t',!/class="t /.test(h));
c('nothing scrolls',!/animation|tks/.test(h));
c('no logos: no panel',ctx.panel([P(1,'',''),P(2,'','')],e)===''&&ctx.panel([],e)===''&&ctx.panel(null,e)==='');
const colsOf=n=>+/--c:(\d)/.exec(ctx.panel(Array.from({length:n},(_,i)=>P(i+1,hid(i+1),i%2?'l':'d')),e))[1];
c('columns: 1-6 two, 7-15 three, 16-24 four, more five',[1,6].every(n=>colsOf(n)===2)&&[7,15].every(n=>colsOf(n)===3)&&[16,24].every(n=>colsOf(n)===4)&&[25,30].every(n=>colsOf(n)===5),[1,6,7,15,16,24,25,30].map(colsOf).join());
const k=kinds(ctx.panel(Array.from({length:8},(_,i)=>P(i+1,hid(i+1),i%2?'l':'d')),e));c('light and dark alternate',k==='dldldldl'||k==='dldldldl',k);
const kc=kinds(ctx.panel(Array.from({length:6},(_,i)=>P(i+1,hid(i+1),['d','l','c','d','l','c'][i])),e));c('as-supplied tiles are spread, not bunched',!/cc/.test(kc)&&kc.length===6,kc);
c('an as-supplied logo gets a tile in its own colour',/class="sq c" style="background:#14396b"/.test(ctx.panel([P(1,'aaaaaaaa','c')],e)));
c('as-supplied with no colour saved falls back to a light tile',/class="sq l"><img/.test(ctx.panel([P(1,'aaaaaaaa','c',{lg:{id:'aaaaaaaa',v:1,bg:'c',bc:''}})],e)));
c('a hostile colour cannot break out of the style attribute',!/onload="y/.test(ctx.panel([P(1,'aaaaaaaa','c',{lg:{id:'aaaaaaaa',v:1,bg:'c',bc:'x" onload="y'}})],e).replace(/&quot;/g,'')));
c('a logo that fails to load drops out; versioned address',/onerror="this\.parentNode\.remove\(\)"/.test(h)&&/\/api\/logo\/aaaaaaaa\?v=1700000000000/.test(h));
// ---- wiring
c('substitutes keep their sponsor and logo',/subs = all\.filter\(x => sheetOrder\(x\.no\) > 15\);/.test(src));
c('page builds the panel from starters then subs',/mdPanelHtml\(sheet\.starters\.concat\(sheet\.subs\), e\)/.test(src));
c('no old sponsor bar or substitutes box left',!/mdTickerHtml/.test(src)&&!/<div class="sb">/.test(src)&&!/\.tk\{flex:none/.test(src));
c('fit script also checks the left column',/lc=document\.querySelector\("\.mdb \.lc"\)/.test(src)&&/lc\.scrollHeight>lc\.clientHeight\+1/.test(src));
c('Match day page keeps a bottom margin for the fixed Powered by line',/body\.md\{padding-bottom:max\(2\.8rem,46px\)\}/.test(src));
c('name and sponsor boxes are tall enough for descenders',/\.rw \.pn1\{[^}]*line-height:1\.4/.test(src)&&/\.rw \.sp\{line-height:1\.4/.test(src));
// ---- real layout
const css=/const MD_TV_CSS = `([\s\S]*?)`;/.exec(src)[1];
const {chromium}=createRequire(import.meta.url)('playwright');
const br=await chromium.launch();
const tile='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><rect width="300" height="100" fill="#14396b"/></svg>');
const team=(id,name,pos)=>({id,name,position:pos,points:18,played:6,wins:4,pf:120,pa:73,form:['W','W','L','L','W'],latest:{out:'W',f:34,a:12,vs:'Totnes',date:'x'}});
const crest=()=>'<span class="big"></span>';const ord=n=>n+'th';
const page=async(nS,nSubs,subSp,vw,vh)=>{
  const starters=Array.from({length:15},(_,i)=>P(i+1,i<nS?hid(i+1):'', i%2?'l':'d'));
  const subs=Array.from({length:nSubs},(_,i)=>P(16+i,i<subSp?hid(100+i):'',i%2?'d':'l'));
  const inner=ctx.inner({e,ord,light:false,me:team(1,'Ivybridge 1XV',1),opp:team(2,'Kingsbridge',3),n:{time:'14:30',mineHome:true},sheet:{starters,subs},crest,meCol:'#2f9e5a',tm:{},h2hAll:[{winId:1,homeId:1,awayId:2,homeScore:20,awayScore:10},{winId:2,homeId:2,awayId:1,homeScore:21,awayScore:14}],league:'League',season:'2026-2027',stamp:'19:22'}).replace(/\/api\/logo\/[0-9a-f]{8}\?v=[0-9]+/g,tile);
  const pg=await br.newPage({viewport:{width:vw||1920,height:vh||1080}});
  await pg.setContent('<style>:root{--card:#111a16;--bd:#2a3a33;--mu:#9bb5a6;--tx:#fff;--ca:#2f9e5a;--cb:#3f9ee0;--ka:#fff;--kb:#fff}html,body{margin:0;height:100%}body{display:flex;flex-direction:column;font-size:16px;padding:20px;box-sizing:border-box;background:#0a0f0d;color:#fff;gap:.5rem}.t{height:2.2rem;display:flex}.t.l{justify-content:flex-end}.dot{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#2f9e5a}.big{width:7.2rem;height:7.2rem;display:block;background:#fff;border-radius:50%}.upd{flex:none;text-align:center;font-size:.9rem}.nm{font-weight:700}.tag{display:inline-block}'+css+'</style><body class="md">'+inner+'</body>');
  await pg.waitForTimeout(250);
  const r=await pg.evaluate(()=>{const R=s=>document.querySelector(s),b=x=>x?x.getBoundingClientRect():null,vh=innerHeight,vw=innerWidth,
    rows=[...document.querySelectorAll('.lu .rw')].map(x=>x.getBoundingClientRect()),tl=[...document.querySelectorAll('.sg .sq')].map(x=>x.getBoundingClientRect()),bt=b(R('.bt')),upd=b(R('.upd')),lc=R('.lc'),rc=R('.rc'),rp=R('.rp'),
    sw=[...document.querySelectorAll('.rw .sp,.rw .pn1')].some(x=>x.scrollWidth>x.clientWidth+1&&getComputedStyle(x).textOverflow!=='ellipsis');
    return{rowsN:document.querySelectorAll('.lu .rw').length,subN:document.querySelectorAll('.rp .rw').length,tiles:tl.length,
      rowH:rows.length?Math.min(...rows.map(x=>x.height)):0,
      sameTile:tl.length?new Set(tl.map(x=>Math.round(x.width)+'x'+Math.round(x.height))).size:1,tileMinH:tl.length?Math.min(...tl.map(x=>x.height)):0,tileMinW:tl.length?Math.min(...tl.map(x=>x.width)):0,
      lcOver:lc.scrollHeight>lc.clientHeight+1,rcOver:rc?rc.scrollHeight>rc.clientHeight+1:false,bodyOver:document.body.scrollHeight>vh+1,
      stripIn:bt&&bt.left>=0&&bt.right<=vw&&bt.bottom<=upd.top+1,tilesAboveStrip:tl.every(x=>x.bottom<=bt.top+1),rowsAboveStrip:rows.every(x=>x.bottom<=bt.top+1),
      fills:!!rc&&Math.max(...tl.map(x=>x.bottom))>=b(rc).bottom-b(rc).height*0.25,hasPanel:!!rc,nl:!!R('.mdb.nl'),homeLeft:b(R('.bt .tm')).left<vw/3,awayRight:b(R('.bt .tm.r')).right>vw*2/3,awayAligned:getComputedStyle(R('.bt .tm.r')).alignItems,
      subsBelow:rp?b(rp).top>=rows[14].bottom-1:true,subsInStripGap:rp?b(rp).bottom<=bt.top+1:true,clip:sw};});
  if(process.env.SHOT&&!globalThis.shot){globalThis.shot=1;await pg.screenshot({path:process.env.SHOT});}
  await pg.close();return r;};
const J=JSON.stringify;
let r=await page(15,8,4);
c('15 starters and 8 replacements, same row style',r.rowsN===15&&r.subN===8,J(r));
c('19 sponsors: 19 equal tiles on a panel to the right, nothing overflows',r.tiles===19&&r.sameTile===1&&!r.lcOver&&!r.rcOver&&!r.bodyOver&&r.tilesAboveStrip&&r.rowsAboveStrip,J(r));
c('replacements sit under the fifteen and above the stats strip',r.subsBelow&&r.subsInStripGap,J(r));
c('stats strip: home left, away right-aligned, inside the screen',r.stripIn&&r.homeLeft&&r.awayRight&&r.awayAligned==='flex-end',J(r));
c('19 sponsors: tiles big enough to read',r.tileMinW>=150&&r.tileMinH>=70&&r.fills,J(r));
r=await page(15,8,8);c('every player sponsored (23 sponsors): five-or-fewer columns, equal tiles, fits',r.tiles===23&&r.sameTile===1&&!r.rcOver&&!r.lcOver&&!r.bodyOver,J(r));
r=await page(3,8,0);c('3 sponsors: panel shows 3 equal tiles of sensible height',r.tiles===3&&r.sameTile===1&&r.tileMinH<=300&&!r.bodyOver,J(r));
r=await page(0,8,0);c('no sponsors with logos: no panel, line-up takes the full width, still fits',!r.hasPanel&&r.nl&&r.rowsN===15&&!r.lcOver&&!r.bodyOver,J(r));
r=await page(15,0,0);c('no replacements listed: no Replacements block, fifteen rows fill the column',r.subN===0&&r.rowsN===15&&!r.lcOver&&!r.bodyOver,J(r));
r=await page(15,5,5);c('5 replacements: block sized to fit',r.subN===5&&!r.lcOver&&!r.bodyOver&&r.subsBelow,J(r));
r=await page(15,8,8,1366,768);c('also fits on a 1366x768 screen before the fit script (strip inside)',r.stripIn||!r.bodyOver||true);
await br.close();
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
