// v3.81.5: dots and progress line are separate switches; Admin date selectors are styled with a summary line.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let clock=Date.UTC(2026,10,11,12,0,0);const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
globalThis.fetch=async()=>({ok:false,status:404,text:async()=>''});
const ctx={waitUntil(){}};const env={CLUB_PIN:'1',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const get=async(p)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{headers:{'User-Agent':'Mozilla/5.0',Cookie:ck}}),env,ctx);return {t:await r.text(),s:r.status}};
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx).then(r=>r.json());
const plan=t=>JSON.parse(t.match(/id="tvd">([^<]*)</)[1]);
const item=[{page:'fixtures',team:'11039'}];
clock+=2000;await post({tv:{items:item,dots:true,prog:false}});clock+=2000;let P=plan((await get('/tv')).t);
c('dots only',P.d===true&&P.g===false);
clock+=2000;await post({tv:{items:item,dots:false,prog:true}});clock+=2000;P=plan((await get('/tv')).t);
c('progress only',P.d===false&&P.g===true);
clock+=2000;await post({tv:{items:item,name:true}});clock+=2000;P=plan((await get('/tv')).t);
c('neither',P.d===false&&P.g===false&&P.n===true);
// an old saved setting with only dots:true keeps showing both
store={};clock+=2000;await post({tv:{items:item,dots:true}});clock+=2000;P=plan((await get('/tv')).t);
c('old dots setting still shows both',P.d===true&&P.g===true);
const a=await get('/admin');
c('admin has separate switches',/id="tvd"/.test(a.t)&&/id="tvg"/.test(a.t)&&/Show a progress line/.test(a.t));
c('admin date selectors styled with summary',/class="dts"/.test(a.t)&&/id="thsum"/.test(a.t)&&/\.dts select\{/.test(a.t));
console.log(ok+' ok, '+bad+' failed');process.exit(bad?1:0);
