/* ===================== WIDGETS: Module D (Machine Learning) ===================== */
const MLX={
 gauss(r){let u=0,v=0;while(!u)u=r();v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)},
 blobs(seed,n,cs,sd){const r=mulberry(seed),o=[];cs.forEach((c,k)=>{for(let i=0;i<n;i++)o.push({x:c[0]+sd*MLX.gauss(r),y:c[1]+sd*MLX.gauss(r),c:k})});return o},
 moons(seed,n,noise){const r=mulberry(seed),o=[];for(let i=0;i<n;i++){const t=Math.PI*r();o.push({x:Math.cos(t)+noise*MLX.gauss(r),y:Math.sin(t)+noise*MLX.gauss(r),c:0});const u=Math.PI*r();o.push({x:1-Math.cos(u)+noise*MLX.gauss(r),y:.5-Math.sin(u)+noise*MLX.gauss(r),c:1})}return o},
 xor(seed,n,noise){const r=mulberry(seed),o=[];for(let i=0;i<n*4;i++){const a=i%2,b=(i>>1)%2;o.push({x:(a?1:-1)+noise*MLX.gauss(r),y:(b?1:-1)+noise*MLX.gauss(r),c:a^b})}return o},
 rings(seed,n,noise){const r=mulberry(seed),o=[];for(let i=0;i<n*2;i++){const t=2*Math.PI*r(),rad=i%2?1.6:0.6;o.push({x:rad*Math.cos(t)+noise*MLX.gauss(r),y:rad*Math.sin(t)+noise*MLX.gauss(r),c:i%2})}return o},
 col:c=>c?'var(--bad)':'var(--ac)',
 sig:z=>1/(1+Math.exp(-z)),
 ext(pts,pad){let a=1e9,b=-1e9,c=1e9,d=-1e9;pts.forEach(p=>{a=Math.min(a,p.x);b=Math.max(b,p.x);c=Math.min(c,p.y);d=Math.max(d,p.y)});return[a-pad,b+pad,c-pad,d+pad]},
 /* draw a class-coloured decision map on a canvas: f(x,y)-> class probability in [0,1] */
 map(host,w,h,ex,f,pts,res){const C=cv(host,w,h),g=C.g;res=res||8;const cs=getComputedStyle(document.documentElement),a=cs.getPropertyValue('--ac').trim(),b=cs.getPropertyValue('--bad').trim();
  for(let i=0;i<w;i+=res)for(let j=0;j<h;j+=res){const x=ex[0]+(i+res/2)/w*(ex[1]-ex[0]),y=ex[3]-(j+res/2)/h*(ex[3]-ex[2]),p=f(x,y);g.globalAlpha=.1+.38*Math.abs(p-.5)*2;g.fillStyle=p>.5?b:a;g.fillRect(i,j,res,res)}
  g.globalAlpha=1;pts.forEach(p=>{g.beginPath();const X=(p.x-ex[0])/(ex[1]-ex[0])*w,Y=(ex[3]-p.y)/(ex[3]-ex[2])*h;if(p.c){g.fillStyle=b;g.moveTo(X,Y-5);g.lineTo(X+5,Y+4);g.lineTo(X-5,Y+4);g.closePath();g.fill()}else{g.fillStyle=a;g.arc(X,Y,4,0,7);g.fill()}g.strokeStyle='#fff';g.lineWidth=.8;g.stroke()});return C}};

