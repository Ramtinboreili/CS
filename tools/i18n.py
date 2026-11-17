#!/usr/bin/env python3
"""Widget/lib string localization helper.
  python3 tools/i18n.py extract src/parts/p05_wA.js          -> numbered list of Persian string literals
  python3 tools/i18n.py apply   src/parts/p05_wA.js map.json -> wraps each literal as t2(<fa>,<en>)
map.json: {"<index from extract>": "<english text>"}; template literals must keep the same ${...} placeholders."""
import re,sys,json
FA=r'[؀-ۿ]'
PAT=re.compile(r"""'((?:[^'\\\n]|\\.)*?%s(?:[^'\\\n]|\\.)*?)'|`((?:[^`\\]|\\.)*?%s(?:[^`\\]|\\.)*?)`|"((?:[^"\\\n]|\\.)*?%s(?:[^"\\\n]|\\.)*?)\"""" % (FA,FA,FA))
def lits(src):
    out=[]
    for m in PAT.finditer(src):
        q,t=("'",m.group(1)) if m.group(1) is not None else (("`",m.group(2)) if m.group(2) is not None else ('"',m.group(3)))
        out.append((m.start(),m.end(),q,t))
    return out
if sys.argv[1]=='extract':
    src=open(sys.argv[2],encoding='utf-8').read();seen=set()
    for s,e,q,t in lits(src):
        if t in seen: continue
        seen.add(t);print(len(seen)-1,q,t)
elif sys.argv[1]=='apply':
    p=sys.argv[2];src=open(p,encoding='utf-8').read();raw=json.load(open(sys.argv[3],encoding='utf-8'))
    order=[];seen=set()
    for s_,e_,q_,t_ in lits(src):
        if t_ not in seen: seen.add(t_);order.append(t_)
    mp={order[int(k)]:v for k,v in raw.items()}
    miss=[];out=[];last=0;n=0
    for s,e,q,t in lits(src):
        en=mp.get(t)
        if en is None: miss.append(t);continue
        if q=='`':
            a=sorted(re.findall(r'\$\{[^}]*\}',t));b=sorted(re.findall(r'\$\{[^}]*\}',en))
            if a!=b: print('PLACEHOLDER MISMATCH:',t[:60]);continue
            enx=en.replace('`','\\`')
        elif q=="'": enx=en.replace('\\','\\\\').replace("'","\\'") if '\\' not in en else en.replace("'","\\'")
        else: enx=en.replace('"','\\"')
        out.append(src[last:s]);out.append('t2(%s%s%s,%s%s%s)'%(q,t,q,q,enx,q));last=e;n+=1
    out.append(src[last:]);open(p,'w',encoding='utf-8').write(''.join(out))
    print('wrapped',n,'missing',len(miss));[print('  MISSING:',m[:70]) for m in miss[:10]]
