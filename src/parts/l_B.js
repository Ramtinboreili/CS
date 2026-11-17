/* ===================== LABS: Module B (Databases) ===================== */
const DBTAB=(head,rows,o)=>{o=o||{};const t=h('table',{class:'dt'});t.append(h('tr',{},head.map(x=>h('th',{},x))));rows.forEach((r,i)=>t.append(h('tr',{class:o.hl&&o.hl(i)?'hl':''},r.map(v=>h('td',{class:v==null?'nl':''},v==null?'NULL':String(v))))));return h('div',{class:'tw'},t)};

/* B1 · The same question, different plans */
LAB({id:'b1',mod:'B',g:'B1',lessons:['b1-1'],
 t:['یک پرسش، چند برنامه‌ی اجرا','One question, many plans'],
 aha:['در SQL می‌گویید «چه می‌خواهید»؛ سیستم انتخاب می‌کند «چگونه»، و هزینه‌ی هر روش به انتخاب‌پذیری (selectivity) شرط بستگی دارد.','In SQL you say what you want; the system chooses how, and the cost of each way depends on how selective the condition is.'],
 big:{had:['می‌دانیم داده در جدول‌هایی از سطرها ذخیره می‌شود و با پرس‌وجو خوانده می‌شود.','We know data lives in tables of rows and is read with queries.'],
  miss:['پرس‌وجو نمی‌گوید چگونه سطرها پیدا شوند. چرا یک جواب می‌تواند با خواندن ۱۰۰ سطر یا فقط ۸ سطر به دست آید؟','A query does not say how to find the rows. Why can one answer come from reading 100 rows or only 8?'],
  fix:['هزینه‌ی دو برنامه‌ی اجرا (اسکن کامل و ایندکس) را روی همان شرط نشان می‌دهد.','Shows the cost of two plans (full scan and index) for the same condition.'],
  close:['نتیجه یکی است ولی هزینه فرق می‌کند: ایندکس فقط وقتی برنده است که سطرهای کمی تطبیق کنند. این استقلال داده‌ای (data independence) است. بعداً می‌بینیم بهینه‌ساز چگونه همین مقایسه را خودکار انجام می‌دهد.','The result is the same but the cost differs: an index wins only when few rows match. This is data independence. Later we see how the optimizer makes this comparison automatically.']},
 sol:{lo:50,hi:51.5},fail:{lo:30,hi:100},
 st:()=>({lo:40,hi:80}),
 stage(host,st,A){const S=Array.from({length:100},(_,i)=>+(30+((i*37)%100)*0.7+((i*37)%100%11)*0.05).toFixed(2));A.matches=()=>S.filter(s=>s>=st.lo&&s<=st.hi).length;A.costs=()=>{const m=A.matches();return{scan:100,idx:7+3*m,m}};
  return()=>{host.innerHTML='';const c=A.costs(),W=560,H=210,svg=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'sv'});
   svg.append(sv('text',{x:10,y:14,class:'mut','font-size':11},t2('۱۰۰ سطر جدول (هر خانه یک سطر؛ رنگ = شرط برقرار است)','100 table rows (each cell is a row; highlighted = matches)')));
   S.forEach((s,i)=>{const x=10+(i%10)*24,y=24+Math.floor(i/10)*17,m=s>=st.lo&&s<=st.hi;svg.append(sv('rect',{x,y,width:21,height:14,rx:2,fill:m?'var(--ac2)':'var(--panel2)',stroke:m?'var(--hl)':'var(--bd)'}),m?sv('text',{x:x+10.5,y:y+11,'text-anchor':'middle','font-size':9,fill:'#111'},'✓'):null)});
   const bx=290,bh=v=>Math.min(150,v/110*150);[['scan',t2('اسکن کامل','Full scan'),c.scan,'var(--ac)'],['idx',t2('ایندکس','Index'),c.idx,'var(--warn)']].forEach(([k,l,v,col],i)=>{const x=bx+i*120;svg.append(sv('rect',{x,y:190-bh(v),width:90,height:bh(v),fill:col,opacity:.85,'stroke-dasharray':k==='idx'?'6 3':null,stroke:'var(--fg)','stroke-width':k==='idx'?1.5:0}),sv('text',{x:x+45,y:190-bh(v)-5,'text-anchor':'middle','font-size':12,'font-weight':700},fmt(v,0)),sv('text',{x:x+45,y:205,'text-anchor':'middle','font-size':10.5},l))});
   host.append(svg,h('div',{class:'stat'},h('span',{},'salary ∈ [',h('b',{},fmt(st.lo,1)+', '+fmt(st.hi,1)),']'),h('span',{},t2('سطرهای تطبیق‌یافته: ','Matching rows: '),h('b',{},c.m)),h('span',{},t2('هزینه‌ی اسکن: ','Scan cost: '),h('b',{},100)),h('span',{},t2('هزینه‌ی ایندکس: ','Index cost: '),h('b',{},'7 + 3·'+c.m+' = '+c.idx))),h('div',{class:'wn'},t2('مدل اسباب‌بازی: اسکن ۱۰۰ صفحه‌ی پشت‌سرهم؛ ایندکس ۷ خواندن برای رسیدن به برگ و ۳ خواندن تصادفی برای هر سطر.','Toy model: a scan reads 100 pages sequentially; an index takes 7 reads to reach the leaf plus 3 random reads per matching row.')))}},
 screens:{
  puzzle:{ask:['SELECT * FROM emp WHERE salary BETWEEN lo AND hi را می‌توان با خواندن همه‌ی ۱۰۰ سطر یا با ایندکس پاسخ داد. جواب یکی است؛ کدام کم‌هزینه‌تر است؟','SELECT * FROM emp WHERE salary BETWEEN lo AND hi can be answered by reading all 100 rows or through an index. The answer is the same; which costs less?'],
   do:['بازه را عوض کنید و ببینید کدام ستون کوتاه‌تر است.','Change the range and see which bar is shorter.'],
   ctl:(st,A)=>[rng('lo',30,100,0.5,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>fmt(v,1)),rng('hi',30,100,0.5,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>fmt(v,1))]},
  explore:{claim:['ایندکس وقتی برنده است که کسر کمی از سطرها تطبیق کنند؛ در غیر این‌صورت اسکن ارزان‌تر است.','An index wins only when a small fraction of rows match; otherwise the scan is cheaper.'],
   ask:['بازه را از بسیار باریک تا کل جدول گسترش دهید. در کدام تعداد سطر دو ستون برابر می‌شوند؟','Widen the range from very narrow to the whole table. At how many matching rows do the two bars become equal?'],
   do:['hi را کم‌کم زیاد کنید و نقطه‌ی برابری را پیدا کنید.','Increase hi gradually and find the break-even point.'],
   ctl:(st,A)=>[rng('lo',30,100,0.5,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>fmt(v,1)),rng('hi',30,100,0.5,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>fmt(v,1))],
   see:['۷+۳m=۱۰۰ نتیجه می‌دهد m≈۳۱: بالاتر از حدود ۳۱٪ سطرها اسکن ارزان‌تر است.','7 + 3m = 100 gives m ≈ 31: above about 31% of the rows the scan is cheaper.']},
  name:{says:[['آنچه دیدید: هزینه‌ی هر برنامه تابعی از «انتخاب‌پذیری» شرط است:','What you saw: each plan\'s cost is a function of the condition\'s selectivity:']],
   tex:['s=\\frac{\\text{matching rows}}{N},\\qquad C_{\\text{scan}}=N,\\qquad C_{\\text{index}}=h+r\\cdot sN'],
   legend:[['s',['انتخاب‌پذیری: کسری از سطرها که شرط را برقرار می‌کنند.','Selectivity: the fraction of rows that satisfy the condition.']],['h',['خواندن‌های لازم برای رسیدن به برگ ایندکس (اینجا ۷).','Reads needed to reach the index leaf (7 here).']],['r',['هزینه‌ی نسبی خواندن تصادفی هر سطر (اینجا ۳).','Relative cost of one random row read (3 here).']]]},
  challenge:{ask:['شرطی بسازید که ایندکس دست‌کم ۴ برابر ارزان‌تر از اسکن کامل باشد، ولی حداقل یک سطر برگردد.','Build a condition for which the index is at least 4× cheaper than a full scan, while returning at least one row.'],
   do:['بازه را باریک کنید؛ هر دو ستون و تعداد سطرها را ببینید.','Narrow the range; watch both bars and the row count.'],
   ctl:(st,A)=>[rng('lo',30,100,0.5,st.lo,v=>{st.lo=Math.min(v,st.hi);A.upd()},v=>fmt(v,1)),rng('hi',30,100,0.5,st.hi,v=>{st.hi=Math.max(v,st.lo);A.upd()},v=>fmt(v,1))],
   ok:st=>{const S=Array.from({length:100},(_,i)=>+(30+((i*37)%100)*0.7+((i*37)%100%11)*0.05).toFixed(2));const m=S.filter(s=>s>=st.lo&&s<=st.hi).length;return m>=1&&7+3*m<=25},
   hints:[['هزینه‌ی ایندکس باید حداکثر یک‌چهارم ۱۰۰ باشد، یعنی ۲۵.','The index cost must be at most a quarter of 100, i.e. 25.'],['از ۷+۳m ≤ ۲۵ می‌توان بیشترین m را حساب کرد.','From 7 + 3m ≤ 25 you can compute the largest allowed m.'],['lo و hi را نزدیک هم ببرید تا فقط چند سطر بماند.','Bring lo and hi close together so only a few rows remain.']],
   win:['شرط بسیار انتخاب‌پذیر (≤ ۶ سطر از ۱۰۰) است. ایندکس فقط برای چنین شرط‌هایی ارزش دارد؛ بهینه‌ساز همین مقایسه را با آمار جدول انجام می‌دهد.','A highly selective condition (≤ 6 of 100 rows). An index pays off only for such conditions; the optimizer makes this same comparison using table statistics.']}}});

