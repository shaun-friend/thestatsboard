// v3.28.3: Usage "Teams people look up" merges rows by team number
import fs from "fs";
const src = fs.readFileSync(new URL("../site/_worker.js", import.meta.url), "utf8");
const m = src.match(/function mergeTeamRows\(rows\) \{[\s\S]*?\n\}\n/); let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log("FAIL", n)); };
ok("function found", !!m);
const f = new Function(m[0] + "; return mergeTeamRows;")();
const out = f([
  { team: "11039", name: "Ivybridge", comp: "1699", div: "75791", n: "29", own: "1" },
  { team: "11039", name: "Ivybridge 1XV", comp: "1699", div: "75791", n: "8", own: "0" },
  { team: "999", name: "Exeter Chiefs", comp: "1", div: "2", n: "5", own: "0" },
  { team: "888", name: "Ivybridge", comp: "1699", div: "75791", n: "3", own: "0" }]);
ok("one row per team number", out.length === 3);
ok("counts add up", out[0].team === "11039" && out[0].n === 37);
ok("ours if any record says so", out[0].own === "1");
ok("most-used name wins", out[0].name === "Ivybridge");
ok("a different team number with the same name stays separate", out.some(r => r.team === "888"));
ok("sorted by count", out[0].n >= out[1].n && out[1].n >= out[2].n);
ok("api uses the merge and the card shows the number", /others: await nameTeamRows\(mergeTeamRows\(others\), W\)/.test(src) && /&middot; no\. /.test(src));
console.log(`${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0);
