const { __w } = await import(process.argv[2]); const { winModel } = __w;
let ok = 0, bad = 0; const c = (n, v) => { if (v) ok++; else { bad++; console.log('FAIL ' + n); } };
const D = 86400000, t0 = Date.UTC(2026, 8, 1);
// four sides, everyone plays everyone twice; A has two giant wins, otherwise level
function league(bigMargin) {
  const ids = ['A', 'B', 'C', 'D'], gs = []; let d = 0;
  for (const h of ids) for (const a of ids) if (h !== a) {
    let hs = 20, as = 20; if (h === 'A' && a === 'C') { hs = 20 + bigMargin; } if (h === 'A' && a === 'D') { hs = 20 + bigMargin; } if (h === 'B' && a === 'A') { hs = 25; as = 20; } if (a === 'A' && h === 'C') { hs = 25; }
    gs.push({ h, a, hs, as, w: 1, ts: t0 + (d++) * 7 * D });
  }
  return gs;
}
const m50 = winModel(league(50), 'A', 'B'), m30 = winModel(league(30), 'A', 'B'), m10 = winModel(league(10), 'A', 'B');
c('margins over 30 count as 30', Math.abs(m50.rHome - m30.rHome) < 1e-9 && Math.abs(m50.mu - m30.mu) < 1e-9);
c('margins under the cap still count', m10.rHome < m30.rHome);
c('cap can be changed in config', winModel(league(50), 'A', 'B', { marginCap: 100 }).rHome > m30.rHome);
// form: X wins early and loses late, Y the reverse; same margins, same opponents
function form() {
  const gs = [], opp = ['P', 'Q', 'R', 'S'];
  for (let i = 0; i < 4; i++) { const early = i < 2, ts = t0 + i * 14 * D;
    gs.push({ h: 'X', a: opp[i], hs: early ? 30 : 10, as: 20, w: 1, ts });   // X wins early, loses late
    gs.push({ h: 'Y', a: opp[i], hs: early ? 10 : 30, as: 20, w: 1, ts }); } // Y the reverse
  return gs;
}
const f = winModel(form(), 'X', 'Y');
c('a side in poor late form is rated below one in good form (equal results otherwise)', f && f.rHome < f.rAway);
const nots = winModel(form().map(g => ({ ...g, ts: undefined })), 'X', 'Y');
c('without dates every game counts the same (old behaviour)', nots && Math.abs(nots.rHome - nots.rAway) < 1e-6);
console.log(ok + ' passed, ' + bad + ' failed');
