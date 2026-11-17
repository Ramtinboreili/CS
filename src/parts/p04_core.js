/* ===================== CORE UI ===================== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function h(tag,a,...kids){const e=document.createElement(tag);for(const k in a||{}){const v=a[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else e.setAttribute(k,v===true?'':v)}
 kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.append(c.nodeType?c:document.createTextNode(c))});return e}
const NS='http://www.w3.org/2000/svg';
function sv(tag,a,...kids){const e=document.createElementNS(NS,tag);for(const k in a||{}){if(a[k]==null)continue;if(k.startsWith('on'))e.addEventListener(k.slice(2),a[k]);else e.setAttribute(k,a[k])}
 kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.append(c.nodeType?c:document.createTextNode(c))});return e}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmt=(x,d=2)=>{if(x===Infinity)return'∞';if(x===-Infinity)return'-∞';if(x===null||x===undefined||Number.isNaN(x))return'—';return Number.isInteger(x)?String(x):(+x.toFixed(d)).toString()};
const pd=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.').replace(/،/g,',');
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1800)}

/* ---- state ---- */
const KEY='cs-interactive-book.v1';
let S={done:{},ex:{},notes:{},vis:{},open:{},theme:'dark',last:''};
try{const r=JSON.parse(localStorage.getItem(KEY)||'null');if(r)S=Object.assign(S,r)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};

/* ---- timers (cleared on navigation) ---- */
const T={ids:[],every(fn,ms){const id=setInterval(fn,ms);this.ids.push(id);return id},stop(id){clearInterval(id)},clear(){this.ids.forEach(clearInterval);this.ids=[]}};

/* ---- data registries ---- */
const MODS={
 A:{t:'ساختمان داده و الگوریتم',en:'Data Structures & Algorithms',ic:'🌳',d:'از تحلیل پیچیدگی تا درخت‌ها، گراف‌ها، مرتب‌سازی، برنامه‌ریزی پویا و Backtracking؛ با انیمیشن‌های گام‌به‌گام.',
  g:{A1:'A1 · Algorithm Fundamentals',A2:'A2 · Linear Data Structures',A3:'A3 · Non-Linear Data Structures',A4:'A4 · Algorithms',A5:'A5 · Advanced Concepts',A6:'A6 · Complexity & Applications'}},
 B:{t:'سیستم‌های پایگاه داده',en:'Database Systems',ic:'🗄️',d:'مدل رابطه‌ای، SQL با موتور اجرای واقعی در مرورگر، نرمال‌سازی، ایندکس‌ها و B+Tree، تراکنش‌ها، MVCC و درونی‌های پایگاه داده.',
  g:{B1:'B1 · Fundamentals',B2:'B2 · Relational Theory',B3:'B3 · SQL & Query Processing',B4:'B4 · Database Design',B5:'B5 · Indexing & Storage',B6:'B6 · Transactions & Concurrency',B7:'B7 · Architecture & Advanced',B8:'B8 · Internals'}},
 C:{t:'ریاضیات برای هوش مصنوعی',en:'Mathematics for AI',ic:'📐',d:'جبر خطی، حسابان، احتمال، آمار و بهینه‌سازی با شهود هندسی، اشتقاق گام‌به‌گام و کاربرد در شبکه‌های عصبی.',
  g:{C1:'C1 · Linear Algebra',C2:'C2 · Calculus',C3:'C3 · Probability',C4:'C4 · Statistics',C5:'C5 · Optimization'}},
 X:{t:'اتصال بنیان‌ها',en:'Connecting the Foundations',ic:'🔗',d:'پیوند میان ساختمان داده، پایگاه داده و ریاضیات هوش مصنوعی: از آرایه تا تانسور، از B+Tree تا ایندکس، از گرادیان تا آموزش شبکه و ترنسفورمر.',
  g:{X:'Connecting the Foundations'}}};
const LESSONS=[];const W={};
const LV=['','مبتدی','متوسط','پیشرفته'];
const byId=id=>LESSONS.find(l=>l.id===id);

