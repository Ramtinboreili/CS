#!/usr/bin/env python3
"""Lesson translation pipeline.
  python3 tools/lessons_i18n.py units /tmp/lessons_fa.json [ids...]   -> prints translatable prose units (key | text)
  python3 tools/lessons_i18n.py build /tmp/lessons_fa.json trans/*.json out.js -> writes addEN(...) overlay JS
Translation files (i18n/*.txt) use blocks: a line '@@ <lessonId>|<unitKey>' followed by the English text (verbatim, any lines).
Prose units keep inline tags and $math$ literally; the translation must keep them (verified). Code/formulas/widget markup are untouched."""
import re,sys,json
FA=re.compile(r'[؀-ۿ]')
BLOCK=r'(?:p|li|ul|ol|h[1-6]|td|th|tr|table|thead|tbody|div|br|hr|section|pre|blockquote)'
TAG=re.compile(r'<[^>]+>')
MATH=re.compile(r'\$\$[\s\S]+?\$\$|\$[^$\n]+?\$')
ATTR=re.compile(r'''(data-t|title|placeholder|alt|aria-label)="([^"]*)"''')
def is_block(tag):
    m=re.match(r'</?\s*([a-zA-Z0-9]+)',tag);return bool(m and re.fullmatch(BLOCK,m.group(1).lower()))
def split_pre(s):
    parts=re.split(r'(<pre[\s\S]*?</pre>)',s);return parts
def seg(s):
    """-> list of (kind,text): kind 'R' raw or 'T' translatable"""
    out=[]
    for i,part in enumerate(split_pre(s)):
        if i%2:  # pre block: translate persian comments only
            last=0
            for m in re.finditer(r'((?://|#|--)\s?)([^\n<]*[؀-ۿ][^\n<]*)',part):
                out.append(('R',part[last:m.start(2)]));out.append(('T',m.group(2)));last=m.end(2)
            out.append(('R',part[last:]));continue
        pos=0;buf=''
        def flush():
            nonlocal buf
            if buf:
                out.append(('T',buf) if FA.search(MATH.sub('',buf)) or FA.search(buf) else ('R',buf));buf=''
        # tokenise: tags, math, text
        tok=re.compile(r'<[^>]+>|\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|[^<$]+|[<$]')
        for m in tok.finditer(part):
            t=m.group(0)
            if t.startswith('<') and t.endswith('>') and len(t)>2:
                if is_block(t):
                    flush()
                    # attributes with persian text
                    last=0;raw=''
                    for a in ATTR.finditer(t):
                        if FA.search(a.group(2)):
                            out.append(('R',t[last:a.start(2)]));out.append(('T',a.group(2)));last=a.end(2)
                    out.append(('R',t[last:]))
                else: buf+=t
            else: buf+=t
        flush()
    # merge adjacent raws
    merged=[]
    for k,t in out:
        if merged and merged[-1][0]=='R' and k=='R': merged[-1]=('R',merged[-1][1]+t)
        else: merged.append((k,t))
    return merged
def fields(l):
    """yield (key,string) for every string field of a lesson record"""
    yield 'body',l['body']
    for i,x in enumerate(l['obj']): yield 'obj:%d'%i,x
    for i,x in enumerate(l['pre']):
        if FA.search(x): yield 'pre:%d'%i,x
    for i,x in enumerate(l['mis']): yield 'mis:%d'%i,x
    for i,x in enumerate(l['sum']): yield 'sum:%d'%i,x
    for i,e in enumerate(l['ex']):
        for f in ('q','e','hint','init','a'):
            if isinstance(e.get(f),str) and FA.search(e[f]) and not (f=='a' and e['t'] in('num',)):
                yield 'ex:%d:%s'%(i,f),e[f]
        if e.get('o'):
            for j,o in enumerate(e['o']):
                if FA.search(o): yield 'ex:%d:o:%d'%(i,j),o
