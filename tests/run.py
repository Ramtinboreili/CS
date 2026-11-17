#!/usr/bin/env python3
"""Headless-Firefox self-test. Usage: python3 tests/run.py   (uses a private profile under ~/snap/firefox/common; never kills other Firefox windows)"""
import http.server,threading,subprocess,json,os,sys,time,pathlib,shutil
root=pathlib.Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
test=(root/'tests/selftest.js').read_text(encoding='utf-8')
page=html.replace('</body>','<script>'+test+'</script></body>')
result={}
class H(http.server.BaseHTTPRequestHandler):
    def log_message(s,*a):pass
    def do_GET(s):
        s.send_response(200);s.send_header('Content-Type','text/html; charset=utf-8');s.end_headers();s.wfile.write(page.encode())
    def do_POST(s):
        n=int(s.headers.get('Content-Length',0));result.update(json.loads(s.rfile.read(n)));s.send_response(200);s.end_headers()
srv=http.server.HTTPServer(('127.0.0.1',0),H);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
prof=pathlib.Path.home()/'snap/firefox/common/cs-selftest-profile'
shutil.rmtree(prof,ignore_errors=True);prof.mkdir(parents=True)
p=subprocess.Popen(['firefox','--headless','--no-remote','--profile',str(prof),f'http://127.0.0.1:{port}/'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True)
t0=time.time()
while time.time()-t0<240 and not result.get('done'):time.sleep(0.5)
try:os.killpg(p.pid,15)
except Exception:pass
time.sleep(1);shutil.rmtree(prof,ignore_errors=True)
if not result:print('NO RESULT (timeout)');sys.exit(2)
r=result
print('lessons visited',r['lessons'],'labs visited',r['labs'])
for k in ('errors','widgetErr','schema','notes'):
    print(k,len(r[k]));[print('  ',x) for x in r[k][:40]]
print('untranslated (en):',len(r['untranslated']))
sys.exit(1 if (r['errors'] or r['widgetErr'] or r['schema'] or r['notes']) else 0)