/* ---- authoring helpers ---- */
const wd=(n,t,o)=>`<div class="wbox" data-w="${n}" data-t="${esc(t)}" data-o="${esc(JSON.stringify(o||{}))}"></div>`;
const co=(type,t,body)=>`<div class="callout ${type}"><b class="t">${t}</b>${body}</div>`;
const ft=(head,rows)=>`<div class="tw"><table class="dt fa"><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---- code highlight ---- */
const KWS={js:'const let var function return if else for while of in new class this true false null undefined break continue switch case throw try catch async await def elif not and or None True False pass lambda import from while do int void',
 sql:'SELECT FROM WHERE GROUP BY HAVING ORDER JOIN LEFT RIGHT INNER OUTER FULL ON AS AND OR NOT IN IS NULL LIKE BETWEEN DISTINCT CASE WHEN THEN ELSE END INSERT INTO VALUES UPDATE SET DELETE WITH OVER PARTITION LIMIT OFFSET CREATE TABLE INDEX PRIMARY KEY FOREIGN REFERENCES UNIQUE BEGIN COMMIT ROLLBACK EXISTS ASC DESC UNION ALL CROSS USING EXPLAIN ANALYZE UNIQUE CHECK DEFAULT ALTER DROP TRANSACTION ISOLATION LEVEL READ COMMITTED REPEATABLE SERIALIZABLE FOR SHARE'};
function hl(code,l){const kw=new Set((KWS[l==='py'||l==='pseudo'?'js':l]||KWS.js).split(' '));const sql=l==='sql';
 const re=sql?/(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g:/(\/\/[^\n]*|#[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
 let o='',i=0,m;while((m=re.exec(code))){o+=esc(code.slice(i,m.index));const t=m[0];
  if(m[1])o+=`<span class="c">${esc(t)}</span>`;else if(m[2])o+=`<span class="s">${esc(t)}</span>`;else if(m[3])o+=`<span class="n">${t}</span>`;
  else o+=kw.has(sql?t.toUpperCase():t)?`<span class="k">${t}</span>`:esc(t);i=m.index+t.length}
 return o+esc(code.slice(i))}
function dedent(s){s=s.replace(/^\n/,'').replace(/\s+$/,'');const ls=s.split('\n');const ind=Math.min(...ls.filter(x=>x.trim()).map(x=>x.match(/^ */)[0].length));return ls.map(x=>x.slice(ind)).join('\n')}
function rich(s){return s.split(/(<pre[\s\S]*?<\/pre>)/).map((p,i)=>{if(i%2){const m=p.match(/<pre(?: data-l="(\w+)")?>([\s\S]*?)<\/pre>/);return `<pre class="code"><code>${hl(dedent(m[2].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')),m[1]||'js')}</code></pre>`}
 return p.replace(/\$\$([\s\S]+?)\$\$/g,(m,t)=>`<div class="tex d" data-t="${esc(t.trim())}"></div>`).replace(/\$([^$\n]+?)\$/g,(m,t)=>`<span class="tex" data-t="${esc(t)}"></span>`)}).join('')}
function renderMath(root){$$('.tex:not([data-done])',root||document).forEach(el=>{const t=el.dataset.t;
 if(window.katex){try{katex.render(t,el,{displayMode:el.classList.contains('d'),throwOnError:false});el.dataset.done=1;el.classList.remove('raw');return}catch(e){}}
 el.textContent=t;el.classList.add('raw')})}
window.addEventListener('load',()=>renderMath());
const strip=s=>s.replace(/<pre[\s\S]*?<\/pre>/g,' ').replace(/<[^>]+>/g,' ').replace(/\$/g,' ').replace(/\s+/g,' ');
const norm=s=>String(s).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u064B-\u065F\u200c]/g,'').toLowerCase();

/* ---- chart helper (SVG) ---- */
function chart(w,hh,x0,x1,y0,y1,o){o=o||{};const m={l:o.l??36,r:o.r??10,t:o.t??10,b:o.b??24};const svg=sv('svg',{class:'sv',viewBox:`0 0 ${w} ${hh}`,width:w,style:'max-width:100%;height:auto'});
 const X=x=>m.l+(x-x0)/(x1-x0)*(w-m.l-m.r),Y=y=>hh-m.b-(y-y0)/(y1-y0)*(hh-m.t-m.b);
 const P={svg,X,Y,w,h:hh,m};
 P.axes=(nx,ny,fx)=>{svg.append(sv('line',{x1:m.l,x2:w-m.r,y1:hh-m.b,y2:hh-m.b,stroke:'var(--bd)'}),sv('line',{x1:m.l,x2:m.l,y1:m.t,y2:hh-m.b,stroke:'var(--bd)'}));
  for(let i=0;i<=nx;i++){const v=x0+(x1-x0)*i/nx;svg.append(sv('text',{x:X(v),y:hh-m.b+15,'text-anchor':'middle','font-size':10.5,class:'mut'},fmt(v,2)))}
  for(let i=0;i<=ny;i++){const v=y0+(y1-y0)*i/ny;svg.append(sv('text',{x:m.l-5,y:Y(v)+4,'text-anchor':'end','font-size':10.5,class:'mut'},fmt(v,2)),sv('line',{x1:m.l,x2:w-m.r,y1:Y(v),y2:Y(v),stroke:'var(--bd)','stroke-dasharray':'2 4',opacity:.5}))}};
 P.path=(f,col,a,b,n,wd)=>{a=a??x0;b=b??x1;n=n||200;let d='';for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;const y=f(x);if(!isFinite(y))continue;d+=(d?'L':'M')+X(x).toFixed(1)+' '+Y(Math.max(y0-(y1-y0),Math.min(y1+(y1-y0),y))).toFixed(1)}
  const p=sv('path',{d,fill:'none',stroke:col||'var(--ac)','stroke-width':wd||2.2});svg.append(p);return p};
 P.area=(f,a,b,col,n)=>{n=n||120;let d=`M${X(a)} ${Y(0)}`;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;d+=`L${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`}d+=`L${X(b)} ${Y(0)}Z`;svg.append(sv('path',{d,fill:col||'var(--ac)',opacity:.35}))};
 P.bar=(x,y,bw,col)=>svg.append(sv('rect',{x:X(x)-bw/2,y:Y(y),width:bw,height:Math.max(0,Y(0)-Y(y)),fill:col||'var(--ac)',opacity:.85}));
 P.dot=(x,y,r,col)=>{const c=sv('circle',{cx:X(x),cy:Y(y),r:r||4,fill:col||'var(--ac2)'});svg.append(c);return c};
 P.line=(xa,ya,xb,yb,col,dash,wd)=>svg.append(sv('line',{x1:X(xa),y1:Y(ya),x2:X(xb),y2:Y(yb),stroke:col||'var(--mut)','stroke-dasharray':dash||null,'stroke-width':wd||1.6}));
 P.text=(x,y,t,col,anchor,fs)=>svg.append(sv('text',{x:X(x),y:Y(y),fill:col||'var(--fg)','text-anchor':anchor||'start','font-size':fs||12},t));
 return P}
