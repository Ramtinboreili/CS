/* ===================== CORE UI ===================== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function h(tag,a,...kids){const e=document.createElement(tag);for(const k in a||{}){const v=a[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else e.setAttribute(k,v===true?'':v)}
 kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.append(c.nodeType?c:document.createTextNode(c))});return e}
const NS='http://www.w3.org/2000/svg';
function sv(tag,a,...kids){const e=document.createElementNS(NS,tag);for(const k in a||{}){if(a[k]==null)continue;if(k.startsWith('on'))e.addEventListener(k.slice(2),a[k]);else e.setAttribute(k,a[k])}
 kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.append(c.nodeType?c:document.createTextNode(c))});return e}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const kfmt=v=>{const a=Math.abs(v);return a>=1e9?+(v/1e9).toFixed(1)+'G':a>=1e6?+(v/1e6).toFixed(1)+'M':a>=1e3?+(v/1e3).toFixed(1)+'k':String(+(+v).toFixed(2))};
const fmt=(x,d=2)=>{if(x===Infinity)return'∞';if(x===-Infinity)return'-∞';if(x===null||x===undefined||Number.isNaN(x))return'—';return Number.isInteger(x)?String(x):(+x.toFixed(d)).toString()};
const pd=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.').replace(/،/g,',');
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1800)}

/* ---- state ---- */
const KEY='cs-interactive-book.v1';
let S={done:{},ex:{},notes:{},vis:{},open:{},theme:'dark',last:'',lang:'fa',labs:{}};
try{const r=JSON.parse(localStorage.getItem(KEY)||'null');if(r)S=Object.assign(S,r)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
/* ---- language (fa | en). URL ?lang=en wins, then saved choice ---- */
let LANG=(()=>{const m=/[?&]lang=(fa|en)/.exec(location.search);return m?m[1]:(S.lang==='en'?'en':'fa')})();
const t2=(fa,en)=>LANG==='en'?en:fa;
const EN={};const addEN=(id,o)=>{EN[id]=o};
function applyLangShell(){const d=document.documentElement;d.lang=LANG;d.dir=LANG==='en'?'ltr':'rtl';
 document.title=t2('کتاب تعاملی علوم کامپیوتر — ساختمان داده، پایگاه داده، ریاضیات هوش مصنوعی، یادگیری ماشین','Interactive CS Book: Data Structures, Databases, Math for AI, Machine Learning');
 const set=(s,f)=>{const e=document.querySelector(s);if(e)f(e)};
 set('.brand span',e=>e.textContent=t2('کتاب تعاملی علوم کامپیوتر','Interactive CS Book'));
 set('#q',e=>e.placeholder=t2('جست‌وجو در همه درس‌ها…','Search all lessons…'));
 set('#progBtn',e=>{e.textContent=t2('📊 پیشرفت','📊 Progress');e.title=t2('پیشرفت و یادداشت‌ها','Progress & notes')});
 set('#themeBtn',e=>e.title=t2('تغییر تم','Toggle theme'));set('#burger',e=>e.setAttribute('aria-label',t2('منو','Menu')));
 set('#langBtn',e=>{e.textContent=LANG==='en'?'فا':'EN';e.title=t2('English','فارسی')})}
function setLang(l){LANG=l;S.lang=l;save();IDX=null;applyLangShell();route()}

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
const LVL={fa:['','مبتدی','متوسط','پیشرفته'],en:['','Beginner','Intermediate','Advanced']};const lv=k=>LVL[LANG][k];
const mt=M=>LANG==='en'?M.en:M.t,md=M=>LANG==='en'?(M.de||M.d):M.d;
const ttl=l=>LANG==='en'?l.en:l.t;
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
 P.axes=(nx,ny,fx,fy)=>{fx=fx||(v=>fmt(v,2));fy=fy||(v=>fmt(v,2));svg.append(sv('line',{x1:m.l,x2:w-m.r,y1:hh-m.b,y2:hh-m.b,stroke:'var(--bd)'}),sv('line',{x1:m.l,x2:m.l,y1:m.t,y2:hh-m.b,stroke:'var(--bd)'}));
  for(let i=0;i<=nx;i++){const v=x0+(x1-x0)*i/nx;svg.append(sv('text',{x:X(v),y:hh-m.b+15,'text-anchor':'middle','font-size':10.5,class:'mut'},fx(v)))}
  for(let i=0;i<=ny;i++){const v=y0+(y1-y0)*i/ny;svg.append(sv('text',{x:m.l-5,y:Y(v)+4,'text-anchor':'end','font-size':10.5,class:'mut'},fy(v)),sv('line',{x1:m.l,x2:w-m.r,y1:Y(v),y2:Y(v),stroke:'var(--bd)','stroke-dasharray':'2 4',opacity:.5}))}};
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
 const play=btn(t2('▶ پخش','▶ Play'),()=>tm?stop():start());const spd=rng(t2('سرعت','Speed'),1,10,1,o.speed||5,()=>{if(tm){stop();start()}},v=>v);
 const bar=h('div',{class:'ctl'},btn('⏮',()=>{stop();go(0)}),btn(t2('◀ قبلی','◀ Prev'),()=>{stop();go(i-1)}),btn(t2('بعدی ▶','Next ▶'),()=>{stop();go(i+1)}),play,spd.el,cnt);
 function go(n){i=Math.max(0,Math.min(frames.length-1,n));draw(stage,frames[i],i);desc.textContent=frames[i].d||'';cnt.textContent=(i+1)+' / '+frames.length;if(i>=frames.length-1)stop()}
 function start(){if(i>=frames.length-1)go(0);play.textContent=t2('⏸ توقف','⏸ Pause');tm=T.every(()=>go(i+1),1100-spd.get()*100)}
 function stop(){if(tm){T.stop(tm);tm=null}play.textContent=t2('▶ پخش','▶ Play')}
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

/* ---- resolved lesson view: English overlay (EN[id]) over the Persian base. Answer keys / SQL solutions always come from the base ---- */
function LX(l){const o=LANG==='en'?EN[l.id]:null;
 if(!o)return{t:ttl(l),obj:l.obj,pre:l.pre,body:l.body,mis:l.mis||[],ex:l.ex,sum:l.sum,tr:LANG!=='en'};
 const ex=l.ex.map((e,i)=>Object.assign({},e,(o.ex||[])[i]||{}));
 return{t:l.en,obj:o.obj||l.obj,pre:o.pre||l.pre,body:o.body||l.body,mis:o.mis||l.mis||[],ex,sum:o.sum||l.sum,tr:true}}

/* ---- navigation tree ---- */
function labsOf(g){return(window.LABS||[]).filter(b=>b.g===g)}
function buildNav(cur){const nav=$('#nav');nav.innerHTML='';const hs=location.hash;
 nav.append(h('a',{class:'nlink'+(hs.startsWith('#/sql')?' act':''),href:'#/sql'},'🧪 SQL Sandbox'),
  h('a',{class:'nlink'+(hs.startsWith('#/lab')?' act':''),href:'#/labs'},t2('🔬 آزمایشگاه‌های تصویری','🔬 Visual labs'),h('span',{class:'mpct'},(window.LABS||[]).filter(b=>S.labs[b.id]).length+'/'+(window.LABS||[]).length)),
  h('a',{class:'nlink'+(hs==='#/p'?' act':''),href:'#/p'},t2('📊 پیشرفت و یادداشت‌ها','📊 Progress & notes')),
  h('a',{class:'nlink'+(hs==='#/'||hs===''?' act':''),href:'#/'},t2('🏠 داشبورد','🏠 Dashboard')));
 for(const m in MODS){const M=MODS[m];const open=S.open['m'+m]!==undefined?S.open['m'+m]:(cur&&cur.mod===m);
  const d=h('details',{class:'nm',open:open||null});d.addEventListener('toggle',()=>{S.open['m'+m]=d.open;save()});
  d.append(h('summary',{},M.ic+' ',h('span',{},mt(M)),h('span',{class:'mpct'},modPct(m)+'%')));
  for(const g in M.g){const ls=LESSONS.filter(l=>l.g===g);if(!ls.length)continue;const gopen=S.open['g'+g]!==undefined?S.open['g'+g]:(cur&&cur.g===g);
   const gd=h('details',{class:'ng',open:gopen||null});gd.addEventListener('toggle',()=>{S.open['g'+g]=gd.open;save()});
   gd.append(h('summary',{},M.g[g]));
   labsOf(g).forEach(b=>gd.append(h('a',{class:'nlink'+(hs==='#/lab/'+b.id?' act':'')+' lablink',href:'#/lab/'+b.id},h('span',{class:'dot '+(S.labs[b.id]?'d':'')}),'🔬 '+lt(b.t),S.labs[b.id]?h('span',{class:'tick'},'✓'):null)));
   ls.forEach(l=>gd.append(h('a',{class:'nlink'+(cur&&cur.id===l.id?' act':''),href:'#/l/'+l.id},h('span',{class:'dot '+(S.done[l.id]?'d':S.vis[l.id]?'v':'')}),ttl(l),S.done[l.id]?h('span',{class:'tick'},'✓'):null)));d.append(gd)}
  nav.append(d)}}
const lt=p=>Array.isArray(p)?p[LANG==='en'?1:0]:p;   // [fa,en] pair -> current language

/* ---- search ---- */
let IDX=null;
function buildIdx(){IDX=LESSONS.map(l=>{const x=LX(l);return{l,x,title:norm(l.t+' '+l.en+' '+(l.kw||'')),text:norm(strip(x.body)+' '+x.obj.join(' ')+' '+x.sum.join(' ')),raw:strip(x.body)}})}
function doSearch(q){const box=$('#res');q=norm(q.trim());if(!q){box.style.display='none';return}if(!IDX)buildIdx();const toks=q.split(/\s+/);
 const hits=IDX.map(x=>{let sc=0;for(const t of toks){if(x.title.includes(t))sc+=10;else if(x.text.includes(t))sc+=1;else return null}return{x,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,12);
 box.innerHTML='';box.style.display='block';if(!hits.length){box.append(h('a',{},t2('نتیجه‌ای پیدا نشد','No results')));return}
 hits.forEach(({x})=>{const i=norm(x.raw).indexOf(toks[0]);let sn=i>=0?x.raw.slice(Math.max(0,i-40),i+70):x.raw.slice(0,90);
  box.append(h('a',{href:'#/l/'+x.l.id,onclick:()=>{box.style.display='none';$('#q').value=''}},h('b',{},ttl(x.l)),h('small',{},mt(MODS[x.l.mod])+' · '+x.l.id),h('small',{},'…'+sn+'…')))})}

/* ---- exercises ---- */
function sqlTable(res){const pre=(res.msgs&&res.msgs.length>(res.cols.length?0:1))?h('div',{class:'wn'},'✔ '+res.msgs.join(' | ')):null;if(res.msg&&!res.cols.length)return h('div',{class:'wn'},'✔ '+(res.msgs&&res.msgs.length>1?res.msgs.join(' | '):res.msg));return h('div',{},pre,dtable(res.cols,res.rows.slice(0,200)),h('div',{class:'wn',style:{direction:'ltr',textAlign:'left'}},res.rows.length+' row(s) · scanned rows: '+res.scanned))}
const EXT=()=>({mcq:t2('چندگزینه‌ای','Multiple choice'),tf:t2('درست/نادرست','True/False'),num:t2('محاسباتی','Numeric'),sql:'SQL',think:t2('استدلال','Reasoning')});
function exCard(l,e,i){const key=exKey(l,i);const card=h('div',{class:'ex'});const st=S.ex[key];
 const mark=ok=>{if(ok||S.ex[key]!==1)S.ex[key]=ok?1:0;save();card.classList.toggle('right',ok);card.classList.toggle('wrong',!ok);buildNav(l);refreshScore()};
 const fb=h('div',{class:'fb',style:{display:'none'}});
 const show=(ok,html)=>{fb.className='fb '+(ok?'ok':'no');fb.style.display='block';fb.innerHTML=(ok?t2('✅ <b>درست!</b> ','✅ <b>Correct!</b> '):t2('❌ <b>نادرست.</b> ','❌ <b>Not quite.</b> '))+rich(html||e.e||'');renderMath(fb)};
 const showExp=()=>{fb.className='fb';fb.style.display='block';fb.innerHTML='💡 '+rich(e.e||'');renderMath(fb)};
 card.append(h('div',{class:'qh'},h('b',{},t2('تمرین ','Exercise ')+(i+1)),h('span',{class:'chip b'+e.l},lv(e.l)),h('span',{class:'chip'},EXT()[e.t])),h('div',{html:rich(e.q)}));
 const body=h('div');card.append(body);
 if(e.t==='mcq'||e.t==='tf'){const opts=e.t==='tf'?[t2('درست','True'),t2('نادرست','False')]:e.o;const ans=e.t==='tf'?(e.a?0:1):e.a;
  const bs=opts.map((o,k)=>h('button',{class:'opt',type:'button',html:rich(o),onclick:()=>{if(card.dataset.lock)return;card.dataset.lock=1;bs.forEach((b,j)=>{if(j===ans)b.classList.add('c');else if(j===k)b.classList.add('w')});mark(k===ans);show(k===ans)}}));
  bs.forEach(b=>body.append(b));if(st!==undefined)card.classList.add(st?'right':'wrong');body.append(h('div',{class:'ctl'},btn(t2('↺ تلاش دوباره','↺ Try again'),()=>{delete card.dataset.lock;bs.forEach(b=>b.classList.remove('c','w'));fb.style.display='none'})))}
 else if(e.t==='num'){const inp=h('input',{class:'in',type:'text',placeholder:t2('پاسخ عددی','Numeric answer'),style:{width:'160px',display:'inline-block',direction:'ltr'}});
  body.append(h('div',{class:'ctl'},inp,btn(t2('بررسی','Check'),()=>{const v=parseFloat(pd(inp.value));if(isNaN(v)){toast(t2('یک عدد وارد کنید','Enter a number'));return}const ok=Math.abs(v-e.a)<=(e.tol??0.01);mark(ok);show(ok)},'pri'),btn(t2('نمایش پاسخ و حل','Show answer & solution'),()=>{fb.className='fb';fb.style.display='block';fb.innerHTML=t2('پاسخ: ','Answer: ')+'<b class="en">'+e.a+'</b><br>'+rich(e.e||'');renderMath(fb)})))}
 else if(e.t==='sql'){const ta=h('textarea',{class:'in',spellcheck:'false'});ta.value=e.init||'';const out=h('div');
  let du=null;const run=()=>{out.innerHTML='';try{du=SQL.clone(SQL.sampleDB());const r=SQL.runAll(ta.value,du);out.append(sqlTable(r));return r}catch(er){out.append(h('div',{class:'fb no',html:'⚠ '+esc(er.message)}));return null}};
  body.append(ta,h('div',{class:'ctl'},btn(t2('▶ اجرا','▶ Run'),run),btn(t2('بررسی پاسخ','Check answer'),()=>{let r=run();if(!r)return;let ok=false;try{if(e.chk)r=SQL.run(e.chk,du);const ds=SQL.clone(SQL.sampleDB());let sol=SQL.runAll(e.sol,ds);if(e.chk)sol=SQL.run(e.chk,ds);ok=SQL.sameResult(r,sol,/order by/i.test(e.sol))}catch(x){}mark(ok);show(ok,ok?t2('نتیجه با خروجی مورد انتظار یکی است. ','The result matches the expected output. ')+(e.e||''):t2('خروجی با نتیجه مورد انتظار یکسان نیست (تعداد/مقدار سطرها یا ستون‌ها). راهنمایی: ','The output differs from the expected result (row count/values or columns). Hint: ')+(e.hint||t2('خروجی خود را با صورت مسئله مقایسه کنید.','compare your output with the task statement.')))},'pri'),btn(t2('نمایش راه‌حل','Show solution'),()=>{fb.className='fb';fb.style.display='block';fb.innerHTML='<pre data-l="sql">'+esc(e.sol)+'</pre>';fb.innerHTML=rich(fb.innerHTML)+rich(e.e||'')})),out)}
 else if(e.t==='think'){const ta=h('textarea',{class:'in',placeholder:t2('پاسخ خود را بنویسید (اختیاری، ذخیره نمی‌شود)…','Write your answer (optional, not saved)…'),style:{direction:LANG==='en'?'ltr':'rtl',textAlign:LANG==='en'?'left':'right',fontFamily:'inherit'}});
  body.append(ta,h('div',{class:'ctl'},btn(t2('نمایش پاسخ نمونه','Show sample answer'),showExp,'pri'),btn(t2('✔ درست فکر کرده بودم','✔ I had it right'),()=>{mark(true);toast(t2('ثبت شد','Saved'))}),btn(t2('✘ باید مرور کنم','✘ I need to review'),()=>{mark(false)})))}
 card.append(fb);if(st!==undefined&&e.t!=='mcq'&&e.t!=='tf')card.classList.add(st?'right':'wrong');return card}
function refreshScore(){const el=$('#scoreLine');if(!el||!window._cur)return;const s=lessonScore(window._cur);el.textContent=t2(`پاسخ صحیح: ${s.c} از ${s.n} · تلاش‌شده: ${s.a}`,`Correct: ${s.c} of ${s.n} · attempted: ${s.a}`)}

/* ---- widget mounting ---- */
function mountWidgets(root){$$('.wbox[data-w]',root).forEach(el=>{if(el.dataset.m)return;el.dataset.m=1;const name=el.dataset.w;const o=JSON.parse(el.dataset.o||'{}');
 const body=h('div',{class:'wb'});el.append(h('div',{class:'wt'},el.dataset.t||name),body);
 try{if(!W[name])throw new Error('widget not found: '+name);W[name](body,o)}catch(e){body.append(h('div',{class:'fb no'},t2('خطا در ویجت: ','Widget error: ')+e.message));console.error(e)}})}

/* ---- pages ---- */
const view=()=>$('#view');
function setCrumb(parts){const c=$('#crumb');c.innerHTML='';parts.forEach((p,i)=>{if(i)c.append(h('span',{},'›'));c.append(p.href?h('a',{href:p.href},p.t):h('span',{},p.t))})}
function ring(p,size){size=size||90;const r=size/2-8,C=2*Math.PI*r;return`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--bd)" stroke-width="8"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--ok)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C*p/100} ${C}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-size="${size/4.2}" style="font-weight:700">${p}%</text></svg>`}
const labCard=b=>h('a',{class:'card labcard',href:'#/lab/'+b.id},h('div',{class:'wn',style:{margin:0}},(S.labs[b.id]?'✅ ':'🔬 ')+b.g),h('b',{},lt(b.t)),h('div',{class:'wn'},lt(b.aha)));

function pageHome(){setCrumb([{t:t2('داشبورد','Dashboard')}]);const v=view();v.innerHTML='';const last=byId(S.last)||LESSONS[0];const nl=(window.LABS||[]).length;
 const hero=h('div',{class:'hero'},h('div',{style:{display:'flex',gap:'22px',alignItems:'center',flexWrap:'wrap'}},h('div',{style:{flex:1,minWidth:'260px'}},h('h1',{},t2('کتاب تعاملی علوم کامپیوتر','The Interactive Computer Science Book')),h('div',{class:'sub',style:{textAlign:'start'}},'Data Structures · Database Systems · Mathematics for AI · Machine Learning'),
  h('p',{},t2(`یک محیط یادگیری سطح دانشگاهی با ${LESSONS.length} درس، ${nl} آزمایشگاه تصویری (معما ← کاوش ← نام‌گذاری ← چالش)، موتور SQL داخل مرورگر، تمرین با بازخورد فوری و ردیابی پیشرفت. دو زبانه: فارسی و English.`,`A university-level learning environment with ${LESSONS.length} lessons, ${nl} visual labs (Puzzle → Explore → Name → Challenge), an in-browser SQL engine, exercises with instant feedback and progress tracking. Bilingual: English and فارسی.`)),
  h('div',{class:'ctl'},h('a',{class:'btn pri',href:'#/l/'+last.id,style:{textDecoration:'none'}},S.last?t2('ادامه: ','Continue: ')+ttl(last):t2('شروع یادگیری: ','Start learning: ')+ttl(last)),h('a',{class:'btn',href:'#/labs',style:{textDecoration:'none'}},t2('🔬 آزمایشگاه‌ها','🔬 Visual labs')),h('a',{class:'btn',href:'#/p',style:{textDecoration:'none'}},t2('📊 پیشرفت من','📊 My progress')))),
  h('div',{html:ring(totalPct(),120),style:{textAlign:'center'}},)));
 v.append(hero);
 const g=h('div',{class:'grid g2'});for(const m in MODS){const M=MODS[m],ls=lessonsOf(m),q=quizAvg(ls);g.append(h('div',{class:'card mcard',onclick:()=>location.hash='#/m/'+m},h('h3',{},M.ic+' '+mt(M)),h('div',{class:'sub',style:{textAlign:'start'}},LANG==='en'?M.t:M.en),h('p',{style:{fontSize:'14.5px',color:'var(--mut)'}},md(M)),
  h('div',{class:'bar'+(modPct(m)===100?' ok':'')},h('i',{style:{width:modPct(m)+'%'}})),h('div',{class:'stat'},h('span',{},ls.length+t2(' درس',' lessons')),h('span',{},t2('تکمیل‌شده: ','Completed: '),h('b',{},ls.filter(l=>S.done[l.id]).length)),h('span',{},t2('میانگین آزمون: ','Quiz average: '),h('b',{},(q.pct??'—')+(q.pct!=null?'%':''))))))}
 v.append(g);
 v.append(h('h2',{},t2('چگونه از این کتاب استفاده کنیم؟','How to use this book')),h('div',{class:'grid g3',html:rich(t2(`
  <div class="card"><b>۱. بخوان و ببین</b><p style="font-size:14.5px">هر درس شامل هدف‌ها، پیش‌نیازها، توضیح نظری، مثال گام‌به‌گام و ویجت‌های تعاملی است. در ویجت‌ها پارامترها را تغییر بده و نتیجه را ببین.</p></div>
  <div class="card"><b>۲. در آزمایشگاه کشف کن</b><p style="font-size:14.5px">هر بخش یک آزمایشگاه ۴ مرحله‌ای دارد: معما، کاوش، نام‌گذاری و چالش. اول ایده را با دست خودت می‌سازی، بعد نامش را می‌فهمی.</p></div>
  <div class="card"><b>۳. تمرین کن</b><p style="font-size:14.5px">تمرین‌ها در سه سطح مبتدی، متوسط و پیشرفته‌اند. پاسخ SQL روی یک پایگاه داده نمونه واقعاً اجرا می‌شود و بازخورد فوری می‌گیری.</p></div>
  <div class="card"><b>۴. پیگیری و یادداشت</b><p style="font-size:14.5px">پیشرفت، نمره‌ی تمرین‌ها و یادداشت‌ها در مرورگر (localStorage) ذخیره می‌شود. کلید <code>/</code> جست‌وجو را باز می‌کند.</p></div>`,`
  <div class="card"><b>1. Read and watch</b><p style="font-size:14.5px">Each lesson has objectives, prerequisites, theory, worked examples and interactive widgets. Change the parameters and watch what happens.</p></div>
  <div class="card"><b>2. Discover in a lab</b><p style="font-size:14.5px">Each section has a 4-screen lab: Puzzle, Explore, Name, Challenge. You build the idea with your own hands first, then learn its name.</p></div>
  <div class="card"><b>3. Practice</b><p style="font-size:14.5px">Exercises come in three levels. SQL answers really run on a sample database and you get instant feedback.</p></div>
  <div class="card"><b>4. Track and annotate</b><p style="font-size:14.5px">Progress, exercise scores and notes are saved in your browser (localStorage). Press <code>/</code> to search.</p></div>`))}));
 renderMath(v)}

function pageModule(m){const M=MODS[m];if(!M)return pageHome();setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:mt(M)}]);const v=view();v.innerHTML='';
 v.append(h('h1',{},M.ic+' '+mt(M)),h('div',{class:'sub',style:{textAlign:'start'}},LANG==='en'?M.t:M.en),h('p',{},md(M)),h('div',{class:'bar'+(modPct(m)===100?' ok':'')},h('i',{style:{width:modPct(m)+'%'}})),h('p',{class:'wn'},t2(`پیشرفت ماژول: ${modPct(m)}٪`,`Module progress: ${modPct(m)}%`)));
 for(const g in M.g){const ls=LESSONS.filter(l=>l.g===g);if(!ls.length)continue;v.append(h('h3',{style:{direction:'ltr',textAlign:'left'}},M.g[g]));
  labsOf(g).forEach(b=>v.append(labCard(b)));
  ls.forEach(l=>{const s=lessonScore(l);v.append(h('a',{class:'card',href:'#/l/'+l.id,style:{display:'flex',gap:'12px',alignItems:'center',textDecoration:'none',color:'inherit',margin:'8px 0',padding:'10px 16px'}},h('span',{style:{fontSize:'20px'}},S.done[l.id]?'✅':S.vis[l.id]?'📖':'⚪'),h('div',{style:{flex:1}},h('b',{},ttl(l)),h('div',{class:'wn',style:{margin:0,direction:'ltr',textAlign:'start'}},LANG==='en'?'':l.en)),h('span',{class:'chip b'+l.lvl},lv(l.lvl)),h('span',{class:'chip'},l.min+t2(' دقیقه',' min')),h('span',{class:'chip'},s.c+'/'+s.n)))})}}

