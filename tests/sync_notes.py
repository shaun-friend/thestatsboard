import re,sys
w='../site/_worker.js'; r='../site/README.txt'
s=open(w).read(); t=open(r).read()
esc=t.replace('\\','\\\\').replace('`','\\`').replace('${','\\${')
a=s.index('// <RELEASE_NOTES_START>')+len('// <RELEASE_NOTES_START>\n'); b=s.index('// <RELEASE_NOTES_END>')
s=s[:a]+'const RELEASE_NOTES = `'+esc+'`;\n'+s[b:]
open(w,'w').write(s); print('synced',len(t),'bytes')
