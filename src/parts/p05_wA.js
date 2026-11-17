/* ===================== WIDGETS: Module A ===================== */
function layoutKids(root){const out=[];let x=0;const go=(n,d,p)=>{let me={n,d,p,x:0};if(!n.kids.length){me.x=x++}else{const cs=n.kids.map(k=>go(k,d+1,me));me.x=(cs[0].x+cs[cs.length-1].x)/2}out.push(me);return me};go(root,0,null);return out}
const rn=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

W.cplx=(el)=>{const N=rng('بیشینه n در محور',5,60,1,20,draw),nn=rng('n برای جدول',1,1000,1,100,tab,v=>v);const box=h('div',{class:'stage'}),tb=h('div');
 const F=[['O(1)',n=>1,'#38c98a'],['O(log n)',n=>Math.log2(n),'#5aa9ff'],['O(n)',n=>n,'#f5b74a'],['O(n log n)',n=>n*Math.log2(n),'#b48cff'],['O(n²)',n=>n*n,'#ff8a5b'],['O(2ⁿ)',n=>Math.pow(2,n),'#ff6b6b']];
 function draw(){box.innerHTML='';const n=N.get(),ym=n*Math.log2(n)*2.2;const c=chart(620,300,1,n,0,ym,{l:46});c.axes(5,5);F.forEach(([nm,f,col],i)=>{c.path(f,col,1,n,160);c.svg.append(sv('text',{x:70+i*88,y:20,fill:col,'font-size':12},nm))});box.append(c.svg)}
 function tab(){const n=nn.get();tb.innerHTML='';const rows=F.map(([nm,f])=>{const v=f(n);const t=v/1e9;return[nm,v>1e12?v.toExponential(2):fmt(v,1),t<1e-6?'< 1 µs':t<1e-3?fmt(t*1e6,1)+' µs':t<1?fmt(t*1e3,2)+' ms':t<86400*365?fmt(t,1)+' s':'≈ '+(t/86400/365).toExponential(1)+' سال']});
  tb.append(dtable(['رشد','تعداد عملیات برای n='+n,'زمان تقریبی با 10⁹ عمل/ثانیه'],rows))}
 body_(el,ctl(N,nn),box,tb,h('div',{class:'wn'},'محور y عمداً کوتاه شده تا نشان دهد 2ⁿ و n² خیلی زود از نمودار خارج می‌شوند. زمان‌ها فقط تخمین مرتبه‌ی بزرگی‌اند، نه اندازه‌گیری واقعی.'));draw();tab()};
const body_=(el,...k)=>el.append(...k);

W.linsearch=(el)=>{const n=12,a=Array.from({length:n},(_,i)=>(i*7+3)%50);let t=5;const box=h('div',{class:'stage'}),st=h('div',{class:'stat'});
 function draw(){box.innerHTML='';const svg=sv('svg',{class:'sv',viewBox:`0 0 ${n*50+20} 70`,width:n*50+20});let cmp=0,found=-1;for(let i=0;i<n;i++){cmp++;if(a[i]===a[t]&&t<n){found=i;break}}
  if(t>=n)cmp=n;a.forEach((v,i)=>{const vis=t>=n?true:i<=t;svg.append(sv('rect',{x:10+i*50,y:10,width:46,height:40,rx:6,class:'cell',style:`fill:${vis?(i===t?'var(--hl)':'var(--panel2)'):'var(--panel)'};stroke:var(--bd)`,onclick:()=>{t=i;draw()}}),sv('text',{x:33+i*50,y:36,'text-anchor':'middle',style:i===t?'fill:#111':'',onclick:()=>{t=i;draw()}},v),sv('text',{x:33+i*50,y:64,'text-anchor':'middle','font-size':10,class:'mut'},i))});
  box.append(svg);st.innerHTML=`<span>هدف: <b>${t>=n?'مقدار غایب':a[t]}</b></span><span>تعداد مقایسه: <b>${cmp}</b></span><span>Best Case=1 · Worst Case=${n} · Average≈${(n+1)/2}</span>`}
 body_(el,h('div',{class:'wn'},'روی هر خانه کلیک کنید تا آن مقدار هدف شود (جست‌وجوی خطی از چپ). برای «غایب» دکمه زیر را بزنید.'),box,st,ctl(btn('هدف غایب (Worst Case)',()=>{t=n;draw()}),btn('هدف = اولین عنصر (Best Case)',()=>{t=0;draw()})));draw()};

W.dynarr=(el)=>{const N=rng('تعداد push',1,64,1,20,draw,v=>v),M=sel('استراتژی رشد',[{v:'dbl',t:'دو برابر کردن ظرفیت'},{v:'inc',t:'افزایش ثابت (+4)'}],'dbl',draw);const box=h('div',{class:'stage'}),st=h('div',{class:'stat'});
 function sim(n,mode){let cap=1,len=0,tot=0;const cost=[];const caps=[];for(let i=0;i<n;i++){let c=1;if(len===cap){c+=len;cap=mode==='dbl'?cap*2:cap+4}len++;tot+=c;cost.push(c);caps.push(cap)}return{cost,tot,caps}}
 function draw(){box.innerHTML='';const n=N.get(),r=sim(n,M.get());const mx=Math.max(...r.cost);const c=chart(640,230,0,n+1,0,mx*1.1,{l:40});c.axes(Math.min(n,8),4);r.cost.forEach((v,i)=>c.bar(i+1,v,Math.max(2,500/n*.6),v>1?'var(--bad)':'var(--ac)'));
  const run=[];let s=0;r.cost.forEach((v,i)=>{s+=v;run.push(s/(i+1))});c.svg.append(sv('path',{d:run.map((v,i)=>(i?'L':'M')+c.X(i+1)+' '+c.Y(v)).join(''),stroke:'var(--ok)',fill:'none','stroke-width':2.4}));box.append(c.svg);
  st.innerHTML=`<span>هزینه کل: <b>${r.tot}</b></span><span>میانگین هر push (سرشکن): <b>${fmt(r.tot/n,2)}</b></span><span>ظرفیت نهایی: <b>${r.caps[n-1]}</b></span><span>گران‌ترین push: <b>${mx}</b></span>`}
 body_(el,ctl(N,M),box,st,h('div',{class:'wn'},'میله‌های قرمز = pushهایی که باعث کپی کل آرایه شده‌اند. خط سبز = میانگین تجمعی هزینه. با دو برابر کردن، میانگین به عددی ثابت (کمتر از ۳) میل می‌کند؛ با افزایش ثابت، میانگین با n بزرگ می‌شود (Θ(n) سرشکن).'));draw()};

