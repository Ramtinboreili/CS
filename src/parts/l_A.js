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
