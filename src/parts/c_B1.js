/* ===================== CONTENT: Module B (part 1) ===================== */
LESSONS.push({id:'b1-1',mod:'B',g:'B1',t:'مبانی پایگاه داده و معماری DBMS',en:'Database Fundamentals & DBMS Architecture',lvl:1,min:35,pre:['آشنایی مقدماتی با جدول و فایل'],kw:'database dbms architecture relational nosql data model schema data independence three level',
obj:['پایگاه داده و DBMS را تعریف و دلیل ناکافی بودن فایل‌ها را بیان کنید.','معماری سه‌سطحی و مفهوم Data Independence را توضیح دهید.','مدل‌های داده‌ی رابطه‌ای و غیررابطه‌ای را بشناسید و معیار انتخاب میانشان را بدانید.','مسیر یک پرس‌وجو را در اجزای درونی DBMS دنبال کنید.'],
body:R`
<h2>۱. پایگاه داده و DBMS</h2>
<p><b>پایگاه داده (Database)</b> مجموعه‌ی سازمان‌یافته و مرتبط از داده‌هاست و <b>سیستم مدیریت پایگاه داده (DBMS)</b> نرم‌افزاری است که ذخیره، بازیابی، به‌روزرسانی و محافظت از آن داده را در برابر چندین کاربر هم‌زمان و خرابی‌ها مدیریت می‌کند (PostgreSQL، MySQL، SQLite، Oracle، MongoDB، ...).</p>
<h3>چرا فایل‌های ساده کافی نیست؟</h3>
<ul><li><b>افزونگی و ناسازگاری:</b> یک واقعیت در چند فایل تکرار و ناهمگام می‌شود.</li><li><b>همزمانی:</b> دو برنامه هم‌زمان یک فایل را به‌روز می‌کنند و یکدیگر را خراب می‌کنند.</li><li><b>اتمیک‌بودن:</b> انتقال پول بین دو حساب نیمه‌کاره بماند، پول گم می‌شود.</li><li><b>یکپارچگی و امنیت:</b> قواعد (مثل «موجودی منفی نباشد») و کنترل دسترسی.</li><li><b>کارایی:</b> جست‌وجو در گیگابایت‌ها بدون ایندکس.</li><li><b>وابستگی برنامه به قالب فایل.</b></li></ul>
<h2>۲. معماری سه‌سطحی و Data Independence</h2>
<p>معماری ANSI/SPARC داده را در سه سطح می‌بیند: <b>سطح خارجی (View)</b> برای هر کاربر/برنامه، <b>سطح مفهومی (Logical)</b> که کل ساختار (جدول‌ها، قیدها) را توصیف می‌کند، و <b>سطح داخلی (Physical)</b> که نحوه‌ی ذخیره روی دیسک (صفحه‌ها، ایندکس‌ها) است. این جداسازی دو <b>استقلال داده</b> می‌دهد: <i>استقلال فیزیکی</i> (تغییر ایندکس/فایل‌بندی بدون تغییر در جدول‌ها و پرس‌وجوها) و <i>استقلال منطقی</i> (تغییر جدول‌ها بدون خراب‌شدن Viewها). اساسِ SQL «اعلانی» نیز همین است: می‌گویید <i>چه</i> می‌خواهید نه <i>چگونه</i>.</p>
<h2>۳. اجزای DBMS</h2>
${wd('dbms','مسیر یک پرس‌وجو در معماری DBMS')}
<h2>۴. مدل‌های داده</h2>
${ft(['مدل','ساختار','نمونه','نقطه‌ی قوت'],[['رابطه‌ای (Relational)','جدول‌ها با سطر/ستون و کلیدها','PostgreSQL, MySQL','SQL، تراکنش ACID، Joinهای قدرتمند'],['سند (Document)','سندهای JSON تودرتو','MongoDB','طرح‌واره‌ی منعطف، داده‌ی سلسله‌مراتبی'],['کلید-مقدار (Key-Value)','نگاشت کلید به مقدار مات','Redis, DynamoDB','سرعت و مقیاس‌پذیری ساده'],['ستون‌گسترده (Wide-Column)','خانواده‌ی ستون‌ها','Cassandra, HBase','نوشتن زیاد، مقیاس بالا'],['گراف (Graph)','گره و یال','Neo4j','پیمایش روابط عمیق'],['ستونی تحلیلی (Columnar)','ذخیره‌ی ستون‌به‌ستون','ClickHouse, BigQuery','تجمیع‌های سنگین (OLAP)']])}
<p><b>طرح‌واره (Schema)</b> توصیف ساختار است و <b>نمونه (Instance)</b> داده‌ی موجود در یک لحظه. پایگاه داده‌ی رابطه‌ای معمولاً <i>Schema-on-Write</i> است (ساختار پیش از درج اعمال می‌شود)، بسیاری از NoSQLها <i>Schema-on-Read</i>.</p>
${co('note','رابطه‌ای در برابر غیررابطه‌ای: انتخاب بر پایه‌ی نیاز','NoSQL «بهتر» یا «سریع‌تر» نیست؛ موازنه‌های متفاوتی دارد. اگر داده‌ی به‌شدت رابطه‌ای و نیازمند تراکنش چندجدولی دارید، رابطه‌ای معمولاً انتخاب درست است. اگر مقیاس افقی بسیار بالا، ساختار انعطاف‌پذیر یا الگوی دسترسی ساده (کلید) دارید، گزینه‌های NoSQL مناسب‌اند. بسیاری از سیستم‌های امروزی (NewSQL، PostgreSQL با JSONB) مرز را کم‌رنگ کرده‌اند.')}
<h2>۵. اصطلاحات جدول</h2>
<p>یک <b>جدول (Table / Relation)</b> از <b>ستون‌ها (Attributes)</b> با نوع داده‌ی مشخص و <b>سطرها (Tuples / Rows)</b> تشکیل می‌شود. در جدول‌های نمونه‌ی این کتاب (employees، departments، projects، assignments) می‌توانید با SQL Sandbox آزمایش کنید.</p>
${wd('sqlplay','نگاهی به جدول‌های نمونه',{q:'SELECT * FROM employees;',rows:3})}`,
mis:['«DBMS همان پایگاه داده است.» ← پایگاه داده = داده؛ DBMS = نرم‌افزار مدیریت آن.','«NoSQL یعنی بدون ساختار و بدون تراکنش.» ← بسیاری ساختار و تراکنش (محدود یا کامل) دارند.','«ایندکس و جدول را برنامه باید مدیریت کند.» ← استقلال فیزیکی یعنی DBMS آن‌ها را مدیریت می‌کند.'],
ex:[{t:'mcq',l:1,q:'کدام مورد از مزایای استقلال فیزیکی داده است؟',o:['افزودن ایندکس بدون تغییر در کد برنامه','حذف نیاز به SQL','ذخیره‌ی داده در حافظه‌ی RAM','کاهش تعداد جدول‌ها'],a:0,e:'استقلال فیزیکی یعنی تغییر سازمان‌دهی ذخیره‌سازی (مثل افزودن ایندکس) بدون تغییر طرح‌واره‌ی منطقی و پرس‌وجوها.'},
{t:'tf',l:1,q:'SQL یک زبان «اعلانی» (Declarative) است: مشخص می‌کنیم چه می‌خواهیم، نه اینکه چگونه به دست آید.',a:true,e:'بهینه‌ساز پرس‌وجو طرح اجرا (چگونگی) را انتخاب می‌کند.'},
{t:'mcq',l:2,q:'کدام جزء DBMS مسئول انتخاب ارزان‌ترین طرح اجرا است؟',o:['Parser','Query Optimizer','Buffer Manager','Lock Manager'],a:1,e:'بهینه‌ساز با مدل هزینه و آمار جدول‌ها از میان طرح‌های معادل یکی را انتخاب می‌کند.'},
{t:'sql',l:1,q:'نام و حقوق کارمندانی که حقوقشان بیش از ۴۵۰۰ است را بنویسید (ستون‌ها: name, salary).',init:'SELECT * FROM employees;',sol:'SELECT name, salary FROM employees WHERE salary > 4500',hint:'فقط دو ستون و شرط WHERE salary > 4500.',e:'<code>SELECT name, salary FROM employees WHERE salary &gt; 4500</code> — چهار سطر: Ali، Omid، Lida (و Maryam=4500 شامل نمی‌شود).'},
{t:'think',l:2,q:'برای سیستم‌هایی مانند سبد خرید فروشگاه و ثبت لاگ حسگرها، مدل داده‌ی مناسب را (با دلیل) پیشنهاد دهید.',a:'سبد خرید و سفارش‌ها: رابطه‌ای (تراکنش ACID، روابط مشتری-سفارش-کالا، قیدهای یکپارچگی). لاگ حسگرها: نوشتن بسیار زیاد با ساختار ساده و پرس‌وجوی بازه‌ی زمانی؛ پایگاه‌داده‌ی سری‌زمانی/ستونی (TimescaleDB، InfluxDB) یا Wide-Column مانند Cassandra، که برای نوشتن ترتیبی و مقیاس افقی بهینه‌اند. معیار: الگوی دسترسی، سازگاری موردنیاز و حجم.'}],
sum:['DBMS مشکلات فایل‌ها (افزونگی، همزمانی، اتمیک‌بودن، امنیت) را حل می‌کند.','معماری سه‌سطحی و SQL اعلانی استقلال داده می‌دهند.','مدل‌های داده موازنه‌های متفاوت دارند؛ انتخاب بر پایه‌ی نیاز است نه مد.']});

