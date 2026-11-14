#!/usr/bin/env python3
"""Release check: fails (exit 1) if the version, build date, changelog, What's new and README release table disagree.
Usage: python3 check_release.py [site folder] [expected-zip-name]"""
import re, sys, datetime, zoneinfo
d = sys.argv[1] if len(sys.argv) > 1 else "../site"
zipname = sys.argv[2] if len(sys.argv) > 2 else ""
w = open(d + "/_worker.js", encoding="utf-8").read()
r = open(d + "/README.txt", encoding="utf-8").read()
errs = []
v = re.search(r'^const VERSION = "([^"]+)";', w, re.M); bd = re.search(r'^const BUILD_DATE = "([^"]+)";', w, re.M)
if not v or not bd: sys.exit("FAIL: cannot find VERSION or BUILD_DATE in _worker.js")
v, bd = v.group(1), bd.group(1)
today = datetime.datetime.now(zoneinfo.ZoneInfo("Europe/London")).strftime("%d-%b-%Y")
import os
if bd != today and not os.environ.get("SKIP_DATE_CHECK"): errs.append(f"BUILD_DATE is {bd} but today (UK) is {today}")
if not re.search(r'^//\s+' + re.escape(v) + r'\s+' + re.escape(bd), w, re.M):
    errs.append(f"header changelog has no line starting '// {v}  {bd}'")
if not re.search(r'\["' + re.escape(v) + r'",', w): errs.append(f"no What's new entry for {v}")
row = re.search(r'^' + re.escape(v) + r'\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|', r, re.M)
if not row: errs.append(f"README release table has no row for {v}")
else:
    if row.group(1) != bd: errs.append(f"README release row date is {row.group(1)}, code says {bd}")
    if zipname and row.group(2) != zipname: errs.append(f"README zip name is {row.group(2)}, building {zipname}")
if not re.search(r'^' + re.escape(v) + r' - ', r, re.M): errs.append(f"README has no entry headed '{v} - ...'")
if re.search(r'^\s*[-*]?\s*[A-Za-z]*\s*$', "") : pass
# documentation rule (v3.27.1): the README entry must say which Documentation sections it updated, or why none
ent = re.search(r'^' + re.escape(v) + r' - .*\n((?:(?!^v\d).*\n)*)', r, re.M)
if ent:
    dl = re.search(r'^- Docs:\s*(.+)$', ent.group(1), re.M)
    if not dl: errs.append(f"README entry for {v} has no '- Docs:' line (name the Documentation sections updated, or '- Docs: none - <reason>')")
    elif re.match(r'none\b', dl.group(1), re.I):
        if not re.match(r'none\s*[-:\u2013]\s*\S.{7,}', dl.group(1), re.I): errs.append("'Docs: none' needs a reason, e.g. '- Docs: none - behind-the-scenes fix'")
    else:
        titles = [m.group(1).lower() for m in re.finditer(r'\{ id: "[a-z]+", title: "([^"]+)"', w)]
        for n in [q.strip().lower() for q in dl.group(1).split(",") if q.strip()]:
            if n not in titles: errs.append(f"Docs line names '{n}', which is not a Documentation section")
top = re.findall(r'^(v\d+(?:\.\d+)+)\s*\|', r, re.M)
if top and top[0] != v: errs.append(f"newest README release row is {top[0]} but code is {v}")
# the release table must run newest first: dates never go up as you read down
prev = None
for m in re.finditer(r'^(v\d[\w.]*)\s*\|\s*(\d{2}-[A-Za-z]{3}-\d{4})\s*\|', r, re.M):
    dt = datetime.datetime.strptime(m.group(2), "%d-%b-%Y")
    if prev and dt > prev[1]: errs.append(f"release table out of order: {m.group(1)} ({m.group(2)}) is below {prev[0]} ({prev[1].strftime('%d-%b-%Y')})")
    prev = (m.group(1), dt)
if errs:
    print("RELEASE CHECK FAILED for " + v); [print("  - " + e) for e in errs]; sys.exit(1)
print(f"Release check OK: {v}, {bd}")
