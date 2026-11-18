"""Create a tag and GitHub Release for every version that has both a README entry and a commit.
Run by the 'Backfill releases' workflow (manual). Skips versions that already have a release."""
import re, subprocess, sys

DRY = "--dry" in sys.argv
readme = open("site/README.txt", encoding="utf-8").read().splitlines()

# README release table: "v3.39.7 | 18-Nov-2026 | zip | previous"
dates = {}
for l in readme:
    m = re.match(r"^(v[0-9][^ ]*)\s*\|\s*([^|]+?)\s*\|", l)
    if m: dates[m.group(1)] = m.group(2)

# README notes: section starts with "vX - title"
notes, cur = {}, None
for l in readme:
    m = re.match(r"^(v[0-9]\S*) - ", l)
    if m: cur = m.group(1); notes[cur] = []; continue
    if cur and re.match(r"^(Earlier versions|[A-Z][A-Za-z ]+:?$)", l) and not l.startswith("-"): cur = None; continue
    if cur: notes[cur].append(l)

# commit per version: newest commit whose subject starts with the version (v3.39.7, "v3.20:" or "The Stats Board v3.18.3")
log = subprocess.run(["git","log","--format=%H\t%s"],capture_output=True,text=True,check=True).stdout.splitlines()
commit = {}
for l in log:
    h, s = l.split("\t",1)
    m = re.match(r"^(?:The Stats Board )?(v[0-9][0-9.]*[0-9])\b", s)
    if m and m.group(1) not in commit: commit[m.group(1)] = h

todo = [v for v in dates if v in commit and v in notes]
print(len(todo), "versions to release; skipped (no commit or no notes):", [v for v in dates if v not in todo])
existing = set(subprocess.run(["gh","release","list","--limit","500","--json","tagName","--jq",".[].tagName"],capture_output=True,text=True).stdout.split())
for v in reversed(todo):  # oldest first
    if v in existing: continue
    body = "\n".join(notes[v]).strip() or "See README.txt for the notes on this version."
    body = f"Released {dates[v]} (backfilled from the project history; the zip was not kept).\n\n{body}"
    print("release", v, commit[v][:7])
    if DRY: continue
    open("notes.md","w",encoding="utf-8").write(body)
    subprocess.run(["gh","release","create",v,"--target",commit[v],"--title",v,"--notes-file","notes.md","--latest=false"],check=True)
