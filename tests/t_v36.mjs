const mod=await import(process.argv[2]);const w=mod.default;
globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({}),text:async()=>''});
let pass=0,fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);c?pass++:fail++};
const ctx={waitUntil(){}};
const req=(p,o={},h={})=>new Request('https://thestatsboard.co.uk'+p,{...o,headers:h});
const kv={store:{},async get(k){return null},async put(){}};
const env={CLUB_PIN:'1234',SETTINGS:kv};
let r=await w.fetch(req('/club-unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/docs'})}),env,ctx);
const ck=(r.headers.get('set-cookie')||'').split(';')[0];
r=await w.fetch(req('/docs',{},{Cookie:ck}),env,ctx);const h=await r.text();
ok('Documentation loads behind the club PIN',r.status===200&&/<title>Documentation<\/title>/.test(h)&&/<h1>Documentation<\/h1>/.test(h));
ok('still locked without the PIN (303) and on PROD with no CLUB_PIN (503)',(await w.fetch(req('/docs'),env,ctx)).status===303&&(await w.fetch(req('/docs'),{},ctx)).status===503);
ok('not cached, not indexed',/no-store/.test(r.headers.get('cache-control')||'')&&/noindex/.test(r.headers.get('x-robots-tag')||''));
const ids=['start','pages','screen','vars','winchance','admin','usagedata','data','defs','trouble','setup','releases','new','privacy'];
for(const i of ids)ok('section '+i+' present and in the contents list',h.includes('id="sec-'+i+'"')&&h.includes('href="#sec-'+i+'"'));
ok('link variables is a section of the documentation',/id="sec-vars"[\s\S]*<h2>Link variables<\/h2>[\s\S]*<code>friendlyName<\/code>/.test(h));
ok('each section says who it is for',(h.match(/class="who"/g)||[]).length===ids.length);
ok('screen setup has numbered steps',/id="sec-screen"[\s\S]*<ol class="bo">/.test(h));
ok('releases section carries the new numbering rule',/major\.minor\.patch/.test(h)&&/v3\.3/.test(h));
ok('calendar and Match Stats cup wording is correct',/and the calendar file, include every game/.test(h)&&/the Opposition Report and the Match Centre\) and the calendar use the team's games in every competition/.test(h)&&!/calendar file cover league games only/.test(h));
ok('what is new lists v3.6 first',h.indexOf('<dt>v3.6.1</dt>')>0&&h.indexOf('<dt>v3.6.1</dt>')<h.indexOf('<dt>v3.6</dt>')&&h.indexOf('<dt>v3.6</dt>')<h.indexOf('<dt>v3.5</dt>'));
ok('light theme works',/<body class="light">/.test(await (await w.fetch(req('/docs?theme=light',{},{Cookie:ck}),env,ctx)).text()));
// DEV address never appears on PROD
const own='season=2026-2027&competition=1699&division=75791&team=11039&teamName=Ivybridge&friendlyName=Ivybridge%201XV';
const pages=['/','/?view=teams','/docs','/admin','/builder','/?'+own,'/?'+own+'&view=fixtures&layout=tv','/?view=stack&layout=tv','/version','/manifest.webmanifest','/?'+own+'&view=match','/?'+own+'&view=fixtures'];
let leak=[];for(const p of pages){const x=await w.fetch(req(p,{},{Cookie:ck}),env,ctx);const t=await x.text();if(/dev\.thestatsboard|irfu-dev|Switch to DEV|You are on/i.test(t))leak.push(p)}
ok('no PROD page mentions the DEV address or a switch ('+pages.length+' pages)',leak.length===0);if(leak.length)console.log(leak.join('\n'));
const lp=await (await w.fetch(req('/?view=teams',{},{Cookie:ck}),env,ctx)).text();
ok('Links page footer says Documentation and Admin, no switch',/href="\/docs"[^>]*>Documentation<\/a> &middot; <a href="\/admin"/.test(lp)&&!/envsw|ENV_SWITCH/.test(lp));
// DEV site: no switch either, and the DEV address is not in any generated link
const denv={ENV_LABEL:'DEV',DEV_PIN:'1234',SETTINGS:kv};
r=await w.fetch(req('/unlock',{method:'POST',body:new URLSearchParams({pin:'1234',next:'/'})}),denv,ctx);const dck=(r.headers.get('set-cookie')||'').split(';')[0];
const dl=await (await w.fetch(req('/?view=teams',{},{Cookie:dck}),denv,ctx)).text();
ok('DEV Links page has no switch to PROD',!/Switch to PROD|You are on/.test(dl)&&!/envsw/.test(dl));
const dd=await (await w.fetch(req('/docs',{},{Cookie:dck}),denv,ctx)).text();
ok('DEV Documentation: test-only examples are links',/href="\/release-notes"/.test(dd)&&/href="\/probe"/.test(dd));
ok('PROD Documentation: test-only examples are greyed',/class="xg"[^>]*>Season debug/.test(h)&&!/href="\/release-notes"/.test(h));
// the worker source itself no longer carries the DEV address outside the release-notes text
const src=(await import('fs')).readFileSync(process.argv[2],'utf8');
const code=src.slice(0,src.indexOf('// <RELEASE_NOTES_START>'))+src.slice(src.indexOf('// <RELEASE_NOTES_END>'));
const codeHits=(code.match(/dev\.thestatsboard|irfu-dev/g)||[]);
ok('DEV address not written in the code (only in old header history/notes: '+codeHits.length+')',!/SITES\s*=\s*\{[^}]*dev\./i.test(code));
console.log(pass,'pass',fail,'fail')
