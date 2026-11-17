/* ===================== LABS: Module C (Mathematics for AI) ===================== */
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function arrowSvg(P,x0,y0,x1,y1,col,wd){P.line(x0,y0,x1,y1,col,null,wd||2.4);const a=Math.atan2(P.Y(y1)-P.Y(y0),P.X(x1)-P.X(x0)),X=P.X(x1),Y=P.Y(y1);P.svg.append(sv('path',{d:`M${X} ${Y} l${-9*Math.cos(a-.4)} ${-9*Math.sin(a-.4)} M${X} ${Y} l${-9*Math.cos(a+.4)} ${-9*Math.sin(a+.4)}`,stroke:col,'stroke-width':wd||2.4,fill:'none'}))}

/* C1 · Eigenvectors keep their direction */
LAB({id:'c1',mod:'C',g:'C1',lessons:['c1-1','c1-2','c1-3'],
 t:['بردار ویژه جهتش را حفظ می‌کند','An eigenvector keeps its direction'],
 aha:['ماتریس یک تبدیل است؛ بیشتر بردارها با آن می‌چرخند، ولی جهت‌های ویژه‌ای فقط کش می‌آیند (ضرب در λ).','A matrix is a transformation; most vectors turn, but special directions are only stretched (multiplied by λ).'],
 big:{had:['می‌دانیم ماتریس بردار را به بردار دیگر می‌برد (Av) و ستون‌های آن مقصد پایه‌ها هستند.','We know a matrix maps one vector to another (Av) and its columns are where the basis vectors land.'],
  miss:['آیا جهتی هست که تبدیل آن را نمی‌چرخاند؟ چنین جهت‌هایی ساختار تبدیل را آشکار می‌کنند.','Is there a direction the transformation does not turn? Such directions reveal the structure of the transformation.'],
  fix:['بردار آزمون u را بچرخانید و ببینید کِی Au با u هم‌راستا می‌شود.','Rotate a test vector u and see when Au lines up with u.'],
  close:['بردارهایی که Av=λv دارند، بردار ویژه‌اند و λ مقدار ویژه است. از آن‌ها در PCA، پایداری سیستم‌ها و SVD استفاده می‌شود؛ درس بعد (حسابان) تغییرات پیوسته را بررسی می‌کند.','Vectors with Av = λv are eigenvectors and λ is the eigenvalue. They power PCA, stability analysis and the SVD; calculus comes next.']},
 sol:{a:2,b:1,c:1,d:2},fail:{a:1,b:0,c:0,d:1},
 st:()=>({a:1,b:1,c:0,d:1,th:40}),
 stage(host,st,A){return k=>{host.innerHTML='';const P=chart(360,330,-5,5,-4.6,4.6,{l:24,r:10,t:10,b:20});P.axes(10,8,v=>String(Math.round(v)),v=>String(Math.round(v)));
   const M=(x,y)=>[st.a*x+st.b*y,st.c*x+st.d*y];const sq=[[0,0],[1,0],[1,1],[0,1]];let d1='M',d2='M';sq.forEach(([x,y],i)=>{d1+=(i?'L':'')+P.X(x)+' '+P.Y(y)+' ';const[m,n]=M(x,y);d2+=(i?'L':'')+P.X(m)+' '+P.Y(n)+' '});
   P.svg.append(sv('path',{d:d1+'Z',fill:'none',stroke:'var(--mut)','stroke-dasharray':'4 3'}),sv('path',{d:d2+'Z',fill:'var(--ac)',opacity:.22,stroke:'var(--ac)'}));
   const ch=k==='challenge',u=ch?[1,1]:[Math.cos(st.th*Math.PI/180),Math.sin(st.th*Math.PI/180)],ul=ch?1.4:1,v=M(u[0],u[1]);
   arrowSvg(P,0,0,u[0],u[1],'var(--ac)',2.8);arrowSvg(P,0,0,Math.max(-4.8,Math.min(4.8,v[0])),Math.max(-4.4,Math.min(4.4,v[1])),'var(--bad)',2.8);
   const cr=u[0]*v[1]-u[1]*v[0],dot=u[0]*v[0]+u[1]*v[1],lam=dot/(u[0]*u[0]+u[1]*u[1]),par=Math.abs(cr)<0.08*Math.hypot(...u)*Math.max(.3,Math.hypot(...v));A.lam=lam;
   P.text(-4.8,4.1,'u',  'var(--ac)','start',12);P.text(-3.6,4.1,'Au','var(--bad)','start',12);
   host.append(P.svg,h('div',{class:'stat'},h('span',{},'A = [[',h('b',{},fmt(st.a,1)+', '+fmt(st.b,1)),'],[',h('b',{},fmt(st.c,1)+', '+fmt(st.d,1)),']]'),h('span',{},'det A = ',h('b',{},fmt(st.a*st.d-st.b*st.c,2))),h('span',{},t2('u و Au: ','u vs Au: '),h('b',{style:{color:par?'var(--ok)':'var(--bad)'}},par?t2('✔ هم‌راستا','✔ parallel'):t2('✘ متفاوت‌جهت','✘ different direction'))),par?h('span',{},'λ ≈ ',h('b',{},fmt(lam,2))):null),
    h('div',{class:'wn'},t2('آبی = u (طول ۱)، قرمز = Au، مربع نقطه‌چین = مربع واحد، ناحیه‌ی آبی = تصویر مربع.','Blue = u (length 1), red = Au, dashed = unit square, shaded = its image.')))}},
 screens:{
  puzzle:{ask:['ماتریس A=[[1,1],[0,1]] (برش) بردار u را به Au می‌برد. آیا Au همیشه با u در یک راستا است؟ برای کدام جهت‌ها هم‌راستا می‌شود؟','The matrix A = [[1,1],[0,1]] (a shear) maps u to Au. Is Au always along u? For which directions is it?'],
   do:['زاویه‌ی u را بچرخانید و ببینید کِی خط قرمز روی آبی می‌افتد.','Rotate u and see when the red arrow falls on the blue one.'],
   ctl:(st,A)=>{Object.assign(st,{a:1,b:1,c:0,d:1});return[rng('θ°',0,180,1,st.th,v=>{st.th=v;A.upd()},v=>Math.round(v)+'°')]}},
  explore:{claim:['هر ماتریس حقیقی ۲×۲ حداکثر دو جهت ویژه‌ی حقیقی دارد؛ بعضی (چرخش) هیچ ندارند.','A real 2×2 matrix has at most two real eigen-directions; some (rotations) have none.'],
   ask:['برای ماتریس متقارن [[2,1],[1,2]] چند جهت هم‌راستا پیدا می‌کنید؟ و برای چرخش ۹۰°؟','How many parallel directions can you find for the symmetric matrix [[2,1],[1,2]]? And for a 90° rotation?'],
   do:['پیش‌تنظیم‌ها را بزنید و θ را بچرخانید.','Press the presets and sweep θ.'],
   ctl:(st,A)=>[btn(t2('برش','Shear'),()=>{Object.assign(st,{a:1,b:1,c:0,d:1});A.upd()}),btn(t2('متقارن','Symmetric'),()=>{Object.assign(st,{a:2,b:1,c:1,d:2});A.upd()}),btn(t2('چرخش ۹۰°','Rotation 90°'),()=>{Object.assign(st,{a:0,b:-1,c:1,d:0});A.upd()}),btn(t2('مقیاس','Scaling'),()=>{Object.assign(st,{a:2,b:0,c:0,d:0.5});A.upd()}),rng('θ°',0,180,1,st.th,v=>{st.th=v;A.upd()},v=>Math.round(v)+'°')],
   see:['متقارن: جهت‌های ۴۵° (λ=۳) و ۱۳۵° (λ=۱). چرخش: هیچ جهتی هم‌راستا نمی‌شود. مقیاس: محورها (λ=۲ و ۰٫۵).','Symmetric: 45° (λ = 3) and 135° (λ = 1). Rotation: no direction lines up. Scaling: the axes (λ = 2 and 0.5).']},
  name:{says:[['جهت‌های هم‌راستا همان بردارهای ویژه‌اند:','The directions that line up are the eigenvectors:']],tex:['A\\mathbf v=\\lambda\\mathbf v\\iff \\det(A-\\lambda I)=0'],
   legend:[['\\mathbf v',['بردار ویژه: جهتی که حفظ می‌شود.','The eigenvector: the direction that is preserved.']],['\\lambda',['مقدار ویژه: ضریب کش‌آمدن (منفی = برعکس‌شدن).','The eigenvalue: the stretch factor (negative = flips).']],['\\det(A-\\lambda I)',['چندجمله‌ای مشخصه؛ ریشه‌هایش λها هستند.','The characteristic polynomial; its roots are the eigenvalues.']]]},
  challenge:{ask:['ماتریس A را طوری بسازید که بردار (۱،۱) بردار ویژه با مقدار ویژه ۳ باشد: A(1,1)=3(1,1).','Build a matrix A for which (1, 1) is an eigenvector with eigenvalue 3: A(1,1) = 3(1,1).'],
   do:['بردار آبی ثابت (۱،۱) است. a,b,c,d را تنظیم کنید تا قرمز هم‌راستا و سه برابر شود.','The blue vector is fixed at (1, 1). Set a, b, c, d so the red arrow lines up with it and is three times as long.'],
   ctl:(st,A)=>{Object.assign(st,{a:1,b:0.5,c:0.5,d:1});return[['a',-3,3],['b',-3,3],['c',-3,3],['d',-3,3]].map(([k,lo,hi])=>rng(k,lo,hi,0.1,st[k],v=>{st[k]=v;A.upd()},v=>fmt(v,1)))},
   ok:st=>Math.abs(st.a+st.b-3)<0.15&&Math.abs(st.c+st.d-3)<0.15,
   hints:[['A(1,1) = (a+b, c+d). این بردار باید (۳،۳) شود.','A(1,1) = (a+b, c+d). That must equal (3, 3).'],['دو معادله‌ی مستقل: a+b=3 و c+d=3.','Two independent equations: a + b = 3 and c + d = 3.'],['بی‌شمار پاسخ هست؛ مثلاً هر سطر را جداگانه روی مجموع ۳ ببرید.','There are infinitely many answers; just bring each row\'s sum to 3.']],
   win:['شرط تنها a+b=c+d=3 است، پس خانواده‌ی بزرگی از ماتریس‌ها (۲ درجه آزادی) بردار (۱،۱) را به‌عنوان بردار ویژه با λ=۳ دارند.','The only condition is a + b = c + d = 3, so a whole family of matrices (2 degrees of freedom) have (1, 1) as an eigenvector with λ = 3.']}}});