W.logreg=(el,o)=>{const pts=MLX.blobs(5,30,[[-1.2,-1],[1.2,1]],0.9);let w=[0,0,0],hist=[];const host=h('div'),info=h('div',{class:'stat'});
 const ex=[-4,4,-4,4];const loss=()=>pts.reduce((s,p)=>{const q=MLX.sig(w[0]*p.x+w[1]*p.y+w[2]);return s-(p.c?Math.log(q+1e-9):Math.log(1-q+1e-9))},0)/pts.length;
 const acc=()=>pts.filter(p=>(w[0]*p.x+w[1]*p.y+w[2]>0)===!!p.c).length/pts.length;
 const step=eta=>{const g=[0,0,0];pts.forEach(p=>{const e=MLX.sig(w[0]*p.x+w[1]*p.y+w[2])-p.c;g[0]+=e*p.x;g[1]+=e*p.y;g[2]+=e});for(let i=0;i<3;i++)w[i]-=eta*g[i]/pts.length;hist.push(loss())};
 const lr=rng('η',0.05,3,0.05,0.8,()=>{},v=>fmt(v,2));
 const draw=()=>{host.innerHTML='';const P=chart(520,330,ex[0],ex[1],ex[2],ex[3],{l:28,b:20});P.axes(8,8,v=>String(Math.round(v)),v=>String(Math.round(v)));
  const line=(k,dash,col)=>{if(Math.abs(w[1])<1e-6)return;const f=x=>(k-w[0]*x-w[2])/w[1];P.line(ex[0],f(ex[0]),ex[1],f(ex[1]),col,dash,dash?1.2:2.4)};line(0,null,'var(--ok)');line(2.2,'5 4','var(--mut)');line(-2.2,'5 4','var(--mut)');
  pts.forEach(p=>{if(p.c)P.svg.append(sv('path',{d:`M${P.X(p.x)} ${P.Y(p.y)-6} l6 10 h-12z`,fill:'var(--bad)',stroke:'#fff','stroke-width':.8}));else P.dot(p.x,p.y,4.5,'var(--ac)')});host.append(P.svg);
  info.innerHTML='';info.append(h('span',{},t2('گام‌ها: ','Steps: '),h('b',{},hist.length)),h('span',{},t2('زیان cross-entropy: ','Cross-entropy: '),h('b',{},fmt(loss(),3))),h('span',{},t2('دقت: ','Accuracy: '),h('b',{},Math.round(acc()*100)+'%')),h('span',{},'w = (',h('b',{},fmt(w[0],2)+', '+fmt(w[1],2)),'), b = ',h('b',{},fmt(w[2],2))))};
 el.append(host,info,h('div',{class:'ctl'},lr.el,btn(t2('گام ×۱','Step ×1'),()=>{step(lr.get());draw()}),btn(t2('گام ×۵۰','Step ×50'),()=>{for(let i=0;i<50;i++)step(lr.get());draw()}),btn(t2('↺ از نو','↺ Reset'),()=>{w=[0,0,0];hist=[];draw()})),h('div',{class:'wn'},t2('خط سبز: p=۰٫۵؛ خط‌چین‌ها: p≈۰٫۱ و ۰٫۹. ▲ = کلاس ۱، ● = کلاس ۰.','Green line: p = 0.5; dashed: p ≈ 0.1 and 0.9. ▲ = class 1, ● = class 0.')));draw()};

W.knn=(el,o)=>{const tr=MLX.moons(3,35,0.28),te=MLX.moons(11,60,0.28);const host=h('div'),info=h('div',{class:'stat'});const ex=[-1.8,2.8,-1.2,1.8];
 const pred=(pts,x,y,k,skip)=>{const d=pts.map((p,i)=>({i,d:(p.x-x)**2+(p.y-y)**2,c:p.c})).filter(a=>a.i!==skip).sort((a,b)=>a.d-b.d).slice(0,k);return d.reduce((s,a)=>s+a.c,0)/k};
 const kk=rng('k',1,45,2,5,()=>{},v=>String(Math.round(v)));
 const draw=()=>{host.innerHTML='';const k=Math.round(kk.get());MLX.map(host,520,300,ex,(x,y)=>pred(tr,x,y,k,-1),tr,8);
  const trAcc=tr.filter((p,i)=>(pred(tr,p.x,p.y,k,-1)>.5)===!!p.c).length/tr.length,teAcc=te.filter(p=>(pred(tr,p.x,p.y,k,-1)>.5)===!!p.c).length/te.length;
  info.innerHTML='';info.append(h('span',{},'k = ',h('b',{},k)),h('span',{},t2('دقت آموزش: ','Train accuracy: '),h('b',{},Math.round(trAcc*100)+'%')),h('span',{},t2('دقت آزمون: ','Test accuracy: '),h('b',{},Math.round(teAcc*100)+'%')))};
 kk.input.addEventListener('input',draw);el.append(host,info,h('div',{class:'ctl'},kk.el),h('div',{class:'wn'},t2('k=۱ هر نقطه‌ی آموزش را حفظ می‌کند (دقت آموزش ۱۰۰٪) ولی مرز دندانه‌دار است؛ k بزرگ مرز را هموار و در نهایت بیش‌ازحد ساده می‌کند. ۷۰ نقطه‌ی آموزش، ۱۲۰ نقطه‌ی آزمون.','k = 1 memorizes every training point (100% train accuracy) with a jagged boundary; a large k smooths the boundary and eventually oversimplifies. 70 training points, 120 test points.')));draw()};

