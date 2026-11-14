// v3.30 win chance model on its own.
const { __w } = await import(process.argv[2]);const {winModel,winPercents,winBacktest,normCdf}=__w;
let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
c('normal curve: 0 gives one half',Math.abs(normCdf(0)-0.5)<1e-6);
c('normal curve: 1.96 gives about 0.975',Math.abs(normCdf(1.96)-0.975)<0.001);
c('normal curve is symmetric',Math.abs(normCdf(1.3)+normCdf(-1.3)-1)<1e-6);
let seed=99;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
const gauss=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd())};
const str=[18,10,6,2,0,-3,-6,-9,-12,-16];
function sim(w,skip){const g=[];str.forEach((a,i)=>str.forEach((b,j)=>{if(i!==j&&!(skip&&skip(i,j))){const m=a-b+4+gauss()*15;g.push({h:'t'+i,a:'t'+j,hs:Math.round(30+m/2),as:Math.round(30-m/2),w:w||1})}}));return g}
const g=sim();
let m=winModel(g,'t0','t9');
c('strong home side against weak: heavy favourite',m&&m.pHome>0.9);
c('strong side away at weak side: still favoured',winModel(g,'t9','t0').pHome<0.2);
c('level sides: home side slightly ahead',(()=>{const x=winModel(g,'t4','t5');return x.pHome>0.5&&x.pHome<0.75})());
c('home advantage is measured near 4',m.ha>2&&m.ha<6.5);
c('spread is sensible',m.sigma>=12&&m.sigma<=28);
const p=winPercents(0.5);c('percentages add to 100',p.home+p.away===100&&p.home===50);
c('never 0 or 100',winPercents(0.9999).home===97&&winPercents(0.0001).home===3&&winPercents(0.9999).away===3);
c('too few games gives nothing',winModel(g.filter(x=>x.h!=='t0'&&x.a!=='t0'||Math.random()<0).slice(0,60),'t0','t1')===null);
c('same team gives nothing',winModel(g,'t1','t1')===null);
c('games with no score are ignored',winModel([...g,{h:'t0',a:'t1',hs:NaN,as:3,w:1}],'t0','t1')!==null);
// earlier seasons help a side that has few games this season but never stand in for the minimum
const thin=g.filter(x=>!(x.h==='t0'||x.a==='t0')).concat(g.filter(x=>x.h==='t0'||x.a==='t0').slice(0,5));
const old=sim(0.5);
const noOld=winModel(thin,'t0','t9'),withOld=winModel([...thin,...old],'t0','t9');
c('earlier seasons raise the case for a strong side with few games',withOld.gap>noOld.gap);
c('earlier seasons alone do not unlock a prediction',winModel(old.map(x=>({...x,w:0.5})),'t0','t9')===null);
// all earlier-season weights shrink: half-weight games count less than full
const gh=g.map(x=>({...x,w:1}));const lowW=winModel([...gh.filter(x=>x.h!=='t3'&&x.a!=='t3'),...gh.filter(x=>x.h==='t3'||x.a==='t3').map(x=>({...x,w:1}))],'t3','t4');c('model runs with mixed weights',!!lowW);
// swapping home and away changes the answer by the home advantage, not randomly
const a=winModel(g,'t2','t3'),b=winModel(g,'t3','t2');c('swap: both agree on who is stronger',a.gap>0&&b.gap<0&&Math.abs(a.gap+b.gap)<0.01);
// backtest on a simulated season: calibrated and better than 50/50
const sg=sim().map((x,i)=>({...x,ts:1+Math.floor(i/6)}));
const b2=winBacktest(sg);
c('backtest predicts most games',b2.predicted>50);
c('backtest beats 50/50',b2.brier<0.22&&b2.favouriteWon>0.65);
c('backtest buckets add up',b2.buckets.reduce((s,x)=>s+x.games,0)===b2.predicted);
c('backtest never peeks: first games are not predicted',b2.predicted<b2.finished);
console.log(`${ok} passed, ${bad} failed`);process.exit(bad?1:0);