function pageLesson(id){const l=byId(id);if(!l)return pageHome();window._cur=l;S.last=id;S.vis[id]=1;save();const M=MODS[l.mod],X=LX(l);
 setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:mt(M),href:'#/m/'+l.mod},{t:M.g[l.g].split(' · ')[0]+' '+(M.g[l.g].split(' · ')[1]||'')},{t:X.t}]);
 buildNav(l);const v=view();v.innerHTML='';const i=LESSONS.indexOf(l),pv=LESSONS[i-1],nx=LESSONS[i+1];
 const doneBtn=btn('',()=>{S.done[l.id]=!S.done[l.id];save();upd();buildNav(l);toast(S.done[l.id]?t2('درس به‌عنوان تکمیل‌شده ثبت شد ✓','Lesson marked complete ✓'):t2('علامت تکمیل برداشته شد','Completion mark removed'))},'');
 const upd=()=>{doneBtn.textContent=S.done[l.id]?t2('✓ تکمیل شد','✓ Completed'):t2('علامت‌گذاری به‌عنوان تکمیل‌شده','Mark as completed');doneBtn.classList.toggle('pri',!!S.done[l.id]);doneBtn2.textContent=doneBtn.textContent;doneBtn2.classList.toggle('pri',!!S.done[l.id])};
 const doneBtn2=btn('',()=>doneBtn.click());
 v.append(h('h1',{},X.t),h('div',{class:'sub',style:{textAlign:'start'}},LANG==='en'?l.t:l.en),h('div',{class:'chips'},h('span',{class:'chip b'+l.lvl},lv(l.lvl)),h('span',{class:'chip'},'⏱ '+l.min+t2(' دقیقه',' min')),h('span',{class:'chip'},M.ic+' '+M.en),h('span',{class:'chip'},X.ex.length+t2(' تمرین',' exercises'))),h('div',{class:'ctl'},doneBtn,...labsOf(l.g).map(b=>h('a',{class:'btn',href:'#/lab/'+b.id,style:{textDecoration:'none'}},'🔬 '+t2('آزمایشگاه: ','Lab: ')+lt(b.t)))));
 if(!X.tr)v.append(h('div',{class:'callout warn',html:'<b class="t">English translation in progress</b>This lesson has not been translated yet, so the text below is still in Persian. Code, formulas, interactive widgets and exercise answer keys are the same in both languages.'}));
 v.append(h('div',{class:'grid g2'},h('div',{class:'card',html:'<b>'+t2('🎯 اهداف یادگیری','🎯 Learning objectives')+'</b><ul style="margin:6px 0 0;padding-inline-start:22px">'+X.obj.map(x=>`<li>${rich(x)}</li>`).join('')+'</ul>'}),h('div',{class:'card',html:'<b>'+t2('📚 پیش‌نیازها','📚 Prerequisites')+'</b><ul style="margin:6px 0 0;padding-inline-start:22px">'+X.pre.map(x=>{const p=byId(x);return p?`<li><a href="#/l/${p.id}">${ttl(p)}</a></li>`:`<li>${x}</li>`}).join('')+'</ul>'})));
 v.append(h('div',{html:rich(X.body)}));
 if(X.mis&&X.mis.length){v.append(h('h2',{},t2('⚠️ اشتباهات و تصورات غلط رایج','⚠️ Common mistakes and misconceptions')));X.mis.forEach(m=>v.append(h('div',{class:'callout bad',html:rich(m)})))}
 const fl=h('div',{class:'tabs ctl'});const exs=h('div');
 fl.append(h('span',{id:'scoreLine',class:'chip'}),h('span',{},t2('فیلتر سطح:','Level filter:')),...[0,1,2,3].map(k=>btn(k?lv(k):t2('همه','All'),e=>{$$('.ex',exs).forEach((c,j)=>c.style.display=(!k||X.ex[j].l===k)?'':'none');$$('.btn',fl).forEach(b=>b.classList.remove('on'));e.target.classList.add('on')},k===0?'on':'')));
 v.append(h('h2',{},t2('🧪 بررسی دانش و تمرین','🧪 Check your knowledge')),fl);X.ex.forEach((e,j)=>exs.append(exCard(l,e,j)));v.append(exs);
 v.append(h('h2',{},t2('📝 خلاصه درس','📝 Summary')),h('div',{class:'card',html:'<ul style="margin:0;padding-inline-start:22px">'+X.sum.map(x=>`<li>${rich(x)}</li>`).join('')+'</ul>'}));
 const ta=h('textarea',{class:'in',placeholder:t2('یادداشت‌های شخصی شما برای این درس (به‌صورت خودکار ذخیره می‌شود)…','Your personal notes for this lesson (saved automatically)…'),style:{direction:LANG==='en'?'ltr':'rtl',textAlign:LANG==='en'?'left':'right',fontFamily:'inherit',minHeight:'120px'}});ta.value=S.notes[l.id]||'';
 ta.addEventListener('input',()=>{S.notes[l.id]=ta.value;if(!ta.value)delete S.notes[l.id];save()});
 const prv=LANG==='en'?'← ':'→ ',nxt=LANG==='en'?' →':' ←';
 v.append(h('h2',{},t2('🗒️ یادداشت‌های من','🗒️ My notes')),ta,h('div',{class:'lnav'},pv?h('a',{class:'btn',href:'#/l/'+pv.id,style:{textDecoration:'none'}},prv+ttl(pv)):h('span'),doneBtn2,nx?h('a',{class:'btn pri',href:'#/l/'+nx.id,style:{textDecoration:'none'}},ttl(nx)+nxt):h('span')));
 upd();refreshScore();renderMath(v);mountWidgets(v);window.scrollTo(0,0)}