LESSONS.push({id:'b2-1',mod:'B',g:'B2',t:'مدل رابطه‌ای، کلیدها و قیدها',en:'Relational Model, Keys & Constraints',lvl:2,min:45,pre:['b1-1'],kw:'relational model primary key foreign key candidate key superkey constraint one to many many to many null referential integrity',
obj:['رابطه، صفت، دامنه و چندتایی (Tuple) را به‌صورت ریاضی بیان کنید.','ابرکلید، کلید کاندید، کلید اصلی و کلید خارجی را تمایز دهید.','قیدهای یکپارچگی و رفتار NULL را بشناسید و روابط ۱:۱، ۱:N، N:M را پیاده‌سازی کنید.'],
body:R`
<h2>۱. مدل رابطه‌ای</h2>
<p>مدل رابطه‌ای (Codd، ۱۹۷۰) داده را به‌صورت <b>رابطه (Relation)</b> می‌بیند. اگر صفت‌ها $A_1,\dots,A_k$ با دامنه‌های $D_1,\dots,D_k$ باشند، یک رابطه زیرمجموعه‌ای از حاصل‌ضرب دکارتی $D_1\times\dots\times D_k$ است؛ یعنی یک <b>مجموعه</b> از چندتایی‌ها. نتایج مهم: ترتیب سطرها بی‌معناست؛ در مدل نظری سطر تکراری نداریم (SQL این را شل می‌کند و «Bag» است)؛ و ترتیب ستون‌ها نیز ذاتی نیست. <b>درجه</b> = تعداد ستون‌ها، <b>کاردینالیتی</b> = تعداد سطرها.</p>
<h2>۲. کلیدها</h2>
<ul><li><b>ابرکلید (Superkey):</b> مجموعه‌ای از صفت‌ها که مقدارش هر سطر را یکتا مشخص می‌کند.</li><li><b>کلید کاندید (Candidate Key):</b> ابرکلید <i>کمینه</i>؛ حذف هر صفتی خاصیت یکتایی را از بین می‌برد.</li><li><b>کلید اصلی (Primary Key):</b> یکی از کلیدهای کاندید که انتخاب شده؛ NULL ندارد. بقیه <b>کلید جایگزین (Alternate)</b> هستند و با <code>UNIQUE</code> اعمال می‌شوند.</li><li><b>کلید خارجی (Foreign Key):</b> صفتی که به کلید کاندید/اصلی جدول دیگر ارجاع می‌دهد و <b>یکپارچگی ارجاعی (Referential Integrity)</b> را تضمین می‌کند.</li><li><b>کلید مصنوعی (Surrogate)</b> مثل <code>id AUTO_INCREMENT/UUID</code> در برابر <b>کلید طبیعی (Natural)</b> مثل کد ملی.</li></ul>
<h2>۳. قیدهای یکپارچگی</h2>
<pre data-l="sql">
CREATE TABLE employees (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    UNIQUE,
  salary     INTEGER CHECK (salary > 0),
  dept_id    INTEGER REFERENCES departments(id)
                     ON DELETE SET NULL   -- یا CASCADE / RESTRICT
);
</pre>
<p>رفتارهای FK هنگام حذف/تغییر ردیف والد: <code>RESTRICT/NO ACTION</code> (رد عملیات)، <code>CASCADE</code> (حذف/تغییر فرزندان)، <code>SET NULL</code>، <code>SET DEFAULT</code>. در موتور داخلی این کتاب، رفتار پیش‌فرض RESTRICT است. آزمایش کنید:</p>
${wd('sqlplay','آزمایش قیدها (PK / FK / NOT NULL)',{q:"-- هر کدام را جداگانه اجرا کنید\nINSERT INTO employees VALUES (11, 'Zahra', 9, 4000, 2024, NULL);",presets:[{t:'نقض FK: دپارتمان ۹ وجود ندارد',q:"INSERT INTO employees VALUES (11, 'Zahra', 9, 4000, 2024, NULL);"},{t:'نقض PK: شناسه‌ی تکراری',q:"INSERT INTO employees VALUES (1, 'Zahra', 1, 4000, 2024, NULL);"},{t:'نقض NOT NULL: نام خالی',q:"INSERT INTO employees VALUES (12, NULL, 1, 4000, 2024, NULL);"},{t:'درج معتبر',q:"INSERT INTO employees VALUES (11, 'Zahra', 1, 4000, 2024, NULL);\nSELECT * FROM employees WHERE id = 11;"},{t:'حذف دپارتمان دارای کارمند (RESTRICT)',q:'DELETE FROM departments WHERE id = 1;'},{t:'حذف دپارتمان بدون کارمند',q:'DELETE FROM departments WHERE id = 4;'}]})}
<p>نکته: در این Sandbox هر اجرا یک دستور را می‌پذیرد؛ دکمه‌ی «بازنشانی» داده را به حالت اولیه برمی‌گرداند.</p>
<h2>۴. NULL و منطق سه‌ارزشی</h2>
<p><code>NULL</code> یعنی «مقدار نامعلوم/نامربوط»، نه صفر یا رشته‌ی خالی. مقایسه با NULL نتیجه‌ی <b>UNKNOWN</b> می‌دهد: <code>NULL = NULL</code> نه درست است نه غلط؛ برای آزمون باید <code>IS NULL</code> نوشت. <code>WHERE</code> فقط سطرهای TRUE را نگه می‌دارد. جدول درستی: <code>TRUE AND UNKNOWN = UNKNOWN</code>، <code>FALSE AND UNKNOWN = FALSE</code>، <code>TRUE OR UNKNOWN = TRUE</code>. توجه: <code>NOT IN (subquery)</code> اگر زیرپرسش NULL داشته باشد هیچ سطری برنمی‌گرداند — تله‌ی مشهور.</p>
<h2>۵. انواع رابطه بین جدول‌ها</h2>
${ft(['نوع','پیاده‌سازی','مثال'],[['یک‌به‌چند (1:N)','FK در سمت «چند»','یک دپارتمان ← چند کارمند: <code>employees.dept_id</code>'],['یک‌به‌یک (1:1)','FK با قید UNIQUE (یا هم‌کلید)','کاربر ← پروفایل'],['چندبه‌چند (N:M)','جدول واسط با دو FK و کلید اصلی مرکب','کارمند ↔ پروژه با <code>assignments(emp_id, project_id)</code>'],['خودارجاعی','FK به همان جدول','<code>employees.manager_id → employees.id</code>']])}`,
mis:['«کلید اصلی باید یک ستون باشد.» ← می‌تواند مرکب باشد (مثل assignments).','«UNIQUE یعنی PRIMARY KEY.» ← UNIQUE اجازه‌ی NULL (بسته به DBMS) دارد و چند UNIQUE می‌توان داشت.','«NULL برابر صفر یا رشته‌ی خالی است.» ← نامعلوم است و منطق سه‌ارزشی دارد.','«FK بدون ایندکس مشکلی ندارد.» ← حذف/Join روی FK بدون ایندکس کند می‌شود.'],
ex:[{t:'mcq',l:1,q:'کدام گزینه کلید کاندید را بهتر توصیف می‌کند؟',o:['هر ستونی با مقدار یکتا','ابرکلید کمینه','کلیدی که به جدول دیگر ارجاع می‌دهد','ستون AUTO_INCREMENT'],a:1,e:'کلید کاندید ابرکلیدی است که هیچ زیرمجموعه‌ی سره‌ی آن ابرکلید نیست.'},
{t:'mcq',l:1,q:'برای پیاده‌سازی رابطه‌ی N:M بین دانشجو و درس چه لازم است؟',o:['یک FK در جدول دانشجو','یک FK در جدول درس','جدول واسط با دو کلید خارجی','دو جدول بدون ارتباط'],a:2,e:'جدول واسط (Enrollment) با کلید مرکب (student_id, course_id) و دو FK.'},
{t:'tf',l:2,q:'عبارت <code>WHERE dept_id = NULL</code> سطرهای بدون دپارتمان را برمی‌گرداند.',a:false,e:'<code>= NULL</code> همیشه UNKNOWN است و هیچ سطری برنمی‌گردد. باید <code>dept_id IS NULL</code> نوشت.'},
{t:'sql',l:2,q:'کارمندان بدون دپارتمان را بیابید (ستون‌ها: id, name).',init:'SELECT id, name FROM employees WHERE dept_id = NULL;',sol:'SELECT id, name FROM employees WHERE dept_id IS NULL',hint:'از IS NULL استفاده کنید.',e:'فقط Nima بدون دپارتمان است.'},
{t:'sql',l:3,q:'یک کارمند جدید با id=20، نام «Sima»، دپارتمان ۲، حقوق ۴۰۰۰ و سال ورود ۲۰۲۴ و بدون مدیر (NULL) درج کنید.',init:"INSERT INTO employees VALUES (20, 'Sima', 2, 4000, 2024, NULL);",sol:"INSERT INTO employees VALUES (20, 'Sima', 2, 4000, 2024, NULL)",chk:'SELECT * FROM employees WHERE id = 20',hint:'ترتیب ستون‌ها: id, name, dept_id, salary, hire_year, manager_id.',e:'کلید اصلی یکتا و FK دپارتمان ۲ معتبر است.'},
{t:'think',l:3,q:'چرا ممکن است یک «کلید طبیعی» مثل ایمیل یا کد ملی برای PK مناسب نباشد؟',a:'کلید طبیعی ممکن است تغییر کند (ایمیل)، ممکن است در آینده دیگر یکتا یا موجود نباشد، طولانی باشد (ایندکس‌های بزرگ‌تر و FKهای سنگین‌تر) یا اطلاعات حساس بدهد. کلید مصنوعی تغییرناپذیر، کوتاه و بی‌معناست؛ ولی باید یکتایی کلید طبیعی را همچنان با قید UNIQUE نگه داشت.'}],
sum:['رابطه = مجموعه‌ی چندتایی‌ها؛ کلید کاندید = ابرکلید کمینه.','FK یکپارچگی ارجاعی را حفظ می‌کند؛ رفتار حذف: RESTRICT/CASCADE/SET NULL.','NULL منطق سه‌ارزشی دارد؛ با IS NULL آزمون می‌شود.','N:M با جدول واسط پیاده می‌شود.']});

