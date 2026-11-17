/* ===================== LABS: Module A (Data Structures & Algorithms) ===================== */
/* A1 · Growth beats constants */
LAB({id:'a1',mod:'A',g:'A1',lessons:['a1-1','a1-2'],
 t:['رشد بر ثابت‌ها می‌چربد','Growth beats constants'],
 aha:['الگوریتمی که سریع‌تر «رشد» می‌کند، هر قدر هم ثابتش کوچک باشد، از یک اندازه‌ی ورودی به بعد می‌بازد.','An algorithm that grows faster eventually loses, however small its constant factor is.'],
 big:{had:['می‌دانیم هر الگوریتم تعدادی عمل پایه انجام می‌دهد و می‌توان آن را شمرد.','We know every algorithm performs some number of basic operations, and we can count them.'],
  miss:['شمارش دقیق به ماشین و ثابت‌ها وابسته است. چگونه دو الگوریتم را منصفانه مقایسه کنیم؟','Exact counts depend on the machine and on constants. How do we compare two algorithms fairly?'],
  fix:['نشان می‌دهد برای ورودی‌های بزرگ فقط «مرتبه‌ی رشد» تعیین‌کننده است؛ همین ایده‌ی Big-O است.','Shows that for large inputs only the order of growth decides. That is the idea behind Big-O.'],
  close:['مرتبه‌ی رشد ثابت‌ها را کنار می‌گذارد و برنده‌ی ورودی‌های بزرگ را مشخص می‌کند. درس بعد (تحلیل سرشکن) همین ایده را برای هزینه‌ی میانگین چند عمل به‌کار می‌برد.','Order of growth sets constants aside and names the winner on large inputs. The next lesson (amortized analysis) uses the same idea for the average cost of a sequence of operations.']},
 sol:{c:0.2},fail:{c:0.5},
 st:()=>({n:200,c:0.5,nmax:3000}),
 stage(host,st,A){const A_=n=>st.c*n*n,B_=n=>50*n*Math.log2(n);
  const cross=c=>{const f=n=>c*n-50*Math.log2(n);let lo=Math.max(2,72.1/c),hi=1e8;if(f(lo)>0)return null;for(let i=0;i<80;i++){const m=(lo+hi)/2;f(m)<0?lo=m:hi=m}return lo};
  A.cross=cross;
  return(k)=>{host.innerHTML='';const nm=st.nmax,ymax=B_(nm)*1.25;const P=chart(560,300,2,nm,0,ymax,{l:56,b:30});P.axes(5,4,v=>String(Math.round(v)),kfmt);
   P.path(A_,'var(--bad)',2,nm,160,2.6);P.path(B_,'var(--ac)',2,nm,160,2.6);
   const x=cross(st.c);if(x&&x<nm){P.line(x,0,x,ymax,'var(--ok)','4 4',1.8);P.text(x,ymax*0.93,'n*≈'+Math.round(x),'var(--ok)','middle',12)}
   const n=Math.min(st.n,nm);P.line(n,0,n,ymax,'var(--hl)',null,1.6);P.dot(n,Math.min(A_(n),ymax),5,'var(--bad)');P.dot(n,Math.min(B_(n),ymax),5,'var(--ac)');
   P.text(nm*0.02,ymax*0.96,'■ A = c·n²   (c='+fmt(st.c,3)+')','var(--bad)','start',12);P.text(nm*0.02,ymax*0.89,'● B = 50·n·log₂n','var(--ac)','start',12);
   host.append(P.svg);const a=A_(n),b=B_(n);
   host.append(h('div',{class:'stat'},h('span',{},'n = ',h('b',{},Math.round(n))),h('span',{},'A(n) = ',h('b',{},fmt(a,0))),h('span',{},'B(n) = ',h('b',{},fmt(b,0))),h('span',{},t2('برنده: ','Winner: '),h('b',{},a<b?'A':'B'))),
    h('div',{class:'wn'},x?t2('نقطه‌ی تقاطع (جایی که B شروع به بردن می‌کند): n* ≈ ','Crossover (where B starts winning): n* ≈ ')+Math.round(x):t2('تقاطعی وجود ندارد.','No crossover.')))}},
 screens:{
  puzzle:{ask:['ماشین A سریع است اما الگوریتمش مربعی است (هزینه‌ی c·n² با c=0٫5). ماشین B کندتر است (۵۰·n·log₂n). آیا A همیشه برنده می‌ماند؟','Machine A is fast but its algorithm is quadratic (cost c·n² with c = 0.5). Machine B is slower (50·n·log₂n). Does A stay ahead forever?'],
   do:['نوار n را بکشید و ببینید چه کسی کمتر هزینه می‌دهد. قبل از کشیدن، حدس بزنید.','Drag the n slider and watch who pays less. Make a guess before you drag.'],
   ctl:(st,A)=>[rng('n',10,3000,10,st.n,v=>{st.n=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['جایی که منحنی‌ها همدیگر را قطع می‌کنند به c بستگی دارد، ولی وجود دارد.','The crossing point depends on c, but it always exists.'],
   ask:['اگر ماشین A را ۱۰ برابر سریع‌تر کنیم (c کوچک‌تر)، تقاطع حذف می‌شود یا فقط جابه‌جا؟','If we make A\'s machine 10× faster (smaller c), does the crossover vanish or just move?'],
   do:['c را کم کنید و «تا کجا نگاه کنیم» را زیاد کنید تا تقاطع را دوباره ببینید.','Lower c, then raise "how far to look" until the crossover is back in view.'],
   ctl:(st,A)=>[rng('c',0.02,1,0.005,st.c,v=>{st.c=v;A.upd()},v=>fmt(v,3)),rng(t2('تا کجا نگاه کنیم (n max)','How far to look (n max)'),100,8000,50,st.nmax,v=>{st.nmax=v;A.upd()},v=>String(Math.round(v))),rng('n',10,3000,10,st.n,v=>{st.n=v;A.upd()},v=>String(Math.round(v)))],
   see:['با کاهش c تقاطع فقط به راست می‌رود (c=0٫05 → n*≈۱۳٬۷۰۰). هرگز حذف نمی‌شود، چون n² سریع‌تر از n·log n رشد می‌کند.','Lowering c only pushes the crossover right (c = 0.05 → n* ≈ 13,700). It never disappears, because n² outgrows n·log n.']},
  name:{says:[['آنچه دیدید این است: برای n بزرگ، تابع با رشد کندتر زیر تابع دیگر می‌ماند، هر ضریبی که داشته باشند.','What you saw: for large n the slower-growing function stays below the other one, whatever the multipliers.'],['این را به شکل صوری می‌نویسیم:','We write this formally:']],
   tex:['f(n)=O(g(n))\\iff \\exists\\, c>0,\\ n_0:\\ f(n)\\le c\\,g(n)\\ \\ \\forall n\\ge n_0'],
   legend:[['n_0',['همان نقطه‌ی تقاطع n* که در تصویر دیدید: از آن به بعد نامساوی همیشه برقرار است.','The crossover n* you saw: from there on the inequality always holds.']],['c',['ضریب ثابت (ماشین، زبان، پیاده‌سازی). فقط n₀ را جابه‌جا می‌کند.','The constant factor (machine, language, implementation). It only moves n₀.']],['g(n)',['مرتبه‌ی رشد: n log n برای B و n² برای A.','The growth order: n log n for B and n² for A.']]]},
  challenge:{ask:['A یک الگوریتم مربعی است و B همان n·log n با ثابت ۵۰. c را طوری بگذارید که A تا حدود n=۲۰۰۰ برنده بماند ولی پیش از n=۴۰۰۰ ببازد.','A is a quadratic algorithm and B is n·log n with constant 50. Set c so that A stays the winner until about n = 2000 but has lost before n = 4000.'],
   do:['فقط c را تغییر دهید؛ خط سبز تقاطع n* را نشان می‌دهد.','Change only c; the green line marks the crossover n*.'],
   ctl:(st,A)=>{st.nmax=8000;return[rng('c',0.02,1,0.005,st.c,v=>{st.c=v;A.upd()},v=>fmt(v,3))]},
   ok:st=>{const x=(function(c){const f=n=>c*n-50*Math.log2(n);let lo=Math.max(2,72.1/c),hi=1e8;if(f(lo)>0)return null;for(let i=0;i<80;i++){const m=(lo+hi)/2;f(m)<0?lo=m:hi=m}return lo})(st.c);return x&&x>=2000&&x<=4000},
   hints:[['به خط سبز نگاه کنید: وقتی c را کم می‌کنید، به کدام سمت می‌رود؟','Watch the green line: which way does it move when you lower c?'],['تقاطع جایی است که c·n = 50·log₂n؛ پس n* تقریباً با c نسبت وارون دارد.','The crossover solves c·n = 50·log₂n, so n* is roughly inversely related to c.'],['c را کم‌کم تغییر دهید و عدد n* زیر نمودار را دنبال کنید تا بین ۲۰۰۰ و ۴۰۰۰ بنشیند.','Nudge c in small steps and follow the n* readout under the chart until it sits between 2000 and 4000.']],
   win:['حل شد: با c این‌قدر، A برای ورودی‌های کوچک برنده است ولی مرتبه‌ی رشدش آن را بعد از n* می‌بازاند. ثابت فقط جای n₀ را تعیین می‌کند.','Solved: with this c, A wins on small inputs, but its growth order makes it lose after n*. The constant only fixes where n₀ sits.']}}});

/* A2 · Hash tables: chains must stay short */
LAB({id:'a2',mod:'A',g:'A2',lessons:['a2-3'],
 t:['زنجیره‌ها باید کوتاه بمانند','Chains must stay short'],
 aha:['جدول هش فقط وقتی سریع است که کلیدها یکنواخت در سطل‌ها پخش شوند؛ اندازه‌ی جدول و تابع هش تعیین می‌کنند چه اتفاقی می‌افتد.','A hash table is only fast when keys spread evenly over the buckets; the table size and the hash function decide whether they do.'],
 big:{had:['آرایه با اندیس O(1) به عنصر می‌رسد، ولی فقط وقتی اندیس را بدانیم.','An array reaches an element in O(1), but only when we know the index.'],
  miss:['کلید دلخواه (مثلاً شماره‌ی دانشجویی) اندیس نیست. چگونه آن را به اندیس تبدیل کنیم و برخوردها چه می‌شوند؟','An arbitrary key (a student id, say) is not an index. How do we turn it into one, and what happens on collisions?'],
  fix:['نشان می‌دهد طول زنجیره‌ی هر سطل هزینه‌ی جست‌وجو را تعیین می‌کند و انتخاب m می‌تواند همه‌ی کلیدها را در چند سطل بریزد.','Shows that bucket chain length sets the lookup cost, and that a bad m can dump all keys into a few buckets.'],
  close:['هزینه‌ی جست‌وجو ≈ ۱ + طول زنجیره است. با ضریب بار α=n/m و پخش یکنواخت، میانگین زنجیره α است. درس بعد (پشته و صف) به ساختارهایی می‌رسد که ترتیب را نگه می‌دارند، نه پخش را.','Lookup cost ≈ 1 + chain length. With load factor α = n/m and even spreading, the average chain is α. The next structures (stacks, queues) keep order instead of spreading.']},
 sol:{m:37},fail:{m:16},
 st:()=>({n:60,m:16,fn:'mod'}),
 stage(host,st,A){const keys=n=>Array.from({length:n},(_,i)=>8*(i+1));
  const hf=(k,m,fn)=>fn==='mod'?k%m:Math.floor((k*2654435761%4294967296)/4294967296*m);
  A.stats=()=>{const c=Array(st.m).fill(0);keys(st.n).forEach(k=>c[hf(k,st.m,st.fn)]++);const mx=Math.max(...c);return{c,mx,used:c.filter(x=>x>0).length,probes:c.reduce((s,x)=>s+x*(x+1)/2,0)/st.n}};
  return k=>{host.innerHTML='';const s=A.stats(),W=560,H=250,m=st.m,bw=(W-50)/m;const svg=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'sv'});
   const ymax=Math.max(4,s.mx),Y=v=>H-30-(v/ymax)*(H-60);svg.append(sv('line',{x1:40,x2:W-5,y1:H-30,y2:H-30,stroke:'var(--bd)'}));
   if(k==='challenge')svg.append(sv('line',{x1:40,x2:W-5,y1:Y(2),y2:Y(2),stroke:'var(--ok)','stroke-dasharray':'5 4'}),sv('text',{x:W-8,y:Y(2)-4,'text-anchor':'end',fill:'var(--ok)'},t2('حد مجاز: ۲','limit: 2')));
   s.c.forEach((v,i)=>{const bad=k==='challenge'?v>2:v>4;svg.append(sv('rect',{x:40+i*bw+1,y:Y(v),width:Math.max(1,bw-2),height:H-30-Y(v),fill:bad?'var(--bad)':'var(--ac)'}));if(bad&&bw>5)svg.append(sv('text',{x:40+i*bw+bw/2,y:Y(v)-3,'text-anchor':'middle','font-size':10,fill:'var(--bad)'},'▲'))});
   svg.append(sv('text',{x:6,y:Y(ymax)+4,class:'mut'},ymax),sv('text',{x:6,y:H-26,class:'mut'},'0'),sv('text',{x:W/2,y:H-8,'text-anchor':'middle',class:'mut'},t2('سطل‌ها 0 … m−1 (ارتفاع = تعداد کلید در سطل)','buckets 0 … m−1 (height = keys in the bucket)')));
   host.append(svg,h('div',{class:'stat'},h('span',{},'n = ',h('b',{},st.n)),h('span',{},'m = ',h('b',{},m)),h('span',{},'α = n/m = ',h('b',{},fmt(st.n/m,2))),h('span',{},t2('سطل‌های استفاده‌شده: ','Buckets used: '),h('b',{},s.used+'/'+m)),h('span',{},t2('بلندترین زنجیره: ','Longest chain: '),h('b',{},s.mx)),h('span',{},t2('میانگین بررسی‌ها: ','Avg probes: '),h('b',{},fmt(s.probes,2)))),
    h('div',{class:'wn'},t2('کلیدها: ۸، ۱۶، ۲۴، … (مضرب‌های ۸) · تابع هش: ','Keys: 8, 16, 24, … (multiples of 8) · hash: ')+(st.fn==='mod'?'k mod m':t2('هش آمیخته (ضرب در عدد بزرگ)','mixing hash (multiply by a large constant)'))))}},
 screens:{
  puzzle:{ask:['۶۰ کلید (مضرب‌های ۸) را با h(k)=k mod m در m سطل می‌ریزیم. با m=16 همه‌چیز کجا می‌افتد؟ آیا اضافه‌کردن سطل کمک می‌کند؟','We put 60 keys (multiples of 8) into m buckets with h(k) = k mod m. With m = 16, where does everything land? Does adding buckets help?'],
   do:['m را تغییر دهید و به ارتفاع ستون‌ها نگاه کنید. قبل از هر تغییر حدس بزنید.','Change m and watch the column heights. Guess before each change.'],
   ctl:(st,A)=>[rng('m',8,64,1,st.m,v=>{st.m=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['طول زنجیره فقط به α=n/m وابسته نیست؛ به اینکه کلیدها با m ضریب مشترک دارند یا نه هم وابسته است.','Chain length does not depend on α = n/m alone; it also depends on whether the keys share factors with m.'],
   ask:['چرا m=۱۶ و m=۳۲ بدترند ولی m=۳۱ و m=۳۷ خوب‌اند؟ و اگر تابع هش را عوض کنیم چه می‌شود؟','Why are m = 16 and m = 32 bad while m = 31 and m = 37 are good? And what changes if we swap the hash function?'],
   do:['بین m=۳۲، ۳۱ و ۳۷ بروید و بعد تابع هش را به «آمیخته» ببرید.','Step through m = 32, 31 and 37, then switch the hash to "mixing".'],
   ctl:(st,A)=>[rng('m',8,64,1,st.m,v=>{st.m=v;A.upd()},v=>String(Math.round(v))),sel(t2('تابع هش','Hash'),[{v:'mod',t:'k mod m'},{v:'mix',t:t2('آمیخته','mixing')}],st.fn,v=>{st.fn=v;A.upd()})],
   see:['k mod m فقط g=m/gcd(۸،m) سطل را استفاده می‌کند. هش آمیخته الگوی کلیدها را می‌شکند و برای هر m تقریباً یکنواخت است.','k mod m only uses m/gcd(8, m) buckets. The mixing hash breaks the key pattern and is near-uniform for any m.']},
  name:{says:[['آنچه دیدید: هزینه‌ی جست‌وجو را «طول زنجیره‌ی سطل» تعیین می‌کند، و پخش کلیدها به m و تابع هش بستگی دارد.','What you saw: lookup cost is set by the bucket chain length, and how keys spread depends on m and on the hash function.']],
   tex:['\\alpha=\\frac{n}{m},\\qquad E[\\text{probes}]\\approx 1+\\frac{\\alpha}{2}\\ \\text{(hit)},\\quad 1+\\alpha\\ \\text{(miss)}'],
   legend:[['\\alpha',['ضریب بار: میانگین طول زنجیره با پخش یکنواخت.','Load factor: the average chain length under even spreading.']],['m',['اندازه‌ی جدول؛ عدد اول یا تابع آمیخته از الگوهای کلید جلوگیری می‌کند.','Table size; a prime or a mixing hash defeats key patterns.']],['n',['تعداد کلیدها؛ با رشد n باید m را هم بزرگ کرد (rehash).','Number of keys; as n grows, m must grow too (rehash).']]]},
  challenge:{ask:['۶۰ کلید و حداکثر ۴۰ سطل داریم و تابع k mod m ثابت است. m را طوری بگذارید که هیچ سطلی بیش از ۲ کلید نداشته باشد.','We have 60 keys, at most 40 buckets and the fixed hash k mod m. Choose m so that no bucket holds more than 2 keys.'],
   do:['خط سبز حد ۲ را نشان می‌دهد؛ ستون‌های قرمز (▲) از حد گذشته‌اند.','The green line is the limit of 2; red columns (▲) are over it.'],
   ctl:(st,A)=>{st.n=60;st.fn='mod';return[rng('m',8,40,1,Math.min(st.m,40),v=>{st.m=v;A.upd()},v=>String(Math.round(v)))]},
   ok:st=>{if(st.fn!=='mod'||st.m>40)return false;const c={};for(let i=1;i<=st.n;i++){const b=(8*i)%st.m;c[b]=(c[b]||0)+1}return Math.max(...Object.values(c))<=2},
   hints:[['فقط مقادیری از m کار می‌کنند که کلیدها را در بیش از ۳۰ سطل پخش کنند.','Only values of m that spread the keys over more than 30 buckets can work.'],['m=۳۲ و m=۳۶ با ۸ ضریب مشترک دارند و کلیدها را در چند سطل جمع می‌کنند.','m = 32 and m = 36 share a factor with 8 and gather keys into few buckets.'],['مقادیر فرد را امتحان کنید و شمارنده‌ی «سطل‌های استفاده‌شده» را ببینید.','Try odd values and watch the "buckets used" counter.']],
   win:['m فرد (بدون ضریب مشترک با ۸) و ≥ ۳۰ است، پس مضرب‌های ۸ همه‌ی سطل‌ها را می‌پوشانند. اندازه‌ی جدول همان‌قدر مهم است که α.','m is odd (no common factor with 8) and ≥ 30, so multiples of 8 cover every bucket. Table size matters as much as α.']}}});

/* A3 · Tree height decides speed */
LAB({id:'a3',mod:'A',g:'A3',lessons:['a3-1','a3-2'],
 t:['ارتفاع درخت سرعت را تعیین می‌کند','Tree height decides speed'],
 aha:['هزینه‌ی جست‌وجو در BST برابر ارتفاع آن است، نه تعداد کلیدها؛ و ارتفاع به ترتیب درج بستگی دارد.','Search cost in a BST equals its height, not its key count; and height depends on the insertion order.'],
 big:{had:['می‌دانیم آرایه‌ی مرتب با جست‌وجوی دودویی O(log n) است ولی درج در آن گران است.','We know a sorted array with binary search is O(log n) but inserting into it is expensive.'],
  miss:['درخت جست‌وجوی دودویی درج ارزان می‌دهد؛ آیا جست‌وجویش همیشه سریع می‌ماند؟','A binary search tree makes insertion cheap; does its search always stay fast?'],
  fix:['نشان می‌دهد ترتیب درج می‌تواند درخت را به لیست پیوندی تبدیل کند و ارتفاع کمینه ⌈log₂(n+1)⌉ است.','Shows that insertion order can turn the tree into a linked list, and that the minimum height is ⌈log₂(n+1)⌉.'],
  close:['ارتفاع h یعنی تا h مقایسه. کمینه‌ی h برای n کلید ⌈log₂(n+1)⌉ است و فقط با درخت متوازن (AVL، قرمز-سیاه) تضمین می‌شود. ساختار بعدی (هیپ) ارتفاع کمینه را با شکل درخت کامل تضمین می‌کند.','Height h means up to h comparisons. The minimum for n keys is ⌈log₂(n+1)⌉, guaranteed only by balanced trees (AVL, red-black). The next structure (the heap) guarantees minimum height by shape.']},
 sol:{N:15,order:[8,4,12,2,6,10,14,1,3,5,7,9,11,13,15]},fail:{N:15,order:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},
 st:()=>({N:7,order:[]}),
 stage(host,st,A){const keysOf=()=>st.N===7?[10,20,30,40,50,60,70]:Array.from({length:st.N},(_,i)=>i+1);
  const build=()=>{let root=null;const ins=k=>{const n={k,l:null,r:null};if(!root){root=n;return}let c=root;for(;;){if(k<c.k){if(!c.l){c.l=n;return}c=c.l}else{if(!c.r){c.r=n;return}c=c.r}}};st.order.forEach(ins);return root};
  const ht=n=>n?1+Math.max(ht(n.l),ht(n.r)):0;A.height=()=>ht(build());A.ideal=()=>Math.ceil(Math.log2(st.N+1));
  return()=>{host.innerHTML='';const root=build(),H=ht(root),W=560,HH=60+Math.max(H,A.ideal())*46;const svg=sv('svg',{viewBox:`0 0 ${W} ${HH}`,class:'sv'});let i=0;const pos=[];
   (function walk(n,d){if(!n)return;walk(n.l,d+1);n.x=i++;n.y=d;pos.push(n);walk(n.r,d+1)})(root,0);const cnt=Math.max(1,pos.length),X=n=>30+(n.x+.5)*(W-60)/cnt,Y=n=>28+n.y*46;
   pos.forEach(n=>{[n.l,n.r].forEach(c=>c&&svg.append(sv('line',{x1:X(n),y1:Y(n),x2:X(c),y2:Y(c),class:'lnk'})))});
   pos.forEach(n=>{const deep=n.y+1>A.ideal();svg.append(sv('circle',{cx:X(n),cy:Y(n),r:14,class:'nd'+(deep?' bad':'')}),sv('text',{x:X(n),y:Y(n)+4,'text-anchor':'middle','font-size':11},n.k))});
   if(!pos.length)svg.append(sv('text',{x:W/2,y:50,'text-anchor':'middle',class:'mut'},t2('درخت خالی است: کلیدها را وارد کنید','Empty tree: insert some keys')));
   host.append(svg,h('div',{class:'stat'},h('span',{},t2('درج‌شده: ','Inserted: '),h('b',{},st.order.length+'/'+st.N)),h('span',{},t2('ارتفاع: ','Height: '),h('b',{},H)),h('span',{},t2('کمینه‌ی ممکن: ','Minimum possible: '),h('b',{},A.ideal())),h('span',{},t2('بیشینه‌ی مقایسه برای جست‌وجو: ','Worst-case comparisons: '),h('b',{},H))),h('div',{class:'wn'},t2('ترتیب درج: ','Insertion order: ')+(st.order.join(' → ')||'—')+t2('  · گره‌های ● قرمز (عمیق‌تر از حد کمینه) بیش از لازم عمیق‌اند.','  · red nodes are deeper than the minimum allows.')))}},
 screens:{
  puzzle:{ask:['۷ کلید یکسان را یک بار به ترتیب صعودی و یک بار با ترتیبی دیگر درج می‌کنیم. آیا درخت‌ها یکسان می‌شوند؟','We insert the same 7 keys once in ascending order and once in another order. Do we get the same tree?'],
   do:['دکمه‌های «مرتب» و «میانه اول» را فشار دهید و ارتفاع‌ها را مقایسه کنید.','Press "Sorted" and "Median first" and compare the heights.'],
   ctl:(st,A)=>{st.N=7;return[btn(t2('مرتب','Sorted'),()=>{st.order=[10,20,30,40,50,60,70];A.upd()}),btn(t2('میانه اول','Median first'),()=>{st.order=[40,20,60,10,30,50,70];A.upd()}),btn(t2('پاک‌کردن','Clear'),()=>{st.order=[];A.upd()})]}},
  explore:{claim:['برای n کلید، ارتفاع از ⌈log₂(n+1)⌉ (بهترین) تا n (بدترین) تغییر می‌کند و فقط ترتیب درج آن را عوض می‌کند.','For n keys the height ranges from ⌈log₂(n+1)⌉ (best) to n (worst), and only the insertion order changes it.'],
   ask:['کدام کلید باید اول درج شود تا ریشه‌ی درخت دو نیمه‌ی هم‌اندازه بسازد؟ و کلید دوم؟','Which key should go in first so that the root splits the rest into two equal halves? And the second?'],
   do:['کلیدها را یکی‌یکی با دکمه درج کنید و ارتفاع را دنبال کنید.','Insert the keys one by one with the buttons and follow the height.'],
   ctl:(st,A)=>{st.N=7;const bs=[10,20,30,40,50,60,70].map(k=>{const b=btn(String(k),()=>{if(!st.order.includes(k))st.order.push(k);rf();A.upd()});b.k=k;return b});const rf=()=>bs.forEach(b=>b.disabled=st.order.includes(b.k));rf();
    return[...bs,btn(t2('↺ پاک‌کردن','↺ Clear'),()=>{st.order=[];rf();A.upd()})]},
   see:['اگر میانه اول بیاید، هر زیردرخت نصف می‌شود و ارتفاع ۳ می‌ماند؛ ورودی مرتب ارتفاع ۷ (یک لیست) می‌دهد.','Median first halves every subtree, giving height 3; sorted input gives height 7 (a list).']},
  name:{says:[['آنچه دیدید: BST با n کلید دقیقاً n! ترتیب درج دارد ولی تعداد شکل‌های ممکن کمتر است، و ارتفاع شکل هزینه‌ی جست‌وجو را می‌دهد.','What you saw: n keys have n! insertion orders but fewer shapes, and the shape\'s height is the search cost.']],
   tex:['\\lceil\\log_2(n+1)\\rceil\\ \\le\\ h\\ \\le\\ n,\\qquad T_{\\text{search}}=O(h)'],
   legend:[['h',['ارتفاع درخت: تعداد سطح‌ها. بیشینه‌ی مقایسه‌ها برای یک جست‌وجو.','Tree height: the number of levels. The most comparisons one search needs.']],['\\lceil\\log_2(n+1)\\rceil',['ارتفاع درخت کامل: هر سطح را تا حد ممکن پر می‌کند.','Height of a complete tree: every level filled as far as possible.']],['n',['ارتفاع لیست پیوندی: وقتی ورودی مرتب است.','Height of a linked list: when the input is sorted.']]]},
  challenge:{ask:['اکنون ۱۵ کلید (۱ تا ۱۵). آن‌ها را طوری درج کنید که ارتفاع درخت برابر کمینه‌ی ممکن (۴) شود.','Now 15 keys (1 to 15). Insert them so that the tree reaches the minimum possible height (4).'],
   do:['کلیدها را به ترتیب انتخاب کنید؛ گره‌های قرمز از حد کمینه عمیق‌ترند.','Pick the keys in order; red nodes are deeper than the minimum allows.'],
   ctl:(st,A)=>{st.N=15;st.order=[];const bs=Array.from({length:15},(_,i)=>{const k=i+1,b=btn(String(k),()=>{if(!st.order.includes(k))st.order.push(k);rf();A.upd()});b.k=k;return b});const rf=()=>bs.forEach(b=>b.disabled=st.order.includes(b.k));return[...bs,btn(t2('↺ پاک‌کردن','↺ Clear'),()=>{st.order=[];rf();A.upd()})]},
   ok:st=>{if(st.N!==15||st.order.length!==15)return false;let root=null;st.order.forEach(k=>{const n={k,l:null,r:null};if(!root){root=n;return}let c=root;for(;;){if(k<c.k){if(!c.l){c.l=n;return}c=c.l}else{if(!c.r){c.r=n;return}c=c.r}}});const ht=n=>n?1+Math.max(ht(n.l),ht(n.r)):0;return ht(root)===4},
   hints:[['کدام کلید اول را وارد کنیم که هر دو طرف آن ۷ کلید بماند؟','Which key goes first so that each side keeps exactly 7 keys?'],['همین قاعده را برای هر نیمه تکرار کنید: میانه‌ی هر بازه را بیاورید.','Repeat the rule for each half: bring in the median of every range.'],['ترتیب سطح‌به‌سطح: ریشه، بعد دو فرزندش، بعد چهار نوه…','Go level by level: the root, then its two children, then four grandchildren…']],
   win:['همین قاعده‌ی «میانه اول» پایه‌ی ساخت درخت متوازن و ایده‌ی چرخش‌های AVL است: ارتفاع را به ⌈log₂(n+1)⌉ می‌رساند.','This "median first" rule is the basis of building a balanced tree and the idea behind AVL rotations: it brings the height down to ⌈log₂(n+1)⌉.']}}});

/* A4 · Binary search: halve the candidates */
LAB({id:'a4',mod:'A',g:'A4',lessons:['a4-1'],
 t:['هر حدس باید نیمی از گزینه‌ها را حذف کند','Every guess should halve the candidates'],
 aha:['در آرایه‌ی مرتب، هر مقایسه می‌تواند نیمی از گزینه‌ها را کنار بگذارد؛ پس n گزینه فقط ⌈log₂ n⌉ حدس لازم دارد.','In a sorted array each comparison can discard half the candidates, so n options need only ⌈log₂ n⌉ guesses.'],
 big:{had:['می‌دانیم جست‌وجوی خطی در بدترین حالت n مقایسه می‌خواهد.','We know linear search needs n comparisons in the worst case.'],
  miss:['اگر داده مرتب باشد، آیا هر مقایسه می‌تواند بیش از یک گزینه را کنار بگذارد؟','If the data is sorted, can one comparison eliminate more than one option?'],
  fix:['نشان می‌دهد حدسِ وسط نیمی از بازه را حذف می‌کند و تعداد حدس‌ها لگاریتمی می‌شود.','Shows that guessing the middle removes half the range and makes the number of guesses logarithmic.'],
  close:['بازه در هر گام نصف می‌شود: n → n/2 → n/4 → … → 1، یعنی ⌈log₂ n⌉ گام. درس بعد همین ایده‌ی «تقسیم» را در مرتب‌سازی (merge sort) به‌کار می‌برد.','The range halves every step: n → n/2 → n/4 → … → 1, i.e. ⌈log₂ n⌉ steps. The next ideas apply the same divide step to sorting (merge sort).']},
 sol:{N:128,target:93,probes:[63,95,79,87,91,93]},fail:{N:128,target:93,probes:[0,1,2,3,4,5,6]},
 st:()=>({N:64,target:37,probes:[],mid:false}),
 stage(host,st,A){const range=()=>{let lo=0,hi=st.N-1;st.probes.forEach(p=>{if(p<st.target)lo=Math.max(lo,p+1);else if(p>st.target)hi=Math.min(hi,p-1)});return[lo,hi]};
  A.probe=p=>{p=Math.round(p);if(p<0||p>=st.N||st.probes.includes(p)||st.probes.includes(st.target))return;st.probes.push(p);A.upd()};A.range=range;A.limit=()=>Math.ceil(Math.log2(st.N));
  return k=>{host.innerHTML='';const[lo,hi]=range(),W=560,H=120,cw=(W-20)/st.N,found=st.probes.includes(st.target);const svg=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'sv',style:'touch-action:none;cursor:crosshair'});
   for(let i=0;i<st.N;i++){const inR=i>=lo&&i<=hi;svg.append(sv('rect',{x:10+i*cw,y:30,width:Math.max(1,cw-(cw>3?1:0)),height:46,fill:i===st.target&&found?'var(--ok)':inR?'var(--ac)':'var(--panel2)',opacity:inR||found&&i===st.target?1:.55}))}
   st.probes.forEach((p,j)=>{const x=10+p*cw+cw/2,hit=p===st.target;svg.append(sv('line',{x1:x,x2:x,y1:30,y2:84,stroke:hit?'var(--ok)':p<st.target?'var(--warn)':'var(--bad)','stroke-width':2}),sv('text',{x,y:98+(j%2)*12,'text-anchor':'middle','font-size':10},(hit?'✔':p<st.target?'<':'>')+p))});
   if(st.mid&&!found){const m=(lo+hi)>>1;svg.append(sv('path',{d:`M${10+m*cw+cw/2} 28 l-5 -10 h10z`,fill:'var(--hl)'}))}
   svg.addEventListener('pointerdown',e=>{const r=svg.getBoundingClientRect();A.probe((e.clientX-r.left)/r.width*W/cw-10/cw-.0)});
   host.append(svg,h('div',{class:'stat'},h('span',{},t2('گزینه‌های باقی‌مانده: ','Candidates left: '),h('b',{},found?1:hi-lo+1)),h('span',{},t2('حدس‌ها: ','Guesses: '),h('b',{},st.probes.length)),h('span',{},'⌈log₂ N⌉ = ',h('b',{},A.limit())),h('span',{},'N = ',h('b',{},st.N))),
    h('div',{class:'wn'},found?t2('عدد پیدا شد. ✔ سبز = هدف، < یعنی «بیشتر است»، > یعنی «کمتر است».','Found it. ✔ green = target; "<" means the target is higher, ">" lower.'):t2('روی یک خانه کلیک کنید تا به آن حدس بزنید. رنگ آبی = هنوز ممکن است.','Click a cell to guess it. Blue = still possible.')))}},
 screens:{
  puzzle:{ask:['یک عدد پنهان بین ۰ و ۶۳ است. هر حدس فقط می‌گوید «بیشتر است» یا «کمتر است». با چند حدس می‌توانید آن را پیدا کنید؟','A number is hidden between 0 and 63. Each guess only says "higher" or "lower". How few guesses can find it?'],
   do:['روی خانه‌ها کلیک کنید. با هر حدس ببینید چه تعداد خانه‌ی آبی می‌ماند.','Click cells. After each guess see how many blue cells remain.'],
   ctl:(st,A)=>{st.N=64;if(!st.probes.length||st.probes.includes(st.target)){st.probes=[];st.target=Math.floor(Math.random()*64)}return[btn(t2('↺ هدف تازه','↺ New target'),()=>{st.target=Math.floor(Math.random()*st.N);st.probes=[];A.upd()})]}},
  explore:{claim:['اگر همیشه وسط بازه‌ی باقی‌مانده را حدس بزنیم، تعداد گزینه‌ها در هر حدس نصف می‌شود.','If we always guess the middle of the remaining range, the candidate count halves each time.'],
   ask:['با نشانگر زرد (وسط بازه) حدس بزنید. آیا هیچ هدفی در ۶ حدس (برای N=۶۴) فرار می‌کند؟','Guess at the yellow marker (the middle of the range). Can any target escape in 6 guesses (N = 64)?'],
   do:['نشانگر وسط را روشن کنید و N را تغییر دهید؛ بدترین تعداد حدس‌ها را با ⌈log₂ N⌉ مقایسه کنید.','Turn the midpoint marker on and change N; compare the worst guess count with ⌈log₂ N⌉.'],
   ctl:(st,A)=>[rng('N',8,128,8,st.N,v=>{st.N=v;st.probes=[];st.target=Math.min(st.target,v-1);A.upd()},v=>String(Math.round(v))),btn(t2('نشانگر وسط','Midpoint marker'),()=>{st.mid=!st.mid;A.upd()}),btn(t2('حدس وسط','Guess middle'),()=>{const[l,h2]=A.range();A.probe((l+h2)>>1)}),btn(t2('↺ هدف تازه','↺ New target'),()=>{st.target=Math.floor(Math.random()*st.N);st.probes=[];A.upd()})],
   see:['حدس وسط، بازه را از N به N/2 به N/4 … می‌رساند؛ برای N=۶۴ حداکثر ۶ حدس.','Guessing the middle takes the range from N to N/2 to N/4 …; for N = 64 at most 6 guesses.']},
  name:{says:[['آنچه دیدید به شکل صوری:','What you saw, formally:']],tex:['\\left\\lceil \\log_2 N \\right\\rceil\\ \\text{guesses suffice:}\\quad n_k\\le \\left\\lfloor \\tfrac{N}{2^k}\\right\\rfloor'],
   legend:[['n_k',['تعداد گزینه‌های باقی‌مانده پس از k حدس.','Candidates remaining after k guesses.']],['N',['اندازه‌ی آرایه‌ی مرتب.','The size of the sorted array.']],['\\log_2 N',['تعداد دفعاتی که می‌توان N را نصف کرد تا ۱ شود.','How many times N can be halved until it reaches 1.']]]},
  challenge:{ask:['اکنون N=۱۲۸ و عدد هدف تصادفی است. آن را با حداکثر ⌈log₂ ۱۲۸⌉ = ۷ حدس پیدا کنید.','Now N = 128 and the target is random. Find it in at most ⌈log₂ 128⌉ = 7 guesses.'],
   do:['هر حدس را به‌گونه‌ای بزنید که بازه نصف شود. اگر شکست خوردید، «هدف تازه» را بزنید.','Make every guess halve the range. If you fail, press "New target".'],
   ctl:(st,A)=>{st.N=128;st.mid=false;st.probes=[];st.target=Math.floor(Math.random()*128);const inp=h('input',{type:'number',min:0,max:127,value:64,class:'in',style:{width:'80px'}});return[inp,btn(t2('حدس','Guess'),()=>A.probe(+inp.value)),btn(t2('↺ هدف تازه','↺ New target'),()=>{st.target=Math.floor(Math.random()*128);st.probes=[];A.upd()})]},
   ok:st=>st.N===128&&st.probes.includes(st.target)&&st.probes.length<=7,
   hints:[['بعد از هر حدس نگاه کنید: دقیقاً چند خانه‌ی آبی مانده؟ حدس بعدی باید آن را نصف کند.','After each guess check exactly how many blue cells remain. The next guess must halve that.'],['حدس اول: خانه‌ی نزدیک وسط (۶۳ یا ۶۴).','First guess: a cell near the middle (63 or 64).'],['هر بار وسط بازه‌ی آبی را بزنید. نشانگر زرد در بخش کاوش همین را نشان می‌داد.','Each time guess the middle of the blue range. The yellow marker in Explore showed exactly that.']],
   win:['۷ حدس یا کمتر: هر حدس نیمی از گزینه‌ها را حذف کرد. همین است که جست‌وجوی دودویی را برای ۱ میلیارد کلید فقط ۳۰ مقایسه می‌کند.','7 guesses or fewer: every guess removed half the candidates. That is why binary search needs only 30 comparisons for a billion keys.']}}});

/* A5 · Greedy vs dynamic programming */
LAB({id:'a5',mod:'A',g:'A5',lessons:['a5-2'],
 t:['حریصانه همیشه بهینه نیست','Greedy is not always optimal'],
 aha:['انتخاب حریصانه‌ی هر گام فقط وقتی بهینه است که ساختار مسئله آن را تضمین کند؛ برنامه‌ریزی پویا همه‌ی زیرمسئله‌ها را می‌سنجد.','Taking the locally best choice is optimal only when the problem\'s structure guarantees it; dynamic programming weighs every subproblem.'],
 big:{had:['می‌دانیم تقسیم مسئله به زیرمسئله‌ها (بازگشت) و ذخیره‌ی جواب‌ها (memoization) تکرار را حذف می‌کند.','We know splitting a problem into subproblems (recursion) and storing answers (memoization) removes repeated work.'],
  miss:['گاهی ساده‌تر است هر بار بهترین گزینه‌ی فعلی را برداریم (greedy). کِی این کار درست است؟','Sometimes it is simpler to take the best option right now (greedy). When is that correct?'],
  fix:['با مسئله‌ی کمترین تعداد سکه نشان می‌دهد greedy برای بعضی سکه‌ها شکست می‌خورد و DP نه.','Using the minimum-coins problem, shows greedy failing for some coin systems while DP never does.'],
  close:['DP جدول $d[x]=1+\\min_c d[x-c]$ را کامل می‌کند و همیشه بهینه است؛ greedy فقط برای سیستم‌های «متعارف» (مثل ۱،۵،۱۰،۲۵). درس بعد (backtracking) همه‌ی انتخاب‌ها را با هرس بررسی می‌کند.','DP fills the table $d[x]=1+\\min_c d[x-c]$ and is always optimal; greedy works only for "canonical" systems (like 1, 5, 10, 25). Backtracking next explores all choices with pruning.']},
 sol:{c2:7,c3:8},fail:{c2:5,c3:10},
 st:()=>({c2:5,c3:10,x:30}),
 stage(host,st,A){const greedy=(coins,a)=>{let n=0;[...coins].sort((p,q)=>q-p).forEach(c=>{n+=Math.floor(a/c);a%=c});return n};
  const dp=(coins,A_)=>{const d=[0];for(let x=1;x<=A_;x++){d[x]=1e9;coins.forEach(c=>{if(c<=x)d[x]=Math.min(d[x],d[x-c]+1)})}return d};
  A.gap=(c2,c3)=>{const co=[1,c2,c3],d=dp(co,30);let g=0,at=0;for(let x=1;x<=30;x++){const v=greedy(co,x)-d[x];if(v>g){g=v;at=x}}return{g,at}};
  return k=>{host.innerHTML='';const co=[1,st.c2,st.c3],d=dp(co,30),W=560,H=150,cw=(W-60)/30;const svg=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'sv'});let worst=0;
   svg.append(sv('text',{x:4,y:42,class:'mut','font-size':10},t2('حریصانه','greedy')),sv('text',{x:4,y:82,class:'mut','font-size':10},t2('بهینه (DP)','optimal (DP)')));
   for(let x=1;x<=30;x++){const g=greedy(co,x),o=d[x],bad=g>o;worst=Math.max(worst,g-o);const cx=50+(x-1)*cw;
    svg.append(sv('text',{x:cx+cw/2,y:14,'text-anchor':'middle','font-size':9,class:'mut'},x),sv('rect',{x:cx,y:22,width:cw-1,height:28,class:'cell',style:bad?'fill:color-mix(in srgb,var(--bad) 35%,var(--panel2));stroke:var(--bad)':''}),sv('text',{x:cx+cw/2,y:41,'text-anchor':'middle','font-size':10},g),
     sv('rect',{x:cx,y:62,width:cw-1,height:28,class:'cell'}),sv('text',{x:cx+cw/2,y:81,'text-anchor':'middle','font-size':10},o));if(bad)svg.append(sv('text',{x:cx+cw/2,y:106,'text-anchor':'middle','font-size':11,fill:'var(--bad)'},'▲'))}
   svg.append(sv('text',{x:W/2,y:H-8,'text-anchor':'middle',class:'mut'},t2('مقدار x (۱ تا ۳۰) · ▲ و قرمز = حریصانه بدتر از بهینه','amount x (1…30) · ▲ and red = greedy is worse than optimal')));
   host.append(svg,h('div',{class:'stat'},h('span',{},t2('سکه‌ها: ','Coins: '),h('b',{},co.join(', '))),h('span',{},t2('بیشترین اختلاف: ','Largest gap: '),h('b',{},worst+t2(' سکه',' coins')))))}},
 screens:{
  puzzle:{ask:['برای پرداخت x با کمترین تعداد سکه، همیشه بزرگ‌ترین سکه‌ی ممکن را برمی‌داریم (حریصانه). با سکه‌های ۱، ۵، ۱۰ این کار درست است؟ و با ۱، ۵، ۶؟','To pay x with the fewest coins we always take the largest coin that fits (greedy). Is that right with coins 1, 5, 10? And with 1, 5, 6?'],
   do:['سکه‌ی دوم و سوم را روی (۵،۱۰) و بعد (۵،۶) بگذارید و ردیف‌های قرمز را ببینید.','Set the second and third coin to (5, 10), then (5, 6), and look for red columns.'],
   ctl:(st,A)=>[rng(t2('سکه‌ی دوم','Second coin'),2,15,1,st.c2,v=>{st.c2=v;A.upd()},v=>String(Math.round(v))),rng(t2('سکه‌ی سوم','Third coin'),2,15,1,st.c3,v=>{st.c3=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['حریصانه فقط برای بعضی مجموعه‌های سکه بهینه است، و DP برای همه‌ی آن‌ها بهینه است.','Greedy is optimal only for some coin sets, and DP is optimal for all of them.'],
   ask:['کدام سکه‌ها حریصانه را می‌شکنند؟ چه نوع x را قرمز می‌کنند؟','Which coin sets break greedy? Which amounts x turn red?'],
   do:['(۱،۵،۱۰)، (۱،۳،۴) و (۱،۶،۷) را مقایسه کنید.','Compare (1, 5, 10), (1, 3, 4) and (1, 6, 7).'],
   ctl:(st,A)=>[btn('1·5·10',()=>{st.c2=5;st.c3=10;A.upd()}),btn('1·3·4',()=>{st.c2=3;st.c3=4;A.upd()}),btn('1·6·7',()=>{st.c2=6;st.c3=7;A.upd()}),rng(t2('سکه‌ی دوم','Second coin'),2,15,1,st.c2,v=>{st.c2=v;A.upd()},v=>String(Math.round(v))),rng(t2('سکه‌ی سوم','Third coin'),2,15,1,st.c3,v=>{st.c3=v;A.upd()},v=>String(Math.round(v)))],
   see:['برای (۱،۳،۴) و x=۶ حریصانه ۴+۱+۱ (۳ سکه) می‌دهد ولی ۳+۳ (۲ سکه) بهتر است. گرفتن بزرگ‌ترین سکه جواب را برای باقی‌مانده خراب کرد.','For (1, 3, 4) and x = 6 greedy gives 4+1+1 (3 coins) but 3+3 (2 coins) is better. Taking the largest coin ruined the remainder.']},
  name:{says:[['DP می‌پرسد: «اگر آخرین سکه c باشد، بهترین راه برای باقی‌مانده چیست؟» و از همه‌ی c کمینه می‌گیرد:','DP asks: "if the last coin is c, what is the best way to pay the remainder?" and takes the minimum over every c:']],
   tex:['d[0]=0,\\qquad d[x]=1+\\min_{c\\in C,\\ c\\le x} d[x-c]'],
   legend:[['d[x]',['کمترین تعداد سکه برای پرداخت x.','The fewest coins that pay x.']],['C',['مجموعه‌ی سکه‌ها.','The set of coin values.']],['c',['آخرین سکه‌ی ممکن؛ همه‌ی آن‌ها امتحان می‌شوند، نه فقط بزرگ‌ترینشان.','The possible last coin; all are tried, not just the largest.']]]},
  challenge:{ask:['سکه‌ی اول ۱ است. سکه‌های دوم و سوم (۲ تا ۱۵) را طوری انتخاب کنید که برای x ≤ ۳۰ حریصانه دست‌کم ۴ سکه بدتر از بهینه شود.','The first coin is 1. Choose the second and third coins (2 to 15) so that for some x ≤ 30 greedy is at least 4 coins worse than optimal.'],
   do:['سطرهای قرمز را دنبال کنید و اختلاف را در نوار بالا ببینید.','Follow the red columns and read the gap in the stats line.'],
   ctl:(st,A)=>[rng(t2('سکه‌ی دوم','Second coin'),2,15,1,st.c2,v=>{st.c2=v;A.upd()},v=>String(Math.round(v))),rng(t2('سکه‌ی سوم','Third coin'),2,15,1,st.c3,v=>{st.c3=v;A.upd()},v=>String(Math.round(v)))],
   ok:st=>{const co=[1,st.c2,st.c3];if(st.c2===st.c3)return false;const g=(a)=>{let n=0;[...co].sort((p,q)=>q-p).forEach(c=>{n+=Math.floor(a/c);a%=c});return n};const d=[0];for(let x=1;x<=30;x++){d[x]=1e9;co.forEach(c=>{if(c<=x)d[x]=Math.min(d[x],d[x-c]+1)})}let m=0;for(let x=1;x<=30;x++)m=Math.max(m,g(x)-d[x]);return m>=4},
   hints:[['حریصانه وقتی می‌بازد که بزرگ‌ترین سکه باقی‌مانده‌ی بدی بسازد.','Greedy loses when the largest coin leaves a bad remainder.'],['دو سکه‌ی نزدیک به هم و کوچک (مثلاً ۶ و ۷) را امتحان کنید.','Try two small, close-together coins (say 6 and 7).'],['باقی‌مانده‌ی x بعد از برداشتن بزرگ‌ترین سکه باید یک مضرب بد از سکه‌ی کوچک‌تر بسازد.','The remainder after taking the largest coin must force many of the smaller coin.']],
   win:['این سکه‌ها «متعارف» نیستند: حریصانه آشکارا بدتر است ولی DP هنوز بهینه است، چون همه‌ی انتخاب‌های آخرین سکه را مقایسه می‌کند.','This coin system is not "canonical": greedy is clearly worse while DP stays optimal, because it compares every choice of last coin.']}}});

/* A6 · Pick the structure by the operation mix */
LAB({id:'a6',mod:'A',g:'A6',lessons:['a6-1'],
 t:['ساختار را با ترکیب عملیات انتخاب کنید','Choose by the operation mix'],
 aha:['هیچ ساختاری در همه‌چیز برنده نیست؛ بهترین ساختار را عملیاتِ غالبِ بار کاری تعیین می‌کند.','No structure wins at everything; the dominant operation in the workload decides the best one.'],
 big:{had:['هر ساختار (آرایه، هش، درخت، هیپ) برای هر عمل هزینه‌ی مشخصی دارد.','Every structure (array, hash, tree, heap) has a known cost per operation.'],
  miss:['در یک برنامه‌ی واقعی عملیات مخلوط‌اند؛ چگونه از روی بار کاری ساختار را انتخاب کنیم؟','A real program mixes operations; how do we pick a structure from the workload?'],
  fix:['هزینه‌ی کل را برای ۵ ساختار روی یک بار کاری قابل‌تغییر نشان می‌دهد.','Shows the total cost of five structures under an adjustable workload.'],
  close:['هزینه‌ی کل = مجموع وزن هر عمل × هزینه‌ی آن عمل در ساختار. بنابراین اول عمل غالب را شناسایی کنید و بعد ساختار را انتخاب کنید. درس‌های بعدی این انتخاب را برای پایگاه داده (ایندکس) تکرار می‌کنند.','Total cost = Σ weight of an operation × its cost in the structure. So identify the dominant operation first, then choose. The database lessons repeat this choice for indexes.']},
 sol:{pick:['hash','heap','bst']},fail:{pick:['bst','bst','bst']},
 st:()=>({L:50,I:30,R:10,M:10,pick:['','','']}),
 stage(host,st,A){const n=1e6,lg=Math.log2(n),k=100;
  const COST={arr:{L:n/2,I:1,R:n,M:n},sorted:{L:lg,I:n/2,R:lg+k,M:1},hash:{L:1,I:1,R:n,M:n},bst:{L:lg,I:lg,R:lg+k,M:lg},heap:{L:n/2,I:lg,R:n,M:1}};
  const NAMES={arr:t2('آرایه‌ی نامرتب','Unsorted array'),sorted:t2('آرایه‌ی مرتب','Sorted array'),hash:t2('جدول هش','Hash table'),bst:t2('درخت متوازن','Balanced tree'),heap:t2('هیپ','Heap')};
  A.WL=[{L:.95,I:.05,R:0,M:0},{L:0,I:.4,R:0,M:.6},{L:.2,I:.3,R:.5,M:0}];
  A.cost=(w)=>{const o={};Object.keys(COST).forEach(s=>o[s]=Object.keys(w).reduce((a,op)=>a+w[op]*COST[s][op],0));return o};A.names=NAMES;
  const bars=(svg,w,x0,wid,pick)=>{const c=A.cost(w),b=Math.min(...Object.values(c)),keys=Object.keys(COST);keys.forEach((s,i)=>{const lv=Math.log10(c[s]/b+1),bh=lv/6*150,y=190-bh;svg.append(sv('rect',{x:x0+i*(wid/5)+4,y,width:wid/5-8,height:bh,fill:c[s]<=b*1.5?'var(--ok)':'var(--ac)',stroke:pick===s?'var(--hl)':'none','stroke-width':3}),sv('text',{x:x0+i*(wid/5)+wid/10,y:y-4,'text-anchor':'middle','font-size':9},c[s]<=b*1.5?'✔':'×'+fmt(c[s]/b,0)),sv('text',{x:x0+i*(wid/5)+wid/10,y:206,'text-anchor':'middle','font-size':8.5,class:'mut'},NAMES[s].split(' ')[0]))})};
  return k=>{host.innerHTML='';const W=560,svg=sv('svg',{viewBox:`0 0 ${W} 225`,class:'sv'});
   if(k==='challenge'){[0,1,2].forEach(i=>{const x0=i*(W/3);svg.append(sv('text',{x:x0+W/6,y:14,'text-anchor':'middle','font-size':11,'font-weight':700},t2('بار کاری ','Workload ')+'ABC'[i]));bars(svg,A.WL[i],x0,W/3,st.pick[i])})}
   else{const tot=(st.L+st.I+st.R+st.M)||1,w={L:st.L/tot,I:st.I/tot,R:st.R/tot,M:st.M/tot};bars(svg,w,0,W,'')}
   host.append(svg,h('div',{class:'wn'},t2('ارتفاع = لگاریتم هزینه‌ی کل نسبت به بهترین ساختار (n=۱۰⁶ و هر بازه ۱۰۰ نتیجه). ✔ = حداکثر ۱٫۵ برابر بهترین.','Height = log of total cost relative to the best structure (n = 10⁶, each range returns 100 results). ✔ = within 1.5× of the best.')))}},
 screens:{
  puzzle:{ask:['برای ۱ میلیون کلید، پنج ساختار با ترکیب «جست‌وجو، درج، بازه، کمینه» رقابت می‌کنند. آیا یک برنده‌ی ثابت وجود دارد؟','Five structures compete over 1 million keys under a mix of lookup, insert, range and min. Is there a fixed winner?'],
   do:['اسلایدرها را عوض کنید و ببینید کدام ستون سبز (✔) می‌شود.','Move the sliders and see which column turns green (✔).'],
   ctl:(st,A)=>['L','I','R','M'].map(o=>rng(({L:t2('جست‌وجوی کلید','Lookup'),I:t2('درج','Insert'),R:t2('بازه','Range'),M:t2('کمینه','Min')})[o],0,100,1,st[o],v=>{st[o]=v;A.upd()},v=>Math.round(v)+'%'))},
  explore:{claim:['هر ساختار فقط روی یک یا دو عمل برنده است؛ بقیه‌ی عمل‌ها را گران می‌پردازد.','Each structure wins on one or two operations and pays dearly for the others.'],
   ask:['کدام عمل را باید غالب کنیم تا هش برنده شود؟ هیپ؟ درخت؟','Which operation must dominate for the hash to win? The heap? The tree?'],
   do:['پیش‌تنظیم‌ها را بزنید و اسلایدرها را حول آن‌ها تغییر دهید.','Press the presets and wiggle the sliders around them.'],
   ctl:(st,A)=>[btn(t2('فقط جست‌وجو','Lookup-heavy'),()=>{Object.assign(st,{L:95,I:5,R:0,M:0});A.upd()}),btn(t2('صف اولویت','Priority queue'),()=>{Object.assign(st,{L:0,I:40,R:0,M:60});A.upd()}),btn(t2('پرس‌وجوی بازه‌ای','Range queries'),()=>{Object.assign(st,{L:20,I:30,R:50,M:0});A.upd()})],
   see:['جست‌وجو → هش، کمینه + درج → هیپ، بازه + درج → درخت متوازن. آرایه‌ی مرتب فقط وقتی خوب است که درج نداشته باشیم.','Lookup → hash, min + insert → heap, range + insert → balanced tree. A sorted array is only good when there are no inserts.']},
  name:{says:[['به زبان ریاضی: هر ساختار S یک بردار هزینه‌ی عمل‌ها دارد و بار کاری یک بردار وزن.','In math: each structure S has a cost vector over operations and the workload is a weight vector.']],
   tex:['\\text{cost}(S)=\\sum_{o\\in\\{L,I,R,M\\}} w_o\\cdot c_o(S)'],
   legend:[['w_o',['سهم عمل o در بار کاری (جمع وزن‌ها ۱).','Share of operation o in the workload (weights sum to 1).']],['c_o(S)',['هزینه‌ی یک عمل o در ساختار S (مثلاً O(1)، O(log n)، O(n)).','The cost of one operation o in structure S (e.g. O(1), O(log n), O(n)).']]]},
  challenge:{ask:['سه بار کاری A (۹۵٪ جست‌وجو)، B (۴۰٪ درج و ۶۰٪ کمینه) و C (۲۰٪ جست‌وجو، ۳۰٪ درج، ۵۰٪ بازه) داریم. برای هرکدام ساختاری انتخاب کنید که ستونش سبز (✔) شود.','Three workloads: A (95% lookup), B (40% insert, 60% min) and C (20% lookup, 30% insert, 50% range). Pick for each a structure whose column turns green (✔).'],
   do:['انتخاب‌های شما با کادر زرد دور ستون مشخص می‌شود.','Your picks are outlined in yellow.'],
   ctl:(st,A)=>[['A',0],['B',1],['C',2]].map(([nm,i])=>sel(t2('بار کاری ','Workload ')+nm,[{v:'',t:'—'},{v:'arr',t:A.names.arr},{v:'sorted',t:A.names.sorted},{v:'hash',t:A.names.hash},{v:'bst',t:A.names.bst},{v:'heap',t:A.names.heap}],st.pick[i],v=>{st.pick[i]=v;A.upd()})),
   ok:st=>{const n=1e6,lg=Math.log2(n),k=100;const C={arr:{L:n/2,I:1,R:n,M:n},sorted:{L:lg,I:n/2,R:lg+k,M:1},hash:{L:1,I:1,R:n,M:n},bst:{L:lg,I:lg,R:lg+k,M:lg},heap:{L:n/2,I:lg,R:n,M:1}};const W=[{L:.95,I:.05,R:0,M:0},{L:0,I:.4,R:0,M:.6},{L:.2,I:.3,R:.5,M:0}];return W.every((w,i)=>{const c={};Object.keys(C).forEach(s=>c[s]=Object.keys(w).reduce((a,o)=>a+w[o]*C[s][o],0));const b=Math.min(...Object.values(c));return st.pick[i]&&c[st.pick[i]]<=b*1.5})},
   hints:[['در A تقریباً فقط جست‌وجوی دقیق داریم. کدام ساختار O(1) می‌دهد؟','In A we almost only look up exact keys. Which structure gives O(1)?'],['B: ۶۰٪ استخراج کمینه و ۴۰٪ درج؛ کدام ساختار هر دو را ارزان می‌کند؟','B: 60% extract-min and 40% inserts; which structure makes both cheap?'],['C: بازه‌ها گران‌ترین عمل‌اند؛ فقط ساختارهای مرتب آن را ارزان می‌کنند، و درج را هم باید تحمل کنند.','C: ranges are the costliest operation; only ordered structures make it cheap, and they must also tolerate inserts.']],
   win:['هر بار کاری یک عمل غالب دارد و ساختار درست آن را ارزان می‌کند. اول بار کاری را بشناسید، بعد ساختار را انتخاب کنید.','Each workload has a dominant operation, and the right structure makes it cheap. Know the workload first, then choose.']}}});