/* B2 · Keys */
LAB({id:'b2',mod:'B',g:'B2',lessons:['b2-1'],
 t:['کلید یعنی یکتایی کمینه','A key is minimal uniqueness'],
 aha:['کلید مجموعه‌ای از ستون‌هاست که هر سطر را یکتا می‌کند؛ کلید کاندید (candidate key) کوچک‌ترین چنین مجموعه است.','A key is a set of columns that makes every row unique; a candidate key is a smallest such set.'],
 big:{had:['جدول مجموعه‌ای از سطرهاست و هر سطر باید قابل تشخیص باشد.','A table is a set of rows and each row must be identifiable.'],
  miss:['کدام ستون‌ها سطر را یکتا می‌کنند؟ آیا یک ستون کافی است و آیا ستون اضافه ضرر دارد؟','Which columns make a row unique? Is one column enough, and does an extra column do any harm?'],
  fix:['ستون‌ها را انتخاب می‌کنید و تصویر سطرهای تکراری را نشان می‌دهد.','You pick columns and the picture shows the duplicate rows.'],
  close:['ابرکلید: بدون تکرار. کلید کاندید: ابرکلید کمینه. کلید اصلی یکی از کلیدهای کاندید است که انتخاب می‌کنیم؛ درس بعد (SQL) از آن برای JOIN استفاده می‌کند.','Superkey: no duplicates. Candidate key: a minimal superkey. The primary key is the candidate key we choose; SQL next uses it for joins.']},
 sol:{sel:['student','course']},fail:{sel:['student']},
 st:()=>({sel:[]}),
 stage(host,st,A){const COLS=['student','course','term','room','grade'];const ROWS=[['Ana','DB','F24','R1','A'],['Ana','AI','F24','R2','B'],['Ben','DB','F24','R1','B'],['Ben','OS','S25','R3','A'],['Cy','AI','S25','R2','A'],['Cy','DB','S25','R4','B'],['Dee','AI','F24','R2','A'],['Dee','OS','S25','R3','B']];A.COLS=COLS;
  A.analyse=sel=>{const idx=sel.map(c=>COLS.indexOf(c)),grp={};ROWS.forEach((r,i)=>{const k=idx.map(j=>r[j]).join('|');(grp[k]=grp[k]||[]).push(i)});const dup=Object.values(grp).some(g=>g.length>1);return{grp,dup,sup:!!sel.length&&!dup}};
  return()=>{host.innerHTML='';const a=A.analyse(st.sel),idx=st.sel.map(c=>COLS.indexOf(c)),mark={};let gi=0;const sym='●■▲◆★✚';Object.values(a.grp).forEach(g=>{if(g.length>1){const s=sym[gi++%sym.length];g.forEach(i=>mark[i]=s)}});
   const tb=h('table',{class:'dt'});tb.append(h('tr',{},h('th',{},''),COLS.map(c=>h('th',{style:st.sel.includes(c)?{background:'var(--ac)',color:'#fff'}:{}},c))));
   ROWS.forEach((r,i)=>tb.append(h('tr',{class:mark[i]?'hl':''},h('td',{style:{color:'var(--bad)',fontWeight:700}},mark[i]||''),r.map((v,j)=>h('td',{style:idx.includes(j)?{fontWeight:700}:{}},v)))));
   const cand=a.sup&&st.sel.every(c=>A.analyse(st.sel.filter(x=>x!==c)).dup);
   host.append(h('div',{class:'tw'},tb),h('div',{class:'stat'},h('span',{},t2('ستون‌های انتخابی: ','Chosen columns: '),h('b',{},st.sel.join(', ')||'—')),h('span',{},a.sup?t2('✔ بدون تکرار → ابرکلید','✔ no duplicates → superkey'):st.sel.length?t2('✘ سطرهای تکراری (علامت‌دار)','✘ duplicate rows (marked)'):t2('ستونی انتخاب نشده','no column chosen')),h('span',{},cand?t2('✔ کمینه → کلید کاندید','✔ minimal → candidate key'):a.sup?t2('ابرکلید، ولی کمینه نیست','superkey, but not minimal'):'')),
    h('div',{class:'wn'},t2('سطرهایی که روی ستون‌های انتخابی مقدار یکسان دارند با نماد مشترک (●■▲…) علامت می‌خورند.','Rows with equal values on the chosen columns share a symbol (●■▲…).')))}},
 screens:{
  puzzle:{ask:['یک ثبت‌نام (سطر) را چگونه یکتا مشخص کنیم؟ آیا ستون «student» به‌تنهایی کافی است؟','How do we identify one enrollment (row) uniquely? Is the "student" column enough on its own?'],
   do:['ستون‌ها را روشن/خاموش کنید و ببینید کدام سطرها تکراری می‌شوند.','Toggle columns and see which rows become duplicates.'],
   ctl:(st,A)=>A.COLS.map(c=>btn(c,()=>{const i=st.sel.indexOf(c);i<0?st.sel.push(c):st.sel.splice(i,1);A.upd()}))},
  explore:{claim:['افزودن ستون هرگز تکرار تازه نمی‌سازد، ولی ممکن است بیش از حد لازم باشد.','Adding a column never creates a new duplicate, but it may be more than needed.'],
   ask:['کدام جفت ستون‌ها یکتایی می‌دهند؟ آیا سه‌تایی‌ای هست که لازم باشد؟','Which pairs of columns give uniqueness? Is there a triple that is actually necessary?'],
   do:['همه‌ی جفت‌ها را امتحان کنید، بعد سه‌تایی‌ها. دنبال ابرکلیدهای کمینه بگردید.','Try every pair, then triples. Look for minimal superkeys.'],
   ctl:(st,A)=>A.COLS.map(c=>btn(c,()=>{const i=st.sel.indexOf(c);i<0?st.sel.push(c):st.sel.splice(i,1);A.upd()})),
   see:['(student, course) و (student, room) هر دو یکتا هستند. هیچ ستون تکی یکتا نیست. (student, course, term) ابرکلید است ولی کمینه نیست.','(student, course) and (student, room) are both unique. No single column is. (student, course, term) is a superkey but not minimal.']},
  name:{says:[['به زبان رابطه‌ای:','In relational terms:']],tex:['K\\ \\text{superkey} \\iff \\forall r_1\\ne r_2:\\ r_1[K]\\ne r_2[K]','K\\ \\text{candidate} \\iff K\\ \\text{superkey} \\wedge \\forall K\'\\subsetneq K:\\ K\'\\ \\text{not a superkey}'],
   legend:[['K',['مجموعه‌ای از ستون‌ها.','A set of columns.']],['r[K]',['مقادیر سطر r روی ستون‌های K.','Row r\'s values on the columns of K.']]]},
  challenge:{ask:['کلید کاندید را پیدا کنید: مجموعه‌ای از ستون‌ها که بدون تکرار باشد و با حذف هر ستون از آن، تکرار پیدا شود.','Find a candidate key: a set of columns with no duplicates such that removing any column creates duplicates.'],
   do:['ستون‌ها را انتخاب کنید؛ پیام زیر جدول می‌گوید ابرکلید یا کلید کاندید.','Choose columns; the line under the table says superkey or candidate key.'],
   ctl:(st,A)=>A.COLS.map(c=>btn(c,()=>{const i=st.sel.indexOf(c);i<0?st.sel.push(c):st.sel.splice(i,1);A.upd()})).concat([btn(t2('پاک‌کردن','Clear'),()=>{st.sel.length=0;A.upd()})]),
   ok:st=>{const COLS=['student','course','term','room','grade'],ROWS=[['Ana','DB','F24','R1','A'],['Ana','AI','F24','R2','B'],['Ben','DB','F24','R1','B'],['Ben','OS','S25','R3','A'],['Cy','AI','S25','R2','A'],['Cy','DB','S25','R4','B'],['Dee','AI','F24','R2','A'],['Dee','OS','S25','R3','B']];const dup=sel=>{const ix=sel.map(c=>COLS.indexOf(c)),s=new Set();return ROWS.some(r=>{const k=ix.map(j=>r[j]).join('|');if(s.has(k))return true;s.add(k);return false})};return st.sel.length>0&&!dup(st.sel)&&st.sel.every(c=>st.sel.length===1||dup(st.sel.filter(x=>x!==c)))},
   hints:[['هیچ ستون تکی یکتا نیست؛ پس کلید حداقل دو ستون دارد.','No single column is unique, so the key has at least two columns.'],['دو ستونی را امتحان کنید که تکرار هر کدام را جبران کند: یکی از آن‌ها student است.','Try a pair where each column fixes the other\'s duplicates; one of them is student.'],['اگر یک ستون سوم اضافه کردید و هنوز یکتاست، آن را بردارید و ببینید یکتایی می‌ماند یا نه.','If you added a third column and it is still unique, remove one and see whether uniqueness survives.']],
   win:['این مجموعه یکتا و کمینه است. DBMS روی کلید اصلی (یکی از کلیدهای کاندید) ایندکس یکتا می‌سازد و کلید خارجی به آن ارجاع می‌دهد.','This set is unique and minimal. The DBMS builds a unique index on the primary key (one of the candidate keys) and foreign keys reference it.']}}});

/* B3 · A join is a filtered cross product */
const B3C=[[1,'Ana','Rome'],[2,'Ben','Oslo'],[3,'Cy','Rome']],B3O=[[10,1,'Rome'],[11,1,'Oslo'],[12,2,'Oslo'],[13,4,'Rome']];
function b3run(st){const ci={id:0,city:2},oi={cust_id:1,ship_city:2},C=B3C,O=B3O;
 const cell=C.map(c=>O.map(o=>{const a=c[ci[st.lc]],b=o[oi[st.rc]];return st.op==='='?a===b:a!==b}));const rows=[];
 if(st.jt==='RIGHT'){O.forEach((o,j)=>{let any=false;C.forEach((c,i)=>{if(cell[i][j]){rows.push([c[1],c[2],o[0],o[1],o[2]]);any=true}});if(!any)rows.push([null,null,o[0],o[1],o[2]])});return{cell,rows}}
 C.forEach((c,i)=>{let any=false;O.forEach((o,j)=>{if(cell[i][j]){rows.push([c[1],c[2],o[0],o[1],o[2]]);any=true}});if(!any&&st.jt==='LEFT')rows.push([c[1],c[2],null,null,null])});return{cell,rows}}