LESSONS.push({id:'b3-1',mod:'B',g:'B3',t:'SQL: SELECT، DML و JOIN',en:'SQL: SELECT, DML & JOIN Operations',lvl:1,min:50,pre:['b2-1'],kw:'sql select insert update delete join inner left right full cross where order by limit',
obj:['پرس‌وجوهای SELECT با WHERE، ORDER BY و LIMIT را بنویسید.','INSERT، UPDATE و DELETE را با رعایت قیدها استفاده کنید.','انواع JOIN را با مثال تمایز دهید و از Join ناخواسته (Cartesian Product) پرهیز کنید.'],
body:R`
<h2>۱. SELECT پایه</h2>
<pre data-l="sql">
SELECT name, salary              -- ستون‌ها (Projection  π)
FROM   employees                 -- منبع داده
WHERE  salary >= 4000            -- فیلتر سطرها (Selection σ)
  AND  hire_year < 2020
ORDER  BY salary DESC            -- مرتب‌سازی
LIMIT  3;                        -- محدودیت تعداد
</pre>
<p>عملگرها: <code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code>، <code>BETWEEN a AND b</code>، <code>IN (...)</code>، <code>LIKE 'M%'</code> (<code>%</code> هر رشته، <code>_</code> یک کاراکتر)، <code>IS NULL</code>، و ترکیب با <code>AND OR NOT</code>. <code>DISTINCT</code> سطرهای تکراری را حذف می‌کند. بدون <code>ORDER BY</code> ترتیب نتیجه تضمین‌شده <b>نیست</b>.</p>
${wd('sqlplay','SELECT را امتحان کنید',{q:'SELECT name, salary, hire_year\nFROM employees\nWHERE salary >= 4000 AND hire_year < 2020\nORDER BY salary DESC\nLIMIT 3;',rows:6})}
<h2>۲. DML: INSERT / UPDATE / DELETE</h2>
<pre data-l="sql">
INSERT INTO departments (id, name, city) VALUES (5, 'Legal', 'Tehran');
UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 3;
DELETE FROM assignments WHERE hours < 70;
</pre>
<p>هشدار: <code>UPDATE</code> یا <code>DELETE</code> <b>بدون WHERE</b> روی همه‌ی سطرها اعمال می‌شود. عادت امن: ابتدا همان WHERE را با <code>SELECT</code> اجرا و تعداد سطرها را بررسی کنید، یا داخل تراکنش اجرا و بعد COMMIT کنید.</p>
<h2>۳. JOIN</h2>
<p>JOIN سطرهای دو جدول را بر اساس یک شرط ترکیب می‌کند. در مدل نظری: $R\bowtie_{\theta}S=\sigma_\theta(R\times S)$.</p>
${ft(['نوع','نتیجه'],[['<code>INNER JOIN</code>','فقط سطرهای دارای جفت در هر دو جدول'],['<code>LEFT JOIN</code>','همه‌ی سطرهای چپ؛ اگر جفت نبود ستون‌های راست NULL'],['<code>RIGHT JOIN</code>','قرینه‌ی LEFT'],['<code>FULL OUTER JOIN</code>','اجتماع LEFT و RIGHT'],['<code>CROSS JOIN</code>','ضرب دکارتی (همه‌ی ترکیب‌ها)']])}
${wd('joinviz','نمایشگر انواع JOIN روی employees و departments')}
<pre data-l="sql">
-- نام کارمند و نام دپارتمان (INNER)
SELECT e.name, d.name AS dept
FROM employees e JOIN departments d ON e.dept_id = d.id;

-- دپارتمان‌هایی که هیچ کارمندی ندارند (Anti-Join با LEFT JOIN)
SELECT d.name
FROM departments d LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.id IS NULL;
</pre>
<h3>نکات مهم</h3>
<ul><li><b>Alias جدول</b> (<code>e</code>، <code>d</code>) خوانایی را زیاد و ستون‌های هم‌نام را قابل‌تفکیک می‌کند.</li><li>شرط <code>WHERE</code> روی جدول سمت راست <code>LEFT JOIN</code> آن را عملاً به INNER JOIN تبدیل می‌کند (چون NULL فیلتر می‌شود)؛ شرط‌های مربوط به جدول راست را در <code>ON</code> بنویسید.</li><li>فراموش‌کردن شرط JOIN، ضرب دکارتی می‌سازد: $n\times m$ سطر.</li><li><b>Self Join</b> برای روابط درون‌جدولی (کارمند و مدیرش) با دو alias از یک جدول.</li></ul>
${wd('sqlplay','JOIN و Self Join',{q:"SELECT e.name AS employee, m.name AS manager\nFROM employees e LEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.id;",rows:4})}`,
mis:['«LEFT JOIN و WHERE روی ستون راست یکی است با شرط در ON.» ← نیست؛ WHERE پس از Join فیلتر می‌کند و سطرهای NULL را حذف می‌کند.','«ترتیب نتیجه بدون ORDER BY همان ترتیب جدول است.» ← تضمین‌شده نیست.','«SELECT * بی‌ضرر است.» ← داده‌ی اضافه، وابستگی به ترتیب ستون و جلوگیری از Covering Index.','استفاده از <code>= NULL</code> به‌جای <code>IS NULL</code>.'],
ex:[{t:'sql',l:1,q:'نام کارمندانی که در سال ۲۰۲۰ یا بعد از آن استخدام شده‌اند را به‌ترتیب نام (صعودی) فهرست کنید. (ستون: name)',init:'SELECT name FROM employees;',sol:'SELECT name FROM employees WHERE hire_year >= 2020 ORDER BY name',hint:'WHERE hire_year >= 2020 و ORDER BY name.',e:'Kian، Neda، Nima، Pouya.'},
{t:'sql',l:2,q:'برای هر کارمندی که دپارتمان دارد، نام کارمند و نام شهر دپارتمانش را بیاورید (ستون‌ها: name، city).',init:'SELECT e.name FROM employees e',sol:'SELECT e.name, d.city FROM employees e JOIN departments d ON e.dept_id = d.id',hint:'INNER JOIN با ON e.dept_id = d.id.',e:'کارمند بدون دپارتمان (Nima) در INNER JOIN نمی‌آید.'},
{t:'sql',l:2,q:'نام دپارتمان‌هایی که هیچ کارمندی ندارند (ستون: name).',init:'SELECT d.name FROM departments d',sol:'SELECT d.name FROM departments d LEFT JOIN employees e ON e.dept_id = d.id WHERE e.id IS NULL',hint:'LEFT JOIN و بررسی NULL شدن ستون جدول راست.',e:'فقط Research.'},
{t:'mcq',l:2,q:'کدام JOIN همه‌ی سطرهای جدول چپ را حتی بدون تطابق نگه می‌دارد؟',o:['INNER JOIN','LEFT JOIN','CROSS JOIN','SELF JOIN فقط'],a:1,e:'LEFT (OUTER) JOIN ستون‌های جدول راست را برای سطرهای بی‌جفت NULL می‌گذارد.'},
{t:'sql',l:3,q:'نام هر کارمند همراه با نام مدیرش (ستون‌ها: employee، manager) برای کسانی که مدیر دارند، مرتب بر اساس employee.',init:'SELECT e.name AS employee FROM employees e',sol:'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id ORDER BY e.name',hint:'Self Join با دو alias.',e:'Self Join: جدول employees با خودش بر اساس manager_id = id.'}],
sum:['SELECT … FROM … WHERE … ORDER BY … LIMIT پایه‌ی پرس‌وجوهاست.','DML بدون WHERE خطرناک است.','INNER، LEFT، RIGHT، FULL و CROSS JOIN رفتار متفاوتی روی سطرهای بی‌جفت دارند.']});