/* ---- canvas helper ---- */
function cv(host,w,hh){const c=h('canvas',{class:'cv'});const d=window.devicePixelRatio||1;c.width=w*d;c.height=hh*d;c.style.width='100%';c.style.maxWidth=w+'px';c.style.aspectRatio=w+'/'+hh;const g=c.getContext('2d');g.scale(d,d);host.append(c);return{c,g,w,h:hh}}

/* ---- UI controls ---- */
const btn=(t,fn,cls)=>h('button',{class:'btn '+(cls||''),onclick:fn,type:'button'},t);
function rng(label,min,max,step,val,fn,f){const o=h('b',{style:{direction:'ltr',minWidth:'38px',display:'inline-block',textAlign:'center'}},(f||fmt)(val));const i=h('input',{type:'range',min,max,step,value:val});
 i.addEventListener('input',()=>{o.textContent=(f||fmt)(+i.value);fn(+i.value)});const el=h('label',{},label,i,o);return{el,get:()=>+i.value,set:v=>{i.value=v;o.textContent=(f||fmt)(v)},input:i}}
function sel(label,opts,val,fn){const s=h('select',{},opts.map(o=>h('option',{value:o.v??o,selected:(o.v??o)==val},o.t??o)));s.addEventListener('change',()=>fn(s.value));return{el:h('label',{},label,s),get:()=>s.value,set:v=>s.value=v}}
function ctl(...c){return h('div',{class:'ctl'},c.map(x=>x.el||x))}
function dtable(cols,rows,o){o=o||{};const t=h('table',{class:'dt'});t.append(h('tr',{},cols.map(c=>h('th',{},c))));
 rows.forEach((r,ri)=>t.append(h('tr',{class:o.hlRow&&o.hlRow(ri,r)?'hl':''},r.map((v,ci)=>h('td',{class:(v===null?'nl ':'')+(o.hlCell&&o.hlCell(ri,ci)?'hl':'')},v===null?'NULL':typeof v==='number'?fmt(v,4):String(v))))));
 return h('div',{class:'tw'},t)}
/* ---- player: step-through animations ---- */
function player(host,frames,draw,o){o=o||{};let i=0,tm=null;const stage=h('div',{class:'stage'}),desc=h('div',{class:'desc'}),cnt=h('b',{style:{direction:'ltr',minWidth:'64px',display:'inline-block'}});
 const play=btn('▶ پخش',()=>tm?stop():start());const spd=rng('سرعت',1,10,1,o.speed||5,()=>{if(tm){stop();start()}},v=>v);
 const bar=h('div',{class:'ctl'},btn('⏮',()=>{stop();go(0)}),btn('◀ قبلی',()=>{stop();go(i-1)}),btn('بعدی ▶',()=>{stop();go(i+1)}),play,spd.el,cnt);
 function go(n){i=Math.max(0,Math.min(frames.length-1,n));draw(stage,frames[i],i);desc.textContent=frames[i].d||'';cnt.textContent=(i+1)+' / '+frames.length;if(i>=frames.length-1)stop()}
 function start(){if(i>=frames.length-1)go(0);play.textContent='⏸ توقف';tm=T.every(()=>go(i+1),1100-spd.get()*100)}
 function stop(){if(tm){T.stop(tm);tm=null}play.textContent='▶ پخش'}
 host.append(stage,desc,bar);go(0);return{set(f,keep){stop();frames=f;go(keep?i:0)},go,get i(){return i}}}

/* ---- progress ---- */
const lessonsOf=m=>LESSONS.filter(l=>l.mod===m);
const exKey=(l,i)=>l.id+':'+i;
function lessonScore(l){const n=l.ex.length;let c=0,a=0;l.ex.forEach((e,i)=>{const v=S.ex[exKey(l,i)];if(v!==undefined)a++;if(v===1)c++});return{c,a,n}}
function modPct(m){const ls=lessonsOf(m);return ls.length?Math.round(100*ls.filter(l=>S.done[l.id]).length/ls.length):0}
function totalPct(){const ls=LESSONS;return ls.length?Math.round(100*ls.filter(l=>S.done[l.id]).length/ls.length):0}
function quizAvg(ls){let c=0,a=0;(ls||LESSONS).forEach(l=>{const s=lessonScore(l);c+=s.c;a+=s.a});return{c,a,pct:a?Math.round(100*c/a):null}}

