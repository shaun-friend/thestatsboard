import fs from 'fs';const src=fs.readFileSync(process.argv[2],'utf8');
let ok=0,bad=0;const c=(n,v)=>{if(v)ok++;else{bad++;console.log('FAIL '+n)}};
c('links page lists an App view row first, for laptops',/\[\["App view \(laptop and tablet\)","app",""," only-lap"\],\["Standard \/ TV view","","lt"," only-tv"\]/.test(src));
c('App view link is the app shell link',/k==="app"\?SB_BASE\+"\/\?"\+qs\(\{season:sel\.season[^}]*app:"1"\}\)/.test(src));
c('the App view row is shown only to mouse devices wider than a phone (and with Show all links)',/\.only-lap\{display:none\}@media \(min-width:821px\) and \(hover:hover\) and \(pointer:fine\)\{\.only-lap\{display:flex\}\}body\.all \.only-lap/.test(src));
c('the app shell lets a mouse device stay in the app view',/capable=force\|\|mm\("\(max-width:820px\)"\)\|\|\(mm\("\(hover:hover\)"\)&&mm\("\(pointer:fine\)"\)\)/.test(src));
c('side-by-side panes are for touch devices only',/function wantSplit\(\)\{return tabOf\(view\)==="next"&&!\(mm\("\(hover:hover\)"\)&&mm\("\(pointer:fine\)"\)\)/.test(src));
c('mouse devices get one centred column inside a full-width frame',/hover:hover\) and \(pointer:fine\)\{html body\{max-width:820px!important/.test(src)&&!/\.sbx-fr\{max-width:1040px\}/.test(src));
console.log(ok+' passed, '+bad+' failed');