function pageProgress(){setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:t2('پیشرفت و یادداشت‌ها','Progress & notes')}]);const v=view();v.innerHTML='';const qa=quizAvg(),LB=window.LABS||[];
 v.append(h('h1',{},t2('📊 پیشرفت یادگیری','📊 Learning progress')),h('div',{class:'grid g3'},
  h('div',{class:'card',style:{textAlign:'center'},html:ring(totalPct(),110)+'<div>'+t2('پیشرفت کل','Overall progress')+'</div>'}),
  h('div',{class:'card',style:{textAlign:'center'},html:`<div style="font-size:38px;font-weight:700;direction:ltr">${qa.pct==null?'—':qa.pct+'%'}</div><div>${t2(`دقت پاسخ‌ها (${qa.c} صحیح از ${qa.a} تلاش)`,`Answer accuracy (${qa.c} correct of ${qa.a} attempts)`)}</div>`}),
  h('div',{class:'card',style:{textAlign:'center'},html:`<div style="font-size:38px;font-weight:700;direction:ltr">${LESSONS.filter(l=>S.done[l.id]).length}/${LESSONS.length}</div><div>${t2('درس تکمیل‌شده','Lessons completed')}</div>`}),
  h('div',{class:'card',style:{textAlign:'center'},html:`<div style="font-size:38px;font-weight:700;direction:ltr">${LB.filter(b=>S.labs[b.id]).length}/${LB.length}</div><div>${t2('چالش آزمایشگاه حل‌شده','Lab challenges solved')}</div>`})));
 for(const m in MODS){const M=MODS[m];v.append(h('h2',{},M.ic+' '+mt(M)+' — '+modPct(m)+t2('٪','%')));
  const rows=lessonsOf(m).map(l=>{const s=lessonScore(l);return[`<a href="#/l/${l.id}">${ttl(l)}</a>`,S.done[l.id]?'✅':S.vis[l.id]?t2('📖 در حال مطالعه','📖 In progress'):'—',s.a?`${s.c}/${s.n} (${Math.round(100*s.c/s.n)}%)`:'—',S.notes[l.id]?'📝':'']});
  v.append(h('div',{html:ft([t2('درس','Lesson'),t2('وضعیت','Status'),t2('نمره تمرین','Exercise score'),t2('یادداشت','Note')],rows)}))}
 const notes=LESSONS.filter(l=>S.notes[l.id]);v.append(h('h2',{},t2('🗒️ همه یادداشت‌ها','🗒️ All notes')));
 if(!notes.length)v.append(h('p',{class:'wn'},t2('هنوز یادداشتی ننوشته‌اید.','You have not written any notes yet.')));notes.forEach(l=>v.append(h('div',{class:'card',style:{margin:'8px 0'}},h('a',{href:'#/l/'+l.id},h('b',{},ttl(l))),h('div',{style:{whiteSpace:'pre-wrap',marginTop:'6px'}},S.notes[l.id]))));
 v.append(h('h2',{},t2('💾 پشتیبان‌گیری','💾 Backup')),h('div',{class:'ctl'},btn(t2('⬇ خروجی JSON','⬇ Export JSON'),()=>{const a=h('a',{href:URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'})),download:'cs-book-progress.json'});a.click()}),
  btn(t2('⬆ بازیابی از فایل','⬆ Import from file'),()=>{const i=h('input',{type:'file',accept:'.json'});i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(t=>{try{S=Object.assign(S,JSON.parse(t));save();toast(t2('بازیابی شد','Restored'));route()}catch(e){toast(t2('فایل نامعتبر است','Invalid file'))}})};i.click()}),
  btn(t2('🗑 پاک‌کردن همه پیشرفت‌ها','🗑 Reset all progress'),()=>{if(confirm(t2('همه پیشرفت‌ها، نمره‌ها و یادداشت‌ها پاک شود؟','Delete all progress, scores and notes?'))){S.done={};S.ex={};S.notes={};S.vis={};S.labs={};S.last='';save();route()}})))}

function pageSQL(){setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:'SQL Sandbox'}]);buildNav(null);const v=view();v.innerHTML='';
 v.append(h('h1',{},'🧪 SQL Sandbox'),h('div',{class:'sub',style:{textAlign:'start'}},'Free SQL practice on the sample database'),h('p',{},t2('هر پرس‌وجویی را روی پایگاه داده نمونه اجرا کنید. موتور داخلی از SELECT (JOIN، زیرپرسش، GROUP BY/HAVING، CTE، توابع پنجره‌ای)، INSERT، UPDATE و DELETE با اعمال قیدهای PK/FK/NOT NULL پشتیبانی می‌کند.','Run any query on the sample database. The built-in engine supports SELECT (JOIN, subqueries, GROUP BY/HAVING, CTE, window functions), INSERT, UPDATE and DELETE, enforcing PK/FK/NOT NULL constraints.')));
 const b=h('div',{class:'wbox','data-w':'sqlplay','data-t':'Sandbox'});b.dataset.o=JSON.stringify({q:'SELECT d.name AS dept, COUNT(e.id) AS n, ROUND(AVG(e.salary),1) AS avg_salary\nFROM departments d LEFT JOIN employees e ON e.dept_id = d.id\nGROUP BY d.name\nORDER BY n DESC;',schema:true});v.append(b);mountWidgets(v)}