W.llist=(el)=>{let a=[3,8,15,21];let dbl=false;const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'},'عملیات را امتحان کنید.');const v=h('input',{type:'number',value:42}),ix=h('input',{type:'number',value:1,style:{width:'60px'}});
 function draw(hi,cls){box.innerHTML='';const W_=dbl?92:80;const svg=sv('svg',{class:'sv',viewBox:`0 0 ${Math.max(a.length,1)*W_+80} 90`,width:Math.max(a.length,1)*W_+80});svg.append(sv('text',{x:10,y:18,'font-size':12,class:'mut'},'head'));svg.append(sv('path',{d:'M26 24 L26 36',stroke:'var(--mut)'}));
  a.forEach((x,i)=>{const X=14+i*W_,on=hi&&hi.includes(i);svg.append(sv('rect',{x:X,y:36,width:W_-26,height:36,rx:6,class:'nd'+(on?(cls||' hi'):'')}),sv('text',{x:X+(W_-26)/2,y:59,'text-anchor':'middle',style:on?'fill:#111':''},x));
   if(i<a.length-1){svg.append(sv('path',{d:`M${X+W_-26} 54 L${X+W_-4} 54`,stroke:'var(--mut)','stroke-width':1.6,'marker-end':'url(#ar)'}));if(dbl)svg.append(sv('path',{d:`M${X+W_-4} 64 L${X+W_-26} 64`,stroke:'var(--mut)','stroke-width':1.2,'marker-end':'url(#ar)'}))}else svg.append(sv('text',{x:X+W_-22,y:58,class:'mut','font-size':11},'null'))});
  svg.append(sv('defs',{},sv('marker',{id:'ar',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'},sv('path',{d:'M0 0L6 3L0 6z',fill:'var(--mut)'}))));box.append(svg)}
 const val=()=>parseInt(v.value),idx=()=>parseInt(ix.value);
 const ops=[btn('insertHead  O(1)',()=>{a.unshift(val());draw([0]);msg.textContent='ساخت گره جدید و اشاره‌ی head به آن: ۱ گام، مستقل از طول لیست.'}),
  btn('insertTail  O(n)',()=>{a.push(val());draw([a.length-1]);msg.textContent=`بدون اشاره‌گر tail باید ${a.length-1} گره را پیمایش کنیم تا به انتها برسیم (با tail نگه‌داشته‌شده: O(1)).`}),
  btn('insertAt(i)',()=>{const i=Math.max(0,Math.min(a.length,idx()));a.splice(i,0,val());draw([i]);msg.textContent=`پیمایش ${i} گام تا گره قبلی + O(1) تغییر اشاره‌گر ⇒ O(i). یافتن موقعیت گران است، خودِ درج ارزان.`}),
  btn('delete(value)',()=>{const i=a.indexOf(val());if(i<0){msg.textContent='مقدار پیدا نشد؛ برای تشخیص آن کل لیست پیمایش شد (n گام).';draw(a.map((_,k)=>k),' bad');return}a.splice(i,1);draw([Math.min(i,a.length-1)]);msg.textContent=`پس از ${i+1} گام پیمایش، اشاره‌گر گره قبلی عوض شد. در Doubly Linked List با داشتن خود گره، حذف O(1) است.`}),
  btn('search(value)',()=>{const i=a.indexOf(val());draw(i<0?a.map((_,k)=>k):a.slice(0,i+1).map((_,k)=>k),i<0?' bad':' ok');msg.textContent=i<0?`پیدا نشد پس از ${a.length} گام ⇒ O(n)`:`پیدا شد پس از ${i+1} گام (دسترسی تصادفی ندارد).`})];
 body_(el,ctl(h('label',{},'مقدار',v),h('label',{},'اندیس',ix),h('label',{},h('input',{type:'checkbox',onchange:e=>{dbl=e.target.checked;draw()}}),'Doubly Linked')),ctl(...ops),box,msg);draw()};

W.stackq=(el)=>{let mode='stack',a=[4,7,2];const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'},'');const ops=h('div',{class:'ctl'});let cnt=10;
 const M=sel('ساختار',[{v:'stack',t:'Stack (LIFO)'},{v:'queue',t:'Queue (FIFO)'},{v:'deque',t:'Deque'}],'stack',v=>{mode=v;mk();draw()});
 function draw(){box.innerHTML='';const svg=sv('svg',{class:'sv',viewBox:`0 0 ${Math.max(a.length,3)*58+120} 100`,width:Math.max(a.length,3)*58+120});
  if(mode==='stack'){a.forEach((x,i)=>svg.append(sv('rect',{x:60+i*58,y:30,width:52,height:44,rx:6,class:'nd'+(i===a.length-1?' hi':'')}),sv('text',{x:86+i*58,y:58,'text-anchor':'middle',style:i===a.length-1?'fill:#111':''},x)));svg.append(sv('text',{x:6,y:58,class:'mut','font-size':12},'bottom'),sv('text',{x:60+a.length*58,y:58,class:'mut','font-size':12},'← top'))}
  else{a.forEach((x,i)=>svg.append(sv('rect',{x:20+i*58,y:30,width:52,height:44,rx:6,class:'nd'+((i===0||i===a.length-1)?' hi':'')}),sv('text',{x:46+i*58,y:58,'text-anchor':'middle',style:(i===0||i===a.length-1)?'fill:#111':''},x)));svg.append(sv('text',{x:20,y:20,class:'mut','font-size':12},'front'),sv('text',{x:20+Math.max(a.length-1,0)*58,y:92,class:'mut','font-size':12},'rear/back'))}
  box.append(svg)}
 function mk(){ops.innerHTML='';const add=(t,f)=>ops.append(btn(t,()=>{f();draw()}));
  if(mode==='stack'){add('push (O(1))',()=>{a.push(++cnt);msg.textContent='push: افزودن به بالا'});add('pop (O(1))',()=>{msg.textContent=a.length?`pop: ${a.pop()} حذف شد — آخرین ورودی، اولین خروجی`:'Stack Underflow: پشته خالی است!'});add('peek',()=>{msg.textContent=a.length?'top = '+a[a.length-1]:'خالی'})}
  else if(mode==='queue'){add('enqueue (O(1))',()=>{a.push(++cnt);msg.textContent='enqueue: افزودن به انتهای صف'});add('dequeue',()=>{msg.textContent=a.length?`dequeue: ${a.shift()} خارج شد — اولین ورودی، اولین خروجی (با آرایه ساده shift هزینه O(n) دارد؛ صف واقعی از حلقه/لیست پیوندی استفاده می‌کند)`:'Queue Underflow!'})}
  else{add('addFront',()=>{a.unshift(++cnt)});add('addBack',()=>{a.push(++cnt)});add('removeFront',()=>{msg.textContent=a.length?'حذف از جلو: '+a.shift():'خالی'});add('removeBack',()=>{msg.textContent=a.length?'حذف از عقب: '+a.pop():'خالی'});msg.textContent='Deque هر چهار عملیات دو سر را در O(1) سرشکن پشتیبانی می‌کند.'}}
 body_(el,ctl(M),ops,box,msg);mk();draw()};

W.hash=(el)=>{let m=7,mode='chain',T_=[],cnt=0;const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'},'کلید را وارد و Insert کنید (hash: h = (h·31 + کد کاراکتر) mod m).');const inp=h('input',{type:'text',value:'apple',style:{width:'110px'}});
 function reset(){T_=Array.from({length:m},()=>mode==='chain'?[]:null);cnt=0}
 const M=sel('حل برخورد',[{v:'chain',t:'Chaining'},{v:'probe',t:'Linear Probing'}],'chain',v=>{mode=v;reset();draw()}),MM=rng('اندازه جدول m',5,13,1,7,v=>{m=v;reset();draw()},v=>v);
 function draw(hi){box.innerHTML='';const svg=sv('svg',{class:'sv',viewBox:`0 0 640 ${m*34+10}`,width:640});T_.forEach((c,i)=>{const y=6+i*34;svg.append(sv('rect',{x:10,y,width:46,height:28,class:'cell',fill:'var(--panel2)'}),sv('text',{x:33,y:y+19,'text-anchor':'middle'},i));
   if(mode==='chain')c.forEach((k,j)=>{svg.append(sv('rect',{x:70+j*86,y,width:76,height:28,rx:6,class:'nd'+(hi&&hi[0]===i&&hi[1]===j?' hi':'')}),sv('text',{x:108+j*86,y:y+19,'text-anchor':'middle',style:hi&&hi[0]===i&&hi[1]===j?'fill:#111':''},k));if(j<c.length-1)svg.append(sv('path',{d:`M${146+j*86} ${y+14} L${156+j*86} ${y+14}`,stroke:'var(--mut)'}))});
   else if(c!==null)svg.append(sv('rect',{x:70,y,width:100,height:28,rx:6,class:'nd'+(hi&&hi.includes(i)?' hi':'')}),sv('text',{x:120,y:y+19,'text-anchor':'middle',style:hi&&hi.includes(i)?'fill:#111':''},c==='#'?'⚰ tombstone':c))});
  box.append(svg);const n=T_.reduce((s,c)=>s+(mode==='chain'?c.length:(c&&c!=='#'?1:0)),0);box.append(h('div',{class:'stat'},h('span',{},'تعداد کلیدها n=',h('b',{},n)),h('span',{},'ضریب بار α=n/m = ',h('b',{},fmt(n/m,2))),h('span',{},'مقدار hash جاری: ',h('b',{},Lib.hash(inp.value,m)))))}
 const key=()=>inp.value.trim();
 function ins(){const k=key();if(!k)return;const i=Lib.hash(k,m);if(mode==='chain'){if(T_[i].includes(k)){msg.textContent='کلید تکراری';return}T_[i].push(k);draw([i,T_[i].length-1]);msg.textContent=`h("${k}") = ${i}. ${T_[i].length>1?'برخورد! به زنجیره‌ی خانه '+i+' اضافه شد.':'خانه خالی بود.'}`}
  else{let p=0,j=i;while(p<m&&T_[j]!==null&&T_[j]!=='#'&&T_[j]!==k){j=(j+1)%m;p++}if(p>=m){msg.textContent='جدول پر است! (rehash لازم است)';return}T_[j]=k;draw([j]);msg.textContent=`h("${k}") = ${i}. ${p?`برخورد: ${p} خانه جلو رفتیم و در خانه ${j} قرار گرفت (Clustering).`:'خانه خالی بود.'}`}}
 function find(del){const k=key(),i=Lib.hash(k,m);if(mode==='chain'){const j=T_[i].indexOf(k);if(j<0){msg.textContent=`در زنجیره خانه ${i} (${T_[i].length} عنصر) پیدا نشد.`;draw();return}if(del){T_[i].splice(j,1);draw();msg.textContent='حذف شد.'}else{draw([i,j]);msg.textContent=`پیدا شد: خانه ${i}، موقعیت ${j+1} در زنجیره.`}}
  else{let p=0,j=i;while(p<m&&T_[j]!==null&&T_[j]!==k){j=(j+1)%m;p++}if(p>=m||T_[j]===null){msg.textContent=`پیدا نشد (پس از ${p+1} بررسی؛ به خانه خالی رسیدیم).`;draw();return}if(del){T_[j]='#';draw([j]);msg.textContent='حذف با tombstone: اگر خانه را null می‌کردیم، جست‌وجوی کلیدهای بعدیِ زنجیره می‌شکست.'}else{draw([j]);msg.textContent=`پیدا شد در خانه ${j} پس از ${p+1} بررسی.`}}}
 body_(el,ctl(M,MM),ctl(h('label',{},'کلید',inp),btn('Insert',ins,'pri'),btn('Search',()=>find(false)),btn('Delete',()=>find(true)),btn('۸ کلید نمونه',()=>{reset();['cat','dog','bird','fish','owl','ant','bee','fox'].forEach(k=>{inp.value=k;ins()});inp.value='cat';draw();msg.textContent='۸ کلید درج شد؛ برخوردها را در جدول ببینید.'}),btn('پاک‌کردن',()=>{reset();draw()})),box,msg);reset();draw()};

function drawTree(svg,root,o){o=o||{};const pos=Lib.layout(root);const dx=o.dx||40,dy=o.dy||56;const byK={};pos.forEach(p=>byK[p.k]=p);
 pos.forEach(p=>{if(p.par!==null){const q=byK[p.par];svg.append(sv('line',{x1:q.x*dx+30,y1:q.y*dy+28,x2:p.x*dx+30,y2:p.y*dy+28,class:'lnk'}))}});
 pos.forEach(p=>{const c=o.cls&&o.cls[p.k]||'';svg.append(sv('g',{},sv('circle',{cx:p.x*dx+30,cy:p.y*dy+28,r:17,class:'nd '+c}),sv('text',{x:p.x*dx+30,y:p.y*dy+33,'text-anchor':'middle','font-size':13},p.k)));
  if(o.bf)svg.append(sv('text',{x:p.x*dx+30,y:p.y*dy+56,'text-anchor':'middle','font-size':10,fill:Math.abs(Lib.bf(p.n))>1?'var(--bad)':'var(--mut)'},'bf='+Lib.bf(p.n)))});
 return{w:Math.max(pos.length,1)*dx+40,h:(Math.max(0,...pos.map(p=>p.y))+1)*dy+30}}
W.tree=(el,o)=>{let root=null;const avl=o.mode==='avl';const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'},avl?'در AVL پس از هر درج، ضریب تعادل (bf = ارتفاع چپ − ارتفاع راست) بررسی و در صورت لزوم چرخش انجام می‌شود.':'BST: کوچک‌ترها سمت چپ، بزرگ‌ترها سمت راست.');const inp=h('input',{type:'number',value:50,style:{width:'80px'}});let hi={};const trav=h('div');let pl=null;
 function draw(){box.innerHTML='';const svg=sv('svg',{class:'sv'});if(!root){box.append(h('div',{class:'wn'},'درخت خالی است — چند کلید درج کنید.'));return}const d=drawTree(svg,root,{cls:hi,bf:avl});svg.setAttribute('viewBox',`0 0 ${d.w} ${d.h}`);svg.setAttribute('width',d.w);box.append(svg)}
 const val=()=>parseInt(inp.value);
 const ins=k=>{if(isNaN(k))return;if(avl){const lg=[];const had=Lib.search(root,k).found;root=Lib.avlInsert(root,k,lg);hi={};hi[k]='hi';draw();msg.textContent=had?'کلید تکراری':lg.length?'درج '+k+' ← '+lg.join(' ⟶ '):`درج ${k}: بدون نیاز به چرخش.`}
  else{const r=Lib.bstInsert(root,k);root=r.root;hi={};r.path.forEach(p=>hi[p]='pr');hi[k]='hi';draw();msg.textContent=r.added?`مسیر مقایسه: ${r.path.join(' → ')||'(ریشه)'} ← ${k} درج شد (${r.path.length} مقایسه).`:'کلید تکراری'}};
 const ctls=[h('label',{},'کلید',inp),btn('Insert',()=>ins(val()),'pri'),btn('Search',()=>{const r=Lib.search(root,val());hi={};r.path.forEach(p=>hi[p]='pr');if(r.found)hi[val()]='ok';draw();msg.textContent=(r.found?'پیدا شد':'پیدا نشد')+` — مسیر: ${r.path.join(' → ')} (${r.path.length} مقایسه، حداکثر برابر ارتفاع درخت)`})];
 if(!avl)ctls.push(btn('Delete',()=>{const r=Lib.bstDelete(root,val());root=r.root;hi={};draw();msg.textContent=r.found?'حذف شد (برای گره با دو فرزند، جانشین Inorder جایگزین می‌شود).':'کلید وجود ندارد'}));
 ctls.push(btn('نمونه تصادفی ۱۰ کلیدی',()=>{root=null;const s=new Set();while(s.size<10)s.add(rn(1,99));[...s].forEach(k=>{if(avl)root=Lib.avlInsert(root,k,[]);else root=Lib.bstInsert(root,k).root});hi={};draw();msg.textContent='درخت تصادفی ساخته شد.'}),
  btn(avl?'درج ۱۰..۷۰ (مرتب)':'درج ۱۰..۷۰ (مرتب ← درخت منحط)',()=>{root=null;[10,20,30,40,50,60,70].forEach(k=>{if(avl)root=Lib.avlInsert(root,k,[]);else root=Lib.bstInsert(root,k).root});hi={};draw();msg.textContent=avl?'AVL با درج مرتب هم متعادل می‌ماند: ارتفاع '+root.h:'درج مرتب BST ساده را به لیست پیوندی تبدیل می‌کند: ارتفاع '+root.h+' ⇒ جست‌وجو O(n)'}),btn('پاک‌کردن',()=>{root=null;hi={};draw()}));
 const tb=h('div',{class:'ctl'},h('span',{},'پیمایش:'),...[['pre','Preorder'],['in','Inorder'],['post','Postorder'],['level','Level-order (BFS)']].map(([k,t])=>btn(t,()=>{if(!root)return;const ord=Lib.order(root,k);const fr=ord.map((_,i)=>({o:ord.slice(0,i+1),d:`${t}: ${ord.slice(0,i+1).join(', ')}`}));trav.innerHTML='';
   player(trav,fr,(st,f)=>{hi={};f.o.forEach(x=>hi[x]='pr');hi[f.o[f.o.length-1]]='hi';draw()},{speed:6})})));
 body_(el,ctl(...ctls),tb,box,msg,trav);draw()};

W.rbcheck=(el)=>{const T_={k:13,c:'B',l:{k:8,c:'R',l:{k:1,c:'B',r:{k:6,c:'R'}},r:{k:11,c:'B'}},r:{k:17,c:'B',l:{k:15,c:'R'},r:{k:25,c:'R'}}};
 const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'});
 function lay(n,d,st){if(!n)return;lay(n.l,d+1,st);n.x=st.x++;n.y=d;lay(n.r,d+1,st)}
 function check(){const errs=[];if(T_.c==='R')errs.push('ریشه باید سیاه باشد');let bh=null;const go=(n,b,p)=>{if(!n){if(bh===null)bh=b;else if(bh!==b)errs.push('black-height مسیرها برابر نیست ('+bh+' ≠ '+b+')');return}
   if(n.c==='R'&&p&&p.c==='R')errs.push(`گره قرمز ${n.k} فرزند گره قرمز ${p.k} است`);go(n.l,b+(n.c==='B'?1:0),n);go(n.r,b+(n.c==='B'?1:0),n)};go(T_,0,null);return[...new Set(errs)]}
 function draw(){box.innerHTML='';lay(T_,0,{x:0});const svg=sv('svg',{class:'sv',viewBox:'0 0 360 220',width:360});const walk=(n,f)=>{if(!n)return;f(n);walk(n.l,f);walk(n.r,f)};
  walk(T_,n=>{[n.l,n.r].forEach(c=>c&&svg.append(sv('line',{x1:n.x*46+25,y1:n.y*56+26,x2:c.x*46+25,y2:c.y*56+26,class:'lnk'})))});
  walk(T_,n=>{svg.append(sv('circle',{cx:n.x*46+25,cy:n.y*56+26,r:18,fill:n.c==='R'?'#d94a4a':'#1b1b1b',stroke:'var(--mut)','stroke-width':2,style:'cursor:pointer',onclick:()=>{n.c=n.c==='R'?'B':'R';draw()}}),sv('text',{x:n.x*46+25,y:n.y*56+31,'text-anchor':'middle','font-size':13,style:'fill:#fff;pointer-events:none'},n.k))});box.append(svg);
  const e=check();msg.className='desc';msg.innerHTML=e.length?'❌ <b>درخت Red-Black معتبر نیست:</b> '+e.join('؛ '):'✅ هر چهار ویژگی برقرار است: ریشه سیاه، بدون دو قرمز متوالی، black-height برابر در همه مسیرها (برگ‌های NIL سیاه‌اند).'}
 body_(el,h('div',{class:'wn'},'روی هر گره کلیک کنید تا رنگ آن (قرمز/سیاه) عوض شود و ببینید کدام قانون نقض می‌شود.'),box,msg,ctl(btn('بازنشانی',()=>{T_.c='B';T_.l.c='R';T_.l.l.c='B';T_.l.l.r.c='R';T_.l.r.c='B';T_.r.c='B';T_.r.l.c='R';T_.r.r.c='R';draw()})));draw()};

W.heap=(el)=>{let a=[],kind='min';const box=h('div',{class:'stage'});const inp=h('input',{type:'number',value:7,style:{width:'70px'}});let pl;
 const less=(x,y)=>kind==='min'?x<y:x>y;
 const fr=(d,hi)=>({a:a.slice(),hi:hi||[],d});
 function drawH(st,f){st.innerHTML='';const n=f.a.length;const levels=n?Math.floor(Math.log2(n))+1:1;const Wd=Math.max(400,Math.pow(2,levels-1)*44);const svg=sv('svg',{class:'sv',viewBox:`0 0 ${Wd} ${levels*54+70}`,width:Wd});
  const P=i=>{const l=Math.floor(Math.log2(i+1)),k=i+1-Math.pow(2,l);return[(k+.5)*Wd/Math.pow(2,l),24+l*54]};
  f.a.forEach((_,i)=>{if(i>0){const[x1,y1]=P((i-1)>>1),[x2,y2]=P(i);svg.append(sv('line',{x1,y1,x2,y2,class:'lnk'}))}});
  f.a.forEach((v,i)=>{const[x,y]=P(i);svg.append(sv('circle',{cx:x,cy:y,r:17,class:'nd '+(f.hi.includes(i)?'hi':'')}),sv('text',{x,y:y+5,'text-anchor':'middle'},v))});
  const ay=levels*54+10;f.a.forEach((v,i)=>{const x=10+i*40;if(x>Wd-40)return;svg.append(sv('rect',{x,y:ay,width:36,height:30,class:'cell',style:'fill:'+(f.hi.includes(i)?'var(--hl)':'var(--panel2)')}),sv('text',{x:x+18,y:ay+20,'text-anchor':'middle',style:f.hi.includes(i)?'fill:#111':''},v),sv('text',{x:x+18,y:ay+44,'text-anchor':'middle','font-size':9,class:'mut'},i))});st.append(svg)}
 const host=h('div');
 function insert(v){a.push(v);const F=[fr(`درج ${v} در انتهای آرایه (اولین جای خالی درخت کامل)`,[a.length-1])];let i=a.length-1;while(i>0){const p=(i-1)>>1;if(less(a[i],a[p])){[a[i],a[p]]=[a[p],a[i]];F.push(fr(`sift-up: ${a[p]} از والد (${a[i]}) ${kind==='min'?'کوچک‌تر':'بزرگ‌تر'} است ← جابه‌جایی`,[p,i]));i=p}else{F.push(fr('شرط هیپ برقرار است؛ توقف',[i]));break}}
  if(i===0&&F.length>1)F.push(fr('به ریشه رسید',[0]));pl.set(F)}
 function extract(){if(!a.length)return;const top=a[0];const last=a.pop();const F=[fr(`ریشه (${top}) خارج می‌شود`,[0])];if(a.length){a[0]=last;F.push(fr(`آخرین عنصر (${last}) به ریشه منتقل شد`,[0]));let i=0;for(;;){let l=2*i+1,r=l+1,b=i;if(l<a.length&&less(a[l],a[b]))b=l;if(r<a.length&&less(a[r],a[b]))b=r;if(b===i){F.push(fr('sift-down تمام شد',[i]));break}[a[i],a[b]]=[a[b],a[i]];F.push(fr(`sift-down: جابه‌جایی با فرزند ${kind==='min'?'کوچک‌تر':'بزرگ‌تر'} (${a[i]})`,[i,b]));i=b}}else F.push(fr('هیپ خالی شد'));
  pl.set(F);toastIt(`extract: ${top}`)}
 const toastIt=toast;
 body_(el,ctl(sel('نوع',[{v:'min',t:'Min-Heap'},{v:'max',t:'Max-Heap'}],'min',v=>{kind=v;a=[];pl.set([fr('هیپ خالی')])}),h('label',{},'مقدار',inp),btn('Insert (O(log n))',()=>insert(parseInt(inp.value)),'pri'),btn('Extract (O(log n))',extract),btn('۸ مقدار تصادفی',()=>{a=[];let F=[];for(let i=0;i<8;i++){const v=rn(1,60);insert(v)}pl.go(pl.i)})),host);
 pl=player(host,[fr('هیپ خالی است — درج کنید.')],drawH);insert(15);insert(9);insert(20);insert(4)};

W.trie=(el)=>{const root=Lib.trieNode();['car','card','care','cat','dog','do'].forEach(w=>Lib.trieInsert(root,w));let words=['car','card','care','cat','dog','do'];const box=h('div',{class:'stage'}),msg=h('div',{class:'desc'},'کلمه را اضافه کنید یا پیشوند را جست‌وجو کنید.');const w1=h('input',{type:'text',value:'cart',style:{width:'110px'}}),w2=h('input',{type:'text',value:'ca',style:{width:'110px'}});
 function conv(n,ch){return{ch,end:n.end,kids:Object.keys(n.c).sort().map(c=>conv(n.c[c],c)),n}}
 function draw(pre){box.innerHTML='';const r=conv(root,'∅');const L_=layoutKids(r);const mx=Math.max(...L_.map(l=>l.x)),md=Math.max(...L_.map(l=>l.d));const svg=sv('svg',{class:'sv',viewBox:`0 0 ${(mx+1)*44+30} ${(md+1)*54+30}`,width:(mx+1)*44+30});
  const on=new Set();if(pre!==undefined){let n=root;on.add(root);for(const c of pre){if(!n.c[c])break;n=n.c[c];on.add(n)}}
  L_.forEach(l=>l.p&&svg.append(sv('line',{x1:l.p.x*44+30,y1:l.p.d*54+26,x2:l.x*44+30,y2:l.d*54+26,class:'lnk'})));
  L_.forEach(l=>{const x=l.x*44+30,y=l.d*54+26;svg.append(sv('circle',{cx:x,cy:y,r:16,class:'nd '+(on.has(l.n.n)?'hi':l.n.end?'ok':'')}),sv('text',{x,y:y+5,'text-anchor':'middle'},l.n.ch))});box.append(svg)}
 body_(el,ctl(h('label',{},'کلمه',w1),btn('Insert',()=>{const w=w1.value.trim().toLowerCase();if(!w)return;Lib.trieInsert(root,w);if(!words.includes(w))words.push(w);draw();msg.textContent=`"${w}" با ${w.length} گام درج شد (هزینه به طول کلمه بستگی دارد، نه به تعداد کل کلمات). گره‌های سبز = پایان کلمه.`},'pri'),h('label',{},'پیشوند',w2),btn('Autocomplete',()=>{const p=w2.value.trim().toLowerCase();const n=Lib.trieWalk(root,p);draw(p);msg.textContent=n?`کلمات با پیشوند "${p}": ${Lib.trieWords(n,p).join(', ')||'—'}`:`هیچ کلمه‌ای با پیشوند "${p}" وجود ندارد.`})),box,msg);draw()};

const GP={directed:false};
function drawGraph(svg,g,o){o=o||{};const P={};g.n.forEach(x=>P[x.id]=x);svg.append(sv('defs',{},sv('marker',{id:'arw',markerWidth:9,markerHeight:9,refX:9,refY:4,orient:'auto'},sv('path',{d:'M0 0L8 4L0 8z',fill:'var(--mut)'}))));
 g.e.forEach(e=>{const a=P[e.a],b=P[e.b];const on=(o.tree||[]).some(t=>(t[0]===e.a&&t[1]===e.b)||(!g.dir&&t[0]===e.b&&t[1]===e.a));const rl=o.rel&&((o.rel[0]===e.a&&o.rel[1]===e.b)||(!g.dir&&o.rel[0]===e.b&&o.rel[1]===e.a));
  const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,R=g.dir?22:0;
  svg.append(sv('line',{x1:a.x,y1:a.y,x2:b.x-ux*R,y2:b.y-uy*R,stroke:rl?'var(--bad)':on?'var(--ok)':'var(--mut)','stroke-width':rl||on?4:1.8,'marker-end':g.dir?'url(#arw)':null}));
  if(o.weights!==false){const mx=(a.x+b.x)/2-uy*10,my=(a.y+b.y)/2+ux*10;svg.append(sv('text',{x:mx,y:my+4,'text-anchor':'middle','font-size':12,fill:'var(--warn)',style:'font-weight:700'},e.w))}});
 g.n.forEach(n=>{const c=(o.cls&&o.cls[n.id])||'';svg.append(sv('circle',{cx:n.x,cy:n.y,r:19,class:'nd '+c}),sv('text',{x:n.x,y:n.y+5,'text-anchor':'middle','font-size':14,style:'font-weight:700'},n.id));
  if(o.lab&&o.lab[n.id]!==undefined)svg.append(sv('text',{x:n.x,y:n.y-26,'text-anchor':'middle','font-size':12,fill:'var(--ac)'},o.lab[n.id]))})}
W.graphrep=(el)=>{let dir=false,wt=true;const box=h('div',{class:'stage'}),info=h('div');
 function draw(){box.innerHTML='';info.innerHTML='';const g=dir?Lib.G2:Lib.G1;const gg={dir,n:g.n,e:(dir?Lib.G2:Lib.G1).e.map(e=>({...e,w:wt?e.w:1}))};const svg=sv('svg',{class:'sv',viewBox:'0 0 540 260',width:540});drawGraph(svg,gg,{weights:wt});box.append(svg);
  const m=Lib.adj(gg);const ids=g.n.map(x=>x.id);const mat=ids.map(a=>ids.map(b=>{const f=m[a].find(x=>x.to===b);return f?(wt?f.w:1):0}));
  info.append(h('div',{class:'grid g2'},h('div',{},h('b',{},'Adjacency List  — حافظه Θ(V+E)'),h('pre',{class:'code',style:{margin:'6px 0'},html:ids.map(a=>`<span class="k">${a}</span> → [${m[a].map(x=>wt?x.to+':'+x.w:x.to).join(', ')}]`).join('\n')})),h('div',{},h('b',{},'Adjacency Matrix — حافظه Θ(V²)'),dtable(['',...ids],mat.map((r,i)=>[ids[i],...r]),{hlCell:(r,c)=>c>0&&mat[r][c-1]!==0}))));
  info.append(h('div',{class:'wn'},dir?'گراف جهت‌دار: ماتریس لزوماً متقارن نیست. (G2 شامل یال‌های با وزن منفی است.)':'گراف بدون جهت: ماتریس متقارن است و هر یال دو بار در لیست‌ها ظاهر می‌شود.'))}
 body_(el,ctl(h('label',{},h('input',{type:'checkbox',onchange:e=>{dir=e.target.checked;draw()}}),'جهت‌دار (Directed)'),h('label',{},h('input',{type:'checkbox',checked:true,onchange:e=>{wt=e.target.checked;draw()}}),'وزن‌دار (Weighted)')),box,info);draw()};

W.graphalgo=(el,o)=>{const algos=o.algos||['bfs','dfs'];let al=algos[0],st='A';const host=h('div');let pl;
 function mk(){const g=al==='bellman'?Lib.G2:Lib.G1;let F;if(al==='bfs')F=Lib.bfs(g,st);else if(al==='dfs')F=Lib.dfs(g,st);else if(al==='dijkstra')F=Lib.dijkstra(g,st);else F=Lib.bellman(g,st);return{g,F}}
 function drawF(stg,f){stg.innerHTML='';const{g}=cur;const svg=sv('svg',{class:'sv',viewBox:'0 0 540 260',width:540});const cls={},lab={};
  if(al==='bfs'||al==='dfs'){f.seen.forEach(x=>cls[x]='pr');f.ord.forEach((x,i)=>lab[x]=i+1);if(f.cur)cls[f.cur]='hi'}
  else if(al==='dijkstra'){f.done.forEach(x=>cls[x]='ok');if(f.cur)cls[f.cur]='hi';for(const k in f.dist)lab[k]=f.dist[k]===Infinity?'∞':f.dist[k]}
  else{for(const k in f.dist)lab[k]=f.dist[k]===Infinity?'∞':f.dist[k];if(f.rel)cls[f.rel[1]]='hi'}
  const tree=(al==='bfs'||al==='dfs')?f.tree:(f.prev?Object.entries(f.prev).map(([v,u])=>[u,v]):[]);
  drawGraph(svg,g,{cls,lab,tree,rel:f.rel,weights:al!=='bfs'&&al!=='dfs'});stg.append(svg);
  if(al==='bfs'||al==='dfs')stg.append(h('div',{class:'stat'},h('span',{},al==='bfs'?'صف (Queue): ':'پشته فراخوانی (Stack): ',h('b',{},'['+f.q.join(', ')+']')),h('span',{},'ترتیب بازدید: ',h('b',{},f.ord.join(' → ')||'—'))));
  else stg.append(dtable(['رأس',...g.n.map(x=>x.id)],[['dist',...g.n.map(x=>f.dist[x.id]===Infinity?'∞':f.dist[x.id])],['prev',...g.n.map(x=>f.prev[x.id]||'—')]]))}
 let cur;function rebuild(){cur=mk();const F=cur.F;if(pl)pl.set(F);else pl=player(host,F,drawF)}
 const names={bfs:'BFS (صف)',dfs:'DFS (پشته/بازگشت)',dijkstra:'Dijkstra',bellman:'Bellman-Ford (گراف G2 با وزن منفی)'};
 body_(el,ctl(sel('الگوریتم',algos.map(a=>({v:a,t:names[a]})),al,v=>{al=v;if(al==='bellman'&&st==='F')st='A';rebuild()}),sel('رأس شروع',Lib.G1.n.map(x=>x.id),st,v=>{st=v;rebuild()})),host,h('div',{class:'wn'},'رأس‌های آبی/بنفش: دیده‌شده؛ زرد: رأس جاری؛ سبز: تثبیت‌شده؛ یال سبز ضخیم: یال درخت جست‌وجو؛ یال قرمز: relax جاری. اعداد بالای رأس: ترتیب بازدید یا فاصله.'));rebuild()};

W.floyd=(el)=>{const{F,ids}=Lib.floyd(Lib.G1);const host=h('div');body_(el,host,h('div',{class:'wn'},'خانه‌های زرد در هر مرحله بهبود یافته‌اند. پس از مرحله‌ی آخر، D[i][j] کوتاه‌ترین فاصله‌ی هر جفت رأس است. پیچیدگی: Θ(V³).'));
 player(host,F,(st,f)=>{st.innerHTML='';st.append(dtable(['D'+(f.k>=0?'⁽'+ids[f.k]+'⁾':'⁽⁰⁾'),...ids],f.D.map((r,i)=>[ids[i],...r.map(x=>x===Infinity?'∞':x)]),{hlCell:(r,c)=>c>0&&f.ch.some(x=>x[0]===r&&x[1]===c-1)}))})};

W.sort=(el)=>{let algo='bubble',n=10,kind='rand',arr=[];const host=h('div');let pl;
 const gen=()=>{const a=Array.from({length:n},(_,i)=>i+1);if(kind==='rand')a.sort(()=>Math.random()-.5);if(kind==='rev')a.reverse();if(kind==='near'){a.sort(()=>0);for(let i=0;i<2;i++){const x=rn(0,n-2);[a[x],a[x+1]]=[a[x+1],a[x]]}}if(kind==='few')return a.map(x=>(x%3)+1);return a};
 function drawS(st,f){st.innerHTML='';const w=Math.max(n*40+20,300),H=210;const svg=sv('svg',{class:'sv',viewBox:`0 0 ${w} ${H+20}`,width:w});const mx=Math.max(...f.a);
  f.a.forEach((v,i)=>{let col='var(--ac)';const inR=!f.range||(i>=f.range[0]&&i<=f.range[1]);if(!inR)col='var(--bd)';if(f.sorted&&f.sorted.includes(i))col='var(--ok)';if(f.pivot===i)col='var(--ac2)';if(f.cmp&&f.cmp.includes(i))col='var(--hl)';if(f.swp&&f.swp.includes(i))col='var(--bad)';
   const bh=v/mx*(H-30);svg.append(sv('rect',{x:10+i*40,y:H-bh,width:34,height:bh,rx:4,fill:col}),sv('text',{x:27+i*40,y:H+14,'text-anchor':'middle','font-size':12},v))});st.append(svg,h('div',{class:'stat'},h('span',{},'مقایسه‌ها: ',h('b',{},f.c)),h('span',{},'جابه‌جایی/نوشتن‌ها: ',h('b',{},f.w))))}
 const rebuild=(keep)=>{arr=gen();pl?pl.set(Lib.sortFrames(arr,algo)):(pl=player(host,Lib.sortFrames(arr,algo),drawS))};
 const names={bubble:'Bubble Sort — O(n²)',insertion:'Insertion Sort — O(n²)، عالی برای داده تقریباً مرتب',selection:'Selection Sort — O(n²)',merge:'Merge Sort — O(n log n)',quick:'Quick Sort — میانگین O(n log n)',heap:'Heap Sort — O(n log n)'};
 body_(el,ctl(sel('الگوریتم',Object.entries(names).map(([v,t])=>({v,t})),algo,v=>{algo=v;pl.set(Lib.sortFrames(arr,algo))}),rng('اندازه n',5,16,1,10,v=>{n=v;rebuild()},v=>v),sel('نوع داده',[{v:'rand',t:'تصادفی'},{v:'rev',t:'معکوس مرتب'},{v:'near',t:'تقریباً مرتب'},{v:'few',t:'مقادیر تکراری'}],'rand',v=>{kind=v;rebuild()}),btn('🔀 داده جدید',rebuild)),host,h('div',{class:'wn'},'زرد: در حال مقایسه · قرمز: جابه‌جایی/نوشتن · سبز: جایگاه نهایی · بنفش: pivot. داده «تقریباً مرتب» را روی Insertion و Quick امتحان کنید و تعداد مقایسه‌ها را مقایسه کنید.'));rebuild()};

W.bsearch=(el)=>{let a=[],t=0;const host=h('div');let pl;const inp=h('input',{type:'number',value:0,style:{width:'80px'}});
 function gen(){const s=new Set();while(s.size<16)s.add(rn(1,60));a=[...s].sort((x,y)=>x-y);t=a[rn(0,15)];inp.value=t}
 function drawB(st,f){st.innerHTML='';const svg=sv('svg',{class:'sv',viewBox:'0 0 700 90',width:700});a.forEach((v,i)=>{const out=i<f.lo||i>f.hi;let col=out?'var(--panel)':'var(--panel2)';if(i===f.mid)col='var(--hl)';if(f.found===i)col='var(--ok)';
   svg.append(sv('rect',{x:8+i*43,y:14,width:40,height:36,rx:6,fill:col,stroke:out?'var(--bd)':'var(--ac)',opacity:out?.45:1}),sv('text',{x:28+i*43,y:37,'text-anchor':'middle',style:(i===f.mid||f.found===i)?'fill:#111':''},v),sv('text',{x:28+i*43,y:66,'text-anchor':'middle','font-size':10,class:'mut'},i));
   if(i===f.lo&&!f.notfound)svg.append(sv('text',{x:28+i*43,y:82,'text-anchor':'middle','font-size':11,fill:'var(--ac)'},'lo'));if(i===f.hi&&!f.notfound)svg.append(sv('text',{x:28+i*43+(i===f.lo?0:0),y:i===f.lo?92:82,'text-anchor':'middle','font-size':11,fill:'var(--ac2)'},'hi'))});st.append(svg)}
 const run=()=>{t=parseInt(inp.value);pl.set(Lib.bsearch(a,t))};
 gen();body_(el,ctl(h('label',{},'مقدار هدف',inp),btn('جست‌وجو',run,'pri'),btn('آرایه جدید',()=>{gen();run()}),btn('هدف غایب',()=>{inp.value=0;run()})),host,h('div',{class:'wn'},'آرایه باید مرتب باشد. با هر مقایسه نیمی از بازه حذف می‌شود ⇒ حداکثر ⌊log₂ n⌋+1 = ۵ مقایسه برای ۱۶ عنصر (و حدود ۲۰ مقایسه برای یک میلیون عنصر).'));
 pl=player(host,Lib.bsearch(a,t),drawB)};

W.fibtree=(el)=>{let n=5,memo=false;const box=h('div',{class:'stage'}),st=h('div',{class:'stat'});
 function draw(){box.innerHTML='';const tr=Lib.fibTree(n,memo);const toK=x=>({k:x.k,hit:x.hit,kids:x.kids.map(toK)});const L_=layoutKids(toK(tr));const mx=Math.max(...L_.map(l=>l.x)),md=Math.max(...L_.map(l=>l.d));const dx=n>6?30:40;const svg=sv('svg',{class:'sv',viewBox:`0 0 ${(mx+1)*dx+20} ${(md+1)*48+20}`,width:(mx+1)*dx+20});
  L_.forEach(l=>l.p&&svg.append(sv('line',{x1:l.p.x*dx+20,y1:l.p.d*48+22,x2:l.x*dx+20,y2:l.d*48+22,class:'lnk'})));
  L_.forEach(l=>svg.append(sv('circle',{cx:l.x*dx+20,cy:l.d*48+22,r:dx>35?15:12,class:'nd '+(l.n.hit?'ok':'')}),sv('text',{x:l.x*dx+20,y:l.d*48+26,'text-anchor':'middle','font-size':dx>35?11:9},l.n.k)));box.append(svg);
  const a=Lib.fibCount(n,false),b=Lib.fibCount(n,true);st.innerHTML=`<span>fib(${n}) = <b>${a.v}</b></span><span>فراخوانی بدون memo: <b>${a.calls}</b></span><span>با memoization: <b>${b.calls}</b></span><span>تعداد گره‌های نمایش‌داده‌شده: <b>${L_.length}</b></span>`}
 body_(el,ctl(rng('n',2,9,1,5,v=>{n=v;draw()},v=>v),h('label',{},h('input',{type:'checkbox',onchange:e=>{memo=e.target.checked;draw()}}),'فعال‌سازی Memoization')),box,st,h('div',{class:'wn'},'گره سبز = نتیجه از حافظه‌ی نهان خوانده شد و زیردرخت آن اجرا نشد. بدون memo تعداد فراخوانی‌ها نمایی (≈ φⁿ) و با memo خطی است.'));draw()};

W.master=(el)=>{let a=2,b=2,d=1;const out=h('div',{class:'callout'});const A=rng('a (تعداد زیرمسئله‌ها)',1,8,1,2,v=>{a=v;upd()},v=>v),B=rng('b (کوچک‌شدن اندازه)',2,8,1,2,v=>{b=v;upd()},v=>v),D=rng('d (نمای هزینه ادغام)',0,3,.5,1,v=>{d=v;upd()},v=>v);
 const pre=sel('نمونه',[{v:'',t:'—'},{v:'2,2,1',t:'Merge Sort'},{v:'1,2,0',t:'Binary Search'},{v:'3,2,1',t:'Karatsuba (≈ n^log₂3 با d=1)'},{v:'7,2,2',t:'Strassen'},{v:'2,2,0',t:'جمع درخت (d=0)'}],'',v=>{if(!v)return;[a,b,d]=v.split(',').map(Number);A.set(a);B.set(b);D.set(d);upd()});
 function upd(){const lg=Math.log(a)/Math.log(b);let res,cs;const eq=Math.abs(lg-d)<1e-9;if(eq){cs='حالت ۲: هزینه هر سطح تقریباً برابر است';res=`Θ(n^${fmt(d,2)} · log n)`}else if(lg>d){cs='حالت ۱: هزینه‌ی برگ‌ها غالب است';res=`Θ(n^${fmt(lg,3)})`}else{cs='حالت ۳: هزینه‌ی ریشه (ادغام) غالب است (با شرط regularity)';res=`Θ(n^${fmt(d,2)})`}
  out.innerHTML=`<b class="t">T(n) = ${a}·T(n/${b}) + Θ(n<sup>${fmt(d,1)}</sup>)</b>log<sub>${b}</sub>${a} = <b>${fmt(lg,3)}</b> در مقابل d = <b>${fmt(d,1)}</b><br>${cs}<br>نتیجه: <b class="en">${res}</b>`}
 body_(el,ctl(pre),ctl(A,B,D),out);upd()};

W.coin=(el)=>{const c=h('input',{type:'text',value:'1,3,4',style:{width:'130px'}}),t=h('input',{type:'number',value:6,style:{width:'80px'}});const out=h('div');
 function run(){const coins=c.value.split(',').map(x=>parseInt(x)).filter(x=>x>0),T_=parseInt(t.value);const g=Lib.coinGreedy(coins,T_),d=Lib.coinDP(coins,T_);out.innerHTML='';
  out.append(h('div',{class:'grid g2'},h('div',{class:'card',html:`<b>حریصانه</b><br>${g?g.join(' + ')+' = '+T_+' ← <b>'+g.length+' سکه</b>':'پاسخی پیدا نشد'}`}),h('div',{class:'card',html:`<b>برنامه‌ریزی پویا (بهینه)</b><br>${d?d.join(' + ')+' = '+T_+' ← <b>'+d.length+' سکه</b>':'ناممکن'}`})));
  out.append(h('div',{class:'desc'},g&&d&&g.length>d.length?`⚠ حریصانه بهینه نیست! ${g.length} سکه در برابر ${d.length}. انتخاب محلیِ بهترین (بزرگ‌ترین سکه) به پاسخ سراسری بهینه منجر نشد.`:'در این ورودی پاسخ حریصانه بهینه است (برای سیستم‌هایی مثل ۱،۵،۱۰،۲۵ همواره بهینه است، ولی برای مجموعه‌های دلخواه نه).'))}
 body_(el,ctl(h('label',{},'سکه‌ها',c),h('label',{},'مبلغ',t),btn('محاسبه',run,'pri'),btn('نمونه {1,5,10,25}',()=>{c.value='1,5,10,25';t.value=63;run()}),btn('نمونه {1,3,4}',()=>{c.value='1,3,4';t.value=6;run()})),out);run()};

W.lcs=(el)=>{const a=h('input',{type:'text',value:'ABCBDAB',style:{width:'120px'}}),b=h('input',{type:'text',value:'BDCABA',style:{width:'120px'}});const host=h('div');let pl;
 const mk=()=>Lib.lcs(a.value.toUpperCase().slice(0,9),b.value.toUpperCase().slice(0,9)).F;
 function drawL(st,f){st.innerHTML='';const A=a.value.toUpperCase().slice(0,9),B=b.value.toUpperCase().slice(0,9);st.append(dtable(['',' ',...B.split('')],f.T.map((r,i)=>[i?A[i-1]:' ',...r]),{hlCell:(r,c)=>c>0&&((f.cur&&f.cur[0]===r+1&&f.cur[1]===c)||f.path.some(p=>p[0]===r+1&&p[1]===c))}))}
 body_(el,ctl(h('label',{},'رشته X',a),h('label',{},'رشته Y',b),btn('اجرا',()=>pl.set(mk()),'pri')),host,h('div',{class:'wn'},'T[i][j] = طول LCS دو پیشوند X[1..i] و Y[1..j]. زمان و حافظه Θ(mn). حداکثر ۹ حرف.'));pl=player(host,mk(),drawL,{speed:7})};

W.queens=(el)=>{let n=5;const host=h('div');let pl;const info=h('div',{class:'stat'});
 function drawQ(st,f){st.innerHTML='';const s=44,svg=sv('svg',{class:'sv',viewBox:`0 0 ${n*s+4} ${n*s+4}`,width:n*s+4});for(let r=0;r<n;r++)for(let c=0;c<n;c++)svg.append(sv('rect',{x:2+c*s,y:2+r*s,width:s,height:s,fill:(r+c)%2?'var(--panel2)':'var(--panel)',stroke:'var(--bd)'}));
  if(f.try)svg.append(sv('rect',{x:2+f.try[1]*s,y:2+f.try[0]*s,width:s,height:s,fill:f.bad?'var(--bad)':f.back?'var(--warn)':'var(--hl)',opacity:.55}));
  f.q.forEach((c,r)=>svg.append(sv('text',{x:2+c*s+s/2,y:2+r*s+s*.7,'text-anchor':'middle','font-size':26,style:'fill:'+(f.sol?'var(--ok)':'var(--fg)')},'♛')));st.append(svg)}
 const mk=()=>{const r=Lib.queens(n);info.innerHTML=`<span>کل جواب‌ها: <b>${r.sol}</b></span><span>تعداد امتحان خانه‌ها (تا سقف نمایش): <b>${r.tries}</b></span><span>جایگشت‌های کامل ممکن: <b>${n}ⁿ = ${Math.pow(n,n)}</b> — backtracking بیشترشان را هرگز نمی‌بیند</span>`;return r.F};
 body_(el,ctl(sel('اندازه صفحه',[4,5,6],5,v=>{n=+v;pl.set(mk())})),host,info,h('div',{class:'wn'},'زرد: خانه در حال آزمون · قرمز: تهدید می‌شود (هرس شاخه) · نارنجی: بازگشت (backtrack) · سبز: جواب کامل.'));pl=player(host,mk(),drawQ,{speed:8})};

W.bench=(el)=>{const out=h('div'),N=sel('اندازه داده n',[1000,10000,100000],10000,()=>{});const Q=1000;
 const run=()=>{out.innerHTML='در حال اجرا…';setTimeout(()=>{const n=+N.get();const arr=Array.from({length:n},(_,i)=>i*2);const set=new Set(arr),obj=new Map(arr.map(x=>[x,1]));const qs=Array.from({length:Q},()=>Math.floor(Math.random()*n*2));
  const bs=x=>{let l=0,h_=n-1;while(l<=h_){const m=(l+h_)>>1;if(arr[m]===x)return true;arr[m]<x?l=m+1:h_=m-1}return false};
  const tm=f=>{const t0=performance.now();let c=0;for(const q of qs)if(f(q))c++;return[performance.now()-t0,c]};
  const R=[['Array.includes (جست‌وجوی خطی) O(n)',...tm(x=>arr.includes(x))],['Binary Search روی آرایه مرتب O(log n)',...tm(bs)],['Set.has (جدول هش) O(1) میانگین',...tm(x=>set.has(x))],['Map.get (جدول هش) O(1) میانگین',...tm(x=>obj.has(x))]];
  const mx=Math.max(...R.map(r=>r[1]));out.innerHTML='';out.append(h('div',{class:'wn'},`${Q} جست‌وجوی تصادفی در n=${n} (زمان واقعی روی مرورگر شما):`));
  R.forEach(r=>out.append(h('div',{style:{margin:'6px 0'}},h('div',{class:'en',style:{fontSize:'13px'}},r[0]+' — '+fmt(r[1],2)+' ms (found='+r[2]+')'),h('div',{class:'bar'},h('i',{style:{width:Math.max(1,r[1]/mx*100)+'%'}})))))},30)};
 body_(el,ctl(N,btn('▶ اجرای بنچمارک',run,'pri')),out,h('div',{class:'wn'},'نتایج به موتور JS، JIT و سخت‌افزار بستگی دارند؛ مهم، روند رشد با n است نه عدد دقیق.'))};

W.chooser=(el)=>{const needs=[['idx','دسترسی مستقیم با اندیس'],['key','جست‌وجوی سریع با کلید'],['ord','پیمایش مرتب / جست‌وجوی بازه‌ای'],['min','دسترسی سریع به کمینه/بیشینه'],['mid','درج/حذف مکرر در وسط (با داشتن اشاره‌گر)'],['pre','جست‌وجوی پیشوندی (Autocomplete)'],['mem','حافظه‌ی فشرده و Cache-friendly']];
 const S_=[['Array / Dynamic Array',{idx:1,mem:1}],['Linked List',{mid:1}],['Hash Table',{key:1}],['Balanced BST / B-Tree',{key:1,ord:1,min:1}],['Binary Heap',{min:1,mem:1}],['Trie',{pre:1,key:1,ord:1}],['Sorted Array',{idx:1,key:1,ord:1,min:1,mem:1}]];
 const why={'Array / Dynamic Array':'O(1) access، حافظه پیوسته؛ درج میانی O(n)','Linked List':'درج/حذف O(1) با داشتن گره؛ ولی جست‌وجو O(n) و Cache ضعیف','Hash Table':'جست‌وجو O(1) میانگین؛ بدون ترتیب','Balanced BST / B-Tree':'همه عملیات O(log n) و ترتیب حفظ می‌شود','Binary Heap':'min/max در O(1)، استخراج O(log n)؛ جست‌وجوی کلید دلخواه O(n)','Trie':'هزینه وابسته به طول کلید؛ حافظه زیاد','Sorted Array':'Binary Search؛ اما درج O(n) است (برای داده‌ی تقریباً ثابت عالی)'};
 const chk={};const out=h('div');const boxes=needs.map(([k,t])=>h('label',{style:{marginInlineEnd:'14px'}},h('input',{type:'checkbox',onchange:e=>{chk[k]=e.target.checked;upd()}}),t));
 function upd(){const sc=S_.map(([n,c])=>[n,needs.filter(([k])=>chk[k]&&c[k]).length,needs.filter(([k])=>chk[k]).length]);const t=sc[0][2];out.innerHTML='';if(!t){out.append(h('div',{class:'wn'},'نیازها را انتخاب کنید.'));return}
  sc.sort((a,b)=>b[1]-a[1]);out.append(dtable(['ساختار','پوشش نیازها','نکته'],sc.map(s=>[s[0],s[1]+' از '+t,why[s[0]]])));out.append(h('div',{class:'wn'},'این یک راهنمای ساده‌شده است؛ در عمل اندازه داده، الگوی دسترسی، همزمانی و Cache هم باید در نظر گرفته شوند.'))}
 body_(el,h('div',{class:'ctl',style:{display:'block'}},...boxes),out);upd()};
