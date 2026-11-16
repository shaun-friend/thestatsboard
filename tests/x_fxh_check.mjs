// v3.36.2: Fixtures TV board header: team name above the season heading, no club name at the top right.
import fs from 'fs';const t=fs.readFileSync('w/fx_hdr.html','utf8');let bad=0;const c=(n,x)=>{if(!x){bad++;console.log('FAIL',n)}};
const tt=t.match(/<div class="tt[^"]*">([\s\S]*?)<\/div>/);c('header block found',!!tt);
c('team name comes before the season heading',tt&&tt[1].indexOf('class="tn"')>-1&&tt[1].indexOf('class="tn"')<tt[1].indexOf('<h1>'));
const rt=t.match(/<div class="rt">([\s\S]*?)<\/div>/);c('top right has the clock and date',rt&&/id="sbclk"/.test(rt[1])&&/id="sbdt"/.test(rt[1]));
c('top right has no club name',rt&&!/<b>/.test(rt[1]));
const fs1=+(t.match(/\.fxh \.tn\{font-size:([\d.]+)vh/)||[])[1],fs2=+(t.match(/\.fxh h1\{font-size:([\d.]+)vh/)||[])[1];c('team name is larger than the heading',fs1>fs2&&fs2>0);
console.log(bad?'FAILED':'ALL OK');process.exit(bad?1:0);