LESSONS.push({id:'b3-2',mod:'B',g:'B3',t:'تجمیع، زیرپرسش، CTE و توابع پنجره‌ای',en:'Aggregation, Subqueries, CTE & Window Functions',lvl:3,min:60,pre:['b3-1'],kw:'aggregate group by having subquery correlated exists cte with window function row_number rank lag sum over partition',
obj:['GROUP BY/HAVING را با تفاوت WHERE و HAVING به کار ببرید.','زیرپرسش‌های اسکالر، IN، EXISTS و هم‌بسته را بنویسید.','از CTE برای ساختاردهی و از توابع پنجره‌ای برای رتبه‌بندی و مجموع تجمعی بدون ادغام سطرها استفاده کنید.'],
body:R`
<h2>۱. توابع تجمیعی و GROUP BY</h2>
<p><code>COUNT، SUM، AVG، MIN، MAX</code> چند سطر را به یک مقدار خلاصه می‌کنند. <code>GROUP BY</code> سطرها را به گروه‌هایی با مقدار یکسان ستون‌های گروه‌بندی تقسیم و تابع را در هر گروه محاسبه می‌کند. <code>COUNT(*)</code> همه‌ی سطرها را می‌شمارد ولی <code>COUNT(col)</code> سطرهای NULL آن ستون را نمی‌شمارد. توابع تجمیعی NULL را نادیده می‌گیرند (<code>AVG</code> میانگین مقادیر غیر NULL است).</p>
<pre data-l="sql">
SELECT d.name, COUNT(*) AS n, ROUND(AVG(e.salary), 1) AS avg_salary
FROM   employees e JOIN departments d ON e.dept_id = d.id
GROUP  BY d.name
HAVING COUNT(*) >= 3             -- فیلتر روی نتیجه‌ی تجمیع
ORDER  BY avg_salary DESC;
</pre>
<p><b>WHERE در برابر HAVING:</b> <code>WHERE</code> <i>قبل</i> از گروه‌بندی روی سطرها اعمال می‌شود و تابع تجمیعی نمی‌پذیرد؛ <code>HAVING</code> <i>بعد</i> از گروه‌بندی روی گروه‌ها. ترتیب منطقی اجرای یک SELECT (نه ترتیب نوشتن):</p>
<p style="direction:ltr;text-align:left"><code>FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (و پنجره‌ها) → DISTINCT → ORDER BY → LIMIT</code></p>
${wd('sqlplay','تجمیع و گروه‌بندی',{q:'SELECT d.name, COUNT(*) AS n, ROUND(AVG(e.salary), 1) AS avg_salary\nFROM employees e JOIN departments d ON e.dept_id = d.id\nGROUP BY d.name\nHAVING COUNT(*) >= 3\nORDER BY avg_salary DESC;',rows:6})}
<h2>۲. زیرپرسش‌ها (Subqueries)</h2>
<ul><li><b>اسکالر:</b> یک مقدار برمی‌گرداند و جای مقدار می‌نشیند: <code>WHERE salary &gt; (SELECT AVG(salary) FROM employees)</code>.</li><li><b>IN:</b> <code>WHERE dept_id IN (SELECT id FROM departments WHERE city='Tehran')</code>.</li><li><b>EXISTS:</b> بررسی وجود حداقل یک سطر؛ معمولاً کارا و بدون مشکل NULL.</li><li><b>هم‌بسته (Correlated):</b> به ستون‌های پرس‌وجوی بیرونی ارجاع می‌دهد و برای هر سطر بیرونی «دوباره» ارزیابی می‌شود (مفهوماً).</li></ul>
<pre data-l="sql">
-- بیشترین حقوق در هر دپارتمان (هم‌بسته)
SELECT name, dept_id, salary FROM employees e
WHERE salary = (SELECT MAX(salary) FROM employees x WHERE x.dept_id = e.dept_id);
</pre>
<h2>۳. CTE (عبارت جدول مشترک)</h2>
<p><code>WITH</code> یک «جدول موقت نام‌دار» برای همان پرس‌وجو می‌سازد و پرس‌وجوهای پیچیده را به گام‌های خوانا می‌شکند.</p>
<pre data-l="sql">
WITH dept_total AS (
  SELECT dept_id, SUM(salary) AS total FROM employees GROUP BY dept_id
)
SELECT d.name, t.total
FROM dept_total t JOIN departments d ON d.id = t.dept_id
ORDER BY t.total DESC;
</pre>
<p>(در PostgreSQL <code>WITH RECURSIVE</code> پیمایش سلسله‌مراتب را ممکن می‌کند؛ موتور داخلی کتاب CTE غیربازگشتی را پشتیبانی می‌کند.)</p>
<h2>۴. توابع پنجره‌ای (Window Functions)</h2>
<p>برخلاف GROUP BY، سطرها را <b>ادغام نمی‌کنند</b>؛ برای هر سطر مقداری بر اساس یک «پنجره» از سطرهای مرتبط محاسبه می‌کنند. ساختار: <code>fn(...) OVER (PARTITION BY ... ORDER BY ...)</code>. توابع رتبه‌بندی: <code>ROW_NUMBER</code> (شماره‌ی یکتا)، <code>RANK</code> (هم‌رتبه‌ها شماره‌ی یکسان با پرش)، <code>DENSE_RANK</code> (بدون پرش)؛ <code>LAG/LEAD</code> مقدار سطر قبل/بعد؛ تجمیعی‌ها با OVER مجموع تجمعی می‌دهند.</p>
${wd('sqlplay','رتبه‌بندی حقوق در هر دپارتمان با RANK',{q:'SELECT name, dept_id, salary,\n       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,\n       SUM(salary) OVER (PARTITION BY dept_id) AS dept_total\nFROM employees\nWHERE dept_id IS NOT NULL\nORDER BY dept_id, rnk;',rows:7,presets:[{t:'رتبه‌بندی با RANK',q:'SELECT name, dept_id, salary,\n       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk\nFROM employees\nWHERE dept_id IS NOT NULL\nORDER BY dept_id, rnk;'},{t:'سه‌نفر اول هر دپارتمان با CTE',q:'WITH r AS (\n  SELECT name, dept_id, salary,\n         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn\n  FROM employees WHERE dept_id IS NOT NULL\n)\nSELECT * FROM r WHERE rn <= 2 ORDER BY dept_id, rn;'},{t:'اختلاف با نفر بالاتر (LAG)',q:'SELECT name, salary,\n       salary - LAG(salary) OVER (ORDER BY salary DESC) AS diff_from_prev\nFROM employees\nORDER BY salary DESC;'}]})}
${co('tip','چرا CTE برای فیلتر پنجره‌ای؟','نتیجه‌ی تابع پنجره‌ای را نمی‌توان مستقیماً در WHERE همان SELECT به‌کار برد (چون پنجره‌ها بعد از WHERE محاسبه می‌شوند). راه‌حل: آن را داخل CTE/زیرپرسش محاسبه و بیرون فیلتر کنید.')}`,
mis:['«HAVING و WHERE یکی‌اند.» ← زمان اعمال و توانایی استفاده از تجمیع متفاوت است.','«ستونی که در SELECT است و در GROUP BY نیست مشکلی ندارد.» ← استاندارد SQL و اکثر DBMSها خطا می‌دهند (MySQL قدیمی مقدار دلخواه می‌داد).','«NOT IN و NOT EXISTS معادل‌اند.» ← با وجود NULL در زیرپرسش، NOT IN نتیجه‌ی خالی می‌دهد.','«Window Function همان GROUP BY است.» ← سطرها را فشرده نمی‌کند.'],
ex:[{t:'sql',l:2,q:'تعداد کارمندان هر دپارتمان (فقط دپارتمان‌هایی که کارمند دارند) به‌صورت (dept_id, n)، مرتب بر اساس dept_id. کارمندان بدون دپارتمان را نادیده بگیرید.',init:'SELECT dept_id, COUNT(*) AS n FROM employees',sol:'SELECT dept_id, COUNT(*) AS n FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id ORDER BY dept_id',hint:'GROUP BY dept_id و حذف NULL با WHERE.',e:'گروه NULL جداگانه ظاهر می‌شود؛ با WHERE حذف می‌کنیم.'},
{t:'sql',l:2,q:'نام کارمندانی که حقوقشان از میانگین حقوق کل بیشتر است (ستون: name).',init:'SELECT name FROM employees',sol:'SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)',hint:'زیرپرسش اسکالر برای AVG.',e:'میانگین حقوق ۴۲۹۰ است ⇒ Ali، Maryam، Omid، Lida.'},
{t:'sql',l:3,q:'برای هر دپارتمان، نام دپارتمان و مجموع ساعت‌های کاری ثبت‌شده در assignments پروژه‌های همان دپارتمان را بنویسید (ستون‌ها: dept، total_hours) که مجموع بیش از ۲۰۰ ساعت باشد.',init:'SELECT d.name AS dept FROM departments d',sol:'SELECT d.name AS dept, SUM(a.hours) AS total_hours FROM departments d JOIN projects p ON p.dept_id = d.id JOIN assignments a ON a.project_id = p.id GROUP BY d.name HAVING SUM(a.hours) > 200',hint:'سه جدول Join + GROUP BY + HAVING.',e:'Engineering: 120+200+150+80+160=710؛ Sales: 90+110+60=260؛ HR: 170 (حذف می‌شود).'},
{t:'sql',l:3,q:'نفر دوم از نظر بیشترین حقوق در هر دپارتمان (ستون‌ها: name، dept_id، salary). از CTE و ROW_NUMBER استفاده کنید.',init:'WITH r AS (\n  SELECT name, dept_id, salary,\n         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn\n  FROM employees WHERE dept_id IS NOT NULL\n)\nSELECT name, dept_id, salary FROM r',sol:'WITH r AS (SELECT name, dept_id, salary, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees WHERE dept_id IS NOT NULL) SELECT name, dept_id, salary FROM r WHERE rn = 2',hint:'فقط WHERE rn = 2 را اضافه کنید.',e:'نفر دوم: Ali (Eng)، Reza یا Kian (Sales؛ حقوق برابر ۳۹۰۰ — ROW_NUMBER یکی را دلخواه انتخاب می‌کند)، Pouya (HR). برای هم‌رتبه‌ها DENSE_RANK مناسب‌تر است.'},
{t:'think',l:3,q:'تفاوت <code>NOT IN</code> و <code>NOT EXISTS</code> وقتی زیرپرسش NULL برگرداند چیست؟',a:'<code>x NOT IN (a, b, NULL)</code> معادل <code>x&lt;&gt;a AND x&lt;&gt;b AND x&lt;&gt;NULL</code> است؛ جزء آخر UNKNOWN و در نتیجه کل عبارت هرگز TRUE نمی‌شود، پس هیچ سطری برنمی‌گردد. <code>NOT EXISTS</code> فقط وجود سطر مطابق را می‌سنجد و NULL را به‌عنوان «تطابق» نمی‌شمارد؛ از این رو امن‌تر است.'}],
sum:['GROUP BY سطرها را فشرده می‌کند؛ HAVING گروه‌ها را فیلتر می‌کند.','زیرپرسش‌ها (اسکالر، IN، EXISTS، هم‌بسته) و CTE ساختار پرس‌وجو را ماژولار می‌کنند.','توابع پنجره‌ای سطرها را حفظ و در کنار آن‌ها رتبه، مجموع تجمعی و مقایسه با سطرهای مجاور می‌دهند.']});

