#!/bin/bash
# v3.7 cup Match Stats: runs the three scenarios (league next, cup next, cup first round)
cd "$(dirname "$0")"; for sc in league cup first; do SC=$sc node x_cup.mjs "$PWD/t_worker.mjs" 2>&1 | grep -E "PASS|FAIL|pass,"; done