W.dtree=(el,o)=>{const tr=MLX.rings(4,40,0.22),te=MLX.rings(9,70,0.22);const host=h('div'),info=h('div',{class:'stat'});const ex=[-2.6,2.6,-2.6,2.6];
 const gini=a=>{if(!a.length)return 0;const p=a.filter(q=>q.c).length/a.length;return 2*p*(1-p)};
 const build=(a,d,md)=>{const n1=a.filter(q=>q.c).length;if(d>=md||n1===0||n1===a.length||a.length<3)return{leaf:1,p:a.length?n1/a.length:0};let best=null;['x','y'].forEach(f=>{const s=[...a].sort((p,q)=>p[f]-q[f]);for(let i=1;i<s.length;i++){if(s[i][f]===s[i-1][f])continue;const t=(s[i][f]+s[i-1][f])/2,L=s.slice(0,i),R=s.slice(i),g=(L.length*gini(L)+R.length*gini(R))/a.length;if(!best||g<best.g)best={g,f,t,L,R}}});if(!best)return{leaf:1,p:n1/a.length};return{f:best.f,t:best.t,l:build(best.L,d+1,md),r:build(best.R,d+1,md)}};
 const ev=(n,x,y)=>n.leaf?n.p:ev(((n.f==='x'?x:y)<n.t)?n.l:n.r,x,y);
 const cnt=n=>n.leaf?1:cnt(n.l)+cnt(n.r);const md=rng(t2('عمق','Depth'),0,10,1,2,()=>{},v=>String(Math.round(v)));
 const draw=()=>{host.innerHTML='';const d=Math.round(md.get()),T=build(tr,0,d);MLX.map(host,520,300,ex,(x,y)=>ev(T,x,y),tr,6);
  const a1=tr.filter(p=>(ev(T,p.x,p.y)>.5)===!!p.c).length/tr.length,a2=te.filter(p=>(ev(T,p.x,p.y)>.5)===!!p.c).length/te.length;
  info.innerHTML='';info.append(h('span',{},t2('عمق: ','Depth: '),h('b',{},d)),h('span',{},t2('برگ‌ها: ','Leaves: '),h('b',{},cnt(T))),h('span',{},t2('دقت آموزش: ','Train: '),h('b',{},Math.round(a1*100)+'%')),h('span',{},t2('دقت آزمون: ','Test: '),h('b',{},Math.round(a2*100)+'%')))};
 md.input.addEventListener('input',draw);el.append(host,info,h('div',{class:'ctl'},md.el),h('div',{class:'wn'},t2('هر گره بهترین برش محور-موازی را با کمینه‌کردن ناخالصی Gini انتخاب می‌کند. عمق بیشتر = مرز دقیق‌تر روی داده‌ی آموزش، و در نهایت overfitting.','Each node picks the best axis-aligned split by minimizing Gini impurity. More depth = a tighter fit to the training data, and eventually overfitting.')));draw()};