/* ---- theme ---- */
function setTheme(t){S.theme=t;document.documentElement.dataset.theme=t;$('#themeBtn').textContent=t==='dark'?'☀':'🌙';save()}

/* ---- navigation tree ---- */
function buildNav(cur){const nav=$('#nav');nav.innerHTML='';
 nav.append(h('a',{class:'nlink'+(location.hash.startsWith('#/sql')?' act':''),href:'#/sql'},'🧪 SQL Sandbox'),h('a',{class:'nlink'+(location.hash==='#/p'?' act':''),href:'#/p'},'📊 پیشرفت و یادداشت‌ها'),h('a',{class:'nlink'+(location.hash==='#/'||location.hash===''?' act':''),href:'#/'},'🏠 داشبورد'));
 for(const m in MODS){const M=MODS[m];const open=S.open['m'+m]!==undefined?S.open['m'+m]:(cur&&cur.mod===m);
  const d=h('details',{class:'nm',open:open||null});d.addEventListener('toggle',()=>{S.open['m'+m]=d.open;save()});
  d.append(h('summary',{},M.ic+' ',h('span',{},M.t),h('span',{class:'mpct'},modPct(m)+'%')));
  for(const g in M.g){const ls=LESSONS.filter(l=>l.g===g);if(!ls.length)continue;const gopen=S.open['g'+g]!==undefined?S.open['g'+g]:(cur&&cur.g===g);
   const gd=h('details',{class:'ng',open:gopen||null});gd.addEventListener('toggle',()=>{S.open['g'+g]=gd.open;save()});
   gd.append(h('summary',{},M.g[g]));ls.forEach(l=>gd.append(h('a',{class:'nlink'+(cur&&cur.id===l.id?' act':''),href:'#/l/'+l.id},h('span',{class:'dot '+(S.done[l.id]?'d':S.vis[l.id]?'v':'')}),l.t,S.done[l.id]?h('span',{class:'tick'},'✓'):null)));d.append(gd)}
  nav.append(d)}}

