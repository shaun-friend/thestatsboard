// v3.80.0: cancellation notices go in the Match Centre title bar on wide screens
import fs from 'fs';
let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const src=fs.readFileSync(process.argv[2],'utf8');
const L=src.split('\n');
const grab=n=>{const i=L.findIndex(l=>l.startsWith('function '+n+'(')||l.startsWith('const '+n+' = '));if(i<0)return null;if(/\}\s*;?\s*$/.test(L[i])&&!/\{\s*$/.test(L[i]))return L[i];let j=i+1;while(j<L.length&&L[j]!=='}')j++;return L.slice(i,j+1).join('\n')};
const code=['offDateLabel','offEsc','offLine','offBar','offNotice'].map(grab);
c('helper functions found',code.every(Boolean),code.map(x=>!!x).join());
const f=new Function(code.join('\n')+'\nreturn {offBar,offNotice}')();
const m1={tn:'The Vandals',d:'2026-11-28',on:'Tamar Saracens',k:'c',n:'Saracens unable to raise a team'},m2={tn:'Ivybridge 1XV',d:'2026-11-28',on:'Okehampton',k:'p',n:''},m3={tn:'Ivybridge Women',d:'2026-11-29',on:'Beckenham <b>',k:'c',n:'Frozen'};
c('no marks, no bar',f.offBar([])==='');
const one=f.offBar([m1]);
c('one mark shows team, game and reason',/The Vandals<\/b> &middot; CANCELLED/.test(one)&&/Sat 28 Nov v Tamar Saracens/.test(one)&&/Saracens unable to raise a team/.test(one),one);
const two=f.offBar([m1,m2]);
c('two marks keep reasons and the postponed word',/class="hdn"/.test(two)&&/POSTPONED/.test(two)&&/Saracens unable/.test(two));
c('postponed with no reason has no empty line',!/<em><\/em>/.test(two));
const three=f.offBar([m1,m2,m3]);
c('three marks drop the reasons',/class="hdn hdm"/.test(three)&&!/unable to raise/.test(three)&&!/Frozen/.test(three)&&/v Tamar Saracens/.test(three));
c('text is escaped',!/<b>\s*Beckenham/.test(three)&&/Beckenham &lt;b&gt;/.test(three));
c('panel notice is tagged so wide screens can hide it',/class="offn"/.test(f.offNotice([m1])));
c('stack header includes the bar',src.includes('<span>Updated ${e(stamp)}</span></div><nav class="jump">')&&src.includes('${offBar(offAll.filter('));
c('CSS: bar only on wide Modern layout, panel notice hidden there',/min-width:801px\)\{body\.ly-on \.hdn\{display:flex/.test(src)&&/body\.ly-on \.offn\{display:none\}/.test(src)&&/\.hdn\{display:none\}/.test(src));
console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0)