W.kmeans=(el,o)=>{const pts=MLX.blobs(8,30,[[-2,-1.2],[1.8,-1],[0,2]],0.75);const host=h('div'),info=h('div',{class:'stat'});let C=[],asg=[],it=0,seed=1;const ex=[-5,5,-4,4];
 const init=k=>{const r=mulberry(seed*97);C=Array.from({length:k},()=>{const p=pts[Math.floor(r()*pts.length)];return[p.x,p.y]});asg=pts.map(()=>-1);it=0};
 const assign=()=>{asg=pts.map(p=>C.reduce((b,c,i)=>((p.x-c[0])**2+(p.y-c[1])**2<b[0]?[(p.x-c[0])**2+(p.y-c[1])**2,i]:b),[1e9,0])[1])};
 const update=()=>{C=C.map((c,i)=>{const m=pts.filter((p,j)=>asg[j]===i);return m.length?[m.reduce((s,p)=>s+p.x,0)/m.length,m.reduce((s,p)=>s+p.y,0)/m.length]:c})};
 const inertia=()=>asg[0]<0?NaN:pts.reduce((s,p,j)=>s+(p.x-C[asg[j]][0])**2+(p.y-C[asg[j]][1])**2,0);
 const kk=rng('k',1,6,1,3,()=>{},v=>String(Math.round(v)));
 const draw=()=>{host.innerHTML='';const P=chart(520,330,ex[0],ex[1],ex[2],ex[3],{l:26,b:20});P.axes(10,8,v=>String(Math.round(v)),v=>String(Math.round(v)));const pal=['var(--ac)','var(--bad)','var(--ok)','var(--warn)','var(--ac2)','var(--hl)'],sh=['●','■','▲','◆','★','✚'];
  pts.forEach((p,j)=>{const c=asg[j];if(c<0)P.dot(p.x,p.y,3.5,'var(--mut)');else P.svg.append(sv('text',{x:P.X(p.x),y:P.Y(p.y)+4,'text-anchor':'middle','font-size':11,fill:pal[c%6]},sh[c%6]))});
  C.forEach((c,i)=>{P.svg.append(sv('circle',{cx:P.X(c[0]),cy:P.Y(c[1]),r:9,fill:'none',stroke:pal[i%6],'stroke-width':3}),sv('text',{x:P.X(c[0]),y:P.Y(c[1])+4,'text-anchor':'middle','font-size':11,'font-weight':700},'μ'+(i+1)))});host.append(P.svg);
  info.innerHTML='';info.append(h('span',{},t2('تکرار: ','Iteration: '),h('b',{},it)),h('span',{},t2('inertia (مجموع مربع فاصله): ','Inertia (sum of squared distances): '),h('b',{},isNaN(inertia())?'—':fmt(inertia(),1))))};
 const reset=()=>{init(Math.round(kk.get()));draw()};kk.input.addEventListener('change',reset);
 el.append(host,info,h('div',{class:'ctl'},kk.el,btn(t2('گام: انتساب + به‌روزرسانی','Step: assign + update'),()=>{assign();update();it++;draw()}),btn(t2('اجرا تا همگرایی','Run to convergence'),()=>{for(let i=0;i<30;i++){const a0=asg.join();assign();if(asg.join()===a0&&i>0)break;update();it++}draw()}),btn(t2('مقداردهی اولیه‌ی تازه','New initialization'),()=>{seed++;reset()})),h('div',{class:'wn'},t2('۹۰ نقطه از ۳ خوشه‌ی واقعی. با k=۳ و مقداردهی بد ممکن است به کمینه‌ی موضعی برسید؛ چند بار «مقداردهی تازه» بزنید.','90 points from 3 true clusters. With k = 3 and an unlucky start you may reach a local minimum; press "New initialization" a few times.')));init(3);draw()};

