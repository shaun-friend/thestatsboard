const { chromium } = require("playwright"); const fs = require("fs");
const html = fs.readFileSync(__dirname + "/w/ms.html", "utf8");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +(process.argv[2]||1920), height: +(process.argv[3]||1080) } });
  const delays = { "9003": +(process.argv[4]||1500), "55001": +(process.argv[5]||300) };
  await p.route("**/*", async r => {
    const u = r.request().url();
    if (u.includes("/api/crest")) { const id = /id=(\d+)/.exec(u)[1]; await new Promise(k => setTimeout(k, delays[id] || 200)); return r.fulfill({ status: 200, contentType: "image/png", body: png }); }
    if (u === "http://x.test/") return r.fulfill({ status: 200, contentType: "text/html", body: html });
    return r.fulfill({ status: 404, body: "" });
  });
  await p.goto("http://x.test/", { waitUntil: "commit" });
  const t0 = Date.now(), rows = []; let prev = "";
  while (Date.now() - t0 < 7000) {
    const s = await p.evaluate(() => { const b = document.body; if (!b) return "nobody"; const bars = document.querySelector(".bars"); return [getComputedStyle(document.documentElement).fontSize, getComputedStyle(b).opacity, b.className.includes("fitwait") ? "wait" : "", bars ? Math.round(bars.getBoundingClientRect().height) : "-", document.querySelector(".hd") ? Math.round(document.querySelector(".hd").getBoundingClientRect().height) : "-"].join(" | ") }).catch(() => "nav");
    if (s !== prev) { rows.push((Date.now() - t0) + "ms  " + s); prev = s }
    await p.waitForTimeout(50);
  }
  const shown = rows.findIndex(r => !/\| 0 \|/.test(r) && !/\| wait/.test(r)); const after = rows.slice(shown).map(r => r.split("|")[0].replace(/^\d+ms\s+/, "").trim());
  const stable = shown >= 0 && new Set(after).size === 1; if (process.argv[6] === "assert") { console.log(stable ? "STABLE: text size never changes once the page is showing" : "UNSTABLE: " + JSON.stringify(after)); process.exitCode = stable ? 0 : 1 }
  console.log("t  fontSize | opacity | wait | barsH | headH"); console.log(rows.join("\n")); await b.close();
})();
