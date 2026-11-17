#!/usr/bin/env python3
"""Syntax-check the JS of index.html with gjs, cumulatively per part, to locate errors. Usage: python3 tools_check.py"""
import json,subprocess,pathlib,re,sys
root=pathlib.Path(__file__).parent
order=re.search(r'ORDER="([^"]+)"',(root/'build.py').read_text()).group(1).split()
acc=''
head=(root/'src/parts/p01_head.html').read_text(encoding='utf-8')
acc=''
for n in order[1:-1]:
    acc+=(root/'src/parts'/n).read_text(encoding='utf-8')
    js="try{new Function(%s);print('ok')}catch(e){print('ERR '+e)}"%json.dumps(acc)
    p=pathlib.Path('/tmp/_chk.js');p.write_text(js)
    r=subprocess.run(['gjs',str(p)],capture_output=True,text=True).stdout.strip()
    if r!='ok':
        print('FAIL after',n,r);sys.exit(1)
print('SYNTAX OK',len(acc),'bytes of JS')