/* ---- router ---- */
function route(){T.clear();const hsh=location.hash||'#/';const p=hsh.split('/');document.body.classList.remove('nav');
 if(p[1]==='l'){pageLesson(p[2]);return}
 if(p[1]==='lab'&&window.pageLab){buildNav(null);pageLab(p[2],p[3]);return}
 buildNav(null);
 if(p[1]==='m')pageModule(p[2]);else if(p[1]==='labs'&&window.pageLabs)pageLabs();else if(p[1]==='p')pageProgress();else if(p[1]==='sql')pageSQL();else pageHome();window.scrollTo(0,0)}

function boot(){setTheme(S.theme);applyLangShell();
 $('#themeBtn').onclick=()=>{setTheme(S.theme==='dark'?'light':'dark');route()};
 $('#langBtn').onclick=()=>setLang(LANG==='en'?'fa':'en');
 $('#burger').onclick=()=>document.body.classList.toggle('nav');
 $('#progBtn').onclick=()=>location.hash='#/p';
 $('#q').addEventListener('input',e=>doSearch(e.target.value));
 $('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){const a=$('#res a[href]');if(a)a.click()}if(e.key==='Escape'){$('#res').style.display='none';e.target.blur()}});
 document.addEventListener('click',e=>{if(!e.target.closest('.srch'))$('#res').style.display='none'});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();document.body.classList.add('nav');$('#q').focus()}});
 window.addEventListener('hashchange',route);route()}