LAB({id:'b3',mod:'B',g:'B3',lessons:['b3-1','b3-2','b3-3'],
 t:['JOIN یعنی ضرب دکارتی فیلترشده','A JOIN is a filtered cross product'],
 aha:['JOIN همه‌ی جفت‌های (سطر چپ، سطر راست) را می‌سازد و شرط ON فقط جفت‌های مجاز را نگه می‌دارد؛ نوع JOIN تعیین می‌کند سطرهای بدون جفت چه شوند.','A JOIN forms every (left row, right row) pair and the ON condition keeps only the allowed pairs; the join type decides what happens to unmatched rows.'],
 big:{had:['می‌توانیم از یک جدول با SELECT و WHERE سطر انتخاب کنیم.','We can select rows from one table with SELECT and WHERE.'],
  miss:['داده‌ی مرتبط در جدول‌های جدا است. چگونه سطرهای مرتبط را کنار هم بیاوریم و سطرهای بدون جفت چه می‌شوند؟','Related data lives in separate tables. How do we bring related rows together, and what about rows without a partner?'],
  fix:['ماتریس همه‌ی جفت‌ها را نشان می‌دهد و شرط ON خانه‌های مجاز را روشن می‌کند.','Shows the matrix of all pairs; the ON condition lights up the allowed cells.'],
  close:['INNER فقط خانه‌های روشن را نگه می‌دارد؛ LEFT سطرهای چپِ بدون جفت را با NULL نگه می‌دارد؛ RIGHT برعکس. بعد از این GROUP BY و پنجره‌ها روی همین خروجی کار می‌کنند.','INNER keeps only the lit cells; LEFT also keeps unmatched left rows (with NULLs); RIGHT the reverse. GROUP BY and windows then work on this output.']},
 sol:{lc:'id',op:'=',rc:'cust_id',jt:'LEFT'},fail:{lc:'city',op:'=',rc:'ship_city',jt:'INNER'},
 st:()=>({lc:'id',op:'=',rc:'cust_id',jt:'INNER'}),
 stage(host,st,A){const C=[[1,'Ana','Rome'],[2,'Ben','Oslo'],[3,'Cy','Rome']],O=[[10,1,'Rome'],[11,1,'Oslo'],[12,2,'Oslo'],[13,4,'Rome']];const ci={id:0,city:2},oi={cust_id:1,ship_city:2};
  A.run=()=>b3run(st);
  return()=>{host.innerHTML='';const r=A.run();const g=h('table',{class:'dt'});g.append(h('tr',{},h('th',{},'customers ↓ / orders →'),O.map(o=>h('th',{},'order '+o[0]+' (cust '+o[1]+', '+o[2]+')'))));
   C.forEach((c,i)=>g.append(h('tr',{},h('td',{style:{fontWeight:700}},c[1]+' (id '+c[0]+', '+c[2]+')'),O.map((o,j)=>h('td',{style:{textAlign:'center',background:r.cell[i][j]?'color-mix(in srgb,var(--ok) 35%,transparent)':'',fontWeight:700}},r.cell[i][j]?'✔':'·')))));
   host.append(h('div',{class:'wn'},t2('همه‌ی ۱۲ جفت (۳ مشتری × ۴ سفارش)؛ ✔ = شرط ON برقرار','All 12 pairs (3 customers × 4 orders); ✔ = the ON condition holds')),h('div',{class:'tw'},g),
    h('pre',{class:'code',style:{margin:'8px 0'},html:hl(`SELECT * FROM customers c\n${st.jt} JOIN orders o ON c.${st.lc} ${st.op==='='?'=':'<>'} o.${st.rc};`,'sql')}),
    DBTAB(['name','city','oid','cust_id','ship_city'],r.rows),h('div',{class:'wn'},r.rows.length+t2(' سطر در خروجی',' rows in the output')))}},
 screens:{
  puzzle:{ask:['۳ مشتری و ۴ سفارش داریم. سفارش ۱۳ به مشتری‌ای اشاره می‌کند که وجود ندارد. با JOIN روی id = cust_id چند سطر می‌گیریم و آن سفارش کجا می‌رود؟','There are 3 customers and 4 orders. Order 13 points to a customer that does not exist. How many rows does a JOIN on id = cust_id produce, and where does that order go?'],
   do:['نوع JOIN را بین INNER، LEFT و RIGHT عوض کنید.','Switch the join type between INNER, LEFT and RIGHT.'],
   ctl:(st,A)=>[sel(t2('نوع','Type'),['INNER','LEFT','RIGHT'],st.jt,v=>{st.jt=v;A.upd()})]},
  explore:{claim:['ON فقط تعیین می‌کند کدام جفت‌ها بمانند؛ نوع JOIN تعیین می‌کند سطرهای بدون جفت چه شوند.','ON only decides which pairs survive; the join type decides what happens to rows with no pair.'],
   ask:['اگر به‌جای id = cust_id شرط city = ship_city را بگذاریم، چه جفت‌هایی روشن می‌شوند و چرا نتیجه بی‌معنا است؟','If we use city = ship_city instead of id = cust_id, which pairs light up, and why is the result meaningless?'],
   do:['ستون‌ها و عملگر را عوض کنید و الگوی ✔ها را ببینید.','Change the columns and the operator and watch the ✔ pattern.'],
   ctl:(st,A)=>[sel(t2('ستون چپ','Left column'),['id','city'],st.lc,v=>{st.lc=v;A.upd()}),sel(t2('عملگر','Operator'),['=','<>'],st.op,v=>{st.op=v;A.upd()}),sel(t2('ستون راست','Right column'),['cust_id','ship_city'],st.rc,v=>{st.rc=v;A.upd()}),sel(t2('نوع','Type'),['INNER','LEFT','RIGHT'],st.jt,v=>{st.jt=v;A.upd()})],
   see:['شرط‌های نامربوط (city = ship_city) جفت‌های بی‌معنا می‌سازند؛ شرط کلید خارجی (id = cust_id) هر سفارش را به صاحبش وصل می‌کند.','Unrelated conditions (city = ship_city) create meaningless pairs; the foreign-key condition (id = cust_id) attaches every order to its owner.']},
  name:{says:[['آنچه دیدید به جبر رابطه‌ای:','What you saw, in relational algebra:']],tex:['R\\bowtie_\\theta S=\\sigma_\\theta(R\\times S)','R\\ ⟕_\\theta\\ S=(R\\bowtie_\\theta S)\\ \\cup\\ \\{(r,\\text{NULL}) : r\\text{ unmatched}\\}'],
   legend:[['\\theta',['شرط ON (اینجا c.id = o.cust_id).','The ON condition (here c.id = o.cust_id).']],['R\\times S',['همه‌ی جفت‌ها: |R|·|S| سطر.','All pairs: |R|·|S| rows.']],['\\sigma_\\theta',['فقط جفت‌هایی را نگه می‌دارد که θ برقرار است.','Keeps only the pairs where θ holds.']]]},
  challenge:{ask:['گزارش می‌خواهد همه‌ی مشتری‌ها (حتی بدون سفارش) نمایش داده شوند و هیچ سفارشِ بی‌صاحب (مثل ۱۳) در آن نباشد. شرط و نوع JOIN را بسازید.','A report must show every customer (even those without orders) and must contain no orphan order (like 13). Build the condition and the join type.'],
   do:['از چهار انتخاب‌گر استفاده کنید؛ جدول خروجی و کد SQL زنده است.','Use the four selectors; the output table and the SQL are live.'],
   ctl:(st,A)=>[sel(t2('ستون چپ','Left column'),['id','city'],st.lc,v=>{st.lc=v;A.upd()}),sel(t2('عملگر','Operator'),['=','<>'],st.op,v=>{st.op=v;A.upd()}),sel(t2('ستون راست','Right column'),['cust_id','ship_city'],st.rc,v=>{st.rc=v;A.upd()}),sel(t2('نوع','Type'),['INNER','LEFT','RIGHT'],st.jt,v=>{st.jt=v;A.upd()})],
   ok:st=>{const r=b3run(st).rows;const names=new Set(r.filter(x=>x[0]).map(x=>x[0]));return names.size===3&&!r.some(x=>!x[0])&&!r.some(x=>x[2]===13)},
   hints:[['«همه‌ی مشتری‌ها» یعنی سطرهای چپِ بی‌جفت هم بمانند: کدام نوع JOIN این کار را می‌کند؟','"Every customer" means unmatched left rows must stay: which join type does that?'],['سفارش ۱۳ با هیچ مشتری‌ای جفت نمی‌شود؛ کدام نوع JOIN آن را نگه می‌دارد؟ (آن را نمی‌خواهیم.)','Order 13 pairs with no customer; which join type keeps it? (We do not want it.)'],['شرط باید کلید خارجی را به کلید اصلی وصل کند: id = cust_id.','The condition must join the foreign key to the primary key: id = cust_id.']],
   win:['LEFT JOIN روی id = cust_id: ۳ مشتری هر کدام حداقل یک‌بار ظاهر می‌شوند (Cy با NULL) و سفارش بی‌صاحب حذف می‌شود.','LEFT JOIN on id = cust_id: each of the 3 customers appears at least once (Cy with NULLs) and the orphan order is dropped.']}}});

