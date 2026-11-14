const { chromium } = require("playwright"); const fs = require("fs");
const html = fs.readFileSync(__dirname + "/w/ms.html", "utf8");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.route("**/*", r => { const u = r.request().url(); if (u.includes("/api/crest")) return r.fulfill({ status: 200, contentType: "image/png", body: png }); if (u === "http://x.test/") return r.fulfill({ status: 200, contentType: "text/html", body: html }); return r.fulfill({ status: 404, body: "" }) });
  await p.goto("http://x.test/"); await p.waitForTimeout(4500);
  const out = await p.evaluate(() => { const H = document.documentElement, B = document.body, bars = document.querySelector(".bars"); const rs = [];
    for (let fs = 17; fs <= 21.01; fs += .25) { H.style.fontSize = fs + "px"; const k = bars.children.length; let sum = 0; for (let i = 0; i < k; i++) sum += bars.children[i].getBoundingClientRect().height;
      const f = parseFloat(getComputedStyle(H).fontSize); rs.push([fs.toFixed(2), "bodySH", B.scrollHeight, "bodyCH", B.clientHeight, "barsSH", bars.scrollHeight, "barsCH", bars.clientHeight, "need", Math.round(sum + k * .45 * f), "over", (B.scrollHeight > B.clientHeight + 1) || bars.scrollHeight > bars.clientHeight + 1 || sum + k * .45 * f > bars.clientHeight].join(" ")) } return rs.join("\n") });
  console.log(out); await b.close();
})();
