// v3.39.8: the Usage page names every screen page with a capital first letter (leaders showed as "leaders").
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,y)=>{if(x){ok++}else{bad++;console.log('FAIL',n,y||'')}};
const m=/var SN=\{([^}]*)\};/.exec(src);c('SN table found',!!m);
const names={};if(m)for(const p of m[1].split(/,(?=\w+:)/)){const k=p.split(':')[0].trim();names[k]=JSON.parse(p.slice(p.indexOf(':')+1).trim())}
for(const k of ['stack','fixtures','match','opposition','team','home','leaders','table'])c('page "'+k+'" has a name',!!names[k]);
for(const [k,v] of Object.entries(names))c('"'+k+'" starts with a capital',/^[A-Z]/.test(v),v);
c('leaders is League Leaders',names.leaders==='League Leaders',names.leaders);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