/* B4 · Normalization */
LAB({id:'b4',mod:'B',g:'B4',lessons:['b4-1','b4-2'],
 t:['افزونگی و ناهنجاری به‌روزرسانی','Redundancy and update anomalies'],
 aha:['وقتی یک وابستگی تابعی در جدولی کلید نباشد، همان واقعیت چند بار ذخیره می‌شود؛ تجزیه‌ی بدون‌اتلاف آن را حذف می‌کند.','When a functional dependency does not come from a key, the same fact is stored many times; a lossless decomposition removes that.'],
 big:{had:['می‌دانیم کلید چیست و جدول چگونه یکتا می‌شود.','We know what a key is and how a table becomes unique.'],
  miss:['حتی با کلید درست، یک واقعیت (دفتر یک استاد) می‌تواند در چند سطر تکرار شود. این چه مشکلی می‌سازد؟','Even with a correct key, one fact (an instructor\'s office) can repeat across rows. What problem does that create?'],
  fix:['جدول را به چند رابطه تجزیه می‌کنید و ببینید کِی ناهنجاری و کِی از دست رفتن اطلاعات رخ می‌دهد.','You split the table into relations and see when anomalies or information loss appear.'],
  close:['هر وابستگی X→Y باید در رابطه‌اش X ابرکلید باشد (BCNF). تجزیه باید بدون‌اتلاف باشد: join دوباره همان جدول را بدهد. درس بعد این روند را به ۱NF تا BCNF رسمی می‌کند.','Every dependency X → Y must have X a superkey in its relation (BCNF), and the decomposition must be lossless: joining back gives the original. The lesson formalizes this as 1NF to BCNF.']},
 sol:{r:[['S','C'],['C','I'],['I','O']]},fail:{r:[['S','C','I','O'],[],[]]},
 st:()=>({r:[['S','C','I','O'],[],[]]}),
 stage(host,st,A){const ATT=['S','C','I','O'],NAME={S:'student',C:'course',I:'instructor',O:'office'};const FDS=[[['C'],['I']],[['I'],['O']]];
  const ROWS=[['Ana','DB','Lee','B12'],['Ben','DB','Lee','B12'],['Cy','AI','Kim','C07'],['Dee','AI','Kim','C07'],['Eli','OS','Lee','B12']];
  const clo=(X,rels)=>{const c=new Set(X);let ch=true;while(ch){ch=false;FDS.concat([[['S','C'],['I','O']]]).forEach(([l,r])=>{if(l.every(a=>c.has(a)))r.forEach(a=>{if(!c.has(a)){c.add(a);ch=true}})})}return c};
  A.ATT=ATT;A.NAME=NAME;
  A.bcnf=rel=>{if(!rel.length)return true;return FDS.concat([[['S','C'],['I','O']]]).every(([l,r])=>{if(!l.every(a=>rel.includes(a)))return true;const rr=r.filter(a=>rel.includes(a)&&!l.includes(a));if(!rr.length)return true;const c=clo(l);return rel.every(a=>c.has(a))})};
  A.lossless=rels=>{const R=rels.filter(x=>x.length);if(!R.length)return false;const T=R.map((rel,i)=>ATT.map((a,j)=>rel.includes(a)?'a'+j:'b'+i+j));let ch=true;while(ch){ch=false;FDS.concat([[['S','C'],['I','O']]]).forEach(([l,r])=>{const li=l.map(a=>ATT.indexOf(a)),ri=r.map(a=>ATT.indexOf(a));for(let x=0;x<T.length;x++)for(let y=x+1;y<T.length;y++)if(li.every(k=>T[x][k]===T[y][k]))ri.forEach(k=>{if(T[x][k]!==T[y][k]){const keep=T[x][k].startsWith('a')?T[x][k]:T[y][k],drop=T[x][k]===keep?T[y][k]:T[x][k];T.forEach(row=>row.forEach((v,q)=>{if(v===drop)row[q]=keep}));ch=true}})})}return T.some(row=>row.every((v,j)=>v==='a'+j))};
  A.cover=rels=>ATT.every(a=>rels.some(r=>r.includes(a)));
  A.updRows=rels=>{let n=0;rels.forEach(rel=>{if(rel.includes('O')){const seen=new Set();ROWS.forEach(r=>{if(r[2]==='Lee'){seen.add(rel.map(a=>r[ATT.indexOf(a)]).join('|'))}});n+=seen.size}});return n};
  return()=>{host.innerHTML='';const rels=st.r.filter(x=>x.length);const grid=h('div',{class:'grid g2'});
   rels.forEach((rel,i)=>{const seen=new Set(),rows=[];ROWS.forEach(r=>{const t=rel.map(a=>r[ATT.indexOf(a)]);const k=t.join('|');if(!seen.has(k)){seen.add(k);rows.push(t)}});grid.append(h('div',{},h('div',{class:'wn',style:{margin:0}},'R'+(i+1)+'('+rel.map(a=>NAME[a]).join(', ')+') '+(A.bcnf(rel)?'✔ BCNF':'✘ not BCNF')),DBTAB(rel.map(a=>NAME[a]),rows,{hl:ri=>rel.includes('O')&&rows[ri][rel.indexOf('O')]==='B12'})))});
   host.append(grid);const ok=A.cover(st.r)&&A.lossless(st.r)&&st.r.every(A.bcnf);
   host.append(h('div',{class:'stat'},h('span',{},t2('همه‌ی ویژگی‌ها پوشش‌یافته: ','All attributes covered: '),h('b',{},A.cover(st.r)?'✔':'✘')),h('span',{},t2('تجزیه‌ی بدون‌اتلاف (chase): ','Lossless decomposition (chase): '),h('b',{},A.lossless(st.r)?'✔':'✘')),h('span',{},t2('هر رابطه BCNF: ','Every relation BCNF: '),h('b',{},st.r.every(A.bcnf)?'✔':'✘')),h('span',{},t2('سطرهای لازم برای عوض‌کردن دفتر Lee: ','Rows to edit if Lee moves office: '),h('b',{},A.updRows(rels)))),
    h('div',{class:'wn'},t2('وابستگی‌ها: course → instructor، instructor → office. کلید: (student, course). سطرهای هم‌رنگ دفتر B12 هستند.','Dependencies: course → instructor, instructor → office. Key: (student, course). Highlighted rows hold office B12.')))}},
 screens:{
  puzzle:{ask:['دفتر استاد Lee در ۳ سطر تکرار شده. اگر او دفترش را عوض کند چند سطر باید دقیقاً یکسان به‌روز شوند؟ اگر یکی فراموش شود چه می‌شود؟','Lee\'s office is repeated in 3 rows. If Lee moves, how many rows must change in exactly the same way? What if one is forgotten?'],
   do:['شمارنده‌ی «سطرهای لازم» را ببینید، بعد در بخش بعد جدول را تجزیه کنید.','Read the "rows to edit" counter; in the next screen you split the table.'],ctl:()=>[]},
  explore:{claim:['اگر هر واقعیت فقط یک‌بار ذخیره شود، به‌روزرسانی تنها یک سطر را عوض می‌کند، به‌شرط آنکه تجزیه اطلاعات را از بین نبرد.','If every fact is stored once, an update changes a single row, provided the decomposition does not lose information.'],
   ask:['کدام ویژگی‌ها را در کدام رابطه بگذاریم تا دفتر فقط یک‌بار بیاید و join همان جدول اصلی را بدهد؟','Which attributes go into which relation so the office appears once and a join still gives the original table?'],
   do:['ویژگی‌ها را در سه رابطه‌ی R1 تا R3 روشن/خاموش کنید.','Toggle attributes in the three relations R1 to R3.'],
   ctl:(st,A)=>st.r.map((rel,i)=>h('span',{class:'ctl'},h('b',{},'R'+(i+1)),A.ATT.map(a=>btn(a,e=>{const k=st.r[i].indexOf(a);k<0?st.r[i].push(a):st.r[i].splice(k,1);st.r[i].sort((x,y)=>A.ATT.indexOf(x)-A.ATT.indexOf(y));A.upd();e.target.classList.toggle('on',st.r[i].includes(a))},rel.includes(a)?'on':'')))),
   see:['{S,C}، {C,I}، {I,O} هر واقعیت را یک‌بار نگه می‌دارد. {S,C,I}+{I,O} هم بدون‌اتلاف است ولی C→I هنوز تکرار می‌شود. {S,I}+{C,O} اتلاف دارد.','{S,C}, {C,I}, {I,O} stores each fact once. {S,C,I}+{I,O} is lossless but still repeats C → I. {S,I}+{C,O} loses information.']},
  name:{says:[['شرط بدون‌اتلاف بودن و شکل نرمال به زبان وابستگی:','The conditions for losslessness and the normal form, in terms of dependencies:']],
   tex:['R=R_1\\bowtie R_2\\ \\text{lossless}\\iff (R_1\\cap R_2)\\to R_1\\ \\text{or}\\ (R_1\\cap R_2)\\to R_2','\\text{BCNF: for every } X\\to Y \\text{ in } R,\\ X \\text{ is a superkey of } R'],
   legend:[['R_1\\cap R_2',['ویژگی‌های مشترک؛ باید یکی از دو طرف را تعیین کنند تا join سطر اضافه نسازد.','The shared attributes; they must determine one side so the join creates no extra rows.']],['X\\to Y',['وابستگی تابعی: X مقدار Y را مشخص می‌کند.','Functional dependency: X determines Y.']]]},
  challenge:{ask:['ویژگی‌های S, C, I, O را در سه رابطه بگذارید طوری که همه پوشش داده شوند، تجزیه بدون‌اتلاف باشد و هر رابطه BCNF باشد.','Place S, C, I, O into three relations so that all attributes are covered, the decomposition is lossless and every relation is in BCNF.'],
   do:['نشانگرهای ✔/✘ زیر جدول‌ها هر سه شرط را نشان می‌دهند.','The ✔/✘ markers under the tables show all three conditions.'],
   ctl:(st,A)=>{st.r=[['S','C','I','O'],[],[]];return st.r.map((rel,i)=>h('span',{class:'ctl'},h('b',{},'R'+(i+1)),A.ATT.map(a=>btn(a,e=>{const k=st.r[i].indexOf(a);k<0?st.r[i].push(a):st.r[i].splice(k,1);st.r[i].sort((x,y)=>A.ATT.indexOf(x)-A.ATT.indexOf(y));A.upd();e.target.classList.toggle('on',st.r[i].includes(a))},rel.includes(a)?'on':''))))},
   ok:st=>{if(!window._lab||!window._lab.A)return false;const A=window._lab.A;return A.cover(st.r)&&A.lossless(st.r)&&st.r.every(A.bcnf)},
   hints:[['هر وابستگی را یک رابطه‌ی جدا بدهید: C→I و I→O.','Give each dependency its own relation: C → I and I → O.'],['برای حفظ ارتباط student با course یک رابطه‌ی سوم لازم است.','A third relation is needed to keep the student–course link.'],['ویژگی مشترک بین هر دو رابطه باید کلید یکی از آن‌ها باشد.','The attribute shared by two relations must be a key of one of them.']],
   win:['{student,course}، {course,instructor}، {instructor,office}: هر واقعیت یک‌بار ذخیره می‌شود، join همان جدول اصلی را می‌دهد و دفتر Lee با به‌روزرسانی یک سطر عوض می‌شود.','{student, course}, {course, instructor}, {instructor, office}: every fact is stored once, the join returns the original table, and Lee\'s office changes with a single-row update.']}}});

