// v3.37.0: the TV screen (/<club>/tv). Settings clean-up, plan, route, zero outside calls, maintenance.
const src=process.argv[2];let ok=0,bad=0;const c=(n,x)=>{if(x){ok++}else{bad++;console.log('FAIL',n)}};
let store={};const kv={get:async(k,o)=>{const v=store[k];if(v==null)return null;return o&&o.type==='json'?JSON.parse(v):v},put:async(k,v)=>{store[k]=v},delete:async k=>{delete store[k]}};
let clock=Date.UTC(2026,10,11,12,0,0);const RD=Date;globalThis.Date=class extends RD{constructor(...a){a.length?super(...a):super(clock)}static now(){return clock}};
let calls=0;globalThis.fetch=async()=>{calls++;return {ok:false,status:404,text:async()=>''}};
const bg=[];const ctx={waitUntil(p){bg.push(p)}};
const env={CLUB_PIN:'1',SETTINGS:kv,ENV_LABEL:''};
const w=(await import(src+'?i=1')).default;
let ck='';{const r0=await w.fetch(new Request('https://x.co.uk/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1'})}),env,ctx);ck=(r0.headers.get('Set-Cookie')||'').split(';')[0]}
const get=async(p,m)=>{const r=await w.fetch(new Request('https://thestatsboard.co.uk'+p,{method:m||'GET',headers:{'User-Agent':'Mozilla/5.0'}}),env,ctx);const t=await r.text();return {h:r.headers,t,s:r.status}};
const post=b=>w.fetch(new Request('https://x.co.uk/api/admin',{method:'POST',headers:{'Content-Type':'application/json',Cookie:ck},body:JSON.stringify(b)}),env,ctx).then(r=>r.json());
const plan=t=>JSON.parse(t.match(/id="tvd">([^<]*)</)[1]);
let a=await get('/ivybridge/tv');
c('route serves the screen',a.s===200&&/id="st"/.test(a.t));
c('empty list says nothing is on',/Nothing is switched on/.test(a.t)&&plan(a.t).p.length===0);
c('not cached, not indexed',/no-store/.test(a.h.get('Cache-Control'))&&/noindex/.test(a.h.get('X-Robots-Tag')));
c('rotator made no outside calls',calls===0);
a=await get('/tv');c('/tv alias works',a.s===200&&/id="tvd"/.test(a.t));
a=await get('/Ivybridge/tv/');c('case and trailing slash',a.s===200&&/id="tvd"/.test(a.t));
a=await get('/otherclub/tv');c('another club is not served',!/id="tvd"/.test(a.t));
// settings
clock+=2000;let j=await post({tv:{items:[{page:'centre',team:'zzz',secs:3},{page:'fixtures',team:'11039',secs:20},{page:'fixtures',team:'11039',secs:40},{page:'match',team:'11039',secs:200},{page:'table',team:'999'},{page:'bogus',team:'11039'},{page:'leaders',team:'11063',on:false},{page:'fixtures',team:'11063'}],order:['11063','all','11039','nope'],off:['11057','nope'],dots:true,theme:'light'}});
c('save ok',j.ok===true);
clock+=2000;calls=0;a=await get('/ivybridge/tv');let P=plan(a.t);
c('plan is in order: Vandals, Match Centre, 1XV',P.p.map(x=>x.k).join()==='fixtures,centre,fixtures,match',P.p.map(x=>x.k).join());
c('Match Centre uses stack view and 25 s default for bad seconds',/view=stack/.test(P.p[1].u)&&P.p[1].s===25);
c('duplicate dropped, secs clamped',P.p.filter(x=>x.k==='fixtures'&&/team=11039/.test(x.u)).length===1&&P.p[3].s===20);
c('page urls carry tv layout, team, theme and a known league',/layout=tv/.test(P.p[0].u)&&/team=11063/.test(P.p[0].u)&&/competition=1699/.test(P.p[0].u)&&/theme=light/.test(P.p[0].u));
c('off page skipped',!P.p.some(x=>x.k==='leaders'));
c('unknown team page dropped',!P.p.some(x=>/team=999/.test(x.u)));
c('dots flag on',P.d===true&&/#dots/.test(a.t));
c('still no outside calls',calls===0);
// team switched off / hidden
clock+=2000;await post({tv:{items:[{page:'fixtures',team:'11039'},{page:'fixtures',team:'11063'}],off:['11039']}});
clock+=2000;a=await get('/ivybridge/tv');P=plan(a.t);c('a switched-off team is skipped',P.p.length===1&&/team=11063/.test(P.p[0].u));
clock+=2000;await post({tv:{items:[{page:'fixtures',team:'11039'},{page:'fixtures',team:'11063'}]},club:{teams:[{team:'11039',teamName:'Ivybridge 1XV',name:'Ivybridge 1XV',competition:'1699',division:'75791'},{team:'11063',teamName:'The Vandals',name:'The Vandals',competition:'1699',division:'75801',hidden:true}]}});
clock+=2000;a=await get('/ivybridge/tv');P=plan(a.t);c('a hidden team is skipped',P.p.length===1&&/team=11039/.test(P.p[0].u));
// auto add
clock+=2000;await post({tv:{items:[],auto:true,seen:['11039']},club:{teams:[{team:'11039',teamName:'Ivybridge 1XV',name:'Ivybridge 1XV',competition:'1699',division:'75791'},{team:'11063',teamName:'The Vandals',name:'The Vandals',competition:'1699',division:'75801'}]}});
clock+=2000;a=await get('/ivybridge/tv');P=plan(a.t);c('auto adds the four pages of an unseen team only',P.p.length===4&&P.p.every(x=>/team=11063/.test(x.u)),P.p.length);
clock+=2000;await post({tv:{items:[],auto:false,seen:['11039']},club:{teams:[{team:'11039',teamName:'Ivybridge 1XV',name:'Ivybridge 1XV',competition:'1699',division:'75791'},{team:'11063',teamName:'The Vandals',name:'The Vandals',competition:'1699',division:'75801'}]}});
clock+=2000;a=await get('/ivybridge/tv');c('auto off adds nothing',plan(a.t).p.length===0);
// escaping
clock+=2000;await post({tv:{items:[{page:'fixtures',team:'11039'}]},club:{teams:[{team:'11039',teamName:'</script><b>x',name:'</script><b>x',competition:'1699',division:'75791'}]}});
clock+=2000;a=await get('/ivybridge/tv');c('team names cannot break out of the data block',(a.t.match(/<\/script>/g)||[]).length===2&&!/<\/script><b>/.test(a.t));
// POST is not the screen
a=await get('/ivybridge/tv','POST');c('POST is not served as the screen',!/id="tvd"/.test(a.t));
// maintenance
clock+=2000;await post({maintenance:{on:true,pun:'none',extra:'',lines:['One']},pin:'1'});clock+=2000;
a=await get('/ivybridge/tv');console.log('maintenance on, tv status',a.s,/Back soon|back soon/i.test(a.t),/id="tvd"/.test(a.t));
console.log(ok+' pass '+bad+' fail');process.exit(bad?1:0);
