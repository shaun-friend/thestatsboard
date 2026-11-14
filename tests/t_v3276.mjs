// v3.27.6: the Match Stats page hides until its text is fitted, then fades in; phones are untouched
import fs from "fs";
const src = fs.readFileSync(new URL("../site/_worker.js", import.meta.url), "utf8");
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log("FAIL", n)); };
ok("body starts hidden on big screens only", /@media \(min-width:801px\) and \(min-height:561px\)\{body\.fitwait\{opacity:0\}/.test(src));
ok("body carries fitwait", /fitwait">\$\{themeBoot/.test(src));
ok("settles after load and by a safety timer", /settle\(\)\},600\)/.test(src) && /setTimeout\(function\(\)\{fit\(\);settle\(\)\},2500\)/.test(src));
ok("settle removes the hiding class", /classList\.remove\("fitwait"\)/.test(src));
console.log(`${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0);