W.pca=(el,o)=>{const r=mulberry(12),th0=0.55,pts=Array.from({length:80},()=>{const a=2.2*MLX.gauss(r),b=0.7*MLX.gauss(r);return{x:a*Math.cos(th0)-b*Math.sin(th0),y:a*Math.sin(th0)+b*Math.cos(th0)}});
 const n=pts.length,mx=pts.reduce((s,p)=>s+p.x,0)/n,my=pts.reduce((s,p)=>s+p.y,0)/n;pts.forEach(p=>{p.x-=mx;p.y-=my});
 const sxx=pts.reduce((s,p)=>s+p.x*p.x,0)/n,syy=pts.reduce((s,p)=>s+p.y*p.y,0)/n,sxy=pts.reduce((s,p)=>s+p.x*p.y,0)/n;const pc=0.5*Math.atan2(2*sxy,sxx-syy);
 const V=a=>{const c=Math.cos(a),s=Math.sin(a);return c*c*sxx+2*c*s*sxy+s*s*syy};const tot=sxx+syy;const host=h('div'),info=h('div',{class:'stat'});
 const ph=rng('φ°',0,180,1,100,()=>{},v=>Math.round(v)+'°');
 const draw=()=>{host.innerHTML='';const a=ph.get()*Math.PI/180,c=Math.cos(a),s=Math.sin(a);const P=chart(520,330,-6,6,-4,4,{l:26,b:20});P.axes(6,4,v=>String(Math.round(v)),v=>String(Math.round(v)));
  P.line(-6*c,-6*s,6*c,6*s,'var(--ok)',null,2.4);pts.forEach(p=>{const t=p.x*c+p.y*s;P.line(p.x,p.y,t*c,t*s,'var(--bd)',null,.8)});pts.forEach(p=>P.dot(p.x,p.y,3.2,'var(--ac)'));
  P.line(-6*Math.cos(pc),-6*Math.sin(pc),6*Math.cos(pc),6*Math.sin(pc),'var(--warn)','5 4',1.4);host.append(P.svg);
  const Q=chart(520,110,0,180,0,tot*1.1,{l:34,b:22,t:6});Q.axes(6,2,v=>Math.round(v)+'°',v=>fmt(v,1));Q.path(x=>V(x*Math.PI/180),'var(--ac2)',0,180,120,2.2);Q.dot(ph.get(),V(a),5,'var(--ok)');host.append(Q.svg);
  info.innerHTML='';info.append(h('span',{},t2('واریانس روی خط انتخابی: ','Variance along the chosen line: '),h('b',{},fmt(V(a),2))),h('span',{},t2('سهم از کل: ','Share of total: '),h('b',{},Math.round(V(a)/tot*100)+'%')),h('span',{},t2('PC1 در ','PC1 at '),h('b',{},Math.round(((pc*180/Math.PI)+180)%180)+'°'),' → ',h('b',{},Math.round(V(pc)/tot*100)+'%')))};
 ph.input.addEventListener('input',draw);el.append(host,info,h('div',{class:'ctl'},ph.el,btn(t2('پرش به PC1','Snap to PC1'),()=>{ph.set(Math.round(((pc*180/Math.PI)+180)%180));draw()})),h('div',{class:'wn'},t2('خط سبز = راستای تصویر؛ خط‌های خاکستری = فاصله‌ی هر نقطه تا تصویرش (خطای بازسازی). نمودار پایین واریانس تصویر را بر حسب زاویه نشان می‌دهد؛ بیشینه‌ی آن PC1 است و بازسازی‌خطا همان‌جا کمینه.','Green line = projection direction; grey segments = each point\'s distance to its projection (reconstruction error). The lower chart shows projected variance versus angle; its maximum is PC1, where the reconstruction error is smallest.')));draw()};