LESSONS.push({id:'b3-3',mod:'B',g:'B3',t:'فرایند اجرای پرس‌وجو و بهینه‌سازی',en:'Query Execution & Optimization',lvl:3,min:50,pre:['b3-2'],kw:'query optimizer execution plan explain cost model join algorithms nested loop hash join merge join selectivity cardinality statistics predicate pushdown',
obj:['مراحل پردازش یک پرس‌وجو (Parse تا Execute) را توضیح دهید.','الگوریتم‌های Join (Nested Loop، Hash، Merge) را از نظر هزینه مقایسه کنید.','نقش آمار، Selectivity و ترتیب Join را در انتخاب طرح اجرا بدانید.'],
body:R`
<h2>۱. مسیر پرس‌وجو</h2>
<ol><li><b>Parse:</b> تحلیل نحوی و ساخت AST، بررسی وجود جدول/ستون در Catalog.</li><li><b>Rewrite:</b> باز‌کردن Viewها، ساده‌سازی عبارت‌ها.</li><li><b>Optimize:</b> تولید و ارزیابی طرح‌های معادل و انتخاب ارزان‌ترین.</li><li><b>Execute:</b> اجرای عملگرها (معمولاً مدل Iterator/Volcano: هر عملگر <code>next()</code> دارد و سطر به سطر می‌کشد).</li></ol>
<p>پرس‌وجو ابتدا به <b>جبر رابطه‌ای</b> ترجمه می‌شود: $\sigma$ (انتخاب سطر)، $\pi$ (انتخاب ستون)، $\bowtie$ (Join)، $\gamma$ (تجمیع). مثلاً:</p>
$$\pi_{name}\left(\sigma_{salary>4500}(employees)\right)$$
<p>این یک <b>طرح منطقی (Logical Plan)</b> است؛ بهینه‌ساز با انتخاب الگوریتم‌های واقعی آن را به <b>طرح فیزیکی (Physical Plan)</b> تبدیل می‌کند.</p>
<h2>۲. بهینه‌سازی</h2>
<ul><li><b>بازنویسی‌های جبری:</b> <i>Predicate Pushdown</i> (فیلتر را هرچه زودتر، پیش از Join اعمال کن)، <i>Projection Pushdown</i> (فقط ستون‌های لازم).</li><li><b>مدل هزینه (Cost Model):</b> برآورد I/O + CPU هر طرح بر پایه‌ی <b>آمار</b> (تعداد سطرها، مقادیر متمایز، هیستوگرام). <b>Selectivity</b> کسری از سطرهاست که شرط را برقرار می‌کنند؛ برآورد غلط (مثلاً به‌علت همبستگی ستون‌ها یا آمار کهنه) رایج‌ترین دلیل طرح بد است. دستور <code>ANALYZE</code> آمار را به‌روز می‌کند.</li><li><b>ترتیب Join:</b> تعداد ترتیب‌ها برای $n$ جدول فاکتوریلی رشد می‌کند؛ بهینه‌سازها از DP روی زیرمجموعه‌ها (System R) یا هیوریستیک استفاده می‌کنند.</li></ul>
<h3>الگوریتم‌های Join</h3>
${ft(['الگوریتم','ایده','هزینه‌ی تقریبی','مناسب برای'],[['Nested Loop','برای هر سطر بیرونی همه‌ی سطرهای داخلی را بررسی/جست‌وجو کن','$O(nm)$؛ با ایندکس روی داخلی $O(n\\log m)$','جدول بیرونی کوچک، شرط غیرتساوی'],['Hash Join','جدول کوچک را در جدول هش بریز، جدول بزرگ را بر آن Probe کن','$O(n+m)$ + حافظه‌ی هش','Join تساوی روی جدول‌های بزرگ بدون ایندکس'],['Sort-Merge Join','هر دو را بر کلید مرتب و ادغام کن','$O(n\\log n+m\\log m)$ (یا $O(n+m)$ اگر قبلاً مرتب)','ورودی‌های از قبل مرتب، Join بازه‌ای']])}
${wd('sqlplay','مقایسه‌ی «سطرهای اسکن‌شده» (scanned rows): Join با شرط در برابر ضرب دکارتی',{q:'SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;',presets:[{t:'Join با شرط',q:'SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;'},{t:'ضرب دکارتی + فیلتر در WHERE (نتیجه‌ی یکسان، کار بیشتر)',q:'SELECT e.name, d.name FROM employees e, departments d WHERE e.dept_id = d.id;'},{t:'زیرپرسش هم‌بسته (اسکن تکراری)',q:'SELECT name FROM employees e WHERE salary = (SELECT MAX(salary) FROM employees x WHERE x.dept_id = e.dept_id);'}]})}
<p>در موتور آموزشی این کتاب، «scanned rows» تعداد سطرهایی است که از جدول‌های پایه خوانده شده؛ زیرپرسش هم‌بسته جدول را برای هر سطر بیرونی دوباره اسکن می‌کند (مفهوم Nested Loop). DBMS واقعی چنین زیرپرسش‌هایی را اغلب به Join بازنویسی (Decorrelate) می‌کند.</p>
<h2>۳. خواندن طرح اجرا (EXPLAIN)</h2>
<pre data-l="sql">
EXPLAIN ANALYZE
SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 4500;
-- نمونه خروجی (PostgreSQL، ساده‌شده):
-- Hash Join  (cost=1.09..2.30 rows=3)
--   Hash Cond: (e.dept_id = d.id)
--   ->  Seq Scan on employees e   Filter: (salary > 4500)
--   ->  Hash
--         ->  Seq Scan on departments d
</pre>
<p>نکات خواندن: از <b>برگ‌ها</b> به ریشه بخوانید؛ <i>Seq Scan</i> اسکن کامل، <i>Index Scan/Index Only Scan</i> استفاده از ایندکس؛ مقایسه‌ی <code>rows</code> برآوردی با واقعی (در ANALYZE) علت طرح بد را نشان می‌دهد.</p>
${co('warn','نکات عملی','تابع روی ستون ایندکس‌شده (<code>WHERE LOWER(name)=...</code>)، <code>LIKE \'%x\'</code> با wildcard ابتدایی و تبدیل نوع ضمنی از استفاده‌ی ایندکس جلوگیری می‌کنند (non-sargable). به‌جای <code>SELECT *</code> ستون‌های لازم را بنویسید.')}`,
mis:['«بهینه‌ساز همیشه بهترین طرح را می‌یابد.» ← بر پایه‌ی برآورد کار می‌کند؛ آمار غلط = طرح بد.','«ترتیب نوشتن Joinها در SQL ترتیب اجرا است.» ← بهینه‌ساز آن را تغییر می‌دهد (مگر در Outer Joinهای حساس).','«ایندکس همیشه استفاده می‌شود.» ← اگر Selectivity پایین باشد (درصد زیادی از سطرها) اسکن کامل ارزان‌تر است.'],
ex:[{t:'mcq',l:1,q:'Predicate Pushdown یعنی چه؟',o:['اعمال زودتر فیلترها قبل از Join برای کاهش حجم داده','حذف Join','استفاده از ایندکس هش','مرتب‌کردن نتیجه'],a:0,e:'هرچه زودتر سطرهای غیرلازم حذف شوند، عملگرهای بعدی کمتر کار می‌کنند.'},
{t:'mcq',l:2,q:'برای Join تساوی روی دو جدول بزرگ بدون ایندکس، معمولاً کدام الگوریتم مناسب‌تر است؟',o:['Nested Loop ساده','Hash Join','هیچ‌کدام','Binary Search'],a:1,e:'Hash Join با $O(n+m)$ زمان؛ Nested Loop ساده $O(nm)$ است.'},
{t:'tf',l:2,q:'در Nested Loop Join اگر جدول داخلی ایندکس روی کلید Join داشته باشد، هزینه به‌طور چشمگیری کم می‌شود.',a:true,e:'هر جست‌وجو $O(\\log m)$ می‌شود و کل $O(n\\log m)$.'},
{t:'num',l:2,q:'Nested Loop Join ساده بین جدولی با ۱۰۰۰ سطر و جدولی با ۵۰۰ سطر چند مقایسه‌ی شرط Join انجام می‌دهد؟',a:500000,tol:0,e:'$1000\\times500=500{,}000$.'},
{t:'think',l:3,q:'یک پرس‌وجو پس از رشد جدول از طرح ایندکسی به اسکن کامل سوئیچ می‌کند. دو دلیل ممکن را بنویسید.',a:'۱) آمار کهنه یا ناسازگار شد و بهینه‌ساز Selectivity را غلط برآورد کرد (ANALYZE لازم است). ۲) شرط اکنون سطر زیادی را شامل می‌شود (Selectivity پایین)؛ خواندن تصادفی ایندکس + دسترسی به صفحه‌های داده از اسکن ترتیبی گران‌تر می‌شود. دلایل دیگر: تغییر پارامترها در Prepared Statement، تغییر ترتیب/نوع Join، تابع روی ستون که ایندکس را بی‌اثر می‌کند.'}],
sum:['مراحل: Parse ← Rewrite ← Optimize ← Execute؛ طرح منطقی به طرح فیزیکی تبدیل می‌شود.','بهینه‌سازی مبتنی بر هزینه و آمار است؛ برآورد غلط → طرح بد.','Nested Loop، Hash و Sort-Merge سه الگوریتم اصلی Join‌اند با موارد کاربرد متفاوت.']});

