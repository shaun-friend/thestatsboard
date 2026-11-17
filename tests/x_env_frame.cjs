// DEV badge: shown once. A page inside the TV rotator (a frame) must not add a second badge beside the rotator's own.
const {chromium}=require('playwright');const {execSync}=require('child_process');
(async()=>{const b=await chromium.launch();let bad=0;const ck=(n,c,x)=>{if(!c){bad++;console.log('FAIL',n,x||'')}};
const page=`<html><head><title>t</title></head><body><div role="note" id="rfuEnv" style="position:fixed;right:10px;bottom:10px">TEST environment</div><script>try{if(window.top!==window.self){var e=document.getElementById("rfuEnv");if(e)e.remove()}}catch(x){}</scr`+`ipt></body></html>`;
const src=require('fs').readFileSync('t_worker.mjs','utf8');const m=src.match(/<div role="note" id="rfuEnv"[^`]*?<\/script>/);
ck('worker emits the badge with the frame check',!!m&&m[0].includes('window.top!==window.self'));
const p=await b.newPage();await p.route('**/*',r=>{const u=r.request().url();r.fulfill({status:200,contentType:'text/html',body:u.endsWith('/outer')?'<body><iframe id=f src="/inner"></iframe></body>':page})});
await p.goto('https://sb.test/inner');ck('on its own, the badge shows',await p.locator('#rfuEnv').count()===1);
await p.goto('https://sb.test/outer');await p.waitForTimeout(500);ck('inside a frame, the badge is removed',(await p.frameLocator('#f').locator('#rfuEnv').count())===0);
await b.close();console.log(bad?'FAILED '+bad:'ALL OK')})();
