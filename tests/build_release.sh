#!/usr/bin/env bash
# One command for a release: sync notes, run the release check, run every suite, then zip. Stops at the first failure.
# Usage: bash build_release.sh <zip-name>   e.g. RFU_Club_Dashboard_v3.14_buttons.zip
set -e
Z="$1"; [ -n "$Z" ] || { echo "give the zip name"; exit 2; }
S="$(cd "$(dirname "$0")" && pwd)"; cd "$S"
mkdir -p w brand
python3 sync_notes.py | tail -1
python3 check_release.py ../site "$Z"
cp ../site/_worker.js t_worker.mjs; node --check t_worker.mjs
cp t_worker.mjs t_worker_exp.mjs; echo 'export const __t = { shortComp, weatherFor, pageTtlFor, pageKeySearch, KNOWN_PARAMS, cachedText, memCache, blockedMem, refreshing, ttlFor, setCtx(c){SITE_CTX=c}, setEnv(e){SITE_ENV=e} };' >> t_worker_exp.mjs
echo 'export const __w = { winModel, winPercents, winBacktest, normCdf };' >> t_worker_exp.mjs
run(){ o=$("$@" | tail -1); echo "$o"; if echo "$o" | grep -qE '[1-9][0-9]* fail'; then echo "TESTS FAILED"; exit 1; fi; }
for t in t_v310.mjs t_v36.mjs t_v35.mjs; do run node $t "$S/t_worker.mjs"; done
run node t_v313.mjs "$S/t_worker_exp.mjs"
run node t_v314.mjs "$S/t_worker_exp.mjs"
run node t_v315.mjs "$S/t_worker.mjs"
run bash t_v37.sh
run node t_v3155.mjs "$S/t_worker.mjs"
run node t_v316.mjs "$S/t_worker.mjs"
run node t_v3161.mjs "$S/t_worker.mjs"
run node t_v3162.mjs "$S/t_worker.mjs"
run node t_v317.mjs "$S/t_worker.mjs"
run node t_v318.mjs "$S/t_worker.mjs"
run node t_v319.mjs "$S/t_worker.mjs"
run node t_v320.mjs "$S/t_worker.mjs"
run node t_v3201.mjs "$S/t_worker_exp.mjs"
run node t_v321.mjs "$S/t_worker.mjs"
run node t_v322.mjs "$S/t_worker_exp.mjs"
run node t_v3221.mjs "$S/t_worker_exp.mjs"
run node t_v324.mjs "$S/t_worker_exp.mjs"
run node t_v325.mjs "$S/t_worker_exp.mjs"
run node t_v3251.mjs "$S/t_worker_exp.mjs"
run node t_v3276.mjs
run node t_v3283.mjs
run node t_v329.mjs "$S/t_worker.mjs"
run node t_v330m.mjs "$S/t_worker_exp.mjs"
run node t_v330.mjs "$S/t_worker.mjs"
run node t_v3305.mjs "$S/t_worker.mjs"
run node t_v3306.mjs "$S/t_worker.mjs"
run node t_v3307.mjs "$S/t_worker.mjs"
run node t_v33011.mjs "$S/t_worker.mjs"
run node t_v33013.mjs "$S/t_worker.mjs"
run node t_v3309.mjs "$S/t_worker.mjs"
NODE_PATH=$(npm root -g) node t_v328.mjs || { echo "CROSSFADE TEST FAILED"; exit 1; }
node x_ms_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node x_ms_timeline.cjs 1920 1080 1500 300 assert | head -1 | grep -q "^STABLE" || { echo "MATCH STATS SIZE JUMP TEST FAILED"; exit 1; }; echo "match stats size stable"
node x_usage_chk.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node x_usage_align.cjs | tail -1 | grep -q "ALL OK" || { echo "USAGE CHART ALIGNMENT TEST FAILED"; exit 1; }; echo "usage chart aligned"
node x_usage_chk.mjs "$S/t_worker.mjs" >/dev/null && NODE_PATH=$(npm root -g) node x_usage_chk.cjs | tail -1 | grep -q "ALL OK" || { echo "USAGE PAGE BROWSER TEST FAILED"; exit 1; }; echo "usage page renders ok"
node dir_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node dir_check.cjs 2>/dev/null | tail -1 | grep -q "ALL OK" || { echo "DIRECTIONS BUTTON TEST FAILED"; exit 1; }; echo "directions button ok"
node brand/shot.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node wel_check.cjs | tail -1 | grep -q "ALL OK" || { echo "WELCOME HEIGHT TEST FAILED"; exit 1; }; echo "welcome height ok"
node dir_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node gap_check.cjs | tail -1 | grep -q "ALL OK" || { echo "MATCH STATS FOOTER GAP TEST FAILED"; exit 1; }; echo "match stats footer gap ok"
node foot_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node foot_check.cjs | tail -1 | grep -q "ALL OK" || { echo "FOOTER OVERLAP TEST FAILED"; exit 1; }; echo "footer overlap ok"
node x_ly_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node x_ly_check.cjs | tail -1 | grep -q "ALL OK" || { echo "MATCH CENTRE LAYOUT TEST FAILED"; exit 1; }; echo "match centre layouts ok"
node x_admin_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node x_admin_check.cjs | tail -1 | grep -q "ALL OK" || { echo "ADMIN PAGE TEST FAILED"; exit 1; }; echo "admin page ok"
node x_wc_render.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node x_wc_shot.cjs | tail -1 | grep -q "ALL OK" || { echo "WIN CHANCE PAGE TEST FAILED"; exit 1; }; echo "win chance pages ok"
node foot_render2.mjs "$S/t_worker.mjs" >/dev/null 2>&1; NODE_PATH=$(npm root -g) node foot_check2.cjs | tail -1 | grep -q "ALL OK" || { echo "MATCH CENTRE FOOTER TEST FAILED"; exit 1; }; echo "match centre footer ok"
NODE_PATH=$(npm root -g) node x_shell.cjs | tail -1 | grep -q "ALL OK" || { echo "APP SHELL BUTTON TEST FAILED"; exit 1; }; echo "app shell buttons ok"
node t_v310.mjs "$S/t_worker.mjs" | grep -q "0 fail" || { echo "counting tests failed"; exit 1; }
mkdir -p ../dist && (cd ../site && rm -f "../dist/$Z" && zip -q "../dist/$Z" _worker.js README.txt index.html) && echo "BUILT dist/$Z"