/* C2 · Gradient and the step size */
function contourStage(host,lam,paths,o){const P=chart(420,300,-6,6,-3.5,3.5,{l:28,r:10,t:8,b:20});P.axes(6,5,v=>String(Math.round(v)),v=>String(Math.round(v)));
 [0.5,2,5,12,24].forEach(L=>{const rx=Math.sqrt(2*L),ry=Math.sqrt(2*L/lam);let d='';for(let i=0;i<=64;i++){const a=i/64*2*Math.PI;d+=(i?'L':'M')+P.X(rx*Math.cos(a)).toFixed(1)+' '+P.Y(ry*Math.sin(a)).toFixed(1)}P.svg.append(sv('path',{d:d+'Z',fill:'none',stroke:'var(--bd)','stroke-width':1.2}))});
 paths.forEach(p=>{let d='';p.pts.forEach(([x,y],i)=>{d+=(i?'L':'M')+P.X(Math.max(-6,Math.min(6,x))).toFixed(1)+' '+P.Y(Math.max(-3.5,Math.min(3.5,y))).toFixed(1)});P.svg.append(sv('path',{d,fill:'none',stroke:p.col,'stroke-width':p.w||2,'stroke-dasharray':p.dash||null}));p.pts.forEach(([x,y],i)=>{if(i%(p.every||1)===0&&Math.abs(x)<6&&Math.abs(y)<3.5)P.svg.append(sv('circle',{cx:P.X(x),cy:P.Y(y),r:2.6,fill:p.col}))})});
 P.svg.append(sv('path',{d:`M${P.X(0)-6} ${P.Y(0)} h12 M${P.X(0)} ${P.Y(0)-6} v12`,stroke:'var(--ok)','stroke-width':2.5}));host.append(P.svg);return P}
