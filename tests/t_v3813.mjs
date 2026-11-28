// v3.81.3: logo corner detection ignores transparent corner pixels (rounded stored logos) and samples a little inside the corner
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x){ok++}else{bad++;console.log('FAIL',n,d||'')}};
const fnTxt=[...src.matchAll(/function lgCorner\(c,w,h\)\{.*?\n/g)].map(m=>m[0]);
c('both Admin copies carry the new corner check',fnTxt.length===2&&fnTxt[0]===fnTxt[1]&&fnTxt[0].includes('d[j+3]<200'),String(fnTxt.length));
const lgCorner=new Function(fnTxt[0].replace(/\n$/,'')+';return lgCorner')();
const img=(w,h,px)=>({getImageData:(x,y,sw,sh)=>{const o=new Uint8ClampedArray(sw*sh*4);for(let j=0;j<sh;j++)for(let i=0;i<sw;i++){const q=px(x+i,y+j),k=(j*sw+i)*4;o[k]=q[0];o[k+1]=q[1];o[k+2]=q[2];o[k+3]=q[3]}return{data:o}}});
const rounded=(w,h,col,r)=>img(w,h,(x,y)=>{const cx=x<r?r-x:x>w-1-r?x-(w-1-r):0,cy=y<r?r-y:y>h-1-r?y-(h-1-r):0;return cx*cx+cy*cy>r*r?[0,0,0,0]:[...col,255]});
c('white logo with transparent rounded corners is as supplied (white)',lgCorner(rounded(300,120,[255,255,255],12),300,120)==='rgb(255,255,255)',String(lgCorner(rounded(300,120,[255,255,255],12),300,120)));
c('dark red logo with rounded corners keeps its colour',lgCorner(rounded(300,120,[120,10,10],12),300,120)==='rgb(120,10,10)');
c('a fully transparent logo is not treated as a coloured tile',lgCorner(img(300,120,()=>[0,0,0,0]),300,120)===null);
c('off-white with slight noise still counts as one colour',lgCorner(img(300,120,(x,y)=>{const n=((x*7+y*13)%9)-4;return[250+n/2,250+n/2,248+n/2,255]}),300,120)!==null);
c('corners of different colours are not a tile',lgCorner(img(300,120,(x,y)=>x<150?[255,255,255,255]:[10,10,10,255]),300,120)===null);
console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0);
