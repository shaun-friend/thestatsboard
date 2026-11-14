// v3.28: crossfade refresh. Source checks plus a real browser run of the injected script.
import fs from "fs"; import http from "http"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const src = fs.readFileSync(new URL("../site/_worker.js", import.meta.url), "utf8");
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log("FAIL", n)); };
const R = "(window.rfuSoft?rfuSoft():location.reload())";
ok("timed refresh sites use rfuSoft", (src.split(R).length - 1) >= 6);
ok("no bare location.reload() left in timed refresh scripts", !/MAX&&document\.visibilityState==="visible"\)location\.reload\(\)/.test(src) && !/setTimeout\(function\(\)\{location\.reload\(\)\},MAX\)/.test(src));
ok("TV layout keeps a noscript meta refresh", /<noscript><meta http-equiv="refresh"/.test(src));
ok("stamp injects the script once", /stamped0\.includes\("rfu-soft"\)/.test(src));
const m = src.match(/const SOFT_SCRIPT = `(<script>[\s\S]*?<\/script>)`;/); ok("script found", !!m);
const script = m[1];
let hits = 0, mode = "ok";
const srv = http.createServer((q, r) => {
  hits++; const sr = /_sr=1/.test(q.url);
  if (mode === "dead" && sr) { r.writeHead(500); r.end("no"); return; }
  r.writeHead(200, { "content-type": "text/html" });
  r.end(`<!doctype html><body style="background:#123"><h1 id="v">${sr ? "NEW" : "OLD"}</h1>${mode === "dead" || mode === "ok" ? script : script}</body>`);
}).listen(0);
const port = srv.address().port, base = `http://127.0.0.1:${port}/?team=1`;
const b = await chromium.launch();
// big screen: crossfade
let p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(base); await p.waitForLoadState("load");
const nav0 = await p.evaluate(() => performance.getEntriesByType("navigation").length);
await p.waitForTimeout(4000);
await p.evaluate(() => window.rfuSoft());
await p.waitForSelector("iframe", { state: "attached" });
const st = await p.$eval("iframe", f => ({ pos: getComputedStyle(f).position, src: f.src, op: getComputedStyle(f).opacity }));
ok("hidden frame starts transparent over the page", st.pos === "fixed" && /_sr=1/.test(st.src) && /team=1/.test(st.src));
await p.waitForFunction(() => { const f = document.querySelector("iframe"); return f && f.style.opacity === "1" }, null, { timeout: 8000 });
ok("fades in once the new page reports ready", true);
await p.waitForTimeout(1800);
const txt = await p.frames().find(f => f !== p.mainFrame()).evaluate(() => document.getElementById("v").textContent);
ok("the frame shows the new page", txt === "NEW");
ok("no reload happened", (await p.evaluate(() => performance.getEntriesByType("navigation").length)) === nav0 && await p.evaluate(() => document.getElementById("v").textContent) === "OLD");
// second refresh too soon is ignored (interval guard), first call set the gap
await p.evaluate(() => window.rfuSoft()); await p.waitForTimeout(300);
ok("a second call straight away is ignored", (await p.$$("iframe")).length === 1);
// a child never starts its own refresh
const childHas = await p.frames().find(f => f !== p.mainFrame()).evaluate(() => { window.rfuSoft(); return document.querySelectorAll("iframe").length });
ok("the hidden copy never nests another", childHas === 0);
await p.close();
// phone: ordinary reload
p = await b.newPage({ viewport: { width: 390, height: 800 } });
await p.goto(base); await p.waitForLoadState("load");
const before = hits;
await Promise.all([p.waitForNavigation(), p.evaluate(() => window.rfuSoft())]);
ok("phone width uses a plain reload", hits > before && (await p.$$("iframe")).length === 0);
await p.close();
// failure: old page stays, frame removed
mode = "dead";
p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.clock.install(); await p.goto(base); await p.waitForLoadState("load");
await p.evaluate(() => window.rfuSoft());
await p.clock.fastForward(21000);
await p.waitForTimeout(200);
ok("a failed refresh removes the frame and leaves the page", (await p.$$("iframe")).length === 0 && await p.evaluate(() => document.getElementById("v").textContent) === "OLD");
await b.close(); srv.close();
console.log(`${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0);