LAB({id:'c2',mod:'C',g:'C2',lessons:['c2-1','c2-2'],
 t:['گرادیان و اندازه‌ی گام','The gradient and the step size'],
 aha:['گرادیان جهت بیشترین صعود است؛ گام‌برداشتن در خلاف آن کاهش می‌دهد، ولی اندازه‌ی گام η باید با انحنای سطح جور باشد وگرنه کند می‌شود یا واگرا.','The gradient points uphill; stepping against it reduces the loss, but the step size η must fit the surface\'s curvature or it crawls or diverges.'],
 big:{had:['می‌دانیم مشتق نرخ تغییر یک تابع است و گرادیان آن را برای چند متغیر تعمیم می‌دهد.','We know a derivative is a function\'s rate of change and the gradient generalizes it to several variables.'],
  miss:['چگونه از گرادیان برای یافتن کمینه استفاده کنیم و گام چقدر باید باشد؟','How do we use the gradient to find a minimum, and how big should the step be?'],
  fix:['گام‌های گرادیان نزولی روی کانتور f(x,y)=½(x²+10y²) را با η قابل‌تنظیم نشان می‌دهد.','Shows gradient-descent steps on the contours of f(x, y) = ½(x² + 10y²) with an adjustable η.'],
  close:['θ←θ−η∇f؛ برای این f هر مؤلفه ضرب در (۱−ηλ) می‌شود و همگرایی نیازمند η<۲/λ_max است. رشد بیشتر در درس بعد (بهینه‌سازی) و ضرب‌های زنجیره‌ای در backprop.','θ ← θ − η∇f; for this f each coordinate is multiplied by (1 − ηλ), so convergence needs η < 2/λ_max. More in the optimization lessons and the chain rule in backprop.']},
 sol:{eta:0.17},fail:{eta:0.05},
 st:()=>({eta:0.1,K:15}),
 stage(host,st,A){const run=(eta,K)=>{let x=4,y=1;const pts=[[x,y]];for(let i=0;i<K;i++){x-=eta*x;y-=eta*10*y;pts.push([x,y])}return pts};A.run=run;A.loss=(eta,K)=>{const p=run(eta,K).pop();return .5*(p[0]*p[0]+10*p[1]*p[1])};
  return()=>{host.innerHTML='';contourStage(host,10,[{pts:run(st.eta,st.K),col:'var(--ac)',w:2.2}]);const L=A.loss(st.eta,st.K);
   host.append(h('div',{class:'stat'},h('span',{},'η = ',h('b',{},fmt(st.eta,3))),h('span',{},t2('گام‌ها: ','Steps: '),h('b',{},st.K)),h('span',{},t2('خطا پس از گام‌ها: ','Loss after the steps: '),h('b',{style:{color:L<0.05?'var(--ok)':'var(--fg)'}},fmt(L,3))),h('span',{},t2('شروع: (۴، ۱)','Start: (4, 1)'))),
    h('div',{class:'wn'},t2('خطوط = کانتورهای f؛ ✚ = کمینه؛ نقطه‌ها = گام‌های متوالی (خارج از کادر = واگرا).','Lines = contours of f; ✚ = minimum; dots = successive steps (off-frame = diverged).')))}},
 screens:{
  puzzle:{ask:['از (۴،۱) با گام‌های θ←θ−η∇f پایین می‌رویم. اگر η بسیار کوچک یا بزرگ باشد چه می‌شود؟','From (4, 1) we descend with θ ← θ − η∇f. What happens if η is tiny or huge?'],
   do:['η را از ۰٫۰۱ تا ۰٫۲۵ بکشید.','Drag η from 0.01 to 0.25.'],ctl:(st,A)=>[rng('η',0.01,0.25,0.002,st.eta,v=>{st.eta=v;A.upd()},v=>fmt(v,3))]},
  explore:{claim:['هر مؤلفه با ضریب (۱−ηλ_i) کم می‌شود: برای λ=۱۰ باید η<۰٫۲ باشد وگرنه نوسان واگرا می‌شود، ولی برای λ=۱ همان η کند است.','Each coordinate shrinks by (1 − ηλ_i): for λ = 10 we need η < 0.2 or the oscillation diverges, yet for λ = 1 that same η is slow.'],
   ask:['چرا مسیر در جهت y نوسان می‌کند و در جهت x آرام می‌رود؟ کدام η هر دو را به‌خوبی حل می‌کند؟','Why does the path zig-zag in y but glide in x? Which η serves both?'],
   do:['η را حول ۰٫۱۸ و ۰٫۲۱ بگردانید و گام‌ها را تغییر دهید.','Move η around 0.18 and 0.21 and vary the number of steps.'],
   ctl:(st,A)=>[rng('η',0.01,0.25,0.002,st.eta,v=>{st.eta=v;A.upd()},v=>fmt(v,3)),rng(t2('تعداد گام','Steps'),1,40,1,st.K,v=>{st.K=v;A.upd()},v=>String(Math.round(v)))],
   see:['η>۰٫۲ در جهت y واگرا می‌شود (|۱−۱۰η|>۱). η≈۰٫۱۸ بهترین سازش است و پس از ۱۵ گام تقریباً به کمینه می‌رسد.','η > 0.2 diverges in y (|1 − 10η| > 1). η ≈ 0.18 is the best compromise and nearly reaches the minimum in 15 steps.']},
  name:{says:[['گرادیان نزولی و شرط همگرایی در این سطح درجه‌دوم:','Gradient descent and the convergence condition on this quadratic surface:']],tex:['\\theta_{t+1}=\\theta_t-\\eta\\nabla f(\\theta_t),\\qquad \\theta_{i,t}=(1-\\eta\\lambda_i)^t\\theta_{i,0}','\\text{converges}\\iff \\eta<\\frac{2}{\\lambda_{\\max}}\\ ,\\quad \\eta^\\*=\\frac{2}{\\lambda_{\\min}+\\lambda_{\\max}}'],
   legend:[['\\nabla f',['گرادیان: بردار مشتقات جزئی؛ جهت بیشترین صعود.','The gradient: the vector of partial derivatives; the steepest-ascent direction.']],['\\eta',['اندازه‌ی گام (نرخ یادگیری).','The step size (learning rate).']],['\\lambda_i',['انحنا در جهت i (اینجا ۱ و ۱۰).','The curvature along direction i (here 1 and 10).']]]},
  challenge:{ask:['فقط ۱۵ گام اجازه دارید. η را طوری انتخاب کنید که خطا از ۰٫۰۵ کمتر شود.','You may take only 15 steps. Choose η so that the loss drops below 0.05.'],
   do:['عدد «خطا پس از گام‌ها» سبز می‌شود وقتی موفق شدید.','The "loss after the steps" number turns green when you succeed.'],ctl:(st,A)=>{st.K=15;return[rng('η',0.01,0.25,0.002,st.eta,v=>{st.eta=v;A.upd()},v=>fmt(v,3))]},
   ok:st=>{let x=4,y=1;for(let i=0;i<15;i++){x-=st.eta*x;y-=st.eta*10*y}return .5*(x*x+10*y*y)<0.05},
   hints:[['η کوچک کند است، η بزرگ نوسانی؛ بهترین جایی بین است.','Small η is slow, large η oscillates; the best sits between.'],['حد واگرایی η=۰٫۲ است؛ بهینه کمی کمتر از آن قرار دارد.','Divergence starts at η = 0.2; the optimum lies a little below it.'],['به فرمول η* = ۲/(λ_min+λ_max) با λ ∈ {۱، ۱۰} نگاه کنید.','Look at η* = 2/(λ_min + λ_max) with λ ∈ {1, 10}.']],
   win:['η≈۲/(۱+۱۰)≈۰٫۱۸: در جهت تند (y) نوسان کم می‌شود و در جهت کند (x) هنوز پیشرفت دارید. این سازش پایه‌ی چرخه‌ی «شرط‌پذیری» و مومنتوم در درس‌های بعد است.','η ≈ 2/(1 + 10) ≈ 0.18: oscillation shrinks in the steep direction (y) while x still makes progress. This compromise is the root of conditioning and momentum in later lessons.']}}});

