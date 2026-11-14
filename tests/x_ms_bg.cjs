const { chromium } = require("playwright"); const fs = require("fs");
let html = fs.readFileSync(__dirname + "/w/ms.html", "utf8");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
(async () => { const b = await chromium.launch();
 for (const th of ["dark", "light"]) { const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const h = html.replace(/<body class="(dark|light)/, '<body class="' + th);
  await p.route("**/*", async r => { const u = r.request().url(); if (u.includes("/api/crest")) { await new Promise(k => setTimeout(k, 2500)); return r.fulfill({ status: 200, contentType: "image/png", body: png }) } if (u === "http://x.test/") return r.fulfill({ status: 200, contentType: "text/html", body: h }); return r.fulfill({ status: 404, body: "" }) });
  await p.goto("http://x.test/", { waitUntil: "commit" }); await p.waitForTimeout(900);
  const o = await p.evaluate(() => ({ op: getComputedStyle(document.body).opacity, bodyBg: getComputedStyle(document.body).backgroundColor, htmlBg: getComputedStyle(document.documentElement).backgroundColor }));
  await p.screenshot({ path: __dirname + "/w/bg_" + th + ".png" }); console.log(th, JSON.stringify(o)); await p.close() }
 await b.close() })();
