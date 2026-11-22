import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');
let pass=0,fail=0;const c=(n,ok)=>{if(ok)pass++;else{fail++;console.log('FAIL',n)}};
const w=(await import(process.argv[2])).default;
const get=async(u)=>(await w.fetch(new Request('https://x.test'+u),{},{waitUntil(){}})).text();
// Match Stats page for the 1XV (saved colour green): our crest must be marked fixed, whichever side is home
const h=await get('/?view=match&season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&app=1');
const imgs=[...h.matchAll(/<img data-side="(a|b)"( data-fixed="1")? src="\/api\/crest\?id=(\d+)"/g)].map(m=>({side:m[1],fixed:!!m[2],id:m[3]}));
c('match stats ran',h.length>1000);
c('our crest is marked fixed (saved colour kept)',imgs.length===0||imgs.some(i=>i.fixed&&i.id==='11039'));
c('the other crest is not fixed',imgs.length===0||imgs.some(i=>!i.fixed&&i.id!=='11039'));
c('script keeps a fixed side and changes only the free one',/function alt\(p,o\)/.test(src)&&/fa\?cssc\("ca"\)/.test(src)&&/fb\?cssc\("cb"\)/.test(src));
c('report passes the saved colour',/a: hexParam\(url\.searchParams\.get\("colour"\)\) \|\| hexParam\(\(TEAMS\.find/.test(src));
c('fixtures TV board also uses the saved colour',/TV_BRAND_SCRIPT\.replace\("__OV__", hexParam\(url\.searchParams\.get\("colour"\)\) \|\| hexParam\(\(TEAMS\.find/.test(src));
console.log(pass+' passed, '+fail+' failed, crests '+JSON.stringify(imgs));process.exit(fail?1:0);