/* C3 · Bayes with natural frequencies */
LAB({id:'c3',mod:'C',g:'C3',lessons:['c3-1'],
 t:['آزمایش مثبت چقدر معنا دارد؟','How much does a positive test mean?'],
 aha:['وقتی بیماری نادر است، حتی آزمایش دقیق بیشتر مثبت‌های کاذب می‌دهد؛ باور تازه به نسبت «پیشین × درست‌نمایی» به‌روز می‌شود.','When a condition is rare, even an accurate test yields mostly false positives; belief updates in proportion to prior × likelihood.'],
 big:{had:['می‌دانیم احتمال شرطی P(A|B) چیست و P(A∩B)=P(A|B)P(B).','We know what a conditional probability P(A | B) is and that P(A ∩ B) = P(A | B) P(B).'],
  miss:['اگر P(مثبت|بیمار) را بدانیم، آیا P(بیمار|مثبت) را هم می‌دانیم؟','If we know P(positive | sick), do we know P(sick | positive)?'],
  fix:['۱۰۰۰ نفر را می‌شمارد و نشان می‌دهد مثبت‌ها از چه کسانی‌اند.','Counts 1000 people and shows who the positives are.'],
  close:['P(بیمار|مثبت)=TP/(TP+FP) و این به شیوع بستگی دارد. قضیه‌ی بیز همین شمارش است. درس بعد متغیرهای تصادفی و توزیع‌ها را معرفی می‌کند.','P(sick | positive) = TP / (TP + FP), and it depends on the prevalence. Bayes\' theorem is this count. Random variables and distributions come next.']},
 sol:{prev:2,sens:95,fpr:1},fail:{prev:2,sens:95,fpr:5},
 st:()=>({prev:1,sens:90,fpr:9}),
 stage(host,st,A){A.ppv=()=>{const p=st.prev/100,s=st.sens/100,f=st.fpr/100,tp=p*s,fp=(1-p)*f;return tp/(tp+fp)};
  return()=>{host.innerHTML='';const N=1000,tp=Math.round(N*st.prev/100*st.sens/100*10)/10,sick=Math.round(N*st.prev/100),fp=Math.round(N*(1-st.prev/100)*st.fpr/100),TP=Math.round(sick*st.sens/100);
   const c=cv(host,560,200),g=c.g;const cols=50,rows=20,cw=560/cols,rh=190/rows;const th=getComputedStyle(document.documentElement);const col=n=>th.getPropertyValue(n).trim();
   for(let i=0;i<N;i++){const x=(i%cols)*cw+cw/2,y=Math.floor(i/cols)*rh+rh/2+4;const isSick=i<sick;let st_='h';if(isSick&&i<TP)st_='tp';else if(isSick)st_='fn';else if(i-sick<fp)st_='fp';
    g.beginPath();if(st_==='tp'){g.fillStyle=col('--ok');g.fillRect(x-4,y-4,8,8)}else if(st_==='fp'){g.fillStyle=col('--bad');g.moveTo(x,y-5);g.lineTo(x+5,y+4);g.lineTo(x-5,y+4);g.closePath();g.fill()}else if(st_==='fn'){g.strokeStyle=col('--warn');g.lineWidth=2;g.arc(x,y,4,0,7);g.stroke()}else{g.fillStyle=col('--bd');g.arc(x,y,2.2,0,7);g.fill()}}
   const p=A.ppv();host.append(h('div',{class:'stat'},h('span',{},t2('بیمار: ','Sick: '),h('b',{},sick)),h('span',{style:{color:'var(--ok)'}},'■ '+t2('مثبت درست: ','true positives: '),h('b',{},TP)),h('span',{style:{color:'var(--bad)'}},'▲ '+t2('مثبت کاذب: ','false positives: '),h('b',{},fp)),h('span',{},'P(sick | +) = ',h('b',{},fmt(p*100,1)+'%'))),
    h('div',{class:'bar'+(p>=.5?' ok':'')},h('i',{style:{width:Math.round(p*100)+'%'}})),h('div',{class:'wn'},t2('۱۰۰۰ نفر: ■ سبز = مثبت درست، ▲ قرمز = مثبت کاذب، ◯ زرد = منفی کاذب، نقطه‌ی خاکستری = سالم با آزمایش منفی. نوار = سهم مثبت‌های درست از همه‌ی مثبت‌ها.','1000 people: green ■ = true positive, red ▲ = false positive, yellow ◯ = false negative, grey dot = healthy and negative. The bar is the share of true positives among all positives.')))}},
 screens:{
  puzzle:{ask:['از هر ۱۰۰ نفر ۱ نفر بیمار است. آزمایشی ۹۰٪ بیماران را درست مثبت می‌کند ولی ۹٪ سالم‌ها را هم مثبت می‌کند. اگر آزمایش شما مثبت شد، احتمال بیمار بودن چقدر است؟ (حدس بزنید.)','One person in 100 is sick. A test flags 90% of sick people but also 9% of healthy people. Your test is positive: how likely are you sick? (Guess first.)'],
   do:['به تعداد ■ و ▲ نگاه کنید و نوار را ببینید.','Count the ■ and ▲ and read the bar.'],ctl:(st,A)=>[]},
  explore:{claim:['احتمال بیمار بودن پس از مثبت‌شدن به شیوع، حساسیت و نرخ مثبت کاذب بستگی دارد و اغلب بسیار کمتر از حساسیت است.','The chance of being sick given a positive depends on prevalence, sensitivity and the false-positive rate, and it is often far below the sensitivity.'],
   ask:['شیوع را ۱٪ → ۱۰٪ ببرید. چرا ▲ها نسبت به ■ها کم می‌شوند؟ و اگر نرخ مثبت کاذب نصف شود؟','Raise prevalence from 1% to 10%. Why do the ▲ shrink relative to the ■? And if the false-positive rate is halved?'],
   do:['هر سه نوار را تغییر دهید.','Change all three sliders.'],
   ctl:(st,A)=>[rng(t2('شیوع (٪)','Prevalence (%)'),0.5,20,0.1,st.prev,v=>{st.prev=v;A.upd()},v=>fmt(v,1)),rng(t2('حساسیت (٪)','Sensitivity (%)'),50,100,1,st.sens,v=>{st.sens=v;A.upd()},v=>String(Math.round(v))),rng(t2('نرخ مثبت کاذب (٪)','False-positive rate (%)'),0.1,20,0.1,st.fpr,v=>{st.fpr=v;A.upd()},v=>fmt(v,1))],
   see:['با ۱٪ شیوع، ۹٪ مثبت کاذب و ۹۰٪ حساسیت، حدود ۹ مثبت درست در برابر ۹۰ مثبت کاذب داریم: احتمال بیمار بودن فقط ≈ ۹٪ است.','With 1% prevalence, 9% false positives and 90% sensitivity, about 9 true positives face about 90 false positives: the chance of being sick is only ≈ 9%.']},
  name:{says:[['شمارش شما همان قضیه‌ی بیز است:','Your count is Bayes\' theorem:']],tex:['P(S\\mid +)=\\frac{P(+\\mid S)\\,P(S)}{P(+\\mid S)\\,P(S)+P(+\\mid \\neg S)\\,P(\\neg S)}=\\frac{TP}{TP+FP}'],
   legend:[['P(S)',['پیشین: شیوع بیماری.','The prior: the prevalence of the condition.']],['P(+\\mid S)',['درست‌نمایی: حساسیت آزمایش.','The likelihood: the test\'s sensitivity.']],['P(+\\mid \\neg S)',['نرخ مثبت کاذب.','The false-positive rate.']]]},
  challenge:{ask:['شیوع ۲٪ و حساسیت ۹۵٪ است. نرخ مثبت کاذب را آن‌قدر کم کنید که یک مثبت دست‌کم ۵۰٪ احتمال بیمار بودن بدهد.','Prevalence is 2% and sensitivity 95%. Lower the false-positive rate until a positive means at least a 50% chance of being sick.'],
   do:['فقط نرخ مثبت کاذب را تغییر دهید؛ نوار سبز می‌شود.','Change only the false-positive rate; the bar turns green.'],ctl:(st,A)=>{st.prev=2;st.sens=95;return[rng(t2('نرخ مثبت کاذب (٪)','False-positive rate (%)'),0.1,10,0.1,Math.min(st.fpr,10),v=>{st.fpr=v;A.upd()},v=>fmt(v,1))]},
   ok:st=>{const p=st.prev/100,s=st.sens/100,f=st.fpr/100;return st.prev===2&&st.sens===95&&s*p/(s*p+(1-p)*f)>=0.5},
   hints:[['■ باید دست‌کم به اندازه‌ی ▲ باشند.','The ■ must be at least as many as the ▲.'],['TP ≈ ۱۹ نفر از هر ۱۰۰۰؛ پس FP باید ≤ ۱۹ باشد.','TP ≈ 19 per 1000, so FP must be ≤ 19.'],['FP = ۹۸۰ × نرخ، پس نرخ ≲ ۱٫۹٪.','FP = 980 × rate, so the rate ≲ 1.9%.']],
   win:['وقتی مثبت‌های کاذب از مثبت‌های درست کمتر شد، یک مثبت بیشتر از ۵۰٪ معنا دارد. برای بیماری‌های نادر، نرخ مثبت کاذب بسیار پایین لازم است.','Once false positives drop below true positives, a positive means more than 50%. For rare conditions the false-positive rate must be very low.']}}});