LESSONS.push({id:'b4-1',mod:'B',g:'B4',t:'طراحی پایگاه داده: ER و وابستگی‌های تابعی',en:'Database Design: ER Modeling & Functional Dependencies',lvl:2,min:45,pre:['b2-1'],kw:'er diagram entity relationship cardinality functional dependency anomaly closure candidate key design',
obj:['مدل ER (موجودیت، صفت، رابطه، کاردینالیتی) را بسازید و به جدول‌های رابطه‌ای نگاشت کنید.','ناهنجاری‌های درج، به‌روزرسانی و حذف را شناسایی کنید.','وابستگی تابعی، بستار صفات و کلیدهای کاندید را محاسبه کنید.'],
body:R`
<h2>۱. طراحی مفهومی با ER</h2>
<p>طراحی پایگاه داده از نیازمندی‌ها شروع و در سه مرحله پیش می‌رود: <b>مفهومی (ER)</b> ← <b>منطقی (جدول‌ها و قیدها)</b> ← <b>فیزیکی (ایندکس، پارتیشن)</b>. در مدل <b>موجودیت-رابطه (Entity-Relationship)</b>: <b>موجودیت</b> (چیزی قابل‌شناسایی مثل Employee)، <b>صفت</b> (ویژگی)، <b>رابطه</b> (ارتباط میان موجودیت‌ها) و <b>کاردینالیتی</b> ($1{:}1$، $1{:}N$، $N{:}M$) و <b>مشارکت</b> (کامل یا جزئی).</p>
${wd('erd','نمودار ER جدول‌های نمونه (نمادگذاری ۱ و N)')}
<h3>نگاشت ER به جدول</h3>
<ul><li>هر موجودیت قوی ← یک جدول با کلید اصلی.</li><li>رابطه‌ی $1{:}N$ ← کلید خارجی در سمت N.</li><li>رابطه‌ی $N{:}M$ ← جدول واسط (با صفات خود رابطه، مثل <code>hours</code>).</li><li>صفت چندمقداری ← جدول جدا؛ موجودیت ضعیف ← کلید مرکب با کلید والد.</li></ul>
<h2>۲. ناهنجاری‌ها: چرا نرمال‌سازی؟</h2>
<p>جدول نامناسب <code>Enrollment(student, student_name, course, instructor, instructor_office)</code> را در نظر بگیرید که اطلاعات دانشجو و استاد در هر سطر تکرار می‌شود:</p>
<ul><li><b>ناهنجاری به‌روزرسانی:</b> تغییر دفتر استاد باید در چندین سطر اعمال شود؛ فراموشی ⇒ ناسازگاری.</li><li><b>ناهنجاری درج:</b> استادی که هنوز درسی ندارد را نمی‌توان ثبت کرد (کلید ناقص می‌شود).</li><li><b>ناهنجاری حذف:</b> با حذف آخرین ثبت‌نام یک درس، اطلاعات استاد هم از بین می‌رود.</li></ul>
<h2>۳. وابستگی تابعی (FD)</h2>
<p>$X\to Y$ یعنی هر دو سطر با مقدار یکسان $X$، مقدار یکسان $Y$ دارند (مثلاً <code>student_id → student_name</code>). FDها ناشی از «معنای داده» هستند، نه از داده‌ی فعلی. <b>بستار صفات</b> $X^+$ همه‌ی صفاتی است که از $X$ استنتاج می‌شود (با بسط تکراری با FDها). $X$ ابرکلید است اگر $X^+$ همه‌ی صفات باشد؛ اگر کمینه هم باشد، کلید کاندید.</p>
<p><b>اصول آرمسترانگ:</b> بازتاب ($Y\subseteq X\Rightarrow X\to Y$)، افزایش ($X\to Y\Rightarrow XZ\to YZ$) و تعدی ($X\to Y,\ Y\to Z\Rightarrow X\to Z$) که اتحاد، تجزیه و ... از آن‌ها می‌آیند.</p>
${wd('fdtool','ماشین‌حساب بستار صفات و کلیدهای کاندید (و فرم نرمال)')}
<p>مثال: $R(A,B,C,D)$ با $A\to B,\ B\to C,\ AD\to C$ ← $\{A,D\}^+=\{A,B,C,D\}$ و هیچ زیرمجموعه‌ی سره‌ای همه‌ی صفات را نمی‌دهد ⇒ تنها کلید کاندید $\{A,D\}$ است.</p>`,
mis:['«نرمال‌سازی یعنی جدول‌های بیشتر.» ← یعنی حذف افزونگی ناشی از FDهای نامناسب.','«FD را از روی داده‌ی فعلی استخراج می‌کنیم.» ← FD یک قید معنایی است؛ داده‌ی فعلی فقط می‌تواند آن را رد کند نه اثبات.','«ER همان جدول است.» ← ER مفهومی است و نگاشت لازم دارد.'],
ex:[{t:'mcq',l:1,q:'رابطه‌ی «دانشجو در چند درس ثبت‌نام می‌کند و هر درس چند دانشجو دارد» چگونه پیاده‌سازی می‌شود؟',o:['یک FK در Student','یک FK در Course','جدول واسط Enrollment','یک ستون لیست'],a:2,e:'N:M با جدول واسط و دو FK.'},
{t:'mcq',l:2,q:'در رابطه‌ی $R(A,B,C)$ با FDهای $A\\to B$ و $B\\to C$، بستار $\\{A\\}^+$ چیست؟',o:['$\\{A\\}$','$\\{A,B\\}$','$\\{A,B,C\\}$','$\\{B,C\\}$'],a:2,e:'$A\\to B$ سپس $B\\to C$ (تعدی) ⇒ $\\{A,B,C\\}$؛ پس $A$ کلید است.'},
{t:'tf',l:2,q:'ناهنجاری درج یعنی نتوان بخشی از اطلاعات را بدون وجود اطلاعات نامرتبط دیگر ثبت کرد.',a:true,e:'مثال: ثبت استاد جدید بدون هیچ درسی.'},
{t:'think',l:3,q:'برای رابطه‌ی $R(S,C,I)$ با FDهای $SC\\to I$ و $I\\to C$ کلیدهای کاندید را بیابید.',a:'$\\{S,C\\}^+=\\{S,C,I\\}$ پس $SC$ کلید است. $\\{S,I\\}^+$: از $I\\to C$ ⇒ $\\{S,I,C\\}$ پس $SI$ هم کلید کاندید است. هر دو کمینه‌اند. بنابراین کلیدها: $\\{S,C\\}$ و $\\{S,I\\}$. جالب: این رابطه 3NF است (همه‌ی صفات Prime‌اند) ولی BCNF نیست چون $I\\to C$ با $I$ ابرکلید نیست.'}],
sum:['ER مفهومی را به جدول‌ها و FKها نگاشت می‌کنیم؛ N:M ⇒ جدول واسط.','FDها (و بستار) پایه‌ی تشخیص افزونگی و کلیدها هستند.','ناهنجاری‌های درج/حذف/به‌روزرسانی انگیزه‌ی نرمال‌سازی‌اند.']});