W.cvfold=(el,o)=>{const r=mulberry(21),f=x=>Math.sin(1.5*x),mk=(n,seed)=>{const q=mulberry(seed);return Array.from({length:n},()=>{const x=-2+4*q();return{x,y:f(x)+0.3*MLX.gauss(q)}})};
 const D=mk(24,5),T=mk(300,77);const host=h('div'),info=h('div',{class:'stat'});const kk=rng('K',2,12,1,5,()=>{},v=>String(Math.round(v)));
 const fit=(S,d)=>Lib.polyfit(S.map(p=>p.x),S.map(p=>p.y),d,1e-6),mse=(w,S)=>S.reduce((s,p)=>s+(Lib.polyval(w,p.x)-p.y)**2,0)/S.length;
 const cvs=(d,K)=>{let s=0,c=0;for(let k=0;k<K;k++){const te=D.filter((_,i)=>i%K===k),tr=D.filter((_,i)=>i%K!==k);if(!te.length)continue;const w=fit(tr,d);s+=mse(w,te)*te.length;c+=te.length}return s/c};
 const draw=()=>{host.innerHTML='';const K=Math.round(kk.get()),degs=[1,2,3,4,5,6,7,8],tr=[],cv_=[],tes=[];degs.forEach(d=>{const w=fit(D,d);tr.push(mse(w,D));cv_.push(cvs(d,K));tes.push(mse(w,T))});const clip=v=>Math.min(v,1.5);
  const P=chart(520,250,1,8,0,1.5,{l:38,b:26});P.axes(7,5,v=>String(Math.round(v)),v=>fmt(v,1));
  [[tr,'var(--ok)'],[cv_,'var(--warn)'],[tes,'var(--bad)']].forEach(([a,c],i)=>{let d='';a.forEach((v,j)=>d+=(j?'L':'M')+P.X(degs[j])+' '+P.Y(clip(v)));P.svg.append(sv('path',{d,fill:'none',stroke:c,'stroke-width':2.4,'stroke-dasharray':i===1?'6 3':i===2?'2 3':null}));a.forEach((v,j)=>P.svg.append(sv('circle',{cx:P.X(degs[j]),cy:P.Y(clip(v)),r:3,fill:c})))});
  const bd=degs[cv_.indexOf(Math.min(...cv_))],bt=degs[tes.indexOf(Math.min(...tes))];P.svg.append(sv('rect',{x:P.X(bd)-6,y:10,width:12,height:230,fill:'var(--warn)',opacity:.14}));
  P.text(1.1,1.42,'── '+t2('آموزش','train')+'   - - '+t2('اعتبارسنجی متقابل','CV')+'   ··· '+t2('آزمون واقعی','true test'),'var(--fg)','start',11);host.append(P.svg);
  info.innerHTML='';info.append(h('span',{},'K = ',h('b',{},K)),h('span',{},t2('بهترین درجه طبق CV: ','Best degree by CV: '),h('b',{},bd)),h('span',{},t2('بهترین درجه طبق آزمون واقعی: ','Best degree on the true test set: '),h('b',{},bt)))};
 kk.input.addEventListener('input',draw);el.append(host,info,h('div',{class:'ctl'},kk.el),h('div',{class:'wn'},t2('۲۴ نقطه‌ی آموزش از y=sin(1.5x)+نویز؛ آزمون واقعی ۳۰۰ نقطه‌ی جدا. خطای آموزش با درجه همیشه کم می‌شود؛ CV و آزمون U‌شکل‌اند و CV بهترین درجه را بدون دیدن آزمون پیدا می‌کند.','24 training points from y = sin(1.5x) + noise; the true test set has 300 separate points. Training error always falls with degree; CV and test errors are U-shaped and CV finds the best degree without seeing the test set.')));draw()};

