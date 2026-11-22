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
// v3.56.0 win bonus and games list
const wl = (n, w, l) => { const gs = [], opp = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W']; for (let i = 0; i < 8; i++) { const win = i < n; gs.push({ h: 'X', a: opp[i], hs: win ? 24 : 18, as: win ? 18 : 24, w: 1, hn: 'Xs', an: 'Opp' + opp[i], ts: t0 + i * 7 * D }); gs.push({ h: 'Z', a: opp[i], hs: 21, as: 20, w: 1, hn: 'Zs', an: 'Opp' + opp[i], ts: t0 + i * 7 * D }); } return gs; };
const steady = winModel(wl(7), 'X', 'Z'), flat = winModel(wl(7), 'X', 'Z', { winBonus: 0 });
c('a side that wins 7 of 8 is rated above a side that scrapes by (win bonus)', steady.rHome > flat.rHome && steady.rHome > steady.rAway);
c('win bonus can be switched off in config', Math.abs(winModel(wl(7), 'X', 'Z', { winBonus: 0 }).rHome - flat.rHome) < 1e-9);
const rows = steady.gameRows('X');
c('games list has every game for the side, newest first', rows.length === 8 && rows[0].ts > rows[7].ts);
c('games list rows carry score, counted margin and weight', rows.every(r => typeof r.f === 'number' && typeof r.c === 'number' && r.w > 0) && rows.some(r => r.c === 12) && rows.some(r => r.c === -12));
c('names are never the word undefined', rows.every(r => !/undefined/.test(r.o) && r.o.length > 0));
const html = __w.winBarHtml({ home: { name: 'Xs', pct: 60 }, away: { name: 'Zs', pct: 40 }, gap: 1, ha: 4, rh: 3, ra: 1, mu: 5, sg: 14, raw: 60, n: 8, gc: { h: rows, a: steady.gameRows('Z') } }, { open: true });
c('panel shows the Games counted list', /Games counted/.test(html) && /Opp[PQ]/.test(html));
// v3.56.1 history can not outweigh this season
{ const gs = []; const opp = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'];
  for (let i = 0; i < 8; i++) { gs.push({ h: 'X', a: opp[i], hs: 38, as: 20, w: 1, ts: t0 + i * 7 * D }); gs.push({ h: 'Z', a: opp[i], hs: 24, as: 20, w: 1, ts: t0 + i * 7 * D }); }
  const old = []; for (let i = 0; i < 40; i++) old.push({ h: 'X', a: opp[i % 8], hs: i % 2 ? 27 : 33, as: 30, w: 0.5, ts: t0 - (i + 1) * 7 * D });
  const withOld = winModel([...gs, ...old], 'X', 'Z'), none = winModel(gs, 'X', 'Z');
  c('forty ordinary old games do not bury a side that is winning now', withOld.rHome > withOld.rAway);
  c('old games still count a little (rating a bit lower than without them)', withOld.rHome < none.rHome);
  const rowsOld = withOld.gameRows('X').filter(r => !r.cur);
  c('old game weights shown are the reduced ones', rowsOld.length > 0 && rowsOld.every(r => r.w < 0.2)); }
console.log(ok + ' passed, ' + bad + ' failed');
