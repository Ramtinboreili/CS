#!/usr/bin/env python3
"""Dump every lesson (fully evaluated: widgets/callouts/tables expanded) as JSON via headless Firefox.
usage: python3 tests/dump_lessons.py /tmp/lessons_fa.json"""
import http.server,threading,subprocess,json,os,sys,time,pathlib,shutil
root=pathlib.Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
inj="""<script>(async()=>{const o=LESSONS.map(l=>({id:l.id,mod:l.mod,pre:l.pre,obj:l.obj,body:l.body,mis:l.mis||[],ex:l.ex,sum:l.sum}));
await fetch('/result',{method:'POST',body:JSON.stringify(o)})})();</script></body>"""
page=html.replace('</body>',inj)
out={}
class H(http.server.BaseHTTPRequestHandler):
    def log_message(s,*a):pass
    def do_GET(s):
        s.send_response(200);s.send_header('Content-Type','text/html; charset=utf-8');s.end_headers();s.wfile.write(page.encode())
    def do_POST(s):
        n=int(s.headers.get('Content-Length',0));out['d']=json.loads(s.rfile.read(n));s.send_response(200);s.end_headers()
srv=http.server.HTTPServer(('127.0.0.1',0),H);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
prof=pathlib.Path.home()/'snap/firefox/common/cs-dump-profile';shutil.rmtree(prof,ignore_errors=True);prof.mkdir(parents=True)
p=subprocess.Popen(['firefox','--headless','--no-remote','--profile',str(prof),f'http://127.0.0.1:{port}/?lang=fa'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True)
t0=time.time()
while time.time()-t0<120 and 'd' not in out:time.sleep(0.5)
try:os.killpg(p.pid,15)
except Exception:pass
time.sleep(1);shutil.rmtree(prof,ignore_errors=True)
if 'd' not in out:print('timeout');sys.exit(2)
json.dump(out['d'],open(sys.argv[1],'w',encoding='utf-8'),ensure_ascii=False)
print('lessons',len(out['d']))