/* ---- search ---- */
let IDX=null;
function buildIdx(){IDX=LESSONS.map(l=>({l,title:norm(l.t+' '+l.en+' '+(l.kw||'')),text:norm(strip(l.body)+' '+l.obj.join(' ')+' '+l.sum.join(' ')),raw:strip(l.body)}))}
function doSearch(q){const box=$('#res');q=norm(q.trim());if(!q){box.style.display='none';return}if(!IDX)buildIdx();const toks=q.split(/\s+/);
 const hits=IDX.map(x=>{let sc=0;for(const t of toks){if(x.title.includes(t))sc+=10;else if(x.text.includes(t))sc+=1;else return null}return{x,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,12);
 box.innerHTML='';box.style.display='block';if(!hits.length){box.append(h('a',{},'نتیجه‌ای پیدا نشد'));return}
 hits.forEach(({x})=>{const i=norm(x.raw).indexOf(toks[0]);let sn=i>=0?x.raw.slice(Math.max(0,i-40),i+70):x.raw.slice(0,90);
  box.append(h('a',{href:'#/l/'+x.l.id,onclick:()=>{box.style.display='none';$('#q').value=''}},h('b',{},x.l.t),h('small',{},MODS[x.l.mod].en+' · '+x.l.en),h('small',{},'…'+sn+'…')))})}

/* ---- exercises ---- */
function sqlTable(res){const pre=(res.msgs&&res.msgs.length>(res.cols.length?0:1))?h('div',{class:'wn'},'✔ '+res.msgs.join(' | ')):null;if(res.msg&&!res.cols.length)return h('div',{class:'wn'},'✔ '+(res.msgs&&res.msgs.length>1?res.msgs.join(' | '):res.msg));return h('div',{},pre,dtable(res.cols,res.rows.slice(0,200)),h('div',{class:'wn',style:{direction:'ltr',textAlign:'left'}},res.rows.length+' row(s) · scanned rows: '+res.scanned))}
function exCard(l,e,i){const key=exKey(l,i);const card=h('div',{class:'ex'});const st=S.ex[key];
 const mark=ok=>{const first=S.ex[key]===undefined;if(ok||S.ex[key]!==1)S.ex[key]=ok?1:0;save();card.classList.toggle('right',ok);card.classList.toggle('wrong',!ok);buildNav(l);refreshScore()};
 const fb=h('div',{class:'fb',style:{display:'none'}});
 const show=(ok,html)=>{fb.className='fb '+(ok?'ok':'no');fb.style.display='block';fb.innerHTML=(ok?'✅ <b>درست!</b> ':'❌ <b>نادرست.</b> ')+rich(html||e.e||'');renderMath(fb)};
 const showExp=()=>{fb.className='fb';fb.style.display='block';fb.innerHTML='💡 '+rich(e.e||'');renderMath(fb)};
 card.append(h('div',{class:'qh'},h('b',{},'تمرین '+(i+1)),h('span',{class:'chip b'+e.l},LV[e.l]),h('span',{class:'chip'},{mcq:'چندگزینه‌ای',tf:'درست/نادرست',num:'محاسباتی',sql:'SQL',think:'استدلال'}[e.t])),h('div',{html:rich(e.q)}));
 const body=h('div');card.append(body);
 if(e.t==='mcq'||e.t==='tf'){const opts=e.t==='tf'?['درست','نادرست']:e.o;const ans=e.t==='tf'?(e.a?0:1):e.a;
  const bs=opts.map((o,k)=>h('button',{class:'opt',type:'button',html:rich(o),onclick:()=>{if(card.dataset.lock)return;card.dataset.lock=1;bs.forEach((b,j)=>{if(j===ans)b.classList.add('c');else if(j===k)b.classList.add('w')});mark(k===ans);show(k===ans)}}));
  bs.forEach(b=>body.append(b));if(st!==undefined)card.classList.add(st?'right':'wrong');body.append(h('div',{class:'ctl'},btn('↺ تلاش دوباره',()=>{delete card.dataset.lock;bs.forEach(b=>b.classList.remove('c','w'));fb.style.display='none'})))}
 else if(e.t==='num'){const inp=h('input',{class:'in',type:'text',placeholder:'پاسخ عددی',style:{width:'160px',display:'inline-block',direction:'ltr'}});
  body.append(h('div',{class:'ctl'},inp,btn('بررسی',()=>{const v=parseFloat(pd(inp.value));if(isNaN(v)){toast('یک عدد وارد کنید');return}const ok=Math.abs(v-e.a)<=(e.tol??0.01);mark(ok);show(ok)},'pri'),btn('نمایش پاسخ و حل',()=>{fb.className='fb';fb.style.display='block';fb.innerHTML='پاسخ: <b class="en">'+e.a+'</b><br>'+rich(e.e||'');renderMath(fb)})))}
 else if(e.t==='sql'){const ta=h('textarea',{class:'in',spellcheck:'false'});ta.value=e.init||'';const out=h('div');
  let du=null;const run=()=>{out.innerHTML='';try{du=SQL.clone(SQL.sampleDB());const r=SQL.runAll(ta.value,du);out.append(sqlTable(r));return r}catch(er){out.append(h('div',{class:'fb no',html:'⚠ '+esc(er.message)}));return null}};
  body.append(ta,h('div',{class:'ctl'},btn('▶ اجرا',run),btn('بررسی پاسخ',()=>{let r=run();if(!r)return;let ok=false;try{if(e.chk)r=SQL.run(e.chk,du);const ds=SQL.clone(SQL.sampleDB());let sol=SQL.runAll(e.sol,ds);if(e.chk)sol=SQL.run(e.chk,ds);ok=SQL.sameResult(r,sol,/order by/i.test(e.sol))}catch(x){}mark(ok);show(ok,ok?'نتیجه با خروجی مورد انتظار یکی است. '+(e.e||''):'خروجی با نتیجه مورد انتظار یکسان نیست (تعداد/مقدار سطرها یا ستون‌ها). راهنمایی: '+(e.hint||'خروجی خود را با صورت مسئله مقایسه کنید.'))},'pri'),btn('نمایش راه‌حل',()=>{fb.className='fb';fb.style.display='block';fb.innerHTML='<pre data-l="sql">'+esc(e.sol)+'</pre>';fb.innerHTML=rich(fb.innerHTML)+rich(e.e||'')})),out)}
 else if(e.t==='think'){const ta=h('textarea',{class:'in',placeholder:'پاسخ خود را بنویسید (اختیاری، ذخیره نمی‌شود)…',style:{direction:'rtl',textAlign:'right',fontFamily:'inherit'}});
  body.append(ta,h('div',{class:'ctl'},btn('نمایش پاسخ نمونه',showExp,'pri'),btn('✔ درست فکر کرده بودم',()=>{mark(true);toast('ثبت شد')}),btn('✘ باید مرور کنم',()=>{mark(false)})))}
 card.append(fb);if(st!==undefined&&e.t!=='mcq'&&e.t!=='tf')card.classList.add(st?'right':'wrong');return card}
function refreshScore(){const el=$('#scoreLine');if(!el||!window._cur)return;const s=lessonScore(window._cur);el.textContent=`پاسخ صحیح: ${s.c} از ${s.n} · تلاش‌شده: ${s.a}`}

/* ---- widget mounting ---- */
function mountWidgets(root){$$('.wbox[data-w]',root).forEach(el=>{if(el.dataset.m)return;el.dataset.m=1;const name=el.dataset.w;const o=JSON.parse(el.dataset.o||'{}');
 const body=h('div',{class:'wb'});el.append(h('div',{class:'wt'},el.dataset.t||name),body);
 try{if(!W[name])throw new Error('widget not found: '+name);W[name](body,o)}catch(e){body.append(h('div',{class:'fb no'},'خطا در ویجت: '+e.message));console.error(e)}})}

/* ---- pages ---- */
const view=()=>$('#view');
function setCrumb(parts){const c=$('#crumb');c.innerHTML='';parts.forEach((p,i)=>{if(i)c.append(h('span',{},'›'));c.append(p.href?h('a',{href:p.href},p.t):h('span',{},p.t))})}
function ring(p,size){size=size||90;const r=size/2-8,C=2*Math.PI*r;return`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--bd)" stroke-width="8"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--ok)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C*p/100} ${C}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-size="${size/4.2}" style="font-weight:700">${p}%</text></svg>`}

function pageHome(){setCrumb([{t:'داشبورد'}]);const v=view();v.innerHTML='';const last=byId(S.last)||LESSONS[0];const qa=quizAvg();
 const hero=h('div',{class:'hero'},h('div',{style:{display:'flex',gap:'22px',alignItems:'center',flexWrap:'wrap'}},h('div',{style:{flex:1,minWidth:'260px'}},h('h1',{},'کتاب تعاملی علوم کامپیوتر'),h('div',{class:'sub'},'Data Structures · Database Systems · Mathematics for AI'),
  h('p',{},`یک محیط یادگیری سطح دانشگاهی با ${LESSONS.length} درس، ویجت‌های تعاملی، موتور SQL داخل مرورگر، تمرین با بازخورد فوری و ردیابی پیشرفت. زبان آموزش فارسی و اصطلاحات فنی انگلیسی است.`),
  h('div',{class:'ctl'},h('a',{class:'btn pri',href:'#/l/'+last.id,style:{textDecoration:'none'}},S.last?'ادامه: '+last.t:'شروع یادگیری: '+last.t),h('a',{class:'btn',href:'#/p',style:{textDecoration:'none'}},'📊 پیشرفت من'))),
  h('div',{html:ring(totalPct(),120),style:{textAlign:'center'}},)));
 v.append(hero);
 const g=h('div',{class:'grid g2'});for(const m in MODS){const M=MODS[m],ls=lessonsOf(m);g.append(h('div',{class:'card mcard',onclick:()=>location.hash='#/m/'+m},h('h3',{},M.ic+' '+M.t),h('div',{class:'sub',style:{textAlign:'left'}},M.en),h('p',{style:{fontSize:'14.5px',color:'var(--mut)'}},M.d),
  h('div',{class:'bar'+(modPct(m)===100?' ok':'')},h('i',{style:{width:modPct(m)+'%'}})),h('div',{class:'stat'},h('span',{},ls.length+' درس'),h('span',{},'تکمیل‌شده: ',h('b',{},ls.filter(l=>S.done[l.id]).length)),h('span',{},'میانگین آزمون: ',h('b',{},(quizAvg(ls).pct??'—')+(quizAvg(ls).pct!=null?'%':''))))))}
 v.append(g);
 v.append(h('h2',{},'چگونه از این کتاب استفاده کنیم؟'),h('div',{class:'grid g3',html:rich(`
  <div class="card"><b>۱. بخوان و ببین</b><p style="font-size:14.5px">هر درس شامل هدف‌ها، پیش‌نیازها، توضیح نظری، مثال گام‌به‌گام و ویجت‌های تعاملی است. در ویجت‌ها پارامترها را تغییر بده و نتیجه را ببین.</p></div>
  <div class="card"><b>۲. تمرین کن</b><p style="font-size:14.5px">تمرین‌ها در سه سطح مبتدی، متوسط و پیشرفته‌اند. پاسخ SQL روی یک پایگاه داده نمونه واقعاً اجرا می‌شود و بازخورد فوری می‌گیری.</p></div>
  <div class="card"><b>۳. پیگیری و یادداشت</b><p style="font-size:14.5px">پیشرفت، نمره‌ی تمرین‌ها و یادداشت‌های هر درس در مرورگر (localStorage) ذخیره می‌شود. کلید <code>/</code> جست‌وجو را باز می‌کند.</p></div>
  <div class="card"><b>۴. پیوند میان حوزه‌ها</b><p style="font-size:14.5px">در بخش «اتصال بنیان‌ها» می‌بینی چرا B+Tree موتور ایندکس است، چرا تانسور همان آرایه چندبعدی است و چرا ترنسفورمر ضرب ماتریس است.</p></div>`)}));
 renderMath(v)}

function pageModule(m){const M=MODS[m];if(!M)return pageHome();setCrumb([{t:'داشبورد',href:'#/'},{t:M.t}]);const v=view();v.innerHTML='';
 v.append(h('h1',{},M.ic+' '+M.t),h('div',{class:'sub'},M.en),h('p',{},M.d),h('div',{class:'bar'+(modPct(m)===100?' ok':'')},h('i',{style:{width:modPct(m)+'%'}})),h('p',{class:'wn'},`پیشرفت ماژول: ${modPct(m)}٪`));
 for(const g in M.g){const ls=LESSONS.filter(l=>l.g===g);if(!ls.length)continue;v.append(h('h3',{style:{direction:'ltr',textAlign:'left'}},M.g[g]));
  ls.forEach(l=>{const s=lessonScore(l);v.append(h('a',{class:'card',href:'#/l/'+l.id,style:{display:'flex',gap:'12px',alignItems:'center',textDecoration:'none',color:'inherit',margin:'8px 0',padding:'10px 16px'}},h('span',{style:{fontSize:'20px'}},S.done[l.id]?'✅':S.vis[l.id]?'📖':'⚪'),h('div',{style:{flex:1}},h('b',{},l.t),h('div',{class:'wn',style:{margin:0,direction:'ltr',textAlign:'right'}},l.en)),h('span',{class:'chip b'+l.lvl},LV[l.lvl]),h('span',{class:'chip'},l.min+' دقیقه'),h('span',{class:'chip'},s.c+'/'+s.n)))})}}

function pageLesson(id){const l=byId(id);if(!l)return pageHome();window._cur=l;S.last=id;S.vis[id]=1;save();const M=MODS[l.mod];
 setCrumb([{t:'داشبورد',href:'#/'},{t:M.t,href:'#/m/'+l.mod},{t:M.g[l.g].split(' · ')[0]+' '+(M.g[l.g].split(' · ')[1]||'')},{t:l.t}]);
 buildNav(l);const v=view();v.innerHTML='';const i=LESSONS.indexOf(l),pv=LESSONS[i-1],nx=LESSONS[i+1];
 const doneBtn=btn('',()=>{S.done[l.id]=!S.done[l.id];save();upd();buildNav(l);toast(S.done[l.id]?'درس به‌عنوان تکمیل‌شده ثبت شد ✓':'علامت تکمیل برداشته شد')},'');
 const upd=()=>{doneBtn.textContent=S.done[l.id]?'✓ تکمیل شد':'علامت‌گذاری به‌عنوان تکمیل‌شده';doneBtn.classList.toggle('pri',!!S.done[l.id]);doneBtn2.textContent=doneBtn.textContent;doneBtn2.classList.toggle('pri',!!S.done[l.id])};
 const doneBtn2=btn('',()=>doneBtn.click());
 v.append(h('h1',{},l.t),h('div',{class:'sub'},l.en),h('div',{class:'chips'},h('span',{class:'chip b'+l.lvl},LV[l.lvl]),h('span',{class:'chip'},'⏱ '+l.min+' دقیقه'),h('span',{class:'chip'},M.ic+' '+M.en),h('span',{class:'chip'},l.ex.length+' تمرین')),h('div',{class:'ctl'},doneBtn));
 v.append(h('div',{class:'grid g2'},h('div',{class:'card',html:'<b>🎯 اهداف یادگیری</b><ul style="margin:6px 0 0;padding-inline-start:22px">'+l.obj.map(x=>`<li>${rich(x)}</li>`).join('')+'</ul>'}),h('div',{class:'card',html:'<b>📚 پیش‌نیازها</b><ul style="margin:6px 0 0;padding-inline-start:22px">'+l.pre.map(x=>{const p=byId(x);return p?`<li><a href="#/l/${p.id}">${p.t}</a></li>`:`<li>${x}</li>`}).join('')+'</ul>'})));
 v.append(h('div',{html:rich(l.body)}));
 if(l.mis&&l.mis.length){v.append(h('h2',{},'⚠️ اشتباهات و تصورات غلط رایج'));l.mis.forEach(m=>v.append(h('div',{class:'callout bad',html:rich(m)})))}
 v.append(h('h2',{},'🧪 بررسی دانش و تمرین'),h('div',{class:'ctl'},h('span',{id:'scoreLine',class:'chip'}),h('span',{},'فیلتر سطح:'),...[0,1,2,3].map(k=>btn(k?LV[k]:'همه',e=>{$$('.ex',exs).forEach((c,j)=>c.style.display=(!k||l.ex[j].l===k)?'':'none');$$('.tabs .btn',fl).forEach(b=>b.classList.remove('on'));e.target.classList.add('on')},k===0?'on':''))));
 const fl=v.lastChild;fl.className='tabs ctl';const exs=h('div');l.ex.forEach((e,j)=>exs.append(exCard(l,e,j)));v.append(exs);
 v.append(h('h2',{},'📝 خلاصه درس'),h('div',{class:'card',html:'<ul style="margin:0;padding-inline-start:22px">'+l.sum.map(x=>`<li>${rich(x)}</li>`).join('')+'</ul>'}));
 const ta=h('textarea',{class:'in',placeholder:'یادداشت‌های شخصی شما برای این درس (به‌صورت خودکار ذخیره می‌شود)…',style:{direction:'rtl',textAlign:'right',fontFamily:'inherit',minHeight:'120px'}});ta.value=S.notes[l.id]||'';
 ta.addEventListener('input',()=>{S.notes[l.id]=ta.value;if(!ta.value)delete S.notes[l.id];save()});
 v.append(h('h2',{},'🗒️ یادداشت‌های من'),ta,h('div',{class:'lnav'},pv?h('a',{class:'btn',href:'#/l/'+pv.id,style:{textDecoration:'none'}},'→ '+pv.t):h('span'),doneBtn2,nx?h('a',{class:'btn pri',href:'#/l/'+nx.id,style:{textDecoration:'none'}},nx.t+' ←'):h('span')));
 upd();refreshScore();renderMath(v);mountWidgets(v);window.scrollTo(0,0)}

function pageProgress(){setCrumb([{t:'داشبورد',href:'#/'},{t:'پیشرفت و یادداشت‌ها'}]);const v=view();v.innerHTML='';const qa=quizAvg();
 v.append(h('h1',{},'📊 پیشرفت یادگیری'),h('div',{class:'grid g3'},
  h('div',{class:'card',style:{textAlign:'center'},html:ring(totalPct(),110)+'<div>پیشرفت کل</div>'}),
  h('div',{class:'card',style:{textAlign:'center'},html:`<div style="font-size:38px;font-weight:700;direction:ltr">${qa.pct==null?'—':qa.pct+'%'}</div><div>دقت پاسخ‌ها (${qa.c} صحیح از ${qa.a} تلاش)</div>`}),
  h('div',{class:'card',style:{textAlign:'center'},html:`<div style="font-size:38px;font-weight:700;direction:ltr">${LESSONS.filter(l=>S.done[l.id]).length}/${LESSONS.length}</div><div>درس تکمیل‌شده</div>`})));
 for(const m in MODS){const M=MODS[m];v.append(h('h2',{},M.ic+' '+M.t+' — '+modPct(m)+'٪'));
  const rows=lessonsOf(m).map(l=>{const s=lessonScore(l);return[`<a href="#/l/${l.id}">${l.t}</a>`,S.done[l.id]?'✅':S.vis[l.id]?'📖 در حال مطالعه':'—',s.a?`${s.c}/${s.n} (${Math.round(100*s.c/s.n)}%)`:'—',S.notes[l.id]?'📝':'']});
  v.append(h('div',{html:ft(['درس','وضعیت','نمره تمرین','یادداشت'],rows)}))}
 const notes=LESSONS.filter(l=>S.notes[l.id]);v.append(h('h2',{},'🗒️ همه یادداشت‌ها'));
 if(!notes.length)v.append(h('p',{class:'wn'},'هنوز یادداشتی ننوشته‌اید.'));notes.forEach(l=>v.append(h('div',{class:'card',style:{margin:'8px 0'}},h('a',{href:'#/l/'+l.id},h('b',{},l.t)),h('div',{style:{whiteSpace:'pre-wrap',marginTop:'6px'}},S.notes[l.id]))));
 v.append(h('h2',{},'💾 پشتیبان‌گیری'),h('div',{class:'ctl'},btn('⬇ خروجی JSON',()=>{const a=h('a',{href:URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'})),download:'cs-book-progress.json'});a.click()}),
  btn('⬆ بازیابی از فایل',()=>{const i=h('input',{type:'file',accept:'.json'});i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(t=>{try{S=Object.assign(S,JSON.parse(t));save();toast('بازیابی شد');route()}catch(e){toast('فایل نامعتبر است')}})};i.click()}),
  btn('🗑 پاک‌کردن همه پیشرفت‌ها',()=>{if(confirm('همه پیشرفت‌ها، نمره‌ها و یادداشت‌ها پاک شود؟')){S.done={};S.ex={};S.notes={};S.vis={};S.last='';save();route()}})))}

function pageSQL(){setCrumb([{t:'داشبورد',href:'#/'},{t:'SQL Sandbox'}]);buildNav(null);const v=view();v.innerHTML='';
 v.append(h('h1',{},'🧪 SQL Sandbox'),h('div',{class:'sub'},'Free SQL practice on the sample database'),h('p',{},'هر پرس‌وجویی را روی پایگاه داده نمونه اجرا کنید. موتور داخلی از SELECT (JOIN، زیرپرسش، GROUP BY/HAVING، CTE، توابع پنجره‌ای)، INSERT، UPDATE و DELETE با اعمال قیدهای PK/FK/NOT NULL پشتیبانی می‌کند.'));
 const b=h('div',{class:'wbox','data-w':'sqlplay','data-t':'Sandbox'});b.dataset.o=JSON.stringify({q:'SELECT d.name AS dept, COUNT(e.id) AS n, ROUND(AVG(e.salary),1) AS avg_salary\nFROM departments d LEFT JOIN employees e ON e.dept_id = d.id\nGROUP BY d.name\nORDER BY n DESC;',schema:true});v.append(b);mountWidgets(v)}

/* ---- router ---- */
function route(){T.clear();const hsh=location.hash||'#/';const p=hsh.split('/');document.body.classList.remove('nav');
 let cur=null;
 if(p[1]==='l'){pageLesson(p[2]);return}
 buildNav(null);
 if(p[1]==='m')pageModule(p[2]);else if(p[1]==='p')pageProgress();else if(p[1]==='sql')pageSQL();else pageHome();window.scrollTo(0,0)}

function boot(){setTheme(S.theme);
 $('#themeBtn').onclick=()=>{setTheme(S.theme==='dark'?'light':'dark');route()};
 $('#burger').onclick=()=>document.body.classList.toggle('nav');
 $('#progBtn').onclick=()=>location.hash='#/p';
 $('#q').addEventListener('input',e=>doSearch(e.target.value));
 $('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){const a=$('#res a[href]');if(a)a.click()}if(e.key==='Escape'){$('#res').style.display='none';e.target.blur()}});
 document.addEventListener('click',e=>{if(!e.target.closest('.srch'))$('#res').style.display='none'});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();document.body.classList.add('nav');$('#q').focus()}});
 window.addEventListener('hashchange',route);route()}
