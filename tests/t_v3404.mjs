import fs from 'fs';
const s=fs.readFileSync(process.argv[2],'utf8');let p=0,f=0;const c=(n,o)=>{o?p++:(f++,console.log('FAIL',n))};
const a=s.indexOf('function probePage(');const seg=s.slice(a,a+9000);
c('each card has a Copy button',/data-cp="'\+ep\.k\+'">Copy<\/button>/.test(seg));
c('it copies the whole result, not the shortened view',/copyText\(body\|\|JSON\.stringify\(r\),cb\)/.test(seg));
c('clipboard with a fallback',/navigator\.clipboard\.writeText\(t\)/.test(seg)&&/execCommand\("copy"\)/.test(seg));
console.log(p+' passed, '+f+' failed');process.exit(f?1:0)