/* C4 · Sampling and confidence intervals */
LAB({id:'c4',mod:'C',g:'C4',lessons:['c4-1','c4-2'],
 t:['میانگین نمونه‌ها با √n تیز می‌شود','Sample means sharpen like √n'],
 aha:['میانگین‌های نمونه‌های تصادفی حتی از جامعه‌ی چوله به شکل زنگوله (CLT) با انحراف σ/√n جمع می‌شوند؛ چهار برابر داده فقط نصف عدم‌قطعیت می‌دهد.','Means of random samples cluster in a bell shape (CLT) with spread σ/√n even for a skewed population; four times the data buys only half the uncertainty.'],
 big:{had:['می‌دانیم توصیف داده با میانگین و واریانس انجام می‌شود و نمونه معرف جامعه است.','We know data is summarized by a mean and a variance and a sample represents a population.'],
  miss:['میانگین نمونه با نمونه‌ی بعدی فرق می‌کند. چقدر؟ و برای کوچک‌کردن این عدم‌قطعیت چه تعداد داده لازم است؟','The sample mean changes from sample to sample. By how much, and how much data shrinks that uncertainty?'],
  fix:['نمونه‌گیری مکرر از یک جامعه‌ی چوله و توزیع میانگین‌ها را نشان می‌دهد.','Repeated sampling from a skewed population and the distribution of the means.'],
  close:['خطای معیار SE=σ/√n و فاصله‌ی اطمینان ۹۵٪ تقریباً ±۱٫۹۶·SE است. برای نصف‌کردن فاصله ۴ برابر نمونه لازم است. درس بعد آزمون فرض را بر همین SE می‌سازد.','The standard error is SE = σ/√n and the 95% interval is about ±1.96·SE. Halving it needs 4× the samples. Hypothesis testing next builds on this SE.']},
 sol:{n:250},fail:{n:50},
 st:()=>({n:5,R:400}),
 stage(host,st,A){const pop=r=>35-15*Math.log(1-r());A.sd=15;A.hw=n=>1.96*15/Math.sqrt(n);
  A.sim=()=>{const r=mulberry(2024),means=[];for(let i=0;i<st.R;i++){let s=0;for(let j=0;j<st.n;j++)s+=pop(r);means.push(s/st.n)}return means};
  return()=>{host.innerHTML='';const m=A.sim(),mu=m.reduce((a,b)=>a+b,0)/m.length,sd=Math.sqrt(m.reduce((a,b)=>a+(b-mu)**2,0)/m.length),se=15/Math.sqrt(st.n);
   const P=chart(560,230,25,90,0,0.1,{l:36,b:28});const lo=25,hi=90,B=39,bw=(hi-lo)/B,cnt=Array(B).fill(0);m.forEach(v=>{const b=Math.floor((v-lo)/bw);if(b>=0&&b<B)cnt[b]++});const peak=Math.max(...cnt)/(st.R*bw);const yM=Math.max(peak,1/(se*2.5))*1.15;
   const P2=chart(560,230,25,90,0,yM,{l:36,b:28});P2.axes(6,3,v=>String(Math.round(v)),v=>fmt(v,2));cnt.forEach((c,i)=>P2.bar(lo+bw*(i+.5),c/(st.R*bw),(560-46)/B-1,'var(--ac)'));
   P2.path(x=>Math.exp(-0.5*((x-50)/se)**2)/(se*Math.sqrt(2*Math.PI)),'var(--warn)',25,90,200,2.4);P2.line(50-1.96*se,0,50-1.96*se,yM,'var(--ok)','4 3',1.6);P2.line(50+1.96*se,0,50+1.96*se,yM,'var(--ok)','4 3',1.6);P2.text(26,yM*0.93,t2('■ توزیع ۴۰۰ میانگین نمونه · منحنی زرد = نرمال با σ/√n · خط سبز = ±۱٫۹۶·SE','■ distribution of 400 sample means · yellow = normal with σ/√n · green = ±1.96·SE'),'var(--fg)','start',10.5);
   host.append(P2.svg,h('div',{class:'stat'},h('span',{},'n = ',h('b',{},st.n)),h('span',{},t2('انحراف معیار میانگین‌ها: ','SD of the means: '),h('b',{},fmt(sd,2))),h('span',{},'σ/√n = ',h('b',{},fmt(se,2))),h('span',{},t2('نیم‌پهنای فاصله‌ی ۹۵٪: ','95% half-width: '),h('b',{},'±'+fmt(1.96*se,2)))),
    h('div',{class:'wn'},t2('جامعه: میانگین ۵۰ و σ=۱۵، به‌شدت چوله (نمایی انتقال‌یافته). هر میله از ۴۰۰ نمونه‌ی تکرارشده‌ی شبیه‌سازی‌شده می‌آید.','Population: mean 50 and σ = 15, strongly skewed (shifted exponential). Each bar comes from 400 simulated repeated samples.')))}},
 screens:{
  puzzle:{ask:['جامعه‌ای چوله دارید (میانگین ۵۰). از آن n مشاهده می‌گیرید و میانگین می‌زنید؛ این کار را ۴۰۰ بار تکرار می‌کنید. میانگین‌ها چه شکلی می‌شوند؟','You have a skewed population (mean 50). You draw n observations, average them, and repeat 400 times. What shape do the means take?'],
   do:['n را از ۱ شروع کنید و کم‌کم زیاد کنید.','Start n at 1 and increase it gradually.'],ctl:(st,A)=>[rng('n',1,200,1,st.n,v=>{st.n=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['پهنای توزیع میانگین‌ها ∝ ۱/√n است و شکل آن برای n بزرگ نرمال می‌شود.','The spread of the means is ∝ 1/√n and its shape becomes normal for large n.'],
   ask:['وقتی n از ۱۰ به ۴۰ می‌رسد، انحراف معیار چند برابر می‌شود؟','When n goes from 10 to 40, by what factor does the SD change?'],
   do:['n را روی ۱۰، ۴۰ و ۱۶۰ بگذارید و عدد σ/√n را بخوانید.','Set n to 10, 40 and 160 and read σ/√n.'],
   ctl:(st,A)=>[rng('n',1,400,1,st.n,v=>{st.n=v;A.upd()},v=>String(Math.round(v)))],
   see:['۴ برابر شدن n انحراف را نصف می‌کند (۱۰→۴۰→۱۶۰: ≈۴٫۷→۲٫۴→۱٫۲). شکل از چوله به زنگوله‌ای می‌رود.','Quadrupling n halves the SD (10 → 40 → 160: ≈ 4.7 → 2.4 → 1.2). The shape goes from skewed to bell-like.']},
  name:{says:[['قضیه‌ی حد مرکزی و فاصله‌ی اطمینان:','The central limit theorem and the confidence interval:']],tex:['\\bar X_n\\ \\approx\\ \\mathcal N\\!\\left(\\mu,\\ \\tfrac{\\sigma^2}{n}\\right),\\qquad \\text{CI}_{95\\%}=\\bar x\\pm 1.96\\,\\frac{\\sigma}{\\sqrt n}'],
   legend:[['\\bar X_n',['میانگین یک نمونه‌ی n‌تایی.','The mean of one sample of n.']],['\\sigma/\\sqrt n',['خطای معیار (SE).','The standard error (SE).']],['1.96',['چندک ۹۷٫۵٪ نرمال استاندارد.','The 97.5% quantile of the standard normal.']]]},
  challenge:{ask:['می‌خواهید نیم‌پهنای فاصله‌ی ۹۵٪ دست‌کم ۲ باشد یا کمتر، ولی بودجه فقط ۳۰۰ نمونه است. n را انتخاب کنید.','You want the 95% half-width to be at most 2, but the budget allows only 300 samples. Choose n.'],
   do:['نیم‌پهنای فاصله‌ی ۹۵٪ را در نوار آماری بخوانید.','Read the 95% half-width in the stats line.'],ctl:(st,A)=>[rng('n',5,600,1,Math.max(st.n,5),v=>{st.n=v;A.upd()},v=>String(Math.round(v)))],
   ok:st=>st.n<=300&&1.96*15/Math.sqrt(st.n)<=2,
   hints:[['نیم‌پهنا ۱٫۹۶·۱۵/√n است؛ آن را ≤ ۲ بگذارید.','The half-width is 1.96·15/√n; set it ≤ 2.'],['√n ≥ ۱٫۹۶·۱۵/۲ ≈ ۱۴٫۷.','√n ≥ 1.96·15/2 ≈ 14.7.'],['n ≥ ۲۱۷ و بودجه ۳۰۰ است.','n ≥ 217 and the budget is 300.']],
   win:['n≈۲۲۰ تا ۳۰۰: هر ۴ برابر شدن n نیم‌پهنا را نصف می‌کند، پس از یک‌جا به بعد هزینه‌ی داده بیشتر می‌شود ولی دقت کم‌تر بهتر می‌شود.','n ≈ 220 to 300: every 4× increase of n halves the half-width, so beyond a point more data costs more than it improves precision.']}}});

/* C5 · Momentum */
LAB({id:'c5',mod:'C',g:'C5',lessons:['c5-1','c5-2','c5-3'],
 t:['مومنتوم دره‌های باریک را صاف می‌کند','Momentum smooths narrow valleys'],
 aha:['در دره‌ای با انحنای بسیار متفاوت، گرادیان ساده نوسان می‌کند؛ مومنتوم نوسان‌ها را خنثی و حرکت در جهت ثابت را شتاب می‌دهد.','In a valley with very different curvatures, plain gradient descent zig-zags; momentum cancels the oscillation and accelerates steady motion.'],
 big:{had:['می‌دانیم گرادیان نزولی با η کوچک پایدار ولی در جهت کم‌انحنا کند است.','We know gradient descent is stable with a small η but slow along the low-curvature direction.'],
  miss:['چگونه بدون واگرایی در جهت تند، سرعت را در جهت آرام بالا ببریم؟','How do we speed up the gentle direction without diverging in the steep one?'],
  fix:['مسیر GD و مومنتوم را روی همان سطح مقایسه می‌کند و β را قابل‌تنظیم می‌کند.','Compares the GD and momentum paths on the same surface with an adjustable β.'],
  close:['v←βv−η∇f؛ θ←θ+v. β نزدیک ۰ یعنی GD ساده، β نزدیک ۱ یعنی حافظه‌ی بلند و ریسک نوسان. Adam همین ایده را با مقیاس‌دهی هر مؤلفه ترکیب می‌کند.','v ← βv − η∇f; θ ← θ + v. β near 0 is plain GD, β near 1 means a long memory and oscillation risk. Adam combines this idea with per-coordinate scaling.']},
 sol:{beta:0.75},fail:{beta:0},
 st:()=>({beta:0.5,eta:0.025,K:50}),
 stage(host,st,A){const run=(beta,eta,K)=>{let x=6,y=1,vx=0,vy=0;const pts=[[x,y]];for(let i=0;i<K;i++){vx=beta*vx-eta*x;vy=beta*vy-eta*25*y;x+=vx;y+=vy;pts.push([x,y])}return pts};A.run=run;A.loss=(beta)=>{const p=run(beta,st.eta,st.K).pop();return .5*(p[0]*p[0]+25*p[1]*p[1])};
  return()=>{host.innerHTML='';contourStage(host,25,[{pts:run(0,st.eta,st.K),col:'var(--mut)',w:1.6,dash:'5 4'},{pts:run(st.beta,st.eta,st.K),col:'var(--ac2)',w:2.2}]);const L=A.loss(st.beta),L0=A.loss(0);
   host.append(h('div',{class:'stat'},h('span',{},'η = ',h('b',{},st.eta)),h('span',{},'β = ',h('b',{},fmt(st.beta,2))),h('span',{},t2('خطای GD ساده: ','Plain GD loss: '),h('b',{},fmt(L0,3))),h('span',{},t2('خطای مومنتوم: ','Momentum loss: '),h('b',{style:{color:L<0.01?'var(--ok)':'var(--fg)'}},fmt(L,4)))),
    h('div',{class:'wn'},t2('خط‌چین خاکستری = GD ساده؛ بنفش = مومنتوم؛ سطح f=½(x²+25y²)، شروع (۶،۱)، ۵۰ گام.','Grey dashed = plain GD; purple = momentum; surface f = ½(x² + 25y²), start (6, 1), 50 steps.')))}},
 screens:{
  puzzle:{ask:['با η=۰٫۰۲۵ گرادیان نزولی ساده در جهت x بسیار کند است. چگونه می‌توان بدون بزرگ‌کردن η (که در y واگرا می‌کند) سریع‌تر شد؟','With η = 0.025 plain gradient descent is very slow along x. How can we speed up without raising η (which would diverge in y)?'],
   do:['β را از ۰ بالا ببرید و مسیر بنفش را با خط‌چین مقایسه کنید.','Raise β from 0 and compare the purple path with the dashed one.'],ctl:(st,A)=>[rng('β',0,0.98,0.01,st.beta,v=>{st.beta=v;A.upd()},v=>fmt(v,2))]},
  explore:{claim:['β متوسط خطا را کم می‌کند؛ β نزدیک ۱ بیش‌ازحد شتاب می‌دهد و نوسان می‌سازد.','A moderate β reduces the loss; β near 1 over-accelerates and oscillates.'],
   ask:['چرا مسیر با β=۰٫۹۵ از کمینه رد می‌شود و برمی‌گردد؟','Why does the β = 0.95 path overshoot the minimum and come back?'],
   do:['β را بین ۰ و ۰٫۹۸ بکشید و عدد خطا را دنبال کنید.','Sweep β between 0 and 0.98 and follow the loss number.'],
   ctl:(st,A)=>[rng('β',0,0.98,0.01,st.beta,v=>{st.beta=v;A.upd()},v=>fmt(v,2)),rng('η',0.005,0.05,0.001,st.eta,v=>{st.eta=v;A.upd()},v=>fmt(v,3))],
   see:['برای η=۰٫۰۲۵ خطا در β≈۰٫۶ تا ۰٫۸ کمینه است. مومنتوم سرعت جهت ثابت (x) را حدود ۱/(۱−β) برابر می‌کند.','For η = 0.025 the loss is lowest around β ≈ 0.6 to 0.8. Momentum multiplies the speed along a steady direction (x) by about 1/(1 − β).']},
  name:{says:[['مومنتوم (heavy ball):','Momentum (heavy ball):']],tex:['v_{t+1}=\\beta\\,v_t-\\eta\\,\\nabla f(\\theta_t),\\qquad \\theta_{t+1}=\\theta_t+v_{t+1}'],
   legend:[['v',['سرعت: میانگین نمایی گرادیان‌های گذشته.','Velocity: an exponential average of past gradients.']],['\\beta',['ضریب حافظه (۰ = GD ساده).','The memory coefficient (0 = plain GD).']],['\\tfrac{1}{1-\\beta}',['شتاب مؤثر در جهت ثابت.','The effective acceleration along a steady direction.']]]},
  challenge:{ask:['η=۰٫۰۲۵ و ۵۰ گام ثابت است. β را طوری بگذارید که خطا به زیر ۰٫۰۱ برسد.','η = 0.025 and 50 steps are fixed. Choose β so that the loss reaches below 0.01.'],
   do:['عدد خطای مومنتوم سبز می‌شود.','The momentum loss number turns green.'],ctl:(st,A)=>{st.eta=0.025;st.K=50;return[rng('β',0,0.98,0.01,st.beta,v=>{st.beta=v;A.upd()},v=>fmt(v,2))]},
   ok:st=>{let x=6,y=1,vx=0,vy=0;for(let i=0;i<50;i++){vx=st.beta*vx-0.025*x;vy=st.beta*vy-0.025*25*y;x+=vx;y+=vy}return .5*(x*x+25*y*y)<0.01},
   hints:[['β=۰ همان GD ساده است و کافی نیست.','β = 0 is plain GD and is not enough.'],['β=۰٫۹۵ بیش از حد شتاب می‌دهد؛ حد وسط را بگیرید.','β = 0.95 over-accelerates; aim for the middle.'],['بازه‌ی خوب حدود ۰٫۶۵ تا ۰٫۸ است؛ عدد خطا را دنبال کنید.','The good range is about 0.65 to 0.8; follow the loss number.']],
   win:['β≈۰٫۷–۰٫۸: مومنتوم حرکت آرام در x را شتاب می‌دهد و نوسان y را به‌خوبی خنثی می‌کند. Adam و SGD+momentum در عمل از همین استفاده می‌کنند.','β ≈ 0.7 to 0.8: momentum speeds up the gentle x motion and damps the y oscillation. Adam and SGD with momentum use this in practice.']}}});