/* B5 · Fan-out */
LAB({id:'b5',mod:'B',g:'B5',lessons:['b5-1','b5-2'],
 t:['فن‌اوت درخت را کم‌ارتفاع می‌کند','Fan-out keeps the tree shallow'],
 aha:['هر گره‌ی B+Tree یک صفحه‌ی دیسک است و صدها کلید دارد؛ پس حتی برای میلیاردها سطر ارتفاع ۳ یا ۴ کافی است.','Each B+Tree node is a disk page holding hundreds of keys, so even billions of rows need a height of only 3 or 4.'],
 big:{had:['می‌دانیم درخت دودویی متوازن برای n کلید ارتفاع log₂ n دارد.','We know a balanced binary tree over n keys has height log₂ n.'],
  miss:['روی دیسک هر مقایسه یک خواندن صفحه است. log₂ n برای میلیاردها کلید حدود ۳۰ خواندن است؛ چگونه آن را کم کنیم؟','On disk each step is a page read. log₂ n is about 30 reads for billions of keys; how do we cut that?'],
  fix:['نشان می‌دهد با پرکردن هر گره تا حد صفحه (فن‌اوت f) ارتفاع به log_f n کم می‌شود.','Shows that filling each node to page size (fan-out f) cuts the height to log_f n.'],
  close:['ارتفاع = ⌈log_f N⌉ و f ≈ اندازه‌ی صفحه ÷ (کلید + اشاره‌گر). کلید کوچک‌تر یعنی f بزرگ‌تر و درخت کم‌ارتفاع‌تر. درس‌های بعد (ایندکس‌ها در عمل) از همین حساب استفاده می‌کنند.','Height = ⌈log_f N⌉ with f ≈ page size ÷ (key + pointer). Smaller keys mean bigger f and a shallower tree. The index-in-practice lessons use this arithmetic.']},
 sol:{page:16384,key:8,N:1e8},fail:{page:8192,key:36,N:1e8},
 st:()=>({page:8192,key:8,N:1e8,cap:false}),
 stage(host,st,A){A.f=()=>Math.max(2,Math.floor(st.page/(st.key+8)));A.h=()=>Math.ceil(Math.log(st.N)/Math.log(A.f()));
  return()=>{host.innerHTML='';const f=A.f(),H=A.h(),W=560,Ht=210,svg=sv('svg',{viewBox:`0 0 ${W} ${Ht}`,class:'sv'});const lv=[];let n=1;for(let i=0;i<Math.max(H,1);i++){lv.push(n);n*=f}
   lv.forEach((c,i)=>{const w=Math.min(W-60,Math.max(14,Math.log10(c+1)/Math.log10(st.N*1.01)*(W-60))),y=22+i*42;svg.append(sv('rect',{x:30,y,width:w,height:26,fill:i===H-1?'var(--ac2)':'var(--ac)',opacity:.85,rx:4}),sv('text',{x:34,y:y+17,'font-size':11,fill:'#fff'},(i===0?t2('ریشه: ','root: '):t2('سطح ','level ')+i+': ')+kfmt(c)+t2(' صفحه',' pages')))});
   svg.append(sv('text',{x:W/2,y:Ht-6,'text-anchor':'middle',class:'mut'},t2('پهنای هر نوار ∝ log تعداد صفحه‌های آن سطح','bar width ∝ log of the pages on that level')));
   host.append(svg,h('div',{class:'stat'},h('span',{},t2('اندازه‌ی صفحه: ','Page size: '),h('b',{},st.page/1024+' KB')),h('span',{},t2('کلید + اشاره‌گر: ','Key + pointer: '),h('b',{},st.key+' + 8 B')),h('span',{},t2('فن‌اوت f = ','Fan-out f = '),h('b',{},f)),h('span',{},'N = ',h('b',{},kfmt(st.N))),h('span',{},t2('ارتفاع = خواندن صفحه: ','Height = page reads: '),h('b',{},H))),h('div',{class:'wn'},t2('اشاره‌گر ۸ بایت فرض شده؛ وقتی ارتفاع به‌اندازه‌ی f^h ≥ N برسد، همه‌ی برگ‌ها پوشش داده می‌شوند.','Pointers are assumed to be 8 bytes; the tree is tall enough once f^h ≥ N.')))}},
 screens:{
  puzzle:{ask:['۱۰۰ میلیون سطر داریم. با صفحه‌ی ۸ کیلوبایتی و کلید ۸ بایتی، یک جست‌وجو چند صفحه می‌خواند؟ (درخت دودویی حدود ۲۷ می‌خواند.)','We have 100 million rows. With 8 KB pages and 8-byte keys, how many pages does one lookup read? (A binary tree would read about 27.)'],
   do:['اندازه‌ی کلید را عوض کنید و ارتفاع را ببینید.','Change the key size and watch the height.'],
   ctl:(st,A)=>[rng(t2('اندازه‌ی کلید (بایت)','Key size (bytes)'),4,64,1,st.key,v=>{st.key=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['ارتفاع با تعداد سطرها لگاریتمی و با فن‌اوت بسیار کند رشد می‌کند.','Height grows logarithmically with the row count, and very slowly because of the fan-out.'],
   ask:['اگر سطرها هزار برابر شوند، ارتفاع چقدر زیاد می‌شود؟ کلید ۳۶ بایتی (UUID متنی) چه می‌کند؟','If the row count grows a thousandfold, how much does the height grow? What does a 36-byte (text UUID) key do?'],
   do:['N، اندازه‌ی صفحه و کلید را تغییر دهید.','Change N, the page size and the key size.'],
   ctl:(st,A)=>[rng(t2('log₁₀ N','log₁₀ N'),4,10,0.1,Math.log10(st.N),v=>{st.N=Math.round(Math.pow(10,v));A.upd()},v=>fmt(v,1)),sel(t2('اندازه‌ی صفحه','Page size'),[{v:4096,t:'4 KB'},{v:8192,t:'8 KB'},{v:16384,t:'16 KB'},{v:32768,t:'32 KB'},{v:65536,t:'64 KB'}],st.page,v=>{st.page=+v;A.upd()}),rng(t2('اندازه‌ی کلید (بایت)','Key size (bytes)'),4,64,1,st.key,v=>{st.key=v;A.upd()},v=>String(Math.round(v)))],
   see:['۱٬۰۰۰ برابر شدن N فقط یک سطح اضافه می‌کند (با f≈۵۰۰). کلید ۳۶ بایتی f را از ۵۱۲ به حدود ۱۸۶ می‌رساند و یک سطح اضافه می‌کند.','A thousandfold more rows adds only one level (with f ≈ 500). A 36-byte key drops f from 512 to about 186 and adds a level.']},
  name:{says:[['آنچه دیدید:','What you saw:']],tex:['f\\approx\\left\\lfloor\\frac{P}{k+p}\\right\\rfloor,\\qquad h=\\lceil\\log_f N\\rceil'],
   legend:[['P',['اندازه‌ی صفحه (بایت).','Page size (bytes).']],['k,p',['اندازه‌ی کلید و اشاره‌گر.','Key and pointer sizes.']],['f',['فن‌اوت: تعداد فرزند هر گره.','Fan-out: the number of children per node.']],['h',['ارتفاع = تعداد خواندن صفحه برای یک جست‌وجو.','Height = page reads for one lookup.']]]},
  challenge:{ask:['برای N=۱۰⁸ سطر جست‌وجو باید حداکثر ۳ صفحه بخواند. اندازه‌ی صفحه تا ۱۶ KB مجاز است. اندازه‌ی صفحه و کلید را انتخاب کنید.','For N = 10⁸ rows a lookup must read at most 3 pages. Pages up to 16 KB are allowed. Choose the page size and the key size.'],
   do:['ارتفاع باید ≤ ۳ شود؛ نوار پایین ارتفاع را نشان می‌دهد.','The height must be ≤ 3; the stats line shows it.'],
   ctl:(st,A)=>{st.N=1e8;st.page=8192;st.key=36;return[sel(t2('اندازه‌ی صفحه','Page size'),[{v:4096,t:'4 KB'},{v:8192,t:'8 KB'},{v:16384,t:'16 KB'}],st.page,v=>{st.page=+v;A.upd()}),rng(t2('اندازه‌ی کلید (بایت)','Key size (bytes)'),4,64,1,st.key,v=>{st.key=v;A.upd()},v=>String(Math.round(v)))]},
   ok:st=>st.N===1e8&&st.page<=16384&&Math.ceil(Math.log(st.N)/Math.log(Math.max(2,Math.floor(st.page/(st.key+8)))))<=3,
   hints:[['f³ باید دست‌کم ۱۰⁸ شود، یعنی f ≥ حدود ۴۶۵.','f³ must reach at least 10⁸, i.e. f ≥ about 465.'],['f = صفحه ÷ (کلید + ۸). برای صفحه‌ی ۸ KB کلید چقدر باید کوچک باشد؟','f = page ÷ (key + 8). For an 8 KB page how small must the key be?'],['یا صفحه را بزرگ‌تر کنید یا کلید را کوچک؛ هر دو را هم می‌توانید.','Either enlarge the page or shrink the key; you can do both.']],
   win:['f ≥ ۴۶۵ با ارتفاع ۳. به همین دلیل کلید عددی ۸ بایتی بهتر از UUID متنی است و چرا صفحه‌ها ۸ تا ۱۶ KB هستند.','f ≥ 465 gives height 3. That is why an 8-byte integer key beats a text UUID, and why pages are 8 to 16 KB.']}}});

/* B6 · Isolation levels */
const ISO=['READ UNCOMMITTED','READ COMMITTED','REPEATABLE READ','SERIALIZABLE'];
const ISOSCH={dirty:{need:1,t:['خواندن کثیف','Dirty read'],ev:[['T2','UPDATE x=200  (not committed)','W x=200'],['T1','SELECT x','R x'],['T2','ROLLBACK','abort']]},
 nonrep:{need:2,t:['خواندن غیرقابل‌تکرار','Non-repeatable read'],ev:[['T1','SELECT x','R x'],['T2','UPDATE x=200; COMMIT','W x, commit'],['T1','SELECT x again','R x again']]},
 phantom:{need:3,t:['سطر شبح','Phantom read'],ev:[['T1','SELECT COUNT(*) WHERE dept=1','COUNT'],['T2','INSERT row dept=1; COMMIT','INSERT, commit'],['T1','SELECT COUNT(*) again','COUNT again']]}};
function isoSee(sch,lvl){ // what T1 sees: [first, second, anomaly?]
 if(sch==='dirty')return lvl===0?{v:[200],bad:true}:{v:[100],bad:false};
 if(sch==='nonrep')return lvl<=1?{v:[100,200],bad:true}:{v:[100,100],bad:false};
 return lvl<=2?{v:[3,4],bad:true}:{v:[3,3],bad:false}}
LAB({id:'b6',mod:'B',g:'B6',lessons:['b6-1','b6-2'],
 t:['سطح انزوا: چه ناهنجاری‌ای را می‌پذیریم؟','Isolation: which anomaly do we accept?'],
 aha:['هر سطح انزوا مجموعه‌ای از ناهنجاری‌ها را حذف می‌کند و هرچه قوی‌تر باشد، همروندی کمتر می‌شود؛ پس ضعیف‌ترین سطحِ کافی را انتخاب می‌کنیم.','Each isolation level removes a set of anomalies and the stronger it is, the less concurrency you get; so we pick the weakest level that is enough.'],
 big:{had:['تراکنش یک واحد اتمی است و ACID قول می‌دهد نتیجه درست بماند.','A transaction is an atomic unit and ACID promises a correct outcome.'],
  miss:['وقتی دو تراکنش هم‌زمان اجرا می‌شوند، T1 چه چیزی از کارهای T2 می‌بیند؟','When two transactions run at the same time, what does T1 see of T2\'s work?'],
  fix:['سه زمان‌بندی کلاسیک را روی چهار سطح انزوا اجرا می‌کند و آنچه T1 می‌بیند را نشان می‌دهد.','Runs three classic schedules over four isolation levels and shows what T1 sees.'],
  close:['خواندن کثیف با READ COMMITTED، خواندن غیرقابل‌تکرار با REPEATABLE READ و شبح با SERIALIZABLE بسته می‌شود (طبق استاندارد؛ پیاده‌سازی‌ها فرق دارند، مثلاً PostgreSQL در REPEATABLE READ شبح ندارد). درس بعد نشان می‌دهد چگونه با قفل و MVCC پیاده می‌شود.','Dirty reads are closed by READ COMMITTED, non-repeatable reads by REPEATABLE READ, phantoms by SERIALIZABLE (per the standard; implementations differ, e.g. PostgreSQL has no phantoms at REPEATABLE READ). The next lesson shows how locks and MVCC implement it.']},
 sol:{pick:[1,2,3]},fail:{pick:[0,0,0]},
 st:()=>({sch:'nonrep',lvl:1,pick:[0,0,0]}),
 stage(host,st,A){A.keys=Object.keys(ISOSCH);
  const lane=(svg,sch,lvl,x0,w,y0,title)=>{const S=ISOSCH[sch],see=isoSee(sch,lvl);svg.append(sv('text',{x:x0+w/2,y:y0,'text-anchor':'middle','font-size':11,'font-weight':700},title));
   S.ev.forEach((e,i)=>{const y=y0+14+i*30,isT1=e[0]==='T1';svg.append(sv('rect',{x:x0+(isT1?4:w/2),y,width:w/2-8,height:24,rx:5,fill:isT1?'var(--ac)':'var(--ac2)',opacity:.85}),sv('text',{x:x0+(isT1?10:w/2+6),y:y+16,'font-size':w>300?10:8.5,fill:'#fff'},e[0]+': '+(w>300?e[1]:e[2])))});
   const yy=y0+14+S.ev.length*30+6;svg.append(sv('text',{x:x0+8,y:yy+10,'font-size':11,fill:see.bad?'var(--bad)':'var(--ok)'},(see.bad?'✘ ':'✔ ')+t2('T1 می‌بیند: ','T1 sees: ')+see.v.join(' → ')+(see.bad?t2('  (ناهنجاری)','  (anomaly)'):'')));return see};
  return k=>{host.innerHTML='';const W=560;if(k==='challenge'){const svg=sv('svg',{viewBox:`0 0 ${W} 230`,class:'sv'});A.keys.forEach((s,i)=>lane(svg,s,st.pick[i],i*(W/3),W/3,16,t2('نیاز ','Need ')+'ABC'[i]+': '+lt(ISOSCH[s].t)));host.append(svg);
    host.append(h('div',{class:'stat'},A.keys.map((s,i)=>h('span',{},'ABC'[i]+': ',h('b',{},ISO[st.pick[i]]+(isoSee(s,st.pick[i]).bad?' ✘':st.pick[i]>ISOSCH[s].need?' ⚠ '+t2('بیش از نیاز','stronger than needed'):' ✔')))) ))}
   else{const svg=sv('svg',{viewBox:`0 0 ${W} 150`,class:'sv'});lane(svg,st.sch,st.lvl,0,W,16,lt(ISOSCH[st.sch].t)+' · '+ISO[st.lvl]);host.append(svg);
    const tb=h('table',{class:'dt'});tb.append(h('tr',{},h('th',{},''),ISO.map(x=>h('th',{},x))));A.keys.forEach(s=>tb.append(h('tr',{},h('td',{style:{fontWeight:700}},lt(ISOSCH[s].t)),ISO.map((_,l)=>h('td',{style:{textAlign:'center',background:s===st.sch&&l===st.lvl?'var(--panel2)':''}},isoSee(s,l).bad?'✘':'✔')))));host.append(h('div',{class:'tw'},tb),h('div',{class:'wn'},t2('✘ = ناهنجاری رخ می‌دهد · ✔ = جلوگیری می‌شود (مدل استاندارد SQL).','✘ = the anomaly occurs · ✔ = prevented (SQL-standard model).')))}}},
 screens:{
  puzzle:{ask:['T2 مقدار x را از ۱۰۰ به ۲۰۰ می‌برد و هنوز commit نکرده. T1 هم‌زمان x را می‌خواند. چه عددی باید ببیند؟','T2 changes x from 100 to 200 and has not committed. T1 reads x at the same time. What number should it see?'],
   do:['سطح انزوا را روی «خواندن کثیف» عوض کنید.','Switch the isolation level with the dirty-read schedule selected.'],
   ctl:(st,A)=>{st.sch='dirty';return[sel(t2('سطح','Level'),ISO.map((x,i)=>({v:i,t:x})),st.lvl,v=>{st.lvl=+v;A.upd()})]}},
  explore:{claim:['هر زمان‌بندی را فقط یک سطح به‌اندازه‌ی کافی قوی ایمن می‌کند؛ سطح‌های قوی‌تر بی‌دلیل همروندی را کم می‌کنند.','Each schedule needs a minimum level; stronger levels only cost concurrency.'],
   ask:['برای هر سه زمان‌بندی، ضعیف‌ترین سطحی که ✔ می‌دهد کدام است؟','For each of the three schedules, which is the weakest level that shows ✔?'],
   do:['زمان‌بندی و سطح را در جدول بررسی کنید.','Step through schedule and level and read the table.'],
   ctl:(st,A)=>[sel(t2('زمان‌بندی','Schedule'),A.keys.map(k=>({v:k,t:lt(ISOSCH[k].t)})),st.sch,v=>{st.sch=v;A.upd()}),sel(t2('سطح','Level'),ISO.map((x,i)=>({v:i,t:x})),st.lvl,v=>{st.lvl=+v;A.upd()})],
   see:['کثیف → RC، غیرقابل‌تکرار → RR، شبح → SERIALIZABLE. هر سطح ناهنجاری‌های سطح پایین‌تر را هم می‌بندد.','dirty → RC, non-repeatable → RR, phantom → SERIALIZABLE. Each level also prevents the anomalies of the levels below it.']},
  name:{says:[['به زبان استاندارد SQL:','In SQL-standard terms:']],tex:['\\text{RU}\\ \\subset\\ \\text{RC}\\ \\subset\\ \\text{RR}\\ \\subset\\ \\text{SER}\\quad(\\text{more anomalies prevented, less concurrency})'],
   legend:[['\\text{RC}',['READ COMMITTED: فقط داده‌ی commit‌شده خوانده می‌شود.','READ COMMITTED: only committed data is read.']],['\\text{RR}',['REPEATABLE READ: خواندن دوباره همان سطرها همان مقدار را می‌دهد.','REPEATABLE READ: re-reading the same rows gives the same values.']],['\\text{SER}',['SERIALIZABLE: نتیجه مثل اجرای پشت‌سرهم است.','SERIALIZABLE: the outcome equals some serial order.']]]},
  challenge:{ask:['برای سه نیاز A (جلوگیری از خواندن کثیف)، B (خواندن غیرقابل‌تکرار) و C (سطر شبح) ضعیف‌ترین سطح کافی را انتخاب کنید.','For the three needs A (no dirty reads), B (no non-repeatable reads) and C (no phantoms) choose the weakest level that is enough.'],
   do:['✘ یعنی ناهنجاری هنوز هست؛ ⚠ یعنی سطح قوی‌تر از نیاز است.','✘ means the anomaly still occurs; ⚠ means the level is stronger than needed.'],
   ctl:(st,A)=>A.keys.map((s,i)=>sel(t2('نیاز ','Need ')+'ABC'[i],ISO.map((x,l)=>({v:l,t:x})),st.pick[i],v=>{st.pick[i]=+v;A.upd()})),
   ok:st=>Object.keys(ISOSCH).every((s,i)=>st.pick[i]===ISOSCH[s].need),
   hints:[['ابتدا مطمئن شوید هیچ ✘ ای نمانده است.','First make sure no ✘ remains.'],['سپس هر ⚠ را یک پله پایین ببرید.','Then lower every ⚠ by one step.'],['سه پاسخ از ضعیف تا قوی به ترتیب فاصله‌ی یک پله دارند.','The three answers are one step apart, from weak to strong.']],
   win:['ضعیف‌ترین سطح کافی برای هر نیاز انتخاب شد: RC، RR و SERIALIZABLE. در واقعیت قفل‌ها/MVCC و ریسک بن‌بست هزینه‌ی سطوح قوی‌تر را می‌سازند.','The weakest sufficient level was chosen for each need: RC, RR and SERIALIZABLE. In reality locks/MVCC and deadlock risk make stronger levels cost more.']}}});

/* B7 · Sharding and consistent hashing */
function mix32(x){x>>>=0;x^=x>>>16;x=Math.imul(x,0x7feb352d)>>>0;x^=x>>>15;x=Math.imul(x,0x846ca68b)>>>0;x^=x>>>16;return x>>>0}
LAB({id:'b7',mod:'B',g:'B7',lessons:['b7-1'],
 t:['افزودن گره: چقدر داده جابه‌جا می‌شود؟','Adding a node: how much data moves?'],
 aha:['با k mod N تقریباً همه‌ی کلیدها هنگام افزودن یک سرور جابه‌جا می‌شوند، ولی با هش سازگار (ring) فقط حدود ۱/(N+1).','With k mod N almost every key moves when a server is added; with consistent hashing only about 1/(N+1) does.'],
 big:{had:['می‌دانیم برای مقیاس‌پذیری داده را بین چند سرور تقسیم (shard) می‌کنیم.','We know we split (shard) data over several servers to scale.'],
  miss:['وقتی سروری اضافه می‌شود، چه کسری از داده باید منتقل شود؟ آیا این هزینه قابل تحمل است؟','When a server is added, what fraction of data must move? Can we afford it?'],
  fix:['دو روش شارد را کنار هم می‌گذارد و کلیدهای جابه‌جا‌شده را علامت می‌زند.','Puts two sharding methods side by side and marks the keys that move.'],
  close:['mod N: کسر جابه‌جایی ≈ N/(N+1)؛ ring: ≈ 1/(N+1). به همین دلیل سیستم‌های توزیع‌شده (Dynamo، Cassandra) هش سازگار را به‌کار می‌برند. درس بعد درباره‌ی بازگشت از خرابی است.','mod N: moved fraction ≈ N/(N+1); ring: ≈ 1/(N+1). That is why distributed systems (Dynamo, Cassandra) use consistent hashing. The next lessons cover recovery from failures.']},
 sol:{N:15},fail:{N:4},
 st:()=>({N:4,K:120}),
 stage(host,st,A){const keys=K=>Array.from({length:K},(_,i)=>mix32(i*2654435761+12345));
  const pts=n=>{const p=[];for(let s=0;s<n;s++)for(let j=0;j<8;j++)p.push([mix32(s*1000+j+7919),s]);return p.sort((a,b)=>a[0]-b[0])};
  const own=(p,k)=>{let lo=0,hi=p.length;while(lo<hi){const m=(lo+hi)>>1;if(p[m][0]<k)lo=m+1;else hi=m}return p[lo%p.length][1]};
  A.exp=N=>({mod:N/(N+1),ring:1/(N+1)});
  A.measure=()=>{const ks=keys(st.K),a=pts(st.N),b=pts(st.N+1);let m1=0,m2=0;ks.forEach(k=>{if(k%st.N!==k%(st.N+1))m1++;if(own(a,k)!==own(b,k))m2++});return{mod:m1/st.K,ring:m2/st.K,ks,a,b}};
  return()=>{host.innerHTML='';const m=A.measure(),e=A.exp(st.N),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 250`,class:'sv'}),cx=140,cy=120,r=95;svg.append(sv('circle',{cx,cy,r,fill:'none',stroke:'var(--bd)','stroke-width':2}));
   const ang=k=>k/4294967296*2*Math.PI-Math.PI/2,P=(k,rr)=>[cx+rr*Math.cos(ang(k)),cy+rr*Math.sin(ang(k))];const SHAPES='●■▲◆★✚◐◑'.split('');
   m.b.forEach(([k,s])=>{const[x,y]=P(k,r);svg.append(sv('circle',{cx:x,cy:y,r:s===st.N?6:4,fill:s===st.N?'var(--hl)':'var(--ac2)',stroke:'var(--fg)','stroke-width':s===st.N?2:0}))});
   m.ks.forEach(k=>{const[x,y]=P(k,r-14),mv=own(m.a,k)!==own(m.b,k);svg.append(sv('circle',{cx:x,cy:y,r:mv?3.2:1.8,fill:mv?'var(--bad)':'var(--mut)'}))});
   svg.append(sv('text',{x:cx,y:cy+4,'text-anchor':'middle','font-size':11,class:'mut'},t2('حلقه‌ی هش','hash ring')),sv('text',{x:cx,y:244,'text-anchor':'middle','font-size':9,class:'mut'},t2('نقطه‌ی بزرگ = گره · نقطه‌ی قرمز = کلید جابه‌جا‌شده','large dot = node · red dot = key that moved')));
   [['mod N',m.mod,e.mod,'var(--bad)'],['ring',m.ring,e.ring,'var(--ok)']].forEach(([l,v,ex,col],i)=>{const x=300+i*125,bh=v*190;svg.append(sv('rect',{x,y:215-bh,width:90,height:bh,fill:col,opacity:.85}),sv('text',{x:x+45,y:215-bh-5,'text-anchor':'middle','font-size':12,'font-weight':700},Math.round(v*100)+(LANG==='en'?'%':'٪')),sv('text',{x:x+45,y:231,'text-anchor':'middle','font-size':11},l),sv('text',{x:x+45,y:244,'text-anchor':'middle','font-size':9,class:'mut'},t2('انتظار ','expected ')+Math.round(ex*100)+(LANG==='en'?'%':'٪')))});
   host.append(svg,h('div',{class:'stat'},h('span',{},'N = ',h('b',{},st.N),' → ',h('b',{},st.N+1)),h('span',{},t2('کلیدها: ','Keys: '),h('b',{},st.K)),h('span',{},t2('جابه‌جایی mod N: ','mod N moved: '),h('b',{},Math.round(m.mod*100)+'%')),h('span',{},t2('جابه‌جایی ring: ','ring moved: '),h('b',{},Math.round(m.ring*100)+'%'))),h('div',{class:'wn'},t2('هر سرور ۸ گره‌ی مجازی روی حلقه دارد. مقدار «انتظار» فرمول نظری است؛ ستون‌ها با شبیه‌سازی ۱۲۰ کلید به‌دست می‌آیند و نوسان دارند.','Each server has 8 virtual nodes on the ring. "Expected" is the theoretical formula; the bars come from simulating 120 keys and are noisy.')))}},
 screens:{
  puzzle:{ask:['۴ سرور داریم و کلید k را روی سرور k mod 4 می‌گذاریم. سرور پنجم اضافه می‌شود (k mod 5). چه کسری از کلیدها سرورشان را عوض می‌کند؟','We have 4 servers and place key k on server k mod 4. A fifth server arrives (k mod 5). What fraction of keys change servers?'],
   do:['ستون قرمز (mod N) را با ستون سبز (ring) مقایسه کنید.','Compare the red bar (mod N) with the green bar (ring).'],ctl:(st,A)=>[rng('N',2,30,1,st.N,v=>{st.N=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['کسر جابه‌جایی mod N به ۱ نزدیک است و با ring حدود ۱/(N+1) می‌شود.','The mod N moved fraction is close to 1; with the ring it is about 1/(N+1).'],
   ask:['وقتی N بزرگ‌تر می‌شود هر دو ستون چه می‌کنند؟ چرا ring مقیاس‌پذیرتر است؟','What do both bars do as N grows? Why does the ring scale better?'],
   do:['N را از ۲ تا ۳۰ ببرید و نقاط قرمز روی حلقه را ببینید.','Sweep N from 2 to 30 and watch the red dots on the ring.'],
   ctl:(st,A)=>[rng('N',2,30,1,st.N,v=>{st.N=v;A.upd()},v=>String(Math.round(v))),rng(t2('تعداد کلید','Keys'),60,200,10,st.K,v=>{st.K=v;A.upd()},v=>String(Math.round(v)))],
   see:['mod N همیشه حدود N/(N+1) را جابه‌جا می‌کند (برای N=۱۰ حدود ۹۱٪). ring فقط حدود ۱/(N+1) را جابه‌جا می‌کند (حدود ۹٪) و فقط به گره‌ی تازه می‌ریزد.','mod N always moves about N/(N+1) (about 91% for N = 10). The ring moves only about 1/(N+1) (about 9%), and only onto the new node.']},
  name:{says:[['هش سازگار هر کلید را به اولین گره‌ی ساعت‌گرد از جایگاهش روی حلقه می‌دهد؛ گره‌ی تازه فقط بخشی از یک بازه را می‌گیرد.','Consistent hashing gives each key to the first node clockwise from its position on the ring; a new node only takes over part of one range.']],
   tex:['\\mathbb{E}[\\text{moved}]_{\\bmod}=\\frac{N}{N+1},\\qquad \\mathbb{E}[\\text{moved}]_{\\text{ring}}=\\frac{1}{N+1}'],
   legend:[['N',['تعداد سرورهای فعلی.','The current number of servers.']],['\\tfrac{1}{N+1}',['سهم گره‌ی تازه از کل داده — کمترین جابه‌جایی ممکن.','The new node\'s share of all data: the minimum possible movement.']]]},
  challenge:{ask:['N را طوری انتخاب کنید که با افزودن یک سرور، ring حدود ۵٪ تا ۸٪ از کلیدها را جابه‌جا کند، در حالی که mod N بیش از ۹۰٪ را جابه‌جا می‌کند.','Choose N so that adding one server makes the ring move about 5% to 8% of the keys while mod N moves more than 90%.'],
   do:['از مقدار «انتظار» زیر ستون‌ها استفاده کنید.','Use the "expected" values under the bars.'],ctl:(st,A)=>[rng('N',2,30,1,st.N,v=>{st.N=v;A.upd()},v=>String(Math.round(v)))],
   ok:st=>{const r=1/(st.N+1),m=st.N/(st.N+1);return r>=0.05&&r<=0.08&&m>0.9},
   hints:[['به‌دنبال ۱/(N+1) بین ۰٫۰۵ و ۰٫۰۸ بگردید.','Look for 1/(N+1) between 0.05 and 0.08.'],['N+1 باید بین ۱۲٫۵ و ۲۰ باشد.','N + 1 must lie between 12.5 and 20.'],['مقدار mod N در همان بازه خودبه‌خود بیش از ۹۰٪ است.','mod N is automatically above 90% in that range.']],
   win:['برای N بزرگ، ring تقریباً فقط سهم گره‌ی تازه را جابه‌جا می‌کند، ولی mod N تقریباً همه‌چیز را جابه‌جا می‌کند.','For large N the ring moves roughly only the new node\'s share, while mod N reshuffles nearly everything.']}}});

/* B8 · Write-ahead logging */
LAB({id:'b8',mod:'B',g:'B8',lessons:['b8-1','b8-2'],
 t:['اول لاگ، بعد داده','Log first, data later'],
 aha:['با نوشتن ترتیبی لاگ پیش از صفحه‌های داده، تراکنش commit‌شده بعد از هر خرابی حفظ می‌شود و تراکنش ناتمام لغو می‌شود.','By writing the log sequentially before the data pages, a committed transaction survives any crash and an unfinished one is undone.'],
 big:{had:['می‌دانیم داده در صفحه‌هایی روی دیسک است و بافر پول صفحه‌ها را در حافظه نگه می‌دارد.','We know data lives in disk pages and the buffer pool keeps pages in memory.'],
  miss:['اگر سیستم وسط نوشتن صفحه‌ها خراب شود، تراکنش نیمه‌کاره چه می‌شود؟ آیا commit‌شده‌ها هم از بین می‌روند؟','If the system crashes while pages are being written, what becomes of a half-done transaction? Are committed ones lost too?'],
  fix:['خرابی را در هر گام تزریق می‌کند و دیسک بدون WAL را با بازیابی با WAL مقایسه می‌کند.','Injects a crash at every step and compares the disk without WAL against recovery with WAL.'],
  close:['قاعده‌ی WAL: رکورد لاگ پیش از صفحه‌ی داده روی دیسک می‌رود و لاگ هنگام commit پایدار می‌شود (force). بازیابی: redo کارهای commit‌شده و undo ناتمام‌ها.','The WAL rule: the log record reaches disk before the data page, and the log is made durable at commit (force). Recovery: redo what committed, undo what did not.']},
 sol:{c:4,force:true},fail:{c:0,force:true},
 st:()=>({c:2,force:true}),
 stage(host,st,A){const EV=[['T1: write A=1','log+buffer'],['T1: write B=1','log+buffer'],['flush page A','disk'],['T1: COMMIT','log'],['flush page B','disk']];A.EV=EV;
  A.state=()=>{const c=st.c,diskA=c>=3?1:0,diskB=c>=5?1:0;const committed=c>=4;const logDurable=committed&&st.force;let wal;
   if(committed&&!logDurable)wal={A:diskA,B:diskB,note:t2('رکورد commit روی دیسک نیست: بازیابی T1 را ناتمام می‌بیند و برمی‌گرداند → تراکنشی که به کاربر «موفق» گفته شد گم می‌شود','The commit record never reached disk: recovery sees T1 as unfinished and rolls it back → a transaction reported as successful is lost'),lost:true};
   else if(committed)wal={A:1,B:1,note:t2('commit در لاگ است → redo هر دو صفحه','commit is in the log → redo both pages'),lost:false};else wal={A:0,B:0,note:t2('commit در لاگ نیست → undo هر نوشتنی که به دیسک رفته','no commit in the log → undo any write that reached the disk'),lost:false};
   return{diskA,diskB,committed,wal,incons:diskA!==diskB}};
  return()=>{host.innerHTML='';const s=A.state(),W=560,svg=sv('svg',{viewBox:`0 0 ${W} 200`,class:'sv'});
   EV.forEach((e,i)=>{const x=10+i*108,done=i<st.c;svg.append(sv('rect',{x,y:16,width:100,height:44,rx:6,fill:done?'var(--ac)':'var(--panel2)',stroke:'var(--bd)',opacity:done?.9:.7}),sv('text',{x:x+50,y:35,'text-anchor':'middle','font-size':9,fill:done?'#fff':'var(--fg)'},e[0]),sv('text',{x:x+50,y:50,'text-anchor':'middle','font-size':9,fill:done?'#fff':'var(--mut)'},e[1]))});
   svg.append(sv('path',{d:`M${10+st.c*108-4} 8 l-6 -8 h12z`,fill:'var(--bad)'}),sv('text',{x:10+st.c*108-4,y:76,'text-anchor':'middle','font-size':10,fill:'var(--bad)'},'⚡ crash'));
   const box=(x,title,a,b,ok)=>{svg.append(sv('text',{x:x+120,y:100,'text-anchor':'middle','font-size':11,'font-weight':700},title),sv('rect',{x,y:108,width:112,height:40,rx:6,class:'cell',style:`stroke:${ok?'var(--ok)':'var(--bad)'};stroke-width:2`}),sv('text',{x:x+56,y:133,'text-anchor':'middle','font-size':14},'A='+a),sv('rect',{x:x+124,y:108,width:112,height:40,rx:6,class:'cell',style:`stroke:${ok?'var(--ok)':'var(--bad)'};stroke-width:2`}),sv('text',{x:x+180,y:133,'text-anchor':'middle','font-size':14},'B='+b),sv('text',{x:x+120,y:166,'text-anchor':'middle','font-size':11,fill:ok?'var(--ok)':'var(--bad)'},ok?'✔ '+t2('سازگار','consistent'):'✘ '+t2('ناسازگار','inconsistent')))};
   box(8,t2('دیسک بدون WAL پس از خرابی','Disk after crash, no WAL'),s.diskA,s.diskB,!s.incons);const wOk=!s.wal.lost&&s.wal.A===s.wal.B;box(300,t2('پس از بازیابی با WAL','After recovery with WAL'),s.wal.A,s.wal.B,wOk);
   host.append(svg,h('div',{class:'wn'},s.wal.note),h('div',{class:'stat'},h('span',{},t2('گام‌های انجام‌شده: ','Steps done: '),h('b',{},st.c+'/5')),h('span',{},t2('لاگ هنگام commit پایدار می‌شود: ','Log forced at commit: '),h('b',{},st.force?t2('بله','yes'):t2('خیر','no')))))}},
 screens:{
  puzzle:{ask:['T1 دو مقدار A و B را باید با هم تغییر دهد (همه یا هیچ). سیستم بین گام‌ها خراب می‌شود. دیسک بدون لاگ در چه گام‌هایی ناسازگار می‌ماند؟','T1 must change A and B together (all or nothing). The system crashes between the steps. At which steps is a disk without a log left inconsistent?'],
   do:['نوار «گام خرابی» را بکشید و کادر قرمز سمت چپ را ببینید.','Drag the crash-step slider and watch the red box on the left.'],ctl:(st,A)=>[rng(t2('خرابی پس از گام','Crash after step'),0,5,1,st.c,v=>{st.c=v;A.upd()},v=>String(Math.round(v)))]},
  explore:{claim:['با WAL ، بازیابی همیشه حالت سازگار می‌سازد، به شرط آنکه لاگ commit پایدار شده باشد.','With WAL, recovery always produces a consistent state, provided the commit record was made durable.'],
   ask:['اگر لاگ را هنگام commit به دیسک نرسانیم (force خاموش) چه می‌شود؟','What if we do not force the log to disk at commit (force off)?'],
   do:['خرابی را در هر گام ببرید؛ «اجبار لاگ» را خاموش کنید و گام ۴ را ببینید.','Move the crash through every step; turn "force log" off and look at step 4.'],
   ctl:(st,A)=>[rng(t2('خرابی پس از گام','Crash after step'),0,5,1,st.c,v=>{st.c=v;A.upd()},v=>String(Math.round(v))),btn(t2('اجبار لاگ هنگام commit','Force log at commit'),()=>{st.force=!st.force;A.upd()})],
   see:['با اجبار لاگ، هر گام سازگار بازیابی می‌شود (redo پس از commit، undo پیش از آن). بدون اجبار، commit در گام ۴ می‌تواند گم شود.','With the log forced, every step recovers to a consistent state (redo after commit, undo before). Without it, a step-4 commit can be lost.']},
  name:{says:[['قواعد WAL و بازیابی:','The WAL rules and recovery:']],tex:['\\text{LSN}_{\\text{log}}(\\text{page})\\ \\le\\ \\text{flushedLSN}\\quad\\text{before the page is written}','\\text{recovery}=\\text{redo}(\\text{committed})\\ +\\ \\text{undo}(\\text{uncommitted})'],
   legend:[['\\text{LSN}',['شماره‌ی رکورد لاگ (Log Sequence Number).','Log Sequence Number: the position of a log record.']],['\\text{redo}',['اعمال دوباره‌ی نوشتن‌های commit‌شده که به صفحه نرسیده بودند.','Re-applying committed writes that never reached the page.']],['\\text{undo}',['برگرداندن نوشتن‌های ناتمام که به دیسک رسیده بودند.','Reverting unfinished writes that did reach the disk.']]]},
  challenge:{ask:['گام خرابی را طوری پیدا کنید که دیسک بدون WAL ناسازگار شود، ولی WAL با اجبار لاگ تراکنش commit‌شده را کامل بازیابی کند.','Find a crash step where the disk without WAL is inconsistent yet WAL with the log forced recovers the committed transaction in full.'],
   do:['گام خرابی و اجبار لاگ را تغییر دهید؛ هر دو کادر باید سبز نشوند/بشوند.','Change the crash step and the log force; the left box must be red and the right box green.'],
   ctl:(st,A)=>[rng(t2('خرابی پس از گام','Crash after step'),0,5,1,st.c,v=>{st.c=v;A.upd()},v=>String(Math.round(v))),btn(t2('اجبار لاگ هنگام commit','Force log at commit'),()=>{st.force=!st.force;A.upd()})],
   ok:st=>st.c===4&&st.force,
   hints:[['دیسک بدون WAL فقط وقتی ناسازگار است که A روی دیسک رفته و B هنوز نه.','The disk without WAL is inconsistent only when A reached the disk and B did not.'],['دو گام این شرط را دارند؛ ولی فقط در یکی تراکنش commit شده است.','Two steps satisfy that; but only in one is the transaction committed.'],['اجبار لاگ باید روشن باشد تا commit بعد از خرابی دیده شود.','The log force must be on for the commit to be visible after the crash.']],
   win:['خرابی بعد از commit و قبل از flush صفحه‌ی B: بدون WAL داده نیمه‌کاره می‌ماند، ولی لاگ پایدار اجازه می‌دهد B با redo کامل شود.','A crash after the commit and before page B is flushed: without WAL the data stays half-written, but the durable log lets recovery finish B with redo.']}}});