LESSONS.push({id:'b4-2',mod:'B',g:'B4',t:'نرمال‌سازی (1NF تا BCNF) و Denormalization',en:'Normalization 1NF–BCNF & Denormalization',lvl:3,min:50,pre:['b4-1'],kw:'normalization 1nf 2nf 3nf bcnf denormalization lossless join dependency preservation design trade off',
obj:['شرایط 1NF، 2NF، 3NF و BCNF را بیان و جدول‌ها را گام‌به‌گام نرمال کنید.','تجزیه‌ی بی‌اتلاف (Lossless Join) و حفظ وابستگی را بدانید.','موارد درست Denormalization و موازنه‌ی آن را تحلیل کنید.'],
body:R`
<h2>فرم‌های نرمال</h2>
${ft(['فرم','شرط','حذف می‌کند'],[['1NF','همه‌ی مقادیر اتمیک؛ بدون گروه‌های تکرارشونده','لیست‌ها و ستون‌های چندمقداری'],['2NF','1NF + هیچ صفت غیرکلیدی به <b>بخشی</b> از کلید مرکب وابسته نباشد','وابستگی جزئی (Partial)'],['3NF','2NF + هیچ وابستگی <b>تراگذر</b> صفت غیرکلید به کلید نباشد؛ یا برای هر $X\\to A$: $X$ ابرکلید یا $A$ صفت اصلی (Prime)','وابستگی تراگذر'],['BCNF','برای هر FD غیربدیهی $X\\to Y$، $X$ ابرکلید باشد','باقی‌مانده‌ی ناهنجاری‌های ناشی از کلیدهای کاندید هم‌پوشان']])}
<p>خلاصه‌ی ماندگار برای 3NF: «هر صفت غیرکلید به <i>کلید، تمام کلید و هیچ چیز جز کلید</i> وابسته است.» BCNF قوی‌تر از 3NF است: $\text{BCNF}\subset\text{3NF}\subset\text{2NF}\subset\text{1NF}$.</p>
<h3>مثال گام‌به‌گام</h3>
${wd('normstep','نرمال‌سازی جدول ثبت‌نام: از 0NF تا 3NF')}
<h2>تجزیه‌ی درست</h2>
<ul><li><b>Lossless Join (بی‌اتلاف):</b> Join تجزیه‌ها باید دقیقاً رابطه‌ی اصلی را بدهد (بدون سطر جعلی). شرط برای تجزیه به $R_1,R_2$: $(R_1\cap R_2)\to R_1$ یا $(R_1\cap R_2)\to R_2$ (اشتراک، کلید یکی از دو طرف باشد).</li><li><b>Dependency Preserving:</b> FDها بتوانند بدون Join بررسی شوند. تجزیه به 3NF همیشه هر دو را تضمین می‌کند؛ تجزیه به BCNF همیشه بی‌اتلاف است ولی ممکن است برخی FDها را حفظ نکند (مثلاً مثال $SC\to I,\ I\to C$).</li></ul>
${wd('fdtool','آزمایش: فرم نرمال را با FDهای مختلف تعیین کنید')}
<h2>Denormalization (نرمال‌زدایی)</h2>
<p>گاهی عمداً افزونگی اضافه می‌کنیم تا <b>خواندن</b> سریع‌تر شود: ذخیره‌ی مجموع سفارش در جدول سفارش، کپی نام مشتری در جدول فاکتور (برای حفظ تاریخچه!)، جدول‌های خلاصه (Materialized View)، جداول Star Schema در انبار داده. هزینه‌ها: <b>نوشتن پیچیده‌تر</b>، خطر ناسازگاری، حافظه‌ی بیشتر. استفاده‌ی درست: ابتدا نرمال طراحی و اندازه‌گیری کنید؛ فقط گلوگاه‌های واقعی خواندن را با کنترل (Trigger، Materialized View، یا لایه‌ی برنامه) denormalize کنید.</p>
${ft(['','نرمال','Denormalized'],[['خواندن','Join لازم','سریع‌تر (کمتر Join)'],['نوشتن','ساده و بدون افزونگی','باید چند جا به‌روز شود'],['ناسازگاری','کم','ریسک بالا'],['حافظه','کمتر','بیشتر'],['مناسب','OLTP','OLAP، گزارش‌گیری، Read-Heavy']])}`,
mis:['«همیشه تا BCNF نرمال کنید.» ← گاهی 3NF (برای حفظ FD) یا denormalization عملی‌تر است.','«Denormalization یعنی طراحی بد.» ← تصمیمی آگاهانه با موازنه است.','«2NF روی جدول با کلید تک‌ستونی هم می‌تواند نقض شود.» ← خیر؛ وابستگی جزئی فقط برای کلید مرکب است.'],
ex:[{t:'mcq',l:1,q:'جدول <code>Order(order_id, product_id, qty, product_name)</code> با کلید (order_id, product_id) و FD: <code>product_id → product_name</code> کدام فرم را نقض می‌کند؟',o:['1NF','2NF','3NF','BCNF'],a:1,e:'<code>product_name</code> فقط به بخشی از کلید (product_id) وابسته است ⇒ وابستگی جزئی ⇒ نقض 2NF.'},
{t:'mcq',l:2,q:'جدول <code>Emp(id, dept, dept_head)</code> با <code>id→dept</code> و <code>dept→dept_head</code> کدام را نقض می‌کند؟',o:['1NF','2NF','3NF','هیچ‌کدام'],a:2,e:'<code>dept_head</code> به‌طور تراگذر به <code>id</code> وابسته است ⇒ نقض 3NF.'},
{t:'tf',l:2,q:'هر رابطه در BCNF لزوماً در 3NF هم هست.',a:true,e:'BCNF شرط قوی‌تری است: هر دترمینان ابرکلید باشد.'},
{t:'tf',l:3,q:'تجزیه‌ی هر رابطه به BCNF همیشه حافظ وابستگی‌ها (Dependency Preserving) هم هست.',a:false,e:'نه؛ برای مثال $R(S,C,I)$ با $SC\\to I,\\ I\\to C$ تجزیه‌ی BCNF ($R_1(I,C)$ و $R_2(S,I)$) FD‌ی $SC\\to I$ را بدون Join قابل‌بررسی نمی‌گذارد.'},
{t:'think',l:3,q:'در یک سامانه‌ی فروش، «قیمت واحد کالا» را در جدول <code>order_items</code> هم ذخیره می‌کنیم (علاوه بر جدول کالا). این نقض نرمال‌سازی است؟ توضیح دهید.',a:'ظاهراً افزونگی است ولی از نظر معنایی داده‌ی متفاوتی است: قیمت کالا در لحظه‌ی خرید (Snapshot تاریخی). FD «product_id → price» فقط برای قیمت <i>فعلی</i> برقرار است، اما قیمت ثبت‌شده در سفارش به <code>(order_id, product_id)</code> وابسته است و با تغییر قیمت کالا نباید عوض شود. پس نقض 3NF نیست و حتی ضروری است.'}],
sum:['1NF اتمیک، 2NF بدون وابستگی جزئی، 3NF بدون وابستگی تراگذر، BCNF: هر دترمینان ابرکلید.','تجزیه باید بی‌اتلاف باشد و ترجیحاً FDها را حفظ کند.','Denormalization موازنه‌ی خواندن سریع و پیچیدگی/ناسازگاری نوشتن است و پس از اندازه‌گیری انجام می‌شود.']});
