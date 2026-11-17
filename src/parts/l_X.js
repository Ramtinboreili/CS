/* ===================== LABS: Connecting the Foundations ===================== */
const phi=z=>1/(1+Math.exp(-z)),Phi=x=>{const t=1/(1+0.2316419*Math.abs(x)),d=0.3989423*Math.exp(-x*x/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p};

/* X1 · A tensor is memory plus a shape */
const X1S=[1,2,3,4,6,8,12];
const x1off=(st)=>st.i*st.b*st.c+st.j*st.c+st.k;
LAB({id:'x1',mod:'X',g:'X',lessons:['x1','a2-1','c1-1'],
 t:['تانسور = حافظه‌ی خطی + شکل','A tensor is flat memory plus a shape'],
 aha:['آرایه‌ی چندبعدی در حافظه همیشه یک رشته‌ی خطی است؛ «شکل» فقط حساب اندیس را عوض می‌کند، پس reshape داده را جابه‌جا نمی‌کند.','A multi-dimensional array is always one flat run of memory; the "shape" only changes the index arithmetic, so a reshape moves no data.'],
 big:{had:['از ساختمان داده می‌دانیم آرایه‌ی یک‌بعدی در حافظه‌ی پیوسته است و دسترسی O(1) دارد.','From data structures we know a 1D array sits in contiguous memory with O(1) access.'],
  miss:['ماتریس و تانسور مفاهیم ریاضی‌اند؛ چگونه روی همین حافظه‌ی خطی می‌نشینند؟','Matrices and tensors are mathematical objects; how do they sit on that same flat memory?'],
  fix:['۲۴ خانه‌ی حافظه را با شکل‌های مختلف (a,b,c) نگاه می‌کنید و جای یک عنصر را می‌بینید.','You view 24 memory cells under different shapes (a, b, c) and see where one element lives.'],
  close:['offset = i·bc + j·c + k (گام‌های strides). reshape فقط (a,b,c) و strides را عوض می‌کند؛ به همین دلیل view ارزان است و transpose بدون کپی ممکن است.','offset = i·bc + j·c + k (the strides). A reshape only changes (a, b, c) and the strides; that is why views are cheap and a transpose can avoid copying.']},
 sol:{b:2,c:4},fail:{b:2,c:6},
 st:()=>({b:3,c:2,i:1,j:1,k:0}),
 stage(host,st,A){return k=>{host.innerHTML='';const a=24/(st.b*st.c),ok=Number.isInteger(a);const W=560,svg=sv('svg',{viewBox:`0 0 ${W} 250`,class:'sv'});const off=ok?x1off(st):-1;
   svg.append(sv('text',{x:8,y:16,class:'mut','font-size':11},t2('حافظه‌ی خطی (۲۴ خانه، offset ۰…۲۳)','flat memory (24 cells, offset 0…23)')));
   for(let o=0;o<24;o++)svg.append(sv('rect',{x:8+o*22.5,y:24,width:21,height:26,class:'cell',style:o===off?'fill:var(--hl);stroke:var(--hl)':''}),sv('text',{x:8+o*22.5+10.5,y:41,'text-anchor':'middle','font-size':10,style:o===off?'fill:#111':''},o));
   if(!ok){svg.append(sv('text',{x:W/2,y:140,'text-anchor':'middle','font-size':13,fill:'var(--bad)'},t2('a·b·c باید ۲۴ شود؛ این b و c ممکن نیست (a صحیح نیست)','a·b·c must equal 24; this b and c is impossible (a is not an integer)')))}
   else{svg.append(sv('text',{x:8,y:72,class:'mut','font-size':11},t2('همان داده با شکل ','the same data with shape ')+'('+a+', '+st.b+', '+st.c+')'));const cs=Math.min(26,(W-16)/(a*(st.c+0.6)),150/st.b);let x=8;
    for(let s=0;s<a;s++){svg.append(sv('text',{x,y:90,class:'mut','font-size':10},'i='+s));for(let r=0;r<st.b;r++)for(let q=0;q<st.c;q++){const o=s*st.b*st.c+r*st.c+q,hit=o===off;svg.append(sv('rect',{x:x+q*cs,y:96+r*cs,width:cs-1,height:cs-1,class:'cell',style:hit?'fill:var(--hl);stroke:var(--hl)':''}),sv('text',{x:x+q*cs+cs/2,y:96+r*cs+cs*0.65,'text-anchor':'middle','font-size':Math.min(10,cs*0.4),style:hit?'fill:#111':''},o))}x+=st.c*cs+cs*0.6}}
   host.append(svg,h('div',{class:'stat'},h('span',{},t2('عنصر ','Element '),h('b',{},'['+st.i+','+st.j+','+st.k+']')),h('span',{},'strides = ',h('b',{},ok?'('+st.b*st.c+', '+st.c+', 1)':'—')),h('span',{},'offset = ',h('b',{style:{color:off===14?'var(--ok)':'var(--fg)'}},ok?st.i+'·'+st.b*st.c+' + '+st.j+'·'+st.c+' + '+st.k+' = '+off:'—'))),h('div',{class:'wn'},t2('خانه‌ی زرد = عنصر انتخابی. تعداد خانه‌ها همیشه ۲۴ است؛ فقط نگاه ما به آن‌ها عوض می‌شود.','Yellow cell = the chosen element. There are always 24 cells; only the way we look at them changes.')))}},
 screens:{
  puzzle:{ask:['۲۴ عدد در حافظه پشت‌سرهم‌اند. اگر آن‌ها را شکل (۴،۳،۲) یا (۳،۲،۴) بدهیم، عنصر [۱،۱،۰] در کدام خانه‌ی حافظه است؟ آیا داده جابه‌جا می‌شود؟','24 numbers sit one after another in memory. If we give them shape (4, 3, 2) or (3, 2, 4), which memory cell holds element [1, 1, 0]? Does the data move?'],
   do:['b و c را عوض کنید و خانه‌ی زرد را دنبال کنید.','Change b and c and follow the yellow cell.'],
   ctl:(st,A)=>[sel('b',X1S,st.b,v=>{st.b=+v;A.upd()}),sel('c',X1S,st.c,v=>{st.c=+v;A.upd()})]},
  explore:{claim:['offset فقط تابعی از شکل و اندیس است؛ هیچ داده‌ای جابه‌جا نمی‌شود.','The offset depends only on the shape and the index; no data moves.'],
   ask:['وقتی c را دو برابر می‌کنیم، یک واحد افزایش j چند خانه به جلو می‌پرد؟','When we double c, how many cells does one step in j jump?'],
   do:['اندیس‌ها را هم عوض کنید و strides را با offset مقایسه کنید.','Change the indices too and compare the strides with the offset.'],
   ctl:(st,A)=>[sel('b',X1S,st.b,v=>{st.b=+v;A.upd()}),sel('c',X1S,st.c,v=>{st.c=+v;A.upd()}),rng('i',0,5,1,st.i,v=>{st.i=Math.round(v);A.upd()},v=>String(Math.round(v))),rng('j',0,5,1,st.j,v=>{st.j=Math.round(v);A.upd()},v=>String(Math.round(v))),rng('k',0,5,1,st.k,v=>{st.k=Math.round(v);A.upd()},v=>String(Math.round(v)))],
   see:['یک گام در k یک خانه، در j به‌اندازه‌ی c خانه و در i به‌اندازه‌ی b·c خانه جلو می‌رود: strides = (bc, c, 1).','One step in k moves one cell, in j it moves c cells and in i it moves b·c cells: strides = (bc, c, 1).']},
  name:{says:[['به زبان NumPy/PyTorch:','In NumPy/PyTorch terms:']],tex:['\\text{offset}(i,j,k)=i\\cdot s_0+j\\cdot s_1+k\\cdot s_2,\\qquad (s_0,s_1,s_2)=(bc,\\ c,\\ 1)'],
   legend:[['s_d',['گام بعد d (stride): تعداد خانه‌ها برای یک واحد حرکت در آن بعد.','The stride of dimension d: how many cells to skip for one step along it.']],['(a,b,c)',['شکل؛ حاصل‌ضربش تعداد عناصر ثابت است.','The shape; its product (the element count) is fixed.']]]},
  challenge:{ask:['b و c را طوری انتخاب کنید که عنصر [۱،۱،۲] در خانه‌ی ۱۴ حافظه باشد (a·b·c=۲۴).','Choose b and c so that element [1, 1, 2] sits at memory cell 14 (a·b·c = 24).'],
   do:['اندیس ثابت است؛ فقط شکل را عوض کنید.','The index is fixed; change only the shape.'],ctl:(st,A)=>{Object.assign(st,{i:1,j:1,k:2,b:3,c:2});return[sel('b',X1S,st.b,v=>{st.b=+v;A.upd()}),sel('c',X1S,st.c,v=>{st.c=+v;A.upd()})]},
   ok:st=>Number.isInteger(24/(st.b*st.c))&&x1off(st)===14,hints:[['offset = i·bc + j·c + k با (i,j,k)=(۱،۱،۲).','offset = i·bc + j·c + k with (i, j, k) = (1, 1, 2).'],['باید ۱·bc + c + ۲ = ۱۴ شود، یعنی c(b+1)=۱۲.','It must satisfy bc + c + 2 = 14, i.e. c(b+1) = 12.'],['و a=۲۴/(bc) باید صحیح باشد.','And a = 24/(bc) must be an integer.']],
   win:['همین داده‌ی ۲۴تایی با شکل (۳،۲،۴) یا (۴،۱،۶) عنصر را در خانه‌ی ۱۴ می‌گذارد. شکل = نگاه، حافظه = واقعیت.','The same 24 numbers with shape (3, 2, 4) or (4, 1, 6) put the element at cell 14. Shape = view, memory = reality.']}}});

/* X2 · Heap vs array for Dijkstra */
const x2c=(V,E)=>({arr:V*V+E,heap:(V+E)*Math.log2(V)});
LAB({id:'x2',mod:'X',g:'X',lessons:['x2','a3-2','a4-3'],
 t:['ساختمان داده سرعت الگوریتم را می‌سازد','The data structure makes the algorithm fast'],
 aha:['دایکسترا با آرایه O(V²+E) و با هیپ O((V+E)logV) است؛ هیپ در گراف تنک می‌برد و آرایه در گراف چگال.','Dijkstra costs O(V² + E) with an array and O((V + E) log V) with a heap; the heap wins on sparse graphs and the array on dense ones.'],
 big:{had:['می‌دانیم دایکسترا در هر گام کوچک‌ترین فاصله‌ی نهایی‌نشده را برمی‌دارد و هیپ استخراج کمینه را ارزان می‌کند.','We know Dijkstra picks the smallest unfinalized distance at each step and a heap makes extract-min cheap.'],
  miss:['آیا هیپ همیشه از اسکن آرایه بهتر است؟','Is the heap always better than scanning an array?'],
  fix:['هزینه‌ی دو پیاده‌سازی را با تعداد رئوس و یال‌ها مقایسه می‌کند.','Compares the cost of both implementations as the vertex and edge counts change.'],
  close:['انتخاب ساختمان داده به چگالی E/V² بستگی دارد: تنک → هیپ، چگال → آرایه. همین منطق در بخش B (انتخاب ایندکس) تکرار می‌شود.','The choice depends on the density E/V²: sparse → heap, dense → array. The same logic returns in section B (choosing an index).']},
 sol:{V:1000,E:110000},fail:{V:1000,E:5000},
 st:()=>({V:1000,E:3000}),
 stage(host,st,A){return()=>{host.innerHTML='';const c=x2c(st.V,st.E),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 200`,class:'sv'}),mx=Math.log10(Math.max(c.arr,c.heap)*1.2),bh=v=>Math.log10(v)/mx*150;
   [[t2('آرایه‌ی ساده','Plain array'),c.arr,'var(--ac)'],['Heap',c.heap,'var(--warn)']].forEach(([l,v,col],i)=>{const x=110+i*190;svg.append(sv('rect',{x,y:170-bh(v),width:110,height:bh(v),fill:col,opacity:.85}),sv('text',{x:x+55,y:170-bh(v)-6,'text-anchor':'middle','font-size':12,'font-weight':700},kfmt(v)),sv('text',{x:x+55,y:188,'text-anchor':'middle','font-size':11},l))});
   svg.append(sv('text',{x:8,y:16,class:'mut','font-size':10.5},t2('ارتفاع = لگاریتم هزینه (تعداد عمل)','height = log of the cost (operations)')));const dens=st.E/(st.V*(st.V-1)/2);
   host.append(svg,h('div',{class:'stat'},h('span',{},'V = ',h('b',{},st.V)),h('span',{},'E = ',h('b',{},kfmt(st.E))),h('span',{},t2('چگالی E/(V²/2) = ','Density E/(V²/2) = '),h('b',{},fmt(dens*100,1)+'%')),h('span',{},t2('نسبت هیپ/آرایه: ','Heap/array ratio: '),h('b',{style:{color:Math.abs(c.heap/c.arr-1)<=0.1?'var(--ok)':'var(--fg)'}},fmt(c.heap/c.arr,2)))),h('div',{class:'wn'},t2('مدل: آرایه V²+E، هیپ (V+E)·log₂V.','Model: array V² + E, heap (V + E)·log₂ V.')))}},
 screens:{
  puzzle:{ask:['گرافی با ۱۰۰۰ شهر و ۳۰۰۰ جاده (تنک). دایکسترا با آرایه‌ی ساده در برابر هیپ؛ کدام ارزان‌تر است؟','A graph with 1000 cities and 3000 roads (sparse). Dijkstra with a plain array versus a heap; which is cheaper?'],
   do:['E را کم‌کم زیاد کنید و دو ستون را مقایسه کنید.','Increase E gradually and compare the two bars.'],ctl:(st,A)=>[rng('E',1000,499000,500,st.E,v=>{st.E=v;A.upd()},v=>kfmt(v))]},
  explore:{claim:['وقتی گراف چگال می‌شود، log V عامل هیپ برنده را از آرایه عقب می‌اندازد.','As the graph gets dense, the heap\'s log V factor lets the array catch up and overtake it.'],
   ask:['در چه چگالی نسبت ۱ می‌شود؟ اگر V را عوض کنیم این نقطه کجا می‌رود؟','At what density does the ratio reach 1? Where does that point go when V changes?'],
   do:['V و E را عوض کنید.','Change V and E.'],ctl:(st,A)=>[rng('V',100,3000,50,st.V,v=>{st.V=v;st.E=Math.min(st.E,Math.floor(v*(v-1)/2));A.upd()},v=>String(Math.round(v))),rng('E',500,499000,500,st.E,v=>{st.E=Math.min(v,Math.floor(st.V*(st.V-1)/2));A.upd()},v=>kfmt(v))],
   see:['برای V=۱۰۰۰ هزینه‌ها حدود E≈۱۱۰٬۰۰۰ (حدود ۲۲٪ چگالی) برابر می‌شوند؛ پایین‌تر از آن هیپ، بالاتر آرایه بهتر است.','For V = 1000 the costs meet near E ≈ 110,000 (about 22% density); below it the heap wins, above it the array.']},
  name:{says:[['دو هزینه:','The two costs:']],tex:['T_{\\text{array}}=\\Theta(V^2+E),\\qquad T_{\\text{heap}}=\\Theta\\big((V+E)\\log V\\big)'],
   legend:[['V^2',['V بار اسکن آرایه‌ی V‌تایی برای کمینه.','V scans of a V-element array to find the minimum.']],['E\\log V',['هر یال یک کاهش کلید در هیپ (log V).','Each edge is one decrease-key in the heap (log V).']]]},
  challenge:{ask:['V=۱۰۰۰ ثابت است. E را طوری بگذارید که هزینه‌ی هیپ و آرایه حداکثر ۱۰٪ با هم تفاوت داشته باشند (نقطه‌ی تلاقی).','V = 1000 is fixed. Choose E so that the heap and array costs differ by at most 10% (the crossover).'],
   do:['نسبت هیپ/آرایه سبز می‌شود.','The heap/array ratio turns green.'],ctl:(st,A)=>{st.V=1000;st.E=3000;return[rng('E',1000,499000,500,st.E,v=>{st.E=v;A.upd()},v=>kfmt(v))]},
   ok:st=>{const c=x2c(1000,st.E),r=c.heap/c.arr;return st.V===1000&&r>=0.9&&r<=1.1},hints:[['آرایه V²+E و هیپ (V+E)·۱۰ (چون log₂۱۰۰۰≈۱۰) است.','The array is V² + E and the heap (V + E)·10 (since log₂ 1000 ≈ 10).'],['برابری: ۱۰⁶+E ≈ ۱۰(۱۰³+E) ⇒ E ≈ ۱۱۰٬۰۰۰.','Equality: 10⁶ + E ≈ 10(10³ + E) ⇒ E ≈ 110,000.'],['E را حول ۱۰۰ تا ۱۲۰ هزار بگردانید.','Move E around 100 to 120 thousand.']],
   win:['در این چگالی هیچ‌کدام برنده‌ی روشن نیست؛ بالاتر آرایه‌ی ساده (با ثابت کمتر) بهتر است. ساختمان داده را با ورودی بسنجید نه با شعار.','At this density neither is a clear winner; above it the plain array (with a smaller constant) is better. Judge a data structure by the input, not by slogans.']}}});

/* X3 · Index = tree: array vs B+tree */
const x3h=(N,f)=>Math.max(1,Math.ceil(Math.log(N)/Math.log(f)));
LAB({id:'x3',mod:'X',g:'X',lessons:['x3','a3-1','b5-1'],
 t:['ایندکس = درخت: درج در آرایه‌ی مرتب گران است','An index is a tree: inserting into a sorted array is costly'],
 aha:['آرایه‌ی مرتب جست‌وجوی لگاریتمی می‌دهد ولی هر درج N/2 جابه‌جایی دارد؛ درخت متوازن هر دو را لگاریتمی نگه می‌دارد، و ایندکس پایگاه داده همین درخت است.','A sorted array gives logarithmic lookup but each insert moves N/2 items; a balanced tree keeps both logarithmic, and a database index is exactly this tree.'],
 big:{had:['می‌دانیم جست‌وجوی دودویی روی آرایه‌ی مرتب سریع است و B+Tree ارتفاع کم دارد.','We know binary search on a sorted array is fast and a B+Tree is shallow.'],
  miss:['اگر داده مدام تغییر کند، چرا ایندکس را آرایه‌ی مرتب نمی‌گیریم؟','If the data keeps changing, why not make the index a sorted array?'],
  fix:['هزینه‌ی جست‌وجو و درج را برای هر دو ساختار با N متغیر مقایسه می‌کند.','Compares lookup and insert costs for both structures as N changes.'],
  close:['جست‌وجو: log₂N برابر ۳۰ ولی h≈۳ برای B+Tree؛ درج: N/2 در برابر h. ایندکس‌های DB به همین دلیل B+Tree‌اند و آرایه‌ی مرتب نیستند.','Lookup: log₂ N is 30 but h ≈ 3 for a B+Tree; insert: N/2 against h. That is why DB indexes are B+Trees, not sorted arrays.']},
 sol:{N:1000},fail:{N:1e8},
 st:()=>({N:1e5,f:256}),
 stage(host,st,A){return()=>{host.innerHTML='';const N=st.N,h_=x3h(N,st.f),vals=[['lookup arr',Math.log2(N),'var(--ac)'],['lookup tree',h_,'var(--ok)'],['insert arr',N/2,'var(--bad)'],['insert tree',h_+1,'var(--warn)']];const W=560,svg=sv('svg',{viewBox:`0 0 ${W} 210`,class:'sv'}),mx=Math.log10(Math.max(...vals.map(v=>v[1]))*1.5+10);
   vals.forEach(([l,v,col],i)=>{const bh=Math.max(4,Math.log10(v+1)/mx*150),x=20+i*135;svg.append(sv('rect',{x,y:175-bh,width:100,height:bh,fill:col,opacity:.85}),sv('text',{x:x+50,y:175-bh-5,'text-anchor':'middle','font-size':12,'font-weight':700},kfmt(v)),sv('text',{x:x+50,y:192,'text-anchor':'middle','font-size':10.5},l))});
   svg.append(sv('text',{x:8,y:14,class:'mut','font-size':10.5},t2('ارتفاع = لگاریتم (تعداد جابه‌جایی یا گره)','height = log of the count (moves or nodes)')));const r=(N/2)/(h_+1);
   host.append(svg,h('div',{class:'stat'},h('span',{},'N = ',h('b',{},kfmt(N))),h('span',{},t2('فن‌اوت f = ','Fan-out f = '),h('b',{},st.f)),h('span',{},t2('ارتفاع B+Tree: ','B+Tree height: '),h('b',{},h_)),h('span',{},t2('نسبت درج (آرایه/درخت): ','Insert ratio (array/tree): '),h('b',{style:{color:r>=100&&r<=1000?'var(--ok)':'var(--fg)'}},kfmt(r)))))}},
 screens:{
  puzzle:{ask:['برای N=۱۰۰٬۰۰۰ کلید: جست‌وجو در آرایه‌ی مرتب ≈ ۱۷ مقایسه و در B+Tree ۳ خواندن. اما درج یک کلید تازه در هر کدام چقدر هزینه دارد؟','For N = 100,000 keys: a sorted-array lookup is about 17 comparisons and a B+Tree lookup is 3 reads. But what does inserting one new key cost in each?'],
   do:['ستون‌های درج را ببینید و N را تغییر دهید.','Look at the insert bars and change N.'],ctl:(st,A)=>[rng('log₁₀ N',2,9,0.1,Math.log10(st.N),v=>{st.N=Math.round(Math.pow(10,v));A.upd()},v=>fmt(v,1))]},
  explore:{claim:['جست‌وجوی هر دو ساختار لگاریتمی است، اما درج آرایه خطی و درج درخت لگاریتمی است.','Both lookups are logarithmic, but an array insert is linear and a tree insert logarithmic.'],
   ask:['وقتی N هزار برابر شود، هر ستون چند برابر می‌شود؟','When N grows a thousandfold, by what factor does each bar grow?'],
   do:['N و فن‌اوت را تغییر دهید.','Change N and the fan-out.'],ctl:(st,A)=>[rng('log₁₀ N',2,9,0.1,Math.log10(st.N),v=>{st.N=Math.round(Math.pow(10,v));A.upd()},v=>fmt(v,1)),sel(t2('فن‌اوت','Fan-out'),[16,64,256,1024],st.f,v=>{st.f=+v;A.upd()})],
   see:['ستون «درج آرایه» با N خطی بالا می‌رود (۱۰۰۰ برابر)، ستون‌های درخت تقریباً ثابت می‌مانند (ارتفاع ۲ تا ۴).','The "insert array" bar grows linearly with N (1000×); the tree bars stay almost flat (height 2 to 4).']},
  name:{says:[['به زبان هزینه:','In terms of cost:']],tex:['T^{\\text{array}}_{\\text{insert}}=\\Theta(N),\\quad T^{\\text{B+tree}}_{\\text{insert}}=\\Theta(\\log_f N),\\quad T_{\\text{lookup}}=\\Theta(\\log N)\\ \\text{for both}'],
   legend:[['\\Theta(N)',['برای باز‌کردن جا باید میانگین N/2 عنصر جابه‌جا شود.','On average N/2 elements must shift to make room.']],['\\log_f N',['ارتفاع B+Tree: هر سطح f راه دارد.','The B+Tree height: each level has f children.']]]},
  challenge:{ask:['N را طوری انتخاب کنید که درج در آرایه‌ی مرتب بین ۱۰۰ تا ۱۰۰۰ برابر گران‌تر از درج در B+Tree (f=۲۵۶) باشد.','Choose N so that inserting into the sorted array costs between 100× and 1000× more than inserting into the B+Tree (f = 256).'],
   do:['نسبت درج سبز می‌شود.','The insert ratio turns green.'],ctl:(st,A)=>{st.f=256;st.N=1e5;return[rng('log₁₀ N',2,9,0.05,Math.log10(st.N),v=>{st.N=Math.round(Math.pow(10,v));A.upd()},v=>fmt(v,1))]},
   ok:st=>{const r=(st.N/2)/(x3h(st.N,st.f)+1);return r>=100&&r<=1000},hints:[['نسبت ≈ (N/۲)/(h+۱) است.','The ratio is about (N/2)/(h + 1).'],['برای N بین ۲۵۶ و ۶۵۰۰۰ ارتفاع h=۲ است.','For N between 256 and 65,000 the height is h = 2.'],['N باید حدود چند صد تا چند هزار باشد.','N must be a few hundred to a few thousand.']],
   win:['برای N کوچک (چند هزار) آرایه‌ی مرتب هنوز قابل‌قبول است؛ اما نسبت با N خطی می‌شود و برای میلیون‌ها کلید ده‌ها هزار برابر شد. در پایگاه داده‌ها که N بزرگ و تغییر مداوم است، درخت لازم است.','For small N (a few thousand) a sorted array is still acceptable; but the ratio grows linearly and reaches tens of thousands for millions of keys. For databases with large, constantly changing N, a tree is necessary.']}}});

/* X4 · B+tree range scan */
const X4K=Array.from({length:48},(_,i)=>2*(i+1)),leafOf=k=>Math.floor((k/2-1)/4);
const x4reads=(lo,hi)=>{if(hi<lo)return{leaves:0,reads:0,keys:0};const a=leafOf(Math.max(2,lo)),b=leafOf(Math.min(96,hi));return{leaves:b-a+1,reads:3+(b-a),keys:X4K.filter(k=>k>=lo&&k<=hi).length,a,b}};
LAB({id:'x4',mod:'X',g:'X',lessons:['x4','b5-1'],
 t:['بازه با پیوند برگ‌ها','Ranges ride the leaf chain'],
 aha:['B+Tree یک‌بار از ریشه به اولین برگ می‌رود و بعد در زنجیره‌ی برگ‌ها جلو می‌رود؛ هزینه‌ی بازه = ارتفاع + تعداد برگ‌های لمس‌شده.','A B+Tree descends once from the root to the first leaf and then walks the leaf chain; a range costs height + the leaves touched.'],
 big:{had:['می‌دانیم کلیدها در برگ‌های B+Tree مرتب‌اند و برگ‌ها به هم پیوند دارند.','We know the keys sit sorted in the B+Tree leaves and the leaves are linked.'],
  miss:['پرس‌وجوی بازه‌ای (BETWEEN) چگونه بدون بازگشت به ریشه اجرا می‌شود و چند صفحه می‌خواند؟','How does a range query (BETWEEN) run without going back to the root, and how many pages does it read?'],
  fix:['بازه‌ی [lo,hi] را روی ۴۸ کلید در ۱۲ برگ می‌کشید و صفحه‌های خوانده‌شده را می‌شمارید.','You drag a range [lo, hi] over 48 keys in 12 leaves and count the pages read.'],
  close:['خواندن‌ها = h + (L−۱) که L تعداد برگ‌های بازه است. به همین دلیل ایندکس B+Tree برای BETWEEN و ORDER BY عالی است و هش نمی‌تواند.','Reads = h + (L − 1) where L is the number of leaves in the range. That is why a B+Tree index is ideal for BETWEEN and ORDER BY, and a hash index cannot do it.']},
 sol:{lo:20,hi:60},fail:{lo:10,hi:30},
 st:()=>({lo:10,hi:30}),
 stage(host,st,A){return()=>{host.innerHTML='';const r=x4reads(st.lo,st.hi),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 190`,class:'sv'}),lw=42,gx=10;
   svg.append(sv('rect',{x:W/2-35,y:8,width:70,height:24,rx:4,class:'cell',style:'stroke:var(--ac2)'}),sv('text',{x:W/2,y:24,'text-anchor':'middle','font-size':10},'root'));
   for(let n=0;n<3;n++){const cx=95+n*185;svg.append(sv('line',{x1:W/2,y1:32,x2:cx,y2:62,class:'lnk'}),sv('rect',{x:cx-35,y:62,width:70,height:24,rx:4,class:'cell',style:n===Math.floor((r.a||0)/4)?'stroke:var(--hl);stroke-width:2.5':''}),sv('text',{x:cx,y:78,'text-anchor':'middle','font-size':10},'internal '+(n+1)));for(let l=0;l<4;l++){const L=n*4+l;svg.append(sv('line',{x1:cx,y1:86,x2:gx+L*46.5+lw/2,y2:116,class:'lnk',opacity:.5}))}}
   for(let L=0;L<12;L++){const hit=r.leaves&&L>=r.a&&L<=r.b;svg.append(sv('rect',{x:gx+L*46.5,y:116,width:lw,height:34,rx:3,class:'cell',style:hit?'fill:color-mix(in srgb,var(--ac2) 55%,var(--panel2));stroke:var(--hl);stroke-width:2':''}),sv('text',{x:gx+L*46.5+lw/2,y:130,'text-anchor':'middle','font-size':8.5},X4K[L*4]+'…'+X4K[L*4+3]),sv('text',{x:gx+L*46.5+lw/2,y:143,'text-anchor':'middle','font-size':8,class:'mut'},'L'+(L+1)));if(L<11)svg.append(sv('path',{d:`M${gx+L*46.5+lw} 133 h4.5`,stroke:'var(--mut)','stroke-width':1.5}))}
   svg.append(sv('text',{x:8,y:178,class:'mut','font-size':10.5},t2('برگ‌های رنگی = خوانده‌شده در بازه · کلیدهای ۲ تا ۹۶','coloured leaves = read for the range · keys 2 to 96')));
   host.append(svg,h('div',{class:'stat'},h('span',{},'[lo, hi] = ',h('b',{},'['+st.lo+', '+st.hi+']')),h('span',{},t2('کلید‌های تطبیق‌یافته: ','Matching keys: '),h('b',{},r.keys)),h('span',{},t2('برگ‌های خوانده‌شده: ','Leaves read: '),h('b',{},r.leaves)),h('span',{},t2('کل خواندن صفحه: ','Total page reads: '),h('b',{style:{color:r.reads===8?'var(--ok)':'var(--fg)'}},r.reads+' = 3 + '+Math.max(0,r.leaves-1)))))}},
 screens:{
  puzzle:{ask:['درخت سه‌سطحی با ۱۲ برگ داریم. برای بازه‌ی [۱۰،۳۰] چند صفحه می‌خوانیم؟ آیا برای هر کلید دوباره از ریشه می‌رویم؟','A three-level tree with 12 leaves. How many pages do we read for the range [10, 30]? Do we restart from the root for every key?'],
   do:['hi را بزرگ کنید و برگ‌های رنگی و شمارنده را ببینید.','Increase hi and watch the coloured leaves and the counter.'],ctl:(st,A)=>[rng('lo',2,96,2,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>String(Math.round(v))),rng('hi',2,96,2,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['هزینه‌ی بازه تقریباً با تعداد برگ‌ها رشد می‌کند، نه با تعداد کلیدها.','A range\'s cost grows with the number of leaves, not with the number of keys.'],
   ask:['بازه‌ای با ۴ کلید که از مرز دو برگ می‌گذرد چند صفحه می‌خواند؟ و بازه‌ی ۴ کلیدی داخل یک برگ؟','How many pages does a 4-key range that straddles two leaves read? And a 4-key range inside one leaf?'],
   do:['lo و hi را با فاصله‌ی ثابت جابه‌جا کنید.','Slide lo and hi while keeping their distance.'],ctl:(st,A)=>[rng('lo',2,96,2,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>String(Math.round(v))),rng('hi',2,96,2,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>String(Math.round(v)))],
   see:['یک بار فرود (۳ صفحه) و بعد هر برگ اضافی فقط ۱ خواندن؛ بازه‌ی [۱۰،۳۰] با ۳ برگ = ۵ خواندن.','One descent (3 pages) and then 1 read per extra leaf; the range [10, 30] touches 3 leaves = 5 reads.']},
  name:{says:[['هزینه‌ی بازه:','The range cost:']],tex:['\\text{reads}=h+(L-1),\\qquad L=\\Big\\lceil\\frac{\\text{matches}}{\\text{keys per leaf}}\\Big\\rceil\\ (+1\\ \\text{if it straddles})'],
   legend:[['h',['ارتفاع درخت (اینجا ۳): یک فرود از ریشه.','The tree height (3 here): one descent from the root.']],['L',['تعداد برگ‌های لمس‌شده در زنجیره.','The number of leaves touched along the chain.']]]},
  challenge:{ask:['بازه‌ای انتخاب کنید که دقیقاً ۸ صفحه بخواند (۳ فرود + ۵ برگ اضافی).','Choose a range that reads exactly 8 pages (3 for the descent + 5 extra leaves).'],
   do:['شمارنده‌ی کل خواندن سبز می‌شود.','The total-reads counter turns green.'],ctl:(st,A)=>{st.lo=10;st.hi=30;return[rng('lo',2,96,2,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>String(Math.round(v))),rng('hi',2,96,2,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>String(Math.round(v)))]},
   ok:st=>x4reads(st.lo,st.hi).reads===8,hints:[['۸ = ۳ + ۵ پس ۶ برگ باید لمس شود.','8 = 3 + 5, so 6 leaves must be touched.'],['هر برگ ۴ کلید دارد؛ بازه باید از ۶ برگ پشت‌سرهم بگذرد.','Each leaf holds 4 keys; the range must span 6 consecutive leaves.'],['مثلاً از برگ L۲ تا L۷.','For example from leaf L2 to L7.']],
   win:['شش برگ: همان یک فرود و ۵ پرش در زنجیره. هش برای همین بازه همه‌ی سطل‌ها را می‌خواند.','Six leaves: one descent and 5 hops along the chain. A hash index would read every bucket for the same range.']}}});

/* X5 · Join strategies and constants */
const x5c=(n,m)=>({nl:n*m,sm:n*Math.log2(Math.max(2,n))+m*Math.log2(Math.max(2,m)),hj:5*(n+m)});
LAB({id:'x5',mod:'X',g:'X',lessons:['x5','b3-3','a1-1'],
 t:['مرتبه‌ی رشد و ثابت‌ها در پردازش داده','Growth order and constants in data processing'],
 aha:['برای ورودی بزرگ مرتبه‌ی رشد تصمیم می‌گیرد، اما وقتی یکی از جدول‌ها کوچک است ثابت‌ها برنده را عوض می‌کنند؛ بهینه‌ساز DB همین را می‌سنجد.','For large inputs the growth order decides, but when one table is tiny the constants change the winner; a DB optimizer weighs exactly this.'],
 big:{had:['از تحلیل پیچیدگی می‌دانیم nested-loop مربعی، sort-merge ‌n log n و hash join خطی است.','From complexity analysis we know nested-loop is quadratic, sort-merge n log n and hash join linear.'],
  miss:['آیا hash join همیشه برنده است؟','Is the hash join always the winner?'],
  fix:['اندازه‌ی دو جدول را از ۱ تا ۱۰⁶ تغییر می‌دهید و هزینه‌ی سه راهبرد را می‌بینید.','You vary the two table sizes from 1 to 10⁶ and see the cost of three strategies.'],
  close:['رشد نمادین راهنمای اصلی است ولی بهینه‌ساز هزینه‌ی واقعی (با ثابت‌ها و اندازه‌ی جدول) را می‌سنجد؛ هیچ راهبردی همیشه بهترین نیست.','Asymptotics is the main guide but the optimizer weighs real cost (with constants and table sizes); no strategy is always the best.']},
 sol:{ln:0.4,lm:5},fail:{ln:4,lm:4},
 st:()=>({ln:4,lm:4}),
 stage(host,st,A){return()=>{host.innerHTML='';const n=Math.round(Math.pow(10,st.ln)),m=Math.round(Math.pow(10,st.lm)),c=x5c(n,m),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 200`,class:'sv'}),mx=Math.log10(Math.max(c.nl,c.sm,c.hj)*1.3+10);
   [[t2('حلقه‌ی تودرتو','Nested loop'),c.nl,'var(--bad)'],[t2('ادغام مرتب','Sort-merge'),c.sm,'var(--ac)'],['Hash join',c.hj,'var(--ok)']].forEach(([l,v,col],i)=>{const bh=Math.max(4,Math.log10(v+1)/mx*150),x=40+i*170;svg.append(sv('rect',{x,y:170-bh,width:110,height:bh,fill:col,opacity:.85,stroke:i===0&&c.nl<c.hj?'var(--hl)':'none','stroke-width':3}),sv('text',{x:x+55,y:170-bh-5,'text-anchor':'middle','font-size':12,'font-weight':700},kfmt(v)),sv('text',{x:x+55,y:190,'text-anchor':'middle','font-size':11},l))});
   host.append(svg,h('div',{class:'stat'},h('span',{},'n = ',h('b',{},kfmt(n))),h('span',{},'m = ',h('b',{},kfmt(m))),h('span',{},t2('برنده: ','Winner: '),h('b',{},c.nl<c.hj&&c.nl<c.sm?t2('حلقه‌ی تودرتو','nested loop'):c.hj<=c.sm?'hash join':t2('ادغام مرتب','sort-merge')))),h('div',{class:'wn'},t2('مدل: nested n·m، sort-merge n·log n+m·log m، hash ۵(n+m) (ثابت ۵ برای ساخت و جست‌وجوی جدول هش). ارتفاع = لگاریتم هزینه.','Model: nested n·m, sort-merge n·log n + m·log m, hash 5(n + m) (constant 5 for building and probing the hash table). Height = log of the cost.')))}},
 screens:{
  puzzle:{ask:['دو جدول را JOIN می‌کنیم. اگر هر دو یک میلیون سطر داشته باشند کدام راهبرد ارزان است؟ و اگر یکی فقط ۳ سطر باشد؟','We JOIN two tables. If both have a million rows which strategy is cheapest? And if one has only 3 rows?'],
   do:['n و m را از ۱ تا ۱۰⁶ ببرید (مقیاس لگاریتمی).','Move n and m from 1 to 10⁶ (log scale).'],ctl:(st,A)=>[rng('log₁₀ n',0,6,0.1,st.ln,v=>{st.ln=v;A.upd()},v=>fmt(v,1)),rng('log₁₀ m',0,6,0.1,st.lm,v=>{st.lm=v;A.upd()},v=>fmt(v,1))]},
  explore:{claim:['وقتی یکی از جدول‌ها بسیار کوچک است nested-loop (n·m کوچک) از hash join ارزان‌تر می‌شود چون ثابت ۵ ندارد.','When one table is tiny, the nested loop (small n·m) becomes cheaper than the hash join because it has no constant 5.'],
   ask:['چه اندازه‌ای باید کوچک شود تا nested-loop برنده شود؟','How small must a table be before the nested loop wins?'],
   do:['n را روی ۱–۱۰ نگه دارید و m را از ۱ تا ۱۰⁶ ببرید.','Keep n between 1 and 10 and sweep m from 1 to 10⁶.'],ctl:(st,A)=>[rng('log₁₀ n',0,6,0.1,st.ln,v=>{st.ln=v;A.upd()},v=>fmt(v,1)),rng('log₁₀ m',0,6,0.1,st.lm,v=>{st.lm=v;A.upd()},v=>fmt(v,1))],
   see:['n·m < ۵(n+m) هرگاه یکی از جدول‌ها کمتر از ≈۵ سطر باشد (دقیق‌تر (n−۵)(m−۵)<۲۵).','n·m < 5(n + m) whenever one table has fewer than about 5 rows (more precisely (n − 5)(m − 5) < 25).']},
  name:{says:[['هزینه‌ها و شرط برتری:','The costs and the winning condition:']],tex:['C_{\\text{nl}}=nm,\\quad C_{\\text{sm}}=n\\log n+m\\log m,\\quad C_{\\text{hj}}=c(n+m)','C_{\\text{nl}}<C_{\\text{hj}}\\iff (n-c)(m-c)<c^2'],
   legend:[['c',['ثابت سربار ساخت/جست‌وجوی جدول هش (اینجا ۵).','The overhead constant of building/probing the hash table (5 here).']],['nm',['مقایسه‌ی همه‌ی جفت‌ها بدون ساختار کمکی.','Compare all pairs with no auxiliary structure.']]]},
  challenge:{ask:['n و m را طوری انتخاب کنید که حلقه‌ی تودرتو از hash join ارزان‌تر شود.','Choose n and m so that the nested loop is cheaper than the hash join.'],
   do:['ستون قرمز حلقه‌ی تودرتو کادر زرد می‌گیرد.','The red nested-loop bar gets a yellow outline.'],ctl:(st,A)=>{st.ln=4;st.lm=4;return[rng('log₁₀ n',0,6,0.1,st.ln,v=>{st.ln=v;A.upd()},v=>fmt(v,1)),rng('log₁₀ m',0,6,0.1,st.lm,v=>{st.lm=v;A.upd()},v=>fmt(v,1))]},
   ok:st=>{const n=Math.round(Math.pow(10,st.ln)),m=Math.round(Math.pow(10,st.lm));return n*m<5*(n+m)},hints:[['n·m باید کمتر از ۵(n+m) شود.','n·m must be less than 5(n + m).'],['اگر n=۳ باشد n·m=۳m و ۵(n+m)=۱۵+۵m.','If n = 3 then n·m = 3m and 5(n + m) = 15 + 5m.'],['یکی از دو جدول را به چند سطر برسانید.','Shrink one of the two tables to a few rows.']],
   win:['یک جدول کوچک ثابت‌ها را مهم می‌کند: برای ۳ سطر ساختن جدول هش اتلاف است. بهینه‌ساز همین را با آمار می‌سنجد.','A tiny table makes constants matter: for 3 rows, building a hash table is waste. The optimizer weighs this using statistics.']}}});

/* X6 · Least squares is a projection */
const X6Y=[1.5,3],X6A=[2,1];
const x6cos=w=>{const r=[X6Y[0]-w*X6A[0],X6Y[1]-w*X6A[1]];return Math.abs(r[0]*X6A[0]+r[1]*X6A[1])/(Math.hypot(...r)*Math.hypot(...X6A)+1e-12)};
LAB({id:'x6',mod:'X',g:'X',lessons:['x6','c1-2','d1-1'],
 t:['کمترین مربعات = تصویر قائم','Least squares is an orthogonal projection'],
 aha:['برازش خطی یعنی نزدیک‌ترین نقطه‌ی فضای ستونی به y؛ باقیمانده‌ی بهینه بر ستون‌ها عمود است.','A linear fit means the closest point of the column space to y; the optimal residual is perpendicular to the columns.'],
 big:{had:['از جبر خطی می‌دانیم تصویر یک بردار روی یک راستا با ضرب داخلی ساخته می‌شود.','From linear algebra we know the projection of a vector onto a direction is built from the dot product.'],
  miss:['رگرسیون خطی چه ربطی به آن دارد؟ چرا معادله‌ی نرمال XᵀXw=Xᵀy است؟','What does linear regression have to do with it? Why is the normal equation XᵀXw = Xᵀy?'],
  fix:['بردار هدف y و یک ستون a را می‌بینید؛ w را عوض می‌کنید و باقیمانده را می‌بینید.','You see a target vector y and one column a; you change w and watch the residual.'],
  close:['جایی که باقیمانده r=y−wa بر a عمود است، ‖r‖² کمینه است و Xᵀ(y−Xw)=0 همان معادله‌ی نرمال است. PCA و SVD همین هندسه را به بُعد بالا می‌برند.','Where the residual r = y − wa is perpendicular to a, ‖r‖² is minimal and Xᵀ(y − Xw) = 0 is the normal equation. PCA and the SVD lift the same geometry to higher dimensions.']},
 sol:{w:1.2},fail:{w:0.2},
 st:()=>({w:0.2}),
 stage(host,st,A){return k=>{host.innerHTML='';const P=chart(400,330,-1,5,-1,4,{l:24,b:20});P.axes(6,5,v=>String(Math.round(v)),v=>String(Math.round(v)));const px=st.w*X6A[0],py=st.w*X6A[1];P.line(-1,-0.5,5,2.5,'var(--mut)','4 3',1);arrowSvg(P,0,0,X6Y[0],X6Y[1],'var(--fg)',2.8);arrowSvg(P,0,0,px,py,'var(--ac)',3);P.line(px,py,X6Y[0],X6Y[1],'var(--bad)',null,2.6);
   const r=[X6Y[0]-px,X6Y[1]-py],c=x6cos(st.w),perp=c<=0.1;if(perp){const u=[X6A[0]/Math.hypot(...X6A),X6A[1]/Math.hypot(...X6A)],v=[r[0]/Math.hypot(...r),r[1]/Math.hypot(...r)];const s=0.25;P.svg.append(sv('path',{d:`M${P.X(px+u[0]*s)} ${P.Y(py+u[1]*s)} L${P.X(px+(u[0]+v[0])*s)} ${P.Y(py+(u[1]+v[1])*s)} L${P.X(px+v[0]*s)} ${P.Y(py+v[1]*s)}`,fill:'none',stroke:'var(--ok)','stroke-width':2.2}))}
   P.text(X6Y[0]+0.1,X6Y[1]+0.15,'y','var(--fg)','start',13);P.text(px+0.1,py-0.3,'w·a','var(--ac)','start',13);
   host.append(P.svg,h('div',{class:'stat'},h('span',{},'w = ',h('b',{},fmt(st.w,2))),h('span',{},'‖r‖² = ',h('b',{},fmt(r[0]*r[0]+r[1]*r[1],3))),h('span',{},t2('زاویه‌ی r با a: ','Angle of r with a: '),h('b',{style:{color:perp?'var(--ok)':'var(--fg)'}},fmt(Math.acos(Math.min(1,c))*0+Math.atan2(Math.abs(r[0]*X6A[1]-r[1]*X6A[0]),r[0]*X6A[0]+r[1]*X6A[1])*180/Math.PI,0)+'°'+(perp?' ⟂ ✔':'')))),h('div',{class:'wn'},t2('خط‌چین خاکستری = فضای ستونی (همه‌ی w·a)؛ آبی = w·a؛ سفید = y؛ قرمز = باقیمانده r=y−wa. داده‌ها ساختگی‌اند.','Grey dashed = the column space (all w·a); blue = w·a; white = y; red = the residual r = y − wa. The data are made up.')))}},
 screens:{
  puzzle:{ask:['بردار y را نمی‌توان دقیقاً به‌صورت w·a نوشت. کدام w نقطه‌ی w·a را به y نزدیک‌ترین می‌کند؟','The vector y cannot be written exactly as w·a. Which w puts the point w·a closest to y?'],
   do:['w را بکشید و طول پاره‌خط قرمز را ببینید.','Drag w and watch the length of the red segment.'],ctl:(st,A)=>[rng('w',-1,3,0.01,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,2))]},
  explore:{claim:['کوتاه‌ترین فاصله‌ی y تا خط زمانی است که باقیمانده بر خط عمود باشد.','The shortest distance from y to the line occurs when the residual is perpendicular to the line.'],
   ask:['وقتی ‖r‖ کمینه است زاویه‌ی r با a چند درجه است؟','When ‖r‖ is smallest, what is the angle between r and a?'],
   do:['w را حول مقدار کمینه‌ی ‖r‖² بگردانید و نشانگر ⟂ را بیابید.','Sweep w around the minimum of ‖r‖² and find the ⟂ marker.'],ctl:(st,A)=>[rng('w',-1,3,0.01,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,2))],
   see:['‖r‖² در w=۱٫۲ کمینه (۰٫۹۰... ) است و همان‌جا زاویه‌ی r با a برابر ۹۰° می‌شود.','‖r‖² is smallest at w = 1.2 and exactly there the angle between r and a is 90°.']},
  name:{says:[['شرط عمود‌بودن همان معادله‌ی نرمال است:','The perpendicularity condition is the normal equation:']],tex:['\\mathbf a^\\top(\\mathbf y-w\\mathbf a)=0\\ \\Rightarrow\\ w^\\*=\\frac{\\mathbf a^\\top\\mathbf y}{\\mathbf a^\\top\\mathbf a}=\\frac{6}{5}=1.2'],
   legend:[['\\mathbf a',['ستون ویژگی (اینجا (۲،۱)).','The feature column (here (2, 1)).']],['\\mathbf y-w\\mathbf a',['باقیمانده؛ در بهینه بر a عمود است.','The residual; perpendicular to a at the optimum.']],['w^\\*',['ضریب تصویر؛ در چند ستون: (XᵀX)⁻¹Xᵀy.','The projection coefficient; with several columns: (XᵀX)⁻¹Xᵀy.']]]},
  challenge:{ask:['w را طوری انتخاب کنید که باقیمانده تقریباً بر a عمود شود (زاویه ≈ ۹۰°).','Choose w so that the residual is nearly perpendicular to a (angle ≈ 90°).'],
   do:['وقتی علامت مربع ⟂ و زاویه سبز شد موفق شده‌اید.','You succeed when the ⟂ square and the angle turn green.'],ctl:(st,A)=>{st.w=0.2;return[rng('w',-1,3,0.01,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,2))]},
   ok:st=>x6cos(st.w)<=0.1,hints:[['به‌دنبال کمینه‌ی طول پاره‌ی قرمز باشید.','Look for the minimum length of the red segment.'],['در کمینه پاره‌ی قرمز با خط خاکستری زاویه‌ی قائمه می‌سازد.','At the minimum the red segment makes a right angle with the grey line.'],['w بین ۱ و ۱٫۵ است.','w lies between 1 and 1.5.']],
   win:['باقیمانده بر a عمود است: همین شرط، معادله‌ی نرمال و فرمول w*=aᵀy/aᵀa را می‌دهد. جبر خطی و آمار یک تصویر شدند.','The residual is perpendicular to a: that condition gives the normal equation and the formula w* = aᵀy/aᵀa. Linear algebra and statistics became one picture.']}}});

/* X7 · Vanishing gradients */
const x7=w=>{const y=phi(w),L=(y-1)**2,g=2*(y-1)*y*(1-y);return{y,L,g}};
LAB({id:'x7',mod:'X',g:'X',lessons:['x7','c2-2','d2-1'],
 t:['گرادیان محوشونده: اشتباه ولی ساکت','Vanishing gradient: wrong but silent'],
 aha:['زنجیره‌ی مشتق‌ها در سیگموید سیر شده صفر می‌شود؛ شبکه می‌تواند کاملاً اشتباه باشد و گرادیان تقریباً صفر بماند، پس یادگیری متوقف می‌شود.','The chain of derivatives vanishes through a saturated sigmoid; a network can be completely wrong while the gradient stays near zero, so learning stalls.'],
 big:{had:['می‌دانیم قاعده‌ی زنجیره‌ای مشتق زیان را حاصل‌ضرب مشتق‌های موضعی می‌کند و GD با آن وزن‌ها را به‌روز می‌کند.','We know the chain rule turns the loss derivative into a product of local derivatives and GD updates the weights with it.'],
  miss:['اگر یکی از ضرب‌ها نزدیک صفر باشد چه می‌شود؟ آیا گرادیان صفر یعنی «درست»؟','What if one factor is near zero? Does a zero gradient mean "correct"?'],
  fix:['یک نورون سیگموید با زیان مربعی را می‌بینید و w را می‌چرخانید؛ زیان و گرادیان را هم‌زمان می‌بینید.','You see one sigmoid neuron with squared loss and move w, watching the loss and the gradient together.'],
  close:['dL/dw = ۲(ŷ−t)·ŷ(۱−ŷ)·x؛ عامل ŷ(۱−ŷ) در ناحیه‌ی سیر صفر می‌شود. به همین دلیل Cross-Entropy، ReLU و مقداردهی مناسب مهم‌اند (درس‌های ML).','dL/dw = 2(ŷ − t)·ŷ(1 − ŷ)·x; the factor ŷ(1 − ŷ) vanishes in the saturated region. That is why cross-entropy, ReLU and good initialization matter (the ML lessons).']},
 sol:{w:-6},fail:{w:0},
 st:()=>({w:1}),
 stage(host,st,A){return()=>{host.innerHTML='';const P=chart(560,250,-10,10,0,1,{l:34,b:24});P.axes(8,4,v=>String(Math.round(v)),v=>fmt(v,1));P.path(w=>x7(w).L,'var(--bad)',-10,10,200,2.6);P.path(w=>Math.abs(x7(w).g)*4,'var(--ac)',-10,10,200,2.6);const e=x7(st.w);P.line(st.w,0,st.w,1,'var(--hl)',null,1.5);P.dot(st.w,e.L,5,'var(--bad)');P.dot(st.w,Math.min(1,Math.abs(e.g)*4),5,'var(--ac)');P.text(-9.7,0.94,'■ '+t2('زیان L','loss L'),'var(--bad)','start',12);P.text(-9.7,0.85,'● '+t2('|dL/dw| (×۴ برای دیده‌شدن)','|dL/dw| (×4 for visibility)'),'var(--ac)','start',12);
   const ok=e.L>=0.4&&Math.abs(e.g)<=0.03;host.append(P.svg,h('div',{class:'stat'},h('span',{},'w = ',h('b',{},fmt(st.w,1))),h('span',{},'ŷ=σ(w) = ',h('b',{},fmt(e.y,3))),h('span',{},'L = ',h('b',{},fmt(e.L,3))),h('span',{},'dL/dw = ',h('b',{style:{color:ok?'var(--ok)':'var(--fg)'}},fmt(e.g,4)))),h('div',{class:'wn'},t2('نورون: ŷ=σ(w·x) با x=۱، هدف t=۱، زیان L=(ŷ−t)².','Neuron: ŷ = σ(w·x) with x = 1, target t = 1, loss L = (ŷ − t)².')))}},
 screens:{
  puzzle:{ask:['هدف t=۱ است. وقتی w بسیار منفی است نورون کاملاً اشتباه می‌گوید. گرادیان GD در آن‌جا بزرگ است یا کوچک؟','The target is t = 1. When w is very negative the neuron is completely wrong. Is GD\'s gradient large or small there?'],
   do:['w را از ۱ به −۱۰ بکشید و دو منحنی را مقایسه کنید.','Drag w from 1 to −10 and compare the two curves.'],ctl:(st,A)=>[rng('w',-10,10,0.1,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,1))]},
  explore:{claim:['بیشترین گرادیان در میانه‌ی منحنی است؛ در دو سر سیر شده صفر می‌شود، حتی در سرِ اشتباه.','The gradient is largest in the middle of the curve; at both ends it vanishes, even at the wrong end.'],
   ask:['کجا زیان بزرگ و گرادیان کوچک است؟ GD از آن نقطه چگونه بیرون می‌آید؟','Where is the loss large and the gradient small? How does GD get out of there?'],
   do:['w را روی −۸ ببرید و بعد روی ۰.','Put w at −8 and then at 0.'],ctl:(st,A)=>[rng('w',-10,10,0.1,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,1))],
   see:['در w=−۸ زیان ≈۱ ولی |dL/dw| ≈ ۰٫۰۰۰۷؛ در w=۰ گرادیان ۰٫۲۵ است. گام GD با η=۱ در w=−۸ عملاً حرکتی نمی‌کند.','At w = −8 the loss is ≈ 1 but |dL/dw| ≈ 0.0007; at w = 0 the gradient is 0.25. A GD step with η = 1 at w = −8 barely moves.']},
  name:{says:[['قاعده‌ی زنجیره‌ای را کامل بنویسیم:','Write the chain rule in full:']],tex:['\\frac{\\partial L}{\\partial w}=\\underbrace{2(\\hat y-t)}_{\\partial L/\\partial\\hat y}\\cdot\\underbrace{\\hat y(1-\\hat y)}_{\\sigma\'(z)}\\cdot\\underbrace{x}_{\\partial z/\\partial w},\\qquad \\sigma\'(z)\\le\\tfrac14'],
   legend:[['\\sigma\'(z)',['مشتق سیگموید؛ حداکثر ۰٫۲۵ و در ناحیه‌ی سیر ≈ ۰.','The sigmoid derivative; at most 0.25 and ≈ 0 in the saturated region.']],['\\hat y-t',['خطا؛ در سرِ اشتباه بزرگ است.','The error; large at the wrong end.']]]},
  challenge:{ask:['w را طوری انتخاب کنید که زیان دست‌کم ۰٫۴ باشد ولی |dL/dw| ≤ ۰٫۰۳ (مدل اشتباه ولی گرادیان تقریباً صفر).','Choose w so that the loss is at least 0.4 yet |dL/dw| ≤ 0.03 (a wrong model with almost no gradient).'],
   do:['عدد dL/dw سبز می‌شود.','The dL/dw number turns green.'],ctl:(st,A)=>{st.w=1;return[rng('w',-10,10,0.1,st.w,v=>{st.w=v;A.upd()},v=>fmt(v,1))]},
   ok:st=>{const e=x7(st.w);return e.L>=0.4&&Math.abs(e.g)<=0.03},hints:[['گرادیان در دو سر کوچک است؛ کدام سر زیان بزرگ دارد؟','The gradient is small at both ends; which end has a large loss?'],['سرِ منفی: ŷ≈۰ ولی هدف ۱.','The negative end: ŷ ≈ 0 but the target is 1.'],['w را زیر حدود −۴ ببرید.','Take w below about −4.']],
   win:['این همان دام آموزش است: شبکه کاملاً اشتباه است ولی گرادیان صفر می‌شود. Cross-Entropy این ضرب را حذف می‌کند و ReLU مشتق ۱ دارد.','This is the classic trap: the network is completely wrong but the gradient is zero. Cross-entropy removes this factor and ReLU has derivative 1.']}}});

/* X8 · Threshold, prevalence and precision/recall */
const x8=(tau,mu,prev)=>{const tpr=1-Phi(tau-mu),fpr=1-Phi(tau),tp=prev*tpr,fp=(1-prev)*fpr;return{tpr,fpr,prec:tp+fp?tp/(tp+fp):1}};
LAB({id:'x8',mod:'X',g:'X',lessons:['x8','c3-1','d4-2'],
 t:['آستانه، شیوع و Precision/Recall','Threshold, prevalence and precision/recall'],
 aha:['یک آستانه‌ی ثابت یک نقطه‌ی ROC است؛ Recall و Precision را معاوضه می‌کند و به شیوع بستگی دارد.','A fixed threshold is one ROC point; it trades recall against precision and depends on the prevalence.'],
 big:{had:['از احتمال می‌دانیم P(+|بیمار) و P(بیمار|+) فرق دارند (بیز) و از ML می‌دانیم Precision و Recall چیست.','From probability we know P(+ | sick) and P(sick | +) differ (Bayes) and from ML we know precision and recall.'],
  miss:['چگونه آستانه را انتخاب کنیم تا هر دو معیار قابل‌قبول باشند؟','How do we choose the threshold so both metrics are acceptable?'],
  fix:['دو توزیع نمره (مثبت و منفی) و یک آستانه‌ی قابل‌حرکت.','Two score distributions (positives and negatives) and a movable threshold.'],
  close:['TPR=۱−Φ(τ−μ) و FPR=۱−Φ(τ)؛ Precision=TP/(TP+FP) با شیوع تغییر می‌کند. بنابراین آستانه را با هزینه‌ها و شیوع می‌چینیم.','TPR = 1 − Φ(τ − μ) and FPR = 1 − Φ(τ); precision = TP/(TP + FP) changes with prevalence. So we set the threshold from the costs and the prevalence.']},
 sol:{tau:0.9},fail:{tau:2.5},
 st:()=>({tau:1.5,mu:2.5,prev:0.3}),
 stage(host,st,A){return()=>{host.innerHTML='';const P=chart(560,230,-3,6,0,0.45,{l:30,b:24});P.axes(9,3,v=>String(Math.round(v)),v=>fmt(v,2));const n=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);P.path(x=>(1-st.prev)*n(x),'var(--ac)',-3,6,200,2.4);P.path(x=>st.prev*n(x-st.mu),'var(--bad)',-3,6,200,2.4);P.area(x=>(1-st.prev)*n(x),st.tau,6,'var(--warn)');P.area(x=>st.prev*n(x-st.mu),st.tau,6,'var(--ok)');P.line(st.tau,0,st.tau,0.45,'var(--hl)',null,2);
   const m=x8(st.tau,st.mu,st.prev);P.text(-2.9,0.42,'■ '+t2('منفی‌ها (مساحت راست‌آستانه = FP)','negatives (area right of τ = FP)'),'var(--ac)','start',11);P.text(-2.9,0.38,'■ '+t2('مثبت‌ها (مساحت راست‌آستانه = TP)','positives (area right of τ = TP)'),'var(--bad)','start',11);
   const ok=m.tpr>=0.9&&m.prec>=0.6;host.append(P.svg,h('div',{class:'stat'},h('span',{},'τ = ',h('b',{},fmt(st.tau,2))),h('span',{},'Recall = ',h('b',{style:{color:m.tpr>=.9?'var(--ok)':'var(--fg)'}},Math.round(m.tpr*100)+'%')),h('span',{},'Precision = ',h('b',{style:{color:m.prec>=.6?'var(--ok)':'var(--fg)'}},Math.round(m.prec*100)+'%')),h('span',{},'FPR = ',h('b',{},Math.round(m.fpr*100)+'%'))),h('div',{class:'wn'},t2('نمره‌ها گاوسی‌اند: منفی N(۰،۱) و مثبت N(μ،۱)؛ ارتفاع‌ها با شیوع وزن شده‌اند. داده‌ها ساختگی‌اند.','Scores are Gaussian: negatives N(0, 1) and positives N(μ, 1); heights are weighted by prevalence. The data are made up.')))}},
 screens:{
  puzzle:{ask:['مدلی به هر نمونه نمره می‌دهد. نمونه‌های بالای آستانه مثبت اعلام می‌شوند. آستانه را بالا ببریم چه چیزی را از دست می‌دهیم و چه چیزی را به دست می‌آوریم؟','A model scores each sample. Samples above the threshold are called positive. If we raise the threshold, what do we lose and what do we gain?'],
   do:['τ را بکشید و Recall و Precision را ببینید.','Drag τ and watch recall and precision.'],ctl:(st,A)=>[rng('τ',-2,5,0.05,st.tau,v=>{st.tau=v;A.upd()},v=>fmt(v,2))]},
  explore:{claim:['آستانه‌ی بالاتر Precision را زیاد و Recall را کم می‌کند؛ شیوع کمتر، Precision را کم می‌کند.','A higher threshold raises precision and lowers recall; a lower prevalence lowers precision.'],
   ask:['اگر شیوع از ۳۰٪ به ۳٪ برسد و τ ثابت بماند، Precision چه می‌شود؟ چرا؟','If the prevalence falls from 30% to 3% with τ unchanged, what happens to precision? Why?'],
   do:['شیوع و جدایی μ را عوض کنید.','Change the prevalence and the separation μ.'],ctl:(st,A)=>[rng('τ',-2,5,0.05,st.tau,v=>{st.tau=v;A.upd()},v=>fmt(v,2)),rng(t2('شیوع','Prevalence'),0.02,0.5,0.01,st.prev,v=>{st.prev=v;A.upd()},v=>Math.round(v*100)+'%'),rng('μ',0.5,4,0.1,st.mu,v=>{st.mu=v;A.upd()},v=>fmt(v,1))],
   see:['شیوع کم تعداد منفی‌ها را غالب می‌کند و حتی FPR کوچک FP زیادی می‌سازد: Precision می‌افتد، در حالی که Recall و FPR تغییر نمی‌کنند.','A low prevalence lets negatives dominate, so even a small FPR creates many FPs: precision drops while recall and FPR do not change.']},
  name:{says:[['به زبان احتمال:','In probability terms:']],tex:['\\mathrm{TPR}=1-\\Phi(\\tau-\\mu),\\quad \\mathrm{FPR}=1-\\Phi(\\tau),\\quad \\mathrm{Prec}=\\frac{\\pi\\,\\mathrm{TPR}}{\\pi\\,\\mathrm{TPR}+(1-\\pi)\\mathrm{FPR}}'],
   legend:[['\\pi',['شیوع کلاس مثبت.','The prevalence of the positive class.']],['\\Phi',['تابع توزیع تجمعی نرمال استاندارد.','The standard normal CDF.']],['\\mu',['جدایی دو توزیع: هرچه بزرگ‌تر، مدل بهتر.','The separation of the two distributions: the larger, the better the model.']]]},
  challenge:{ask:['شیوع ۳۰٪ و μ=۲٫۵ ثابت‌اند. τ را طوری بگذارید که Recall ≥ ۹۰٪ و Precision ≥ ۶۰٪ باشد.','Prevalence 30% and μ = 2.5 are fixed. Set τ so that recall ≥ 90% and precision ≥ 60%.'],
   do:['هر دو عدد باید سبز شوند.','Both numbers must turn green.'],ctl:(st,A)=>{st.mu=2.5;st.prev=0.3;st.tau=2.5;return[rng('τ',-2,5,0.05,st.tau,v=>{st.tau=v;A.upd()},v=>fmt(v,2))]},
   ok:st=>{const m=x8(st.tau,2.5,0.3);return st.mu===2.5&&st.prev===0.3&&m.tpr>=0.9&&m.prec>=0.6},hints:[['Recall با کم‌کردن τ زیاد می‌شود.','Recall grows as τ decreases.'],['Precision با زیاد‌کردن τ زیاد می‌شود؛ پس دنبال بازه‌ای بگردید که هر دو را بدهد.','Precision grows as τ increases; so look for a range that gives both.'],['τ بین حدود ۰٫۶ و ۱٫۲.','τ between about 0.6 and 1.2.']],
   win:['در این بازه‌ی باریک هر دو شرط برقرار است. اگر جدایی μ کمتر یا شیوع کمتر بود، چنین بازه‌ای وجود نداشت: داده‌ی بهتر یا مدل بهتر لازم می‌شد.','Both conditions hold in this narrow window. With a smaller separation μ or a lower prevalence no such window would exist: you would need better data or a better model.']}}});

/* X9 · Embeddings and analogies */
const X9W={man:[1,0.1],woman:[-1,0.1],king:[1,1.1],queen:[-1,1.1],prince:[1,0.7],princess:[-1,0.7],boy:[1,-0.5],girl:[-1,-0.5]};
const x9near=(a,b,c)=>{const v=[X9W[a][0]-X9W[b][0]+X9W[c][0],X9W[a][1]-X9W[b][1]+X9W[c][1]];let best=null;Object.keys(X9W).forEach(w=>{if(w===a||w===b||w===c)return;const u=X9W[w],cs=(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)+1e-9);if(!best||cs>best.cs)best={w,cs}});return{v,...best}};
LAB({id:'x9',mod:'X',g:'X',lessons:['x9','c1-1'],
 t:['حساب برداری روی معنا','Vector arithmetic on meaning'],
 aha:['در فضای تعبیه (embedding) جهت‌ها معنا دارند؛ پس «پادشاه − مرد + زن» با ضرب و جمع بردار به «ملکه» نزدیک می‌شود.','In an embedding space directions carry meaning, so "king − man + woman" lands near "queen" using only vector addition.'],
 big:{had:['از جبر خطی می‌دانیم بردارها را می‌توان جمع و تفریق کرد و شباهت کسینوسی زاویه را می‌سنجد.','From linear algebra we know vectors can be added and subtracted and cosine similarity measures angle.'],
  miss:['چگونه کلمه‌ها را به بردار تبدیل کنیم که این عملیات معنا داشته باشد؟','How can words become vectors so that these operations mean something?'],
  fix:['۸ کلمه‌ی اسباب‌بازی در صفحه (محور جنسیت و محور سلطنت) و حساب برداری.','Eight toy words on a plane (a gender axis and a royalty axis) and vector arithmetic.'],
  close:['v=a−b+c و نزدیک‌ترین کلمه با کسینوس؛ در مدل‌های واقعی بُعد ۳۰۰ تا ۴٬۰۰۰ است و رابطه‌ها تقریبی‌اند. توجه (attention) در درس بعد از همین ضرب داخلی استفاده می‌کند.','v = a − b + c and the nearest word by cosine; real models have 300 to 4,000 dimensions and the relations are only approximate. Attention (next lab) uses the same dot product.']},
 sol:{a:'king',b:'man',c:'woman'},fail:{a:'prince',b:'man',c:'woman'},
 st:()=>({a:'prince',b:'boy',c:'girl'}),
 stage(host,st,A){return()=>{host.innerHTML='';const P=chart(440,330,-2,2,-1,1.8,{l:26,b:22});P.axes(4,4,v=>fmt(v,1),v=>fmt(v,1));const r=x9near(st.a,st.b,st.c);
   Object.entries(X9W).forEach(([w,u])=>{const hit=w===r.w;P.dot(u[0],u[1],hit?7:5,hit?'var(--ok)':'var(--ac)');P.text(u[0]+0.06,u[1]+0.08,w,hit?'var(--ok)':'var(--fg)','start',12)});
   arrowSvg(P,0,0,r.v[0],r.v[1],'var(--hl)',2.6);P.dot(r.v[0],r.v[1],4,'var(--hl)');P.text(r.v[0]+0.05,r.v[1]-0.15,'a−b+c','var(--hl)','start',11);
   P.text(-1.95,1.7,t2('→ جنسیت','→ gender'),'var(--mut)','start',10);host.append(P.svg,h('div',{class:'stat'},h('span',{},st.a+' − '+st.b+' + '+st.c),h('span',{},t2('نزدیک‌ترین کلمه: ','Nearest word: '),h('b',{style:{color:r.w==='queen'?'var(--ok)':'var(--fg)'}},r.w)),h('span',{},'cos = ',h('b',{},fmt(r.cs,3)))),h('div',{class:'wn'},t2('محور افقی ≈ جنسیت، محور عمودی ≈ سلطنت. بردارها ساختگی و دوبعدی‌اند؛ مدل‌های واقعی چنین ساختاری را از متن می‌آموزند.','The horizontal axis ≈ gender, the vertical ≈ royalty. The vectors are made up and 2D; real models learn such structure from text.')))}},
 screens:{
  puzzle:{ask:['اگر «مرد» را از «پادشاه» کم و «زن» را اضافه کنیم، نتیجه کجا می‌افتد؟','If we subtract "man" from "king" and add "woman", where does the result land?'],
   do:['a، b و c را انتخاب کنید و پیکان زرد را ببینید.','Choose a, b and c and watch the yellow arrow.'],ctl:(st,A)=>{const W=Object.keys(X9W);return[sel('a',W,st.a,v=>{st.a=v;A.upd()}),sel('b',W,st.b,v=>{st.b=v;A.upd()}),sel('c',W,st.c,v=>{st.c=v;A.upd()})]}},
  explore:{claim:['تفاضل دو بردار یک «رابطه» را می‌گیرد (مرد→زن) و آن را روی کلمه‌ی دیگر اعمال می‌کند.','The difference of two vectors captures a "relation" (man → woman) and applies it to another word.'],
   ask:['شاهزاده − پسر + دختر چه می‌شود؟ آیا «پسر→دختر» همان رابطه‌ی «مرد→زن» است؟ (پادشاه − پسر + دختر را هم امتحان کنید.)','What does prince − boy + girl give? Is "boy → girl" the same relation as "man → woman"? (Also try king − boy + girl.)'],
   do:['سه‌تایی‌های مختلف را امتحان کنید.','Try different triples.'],ctl:(st,A)=>{const W=Object.keys(X9W);return[sel('a',W,st.a,v=>{st.a=v;A.upd()}),sel('b',W,st.b,v=>{st.b=v;A.upd()}),sel('c',W,st.c,v=>{st.c=v;A.upd()})]},
   see:['شاهزاده−پسر+دختر → شاهزاده‌خانم. پادشاه−پسر+دختر و پادشاه−مرد+زن هر دو ملکه می‌دهند، چون «پسر→دختر» و «مرد→زن» یک جهت دارند (تغییر جنسیت).','prince − boy + girl → princess. king − boy + girl and king − man + woman both give queen, because "boy → girl" and "man → woman" point in the same direction (flip gender).']},
  name:{says:[['به زبان بردار و شباهت کسینوسی:','In vector and cosine-similarity terms:']],tex:['\\mathbf v=\\mathbf e_a-\\mathbf e_b+\\mathbf e_c,\\qquad \\hat w=\\arg\\max_{w}\\ \\cos(\\mathbf e_w,\\mathbf v)=\\frac{\\mathbf e_w\\cdot\\mathbf v}{\\|\\mathbf e_w\\|\\|\\mathbf v\\|}'],
   legend:[['\\mathbf e_w',['بردار تعبیه‌ی کلمه.','The embedding vector of a word.']],['\\cos',['شباهت زاویه‌ای؛ مستقل از طول بردار.','Angular similarity; independent of vector length.']]]},
  challenge:{ask:['سه کلمه (a,b,c) انتخاب کنید که a−b+c به «queen» نزدیک‌ترین باشد.','Choose three words (a, b, c) so that a − b + c is nearest to "queen".'],
   do:['وقتی نزدیک‌ترین کلمه سبز و «queen» شد موفق شده‌اید.','You succeed when the nearest word turns green and reads "queen".'],ctl:(st,A)=>{Object.assign(st,{a:'prince',b:'boy',c:'girl'});const W=Object.keys(X9W);return[sel('a',W,st.a,v=>{st.a=v;A.upd()}),sel('b',W,st.b,v=>{st.b=v;A.upd()}),sel('c',W,st.c,v=>{st.c=v;A.upd()})]},
   ok:st=>new Set([st.a,st.b,st.c]).size===3&&x9near(st.a,st.b,st.c).w==='queen',hints:[['ملکه مؤنث و سلطنتی است.','A queen is female and royal.'],['از «پادشاه» (سلطنتی، مرد) شروع کنید و جنسیت را عوض کنید.','Start from "king" (royal, male) and flip the gender.'],['b باید مردانه و c زنانه باشد.','b must be male and c female.']],
   win:['رابطه‌ی «مرد→زن» به «پادشاه» اعمال شد. در مدل‌های واقعی این همان خاصیت خطی‌بودن نسبی تعبیه‌هاست.','The relation "man → woman" was applied to "king". In real models this is the approximate linear structure of embeddings.']}}});

/* X10 · Attention is a matrix product */
const X10K=[0,120,240].map(t=>[Math.cos(t*Math.PI/180),Math.sin(t*Math.PI/180)]);
const x10w=(phi_,r)=>{const q=[r*Math.cos(phi_*Math.PI/180),r*Math.sin(phi_*Math.PI/180)],s=X10K.map(k=>(q[0]*k[0]+q[1]*k[1])/Math.sqrt(2)),m=Math.max(...s),e=s.map(x=>Math.exp(x-m)),z=e.reduce((a,b)=>a+b);return{q,s,w:e.map(x=>x/z)}};
LAB({id:'x10',mod:'X',g:'X',lessons:['x10','c3-1'],
 t:['توجه = ضرب ماتریسی + softmax','Attention is a matrix product + softmax'],
 aha:['توجه شباهت پرس‌وجو با کلیدها را با ضرب داخلی می‌سنجد و softmax آن را به وزن‌هایی تبدیل می‌کند که مجموعشان ۱ است؛ خروجی میانگین وزن‌دار مقدارهاست.','Attention measures the similarity of a query with the keys by dot products and softmax turns them into weights that sum to 1; the output is a weighted average of the values.'],
 big:{had:['می‌دانیم ضرب داخلی شباهت را می‌سنجد و softmax امتیازها را به احتمال تبدیل می‌کند.','We know the dot product measures similarity and softmax turns scores into probabilities.'],
  miss:['چگونه یک توکن تصمیم می‌گیرد به کدام توکن‌های دیگر نگاه کند؟','How does a token decide which other tokens to look at?'],
  fix:['۳ توکن با کلیدهای ثابت و یک پرس‌وجوی قابل‌چرخش و قابل‌کشیده‌شدن.','Three tokens with fixed keys and a query you can rotate and stretch.'],
  close:['Attention(Q,K,V)=softmax(QKᵀ/√d)V. طول پرس‌وجو دما را تعیین می‌کند: بزرگ → تیز، کوچک → یکنواخت. این همان قلب ترنسفورمر است.','Attention(Q, K, V) = softmax(QKᵀ/√d)V. The query length sets the temperature: large → sharp, small → uniform. This is the heart of the transformer.']},
 sol:{phi:240,r:3},fail:{phi:0,r:1},
 st:()=>({phi:0,r:1}),
 stage(host,st,A){return()=>{host.innerHTML='';const e=x10w(st.phi,st.r),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 230`,class:'sv'}),cx=120,cy=115,R=80;svg.append(sv('circle',{cx,cy,r:R,fill:'none',stroke:'var(--bd)'}));
   X10K.forEach((k,i)=>{const x=cx+R*k[0],y=cy-R*k[1];svg.append(sv('line',{x1:cx,y1:cy,x2:x,y2:y,stroke:'var(--mut)','stroke-width':1.5}),sv('circle',{cx:x,cy:y,r:8,fill:'var(--panel2)',stroke:'var(--ac2)','stroke-width':2}),sv('text',{x:x+(k[0]>=0?12:-12),y:y+4,'text-anchor':k[0]>=0?'start':'end','font-size':11},'k'+(i+1)))});
   const qx=cx+e.q[0]*R/3,qy=cy-e.q[1]*R/3;svg.append(sv('line',{x1:cx,y1:cy,x2:qx,y2:qy,stroke:'var(--hl)','stroke-width':3}),sv('circle',{cx:qx,cy:qy,r:5,fill:'var(--hl)'}),sv('text',{x:qx+8,y:qy-6,'font-size':11,fill:'var(--hl)'},'q'));
   e.w.forEach((w,i)=>{const x=300+i*80,bh=w*150;svg.append(sv('rect',{x,y:190-bh,width:56,height:bh,fill:i===2?'var(--ok)':'var(--ac)',opacity:.85}),sv('text',{x:x+28,y:190-bh-5,'text-anchor':'middle','font-size':12,'font-weight':700},Math.round(w*100)+'%'),sv('text',{x:x+28,y:206,'text-anchor':'middle','font-size':11},t2('توکن ','token ')+(i+1)));if(i===0)svg.append(sv('text',{x:300,y:14,class:'mut','font-size':10.5},t2('وزن‌های توجه = softmax(q·k/√d)','attention weights = softmax(q·k/√d)')))});
   host.append(svg,h('div',{class:'stat'},h('span',{},'φ = ',h('b',{},Math.round(st.phi)+'°')),h('span',{},'|q| = ',h('b',{},fmt(st.r,1))),h('span',{},t2('امتیازها q·k/√۲: ','Scores q·k/√2: '),h('b',{},e.s.map(x=>fmt(x,2)).join(', '))),h('span',{},t2('وزن توکن ۳: ','Token-3 weight: '),h('b',{style:{color:e.w[2]>=0.7?'var(--ok)':'var(--fg)'}},Math.round(e.w[2]*100)+'%'))),h('div',{class:'wn'},t2('کلیدها k1,k2,k3 روی دایره با زاویه‌ی ۰°، ۱۲۰°، ۲۴۰°؛ d=۲. q پرس‌وجوی شما (زرد) است. داده‌ها ساختگی‌اند.','Keys k1, k2, k3 on the circle at 0°, 120°, 240°; d = 2. q is your query (yellow). The data are made up.')))}},
 screens:{
  puzzle:{ask:['سه توکن کلیدی روی دایره‌اند. پرس‌وجوی q به کدام بیشتر «نگاه» می‌کند؟ آیا مجموع وزن‌ها همیشه ۱۰۰٪ است؟','Three key tokens sit on the circle. Which one does the query q "look at" most? Do the weights always sum to 100%?'],
   do:['زاویه‌ی q را بچرخانید.','Rotate the angle of q.'],ctl:(st,A)=>[rng('φ°',0,360,1,st.phi,v=>{st.phi=v;A.upd()},v=>Math.round(v)+'°')]},
  explore:{claim:['وزن بیشینه برای کلیدی است که با q بیشترین ضرب داخلی (هم‌جهت‌ترین) را دارد، و |q| تیزی را تعیین می‌کند.','The largest weight goes to the key with the largest dot product (the most aligned) and |q| sets the sharpness.'],
   ask:['اگر |q|→۰ وزن‌ها چه می‌شوند؟ و اگر |q| بزرگ شود؟','What do the weights become as |q| → 0? And as |q| grows?'],
   do:['|q| را از ۰٫۱ تا ۴ ببرید.','Sweep |q| from 0.1 to 4.'],ctl:(st,A)=>[rng('φ°',0,360,1,st.phi,v=>{st.phi=v;A.upd()},v=>Math.round(v)+'°'),rng('|q|',0.1,4,0.1,st.r,v=>{st.r=v;A.upd()},v=>fmt(v,1))],
   see:['|q|→۰: وزن‌ها یکنواخت (۳۳٪ هرکدام). |q| بزرگ: softmax تقریباً «بیشینه‌ی سخت» می‌شود و تقریباً ۱۰۰٪ به یک توکن می‌رود.','|q| → 0: uniform weights (33% each). Large |q|: softmax approaches a hard maximum and almost 100% goes to one token.']},
  name:{says:[['برای همه‌ی توکن‌ها هم‌زمان یک ضرب ماتریسی:','For all tokens at once, one matrix product:']],tex:['\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\Big(\\frac{QK^\\top}{\\sqrt d}\\Big)V'],
   legend:[['QK^\\top',['ماتریس همه‌ی ضرب‌های داخلی پرس‌وجو و کلید (n×n).','The matrix of all query–key dot products (n × n).']],['\\sqrt d',['مقیاس‌دهی: جلوگیری از سیر شدن softmax وقتی بُعد بزرگ است.','Scaling: keeps softmax from saturating when the dimension is large.']],['V',['مقدارها؛ خروجی = میانگین وزن‌دار V.','The values; the output = the weighted average of V.']]]},
  challenge:{ask:['q را طوری تنظیم کنید که توکن ۳ دست‌کم ۷۰٪ وزن توجه را بگیرد.','Set q so that token 3 receives at least 70% of the attention weight.'],
   do:['هم زاویه و هم اندازه‌ی q لازم است.','You need both the angle and the length of q.'],ctl:(st,A)=>{st.phi=0;st.r=1;return[rng('φ°',0,360,1,st.phi,v=>{st.phi=v;A.upd()},v=>Math.round(v)+'°'),rng('|q|',0.1,4,0.1,st.r,v=>{st.r=v;A.upd()},v=>fmt(v,1))]},
   ok:st=>x10w(st.phi,st.r).w[2]>=0.7,hints:[['q باید به k3 (۲۴۰°) نزدیک شود.','q must get close to k3 (240°).'],['زاویه به‌تنهایی کافی نیست؛ با |q| کوچک وزن‌ها یکنواخت می‌مانند.','The angle alone is not enough; with a small |q| the weights stay uniform.'],['|q| را دست‌کم حدود ۱٫۵ بگذارید.','Use |q| of at least about 1.5.']],
   win:['q هم‌جهت با k3 و به‌اندازه‌ی کافی بلند است: softmax تیز شد. در ترنسفورمر Q و K با وزن‌های آموخته‌شده ساخته می‌شوند تا این هم‌جهتی معنادار باشد.','q is aligned with k3 and long enough: softmax sharpened. In a transformer Q and K come from learned weights so that this alignment is meaningful.']}}});