W.mlp2d=(el,o)=>{let H=4,ds='xor',w1,b1,w2,b2,loss=0,run=null,ep=0;const host=h('div'),info=h('div',{class:'stat'});const sets={xor:()=>MLX.xor(2,25,0.25),rings:()=>MLX.rings(3,60,0.12),moons:()=>MLX.moons(4,50,0.15)};let pts=sets.xor();const ex=[-2.6,2.6,-2.6,2.6];
 const init=()=>{const r=mulberry(7);const g=()=>MLX.gauss(r)*0.8;w1=Array.from({length:H},()=>[g(),g()]);b1=Array(H).fill(0);w2=Array.from({length:H},g);b2=0;ep=0;loss=NaN};
 const fwd=(x,y)=>{const a=w1.map((w,i)=>Math.tanh(w[0]*x+w[1]*y+b1[i]));return{a,p:MLX.sig(a.reduce((s,v,i)=>s+v*w2[i],b2))}};
 const train=n=>{for(let e=0;e<n;e++){const g1=w1.map(()=>[0,0]),gb1=Array(H).fill(0),g2=Array(H).fill(0);let gb2=0,L=0;pts.forEach(p=>{const{a,p:q}=fwd(p.x,p.y),d=q-p.c;L-=p.c?Math.log(q+1e-9):Math.log(1-q+1e-9);gb2+=d;a.forEach((v,i)=>{g2[i]+=d*v;const dh=d*w2[i]*(1-v*v);g1[i][0]+=dh*p.x;g1[i][1]+=dh*p.y;gb1[i]+=dh})});const N=pts.length,eta=0.5;for(let i=0;i<H;i++){w1[i][0]-=eta*g1[i][0]/N;w1[i][1]-=eta*g1[i][1]/N;b1[i]-=eta*gb1[i]/N;w2[i]-=eta*g2[i]/N}b2-=eta*gb2/N;loss=L/N;ep++}};
 const draw=()=>{host.innerHTML='';MLX.map(host,520,300,ex,(x,y)=>fwd(x,y).p,pts,6);const acc=pts.filter(p=>(fwd(p.x,p.y).p>.5)===!!p.c).length/pts.length;info.innerHTML='';info.append(h('span',{},t2('دوره‌ها: ','Epochs: '),h('b',{},ep)),h('span',{},t2('زیان: ','Loss: '),h('b',{},isNaN(loss)?'—':fmt(loss,3))),h('span',{},t2('دقت: ','Accuracy: '),h('b',{},Math.round(acc*100)+'%')),h('span',{},t2('پارامترها: ','Parameters: '),h('b',{},H*4+1)))};
 const hs=rng(t2('نورون‌های پنهان','Hidden units'),0,8,1,4,()=>{},v=>String(Math.round(v)));
 const setH=()=>{H=Math.round(hs.get());stop();if(H===0){w1=[];b1=[];w2=[];b2=0;ep=0;loss=NaN}else init();draw()};hs.input.addEventListener('change',setH);
 const stop=()=>{if(run){T.stop(run);run=null}};
 const dsel=sel(t2('داده','Data'),[{v:'xor',t:'XOR'},{v:'rings',t:t2('حلقه‌ها','Rings')},{v:'moons',t:t2('دو هلال','Moons')}],'xor',v=>{ds=v;pts=sets[v]();stop();if(H)init();draw()});
 el.append(host,info,h('div',{class:'ctl'},hs.el,dsel.el,btn(t2('▶ آموزش','▶ Train'),()=>{if(!H||run)return;run=T.every(()=>{train(8);draw()},60)}),btn(t2('⏸ توقف','⏸ Pause'),stop),btn(t2('↺ شروع مجدد','↺ Restart'),()=>{stop();if(H)init();draw()})),h('div',{class:'wn'},t2('بدون لایه‌ی پنهان (۰ نورون) مدل لجستیک است و XOR را نمی‌تواند جدا کند؛ با ≥۲ نورون tanh مرز خمیده می‌شود. آموزش: گرادیان کامل با η=۰٫۵.','With no hidden layer (0 units) the model is logistic regression and cannot separate XOR; with ≥ 2 tanh units the boundary bends. Training: full-batch gradient descent, η = 0.5.')));init();draw()};

