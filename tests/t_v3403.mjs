import fs from 'fs';
const s=fs.readFileSync(process.argv[2],'utf8');let p=0,f=0;const c=(n,o)=>{o?p++:(f++,console.log('FAIL',n))};
const a=s.indexOf('function usagePage(');const seg=s.slice(a,a+6000);
c('usage page releases the fixed version line',/#sbv\{position:static!important/.test(seg));
c('rule is inside the usage page style',seg.indexOf('#sbv{position:static')<seg.indexOf('<div class="wrap us">'));
console.log(p+' passed, '+f+' failed');process.exit(f?1:0)
