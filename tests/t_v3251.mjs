const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x)ok++;else{bad++;console.log('FAIL',n)}};
const fs=await import('fs');const t=fs.readFileSync('../site/_worker.js','utf8');
const i=t.indexOf('async function adminPage')>=0?t.indexOf('async function adminPage'):t.indexOf('function adminPage');
const seg=t;
const ids=[...seg.matchAll(/sw\("([a-z0-9]+)"/g)].map(m=>m[1]);
c('found switches',ids.length>=8);
c('every Admin switch id is unique',new Set(ids).size===ids.length);
c('web switch has its own id',ids.includes('fb')&&ids.includes('fw')&&/webfallback:\$\("fb"\)/.test(seg)&&/weather:\$\("fw"\)/.test(seg));
console.log(ok+' passed, '+bad+' failed');process.exit(bad?1:0)
