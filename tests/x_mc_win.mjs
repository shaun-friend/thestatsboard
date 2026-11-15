// Match Centre fit check with a Win Predictor bar in every Next game panel, carrying the Early season note and the underdog line (TV widths show both).
import fs from 'fs';
const {winBarHtml,UNDERDOG_LINES}=(await import(process.argv[2])).__w;
const src=fs.readFileSync('w/ly_next.html','utf8').replace(/ly-two(?! ly-win)"/,'ly-two ly-win"');
let i=0;const out=src.replace(/<div class="nw"><\/div>/g,()=>{const lo=i%2===0;i++;
 const w={home:{id:'1',name:'Ivybridge U18',pct:lo?22:72},away:{id:'2',name:'Paignton Colts U18',pct:lo?78:28},gap:-8,ha:4,early:true,n:5,line:UNDERDOG_LINES[i%UNDERDOG_LINES.length]};
 return '<div class="nw">'+winBarHtml(w,{compact:true,left:'#c0303f',right:'#7f93a3',leftFg:'#fff',rightFg:'#0b1218',fs:'1.1rem'})+'</div>'});
if(i<2){console.log('no panels found');process.exit(1)}
fs.writeFileSync('w/ly_next_win.html',out);console.log('panels with a bar: '+i);