def units(l):
    res=[]
    for key,s in fields(l):
        n=0
        for k,t in seg(s):
            if k=='T': res.append(('%s#%d'%(key,n),t));n+=1
    return res
def sig(t):
    return sorted(m for m in MATH.findall(t) if not FA.search(m))+sorted(TAG.findall(MATH.sub('',t)))
def sig_ok(src,en):
    a=[m for m in MATH.findall(src) if not FA.search(m)];b=MATH.findall(en)
    for m in a:
        if m in b: b.remove(m)
        else: return False
    return sorted(TAG.findall(MATH.sub('',src)))==sorted(TAG.findall(MATH.sub('',en)))
if __name__=='__main__':
    cmd=sys.argv[1];data=json.load(open(sys.argv[2],encoding='utf-8'))
    if cmd=='units':
        want=set(sys.argv[3:]);tot=0;cnt=0
        for l in data:
            if want and l['id'] not in want: continue
            for k,t in units(l): print('@@ %s|%s\n%s'%(l['id'],k,t));tot+=len(t);cnt+=1
        print('# units',cnt,'chars',tot,file=sys.stderr)
    elif cmd=='build':
        tr={}
        import glob
        for f in sys.argv[3:-1]:
            for p in glob.glob(f):
                cur=None;buf=[]
                def put():
                    if cur: lid,key=cur.split('|',1);tr.setdefault(lid,{})[key]='\n'.join(buf).strip('\n') if False else '\n'.join(buf)
                for line in open(p,encoding='utf-8').read().split('\n'):
                    if line.startswith('@@ '):
                        put();cur=line[3:].strip();buf=[]
                    else: buf.append(line)
                put()
        out=[];bad=0
        for l in data:
            if l['id'] not in tr: continue
            m=tr[l['id']];ov={}
            def rebuild(key,s):
                global bad
                n=0;res=''
                for k,t in seg(s):
                    if k=='T':
                        en=m.get('%s#%d'%(key,n));n+=1
                        if en is None: print('MISSING',l['id'],key,n-1);bad+=1;res+=t
                        else:
                            if not sig_ok(t,en): print('SIG MISMATCH',l['id'],key,n-1,'| missing in en:',[m for m in sig(t) if m not in sig(en)],'| extra in en:',[m for m in sig(en) if m not in sig(t)]);bad+=1
                            if FA.search(en): print('PERSIAN LEFT',l['id'],key,n-1,en[:50]);bad+=1
                            res+=en
                    else: res+=t
                return res
            ov['body']=rebuild('body',l['body'])
            ov['obj']=[rebuild('obj:%d'%i,x) for i,x in enumerate(l['obj'])]
            if any(FA.search(x) for x in l['pre']): ov['pre']=[rebuild('pre:%d'%i,x) if FA.search(x) else x for i,x in enumerate(l['pre'])]
            ov['mis']=[rebuild('mis:%d'%i,x) for i,x in enumerate(l['mis'])]
            ov['sum']=[rebuild('sum:%d'%i,x) for i,x in enumerate(l['sum'])]
            ex=[]
            for i,e in enumerate(l['ex']):
                o={}
                for f in ('q','e','hint','init','a'):
                    if isinstance(e.get(f),str) and FA.search(e[f]) and not (f=='a' and e['t']=='num'): o[f]=rebuild('ex:%d:%s'%(i,f),e[f])
                if e.get('o'): o['o']=[rebuild('ex:%d:o:%d'%(i,j),x) if FA.search(x) else x for j,x in enumerate(e['o'])]
                if e['t']!='think': o.pop('a',None)
                ex.append(o)
            ov['ex']=ex
            out.append("addEN(%s,%s);"%(json.dumps(l['id']),json.dumps(ov,ensure_ascii=False)))
        open(sys.argv[-1],'w',encoding='utf-8').write("/* GENERATED by tools/lessons_i18n.py from translations in i18n/*.json — do not edit by hand */\n"+"\n".join(out)+"\n")
        print('wrote',len(out),'lessons; problems:',bad)