W.conv2d=(el,o)=>{const IMG={bar:t2('میله‌ی عمودی','Vertical bar'),sq:t2('مربع','Square'),diag:t2('قطر','Diagonal')};const mk=n=>Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=>n==='bar'?(j===3||j===4?1:0):n==='sq'?(i>=2&&i<=5&&j>=2&&j<=5?1:0):(Math.abs(i-j)<=0?1:0)));
 const K={vedge:[[-1,0,1],[-1,0,1],[-1,0,1]],hedge:[[-1,-1,-1],[0,0,0],[1,1,1]],blur:[[1,1,1],[1,1,1],[1,1,1]].map(r=>r.map(v=>v/9)),ident:[[0,0,0],[0,1,0],[0,0,0]]};
 let img='bar',ker='vedge',pad=0,str=1;const host=h('div'),info=h('div',{class:'stat'});
 const draw=()=>{host.innerHTML='';const I=mk(img),k=K[ker],n=8,P=pad,S=str,m=Math.floor((n+2*P-3)/S)+1;const get=(i,j)=>(i<0||j<0||i>=n||j>=n)?0:I[i][j];const out=[];for(let a=0;a<m;a++){out.push([]);for(let b=0;b<m;b++){let s=0;for(let u=0;u<3;u++)for(let v=0;v<3;v++)s+=k[u][v]*get(a*S+u-P,b*S+v-P);out[a].push(s)}}
  const svg=sv('svg',{viewBox:'0 0 560 240',class:'sv'});const cs=22;
  I.forEach((r,i)=>r.forEach((v,j)=>svg.append(sv('rect',{x:10+j*cs,y:30+i*cs,width:cs-1,height:cs-1,fill:v?'var(--ac)':'var(--panel2)',stroke:'var(--bd)'}))));svg.append(sv('text',{x:10,y:18,class:'mut','font-size':11},t2('تصویر ۸×۸','input 8×8')));
  svg.append(sv('text',{x:230,y:18,class:'mut','font-size':11},t2('هسته ۳×۳','kernel 3×3')));k.forEach((r,i)=>r.forEach((v,j)=>{svg.append(sv('rect',{x:230+j*34,y:30+i*34,width:33,height:33,class:'cell'}),sv('text',{x:246.5+j*34,y:52+i*34,'text-anchor':'middle','font-size':10},fmt(v,2)))}));
  const mx=Math.max(1,...out.flat().map(Math.abs)),oc=Math.min(22,176/m);svg.append(sv('text',{x:350,y:18,class:'mut','font-size':11},t2('نقشه‌ی ویژگی ','feature map ')+m+'×'+m));
  out.forEach((r,i)=>r.forEach((v,j)=>svg.append(sv('rect',{x:350+j*oc,y:30+i*oc,width:oc-1,height:oc-1,fill:v>0?'var(--ok)':v<0?'var(--bad)':'var(--panel2)',opacity:v?.25+.75*Math.abs(v)/mx:1}))));
  host.append(svg);info.innerHTML='';info.append(h('span',{},t2('اندازه‌ی خروجی ','Output size '),h('b',{},'⌊(8+2·'+P+'−3)/'+S+'⌋+1 = '+m)),h('span',{},t2('پارامترهای هسته: ','Kernel parameters: '),h('b',{},'9+1')),h('span',{},t2('سبز = پاسخ مثبت، قرمز = منفی','green = positive response, red = negative')))};
 const mkSel=(l,o,v,f)=>sel(l,o,v,x=>{f(x);draw()});
 el.append(host,info,h('div',{class:'ctl'},mkSel(t2('تصویر','Image'),Object.entries(IMG).map(([v,t])=>({v,t})),img,v=>img=v).el,mkSel(t2('هسته','Kernel'),[{v:'vedge',t:t2('لبه‌ی عمودی','Vertical edge')},{v:'hedge',t:t2('لبه‌ی افقی','Horizontal edge')},{v:'blur',t:t2('محو','Blur')},{v:'ident',t:t2('همانی','Identity')}],ker,v=>ker=v).el,mkSel('padding',[0,1,2],pad,v=>pad=+v).el,mkSel('stride',[1,2],str,v=>str=+v).el),h('div',{class:'wn'},t2('همان هسته در همه‌ی مکان‌ها اعمال می‌شود (اشتراک وزن)؛ هسته‌ی لبه‌ی عمودی روی میله فقط در دو لبه‌اش پاسخ بزرگ می‌دهد.','The same kernel is applied at every position (weight sharing); the vertical-edge kernel responds strongly only at the bar\'s two edges.')));draw()};
