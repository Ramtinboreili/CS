/* ===================== LIB 2: algorithms & math (pure JS) ===================== */
const Lib=(function(){
const L={};
/* ---- PRNG ---- */
L.rng=function(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
L.randn=function(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};

/* ---- sorting frames: {a,cmp:[i,j],swp:[i,j],sorted:Set-like array,pivot,range,d,c,w} ---- */
L.sortFrames=function(arr,algo){const a=arr.slice(),F=[];let c=0,w=0;const n=a.length;let sorted=[];
 const push=(d,o)=>F.push(Object.assign({a:a.slice(),d,c,w,sorted:sorted.slice()},o||{}));
 push(t2('آرایه اولیه','initial array'));
 if(algo==='bubble'){for(let i=0;i<n-1;i++){let sw=false;for(let j=0;j<n-1-i;j++){c++;push(t2(`مقایسه a[${j}]=${a[j]} و a[${j+1}]=${a[j+1]}`,`compare a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`),{cmp:[j,j+1]});
   if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];w++;sw=true;push(t2('جابه‌جایی چون بزرگ‌تر قبل از کوچک‌تر بود','swap because the larger comes before the smaller'),{swp:[j,j+1]})}}
   sorted.push(n-1-i);if(!sw){for(let k=0;k<n-1-i;k++)sorted.push(k);break}}sorted=[...Array(n).keys()]}
 else if(algo==='insertion'){sorted=[0];for(let i=1;i<n;i++){let j=i;push(t2(`کلید a[${i}]=${a[i]} را در بخش مرتب جا می‌دهیم`,`insert key a[${i}]=${a[i]} into the sorted part`),{cmp:[i,i]});
   while(j>0){c++;push(t2(`مقایسه ${a[j-1]} و ${a[j]}`,`compare ${a[j-1]} and ${a[j]}`),{cmp:[j-1,j]});if(a[j-1]>a[j]){[a[j-1],a[j]]=[a[j],a[j-1]];w++;push(t2('جابه‌جایی به چپ','shift left'),{swp:[j-1,j]});j--}else break}
   sorted=[...Array(i+1).keys()]}}
 else if(algo==='selection'){for(let i=0;i<n-1;i++){let m=i;for(let j=i+1;j<n;j++){c++;push(t2(`دنبال کمینه: مقایسه a[${j}]=${a[j]} با کمینه فعلی ${a[m]}`,`looking for the minimum: compare a[${j}]=${a[j]} with the current minimum ${a[m]}`),{cmp:[m,j]});if(a[j]<a[m])m=j}
   if(m!==i){[a[i],a[m]]=[a[m],a[i]];w++;push(t2(`کمینه (${a[i]}) را به موقعیت ${i} می‌بریم`,`move the minimum (${a[i]}) to position ${i}`),{swp:[i,m]})}sorted.push(i)}sorted=[...Array(n).keys()]}
 else if(algo==='merge'){const aux=a.slice();
   (function ms(lo,hi){if(hi-lo<1)return;const mid=(lo+hi)>>1;ms(lo,mid);ms(mid+1,hi);
    for(let k=lo;k<=hi;k++)aux[k]=a[k];let i=lo,j=mid+1;push(t2(`ادغام دو نیمه مرتب [${lo}..${mid}] و [${mid+1}..${hi}]`,`merge the two sorted halves [${lo}..${mid}] and [${mid+1}..${hi}]`),{range:[lo,hi]});
    for(let k=lo;k<=hi;k++){if(i>mid)a[k]=aux[j++];else if(j>hi)a[k]=aux[i++];else{c++;a[k]=aux[j]<aux[i]?aux[j++]:aux[i++]}w++;push(t2(`نوشتن ${a[k]} در موقعیت ${k}`,`write ${a[k]} at position ${k}`),{range:[lo,hi],swp:[k,k]})}})(0,n-1);sorted=[...Array(n).keys()]}
 else if(algo==='quick'){(function qs(lo,hi){if(lo>=hi){if(lo===hi)sorted.push(lo);return}const p=a[hi];let i=lo;push(t2(`pivot = ${p} (آخرین عنصر بازه [${lo}..${hi}])`,`pivot = ${p} (last element of the range [${lo}..${hi}])`),{pivot:hi,range:[lo,hi]});
    for(let j=lo;j<hi;j++){c++;push(t2(`مقایسه a[${j}]=${a[j]} با pivot=${p}`,`compare a[${j}]=${a[j]} with pivot=${p}`),{cmp:[j,hi],pivot:hi,range:[lo,hi]});if(a[j]<p){if(i!==j){[a[i],a[j]]=[a[j],a[i]];w++;push(t2('انتقال عنصر کوچک‌تر به سمت چپ','move the smaller element to the left'),{swp:[i,j],pivot:hi,range:[lo,hi]})}i++}}
    [a[i],a[hi]]=[a[hi],a[i]];w++;sorted.push(i);push(t2(`pivot در جایگاه نهایی ${i} قرار گرفت`,`pivot reached its final position ${i}`),{swp:[i,hi],range:[lo,hi]});qs(lo,i-1);qs(i+1,hi)})(0,n-1);sorted=[...Array(n).keys()]}
 else if(algo==='heap'){const sift=(i,m)=>{for(;;){let l=2*i+1,r=l+1,b=i;if(l<m){c++;if(a[l]>a[b])b=l}if(r<m){c++;if(a[r]>a[b])b=r}if(b===i)return;[a[i],a[b]]=[a[b],a[i]];w++;push(t2(`sift-down: جابه‌جایی ${i} و ${b}`,`sift-down: swap ${i} and ${b}`),{swp:[i,b]});i=b}};
   for(let i=(n>>1)-1;i>=0;i--)sift(i,n);push(t2('ساخت Max-Heap کامل شد','Max-Heap built'));
   for(let e=n-1;e>0;e--){[a[0],a[e]]=[a[e],a[0]];w++;sorted.push(e);push(t2(`بیشینه (${a[e]}) به انتهای آرایه رفت`,`the maximum (${a[e]}) moves to the end of the array`),{swp:[0,e]});sift(0,e)}sorted=[...Array(n).keys()]}
 push(t2('پایان — آرایه مرتب است','done — the array is sorted'));return F};

/* ---- binary search frames ---- */
L.bsearch=function(a,t){const F=[];let lo=0,hi=a.length-1,s=0;F.push({lo,hi,mid:-1,d:t2(`بازه جست‌وجو [${lo}..${hi}] — هدف: ${t}`,`search range [${lo}..${hi}] — target: ${t}`)});
 while(lo<=hi){const mid=(lo+hi)>>1;s++;F.push({lo,hi,mid,d:t2(`گام ${s}: mid=⌊(${lo}+${hi})/2⌋=${mid}، a[mid]=${a[mid]}`,`step ${s}: mid=⌊(${lo}+${hi})/2⌋=${mid}, a[mid]=${a[mid]}`)});
  if(a[mid]===t){F.push({lo,hi,mid,found:mid,d:t2(`پیدا شد! اندیس ${mid} با ${s} مقایسه`,`found! index ${mid} after ${s} comparisons`)});return F}
  if(a[mid]<t){lo=mid+1;F.push({lo,hi,mid:-1,d:t2(`${a[mid]} < ${t} ← نیمه چپ حذف می‌شود: lo=${lo}`,`${a[mid]} < ${t} ← discard the left half: lo=${lo}`)})}else{hi=mid-1;F.push({lo,hi,mid:-1,d:t2(`${a[mid]} > ${t} ← نیمه راست حذف می‌شود: hi=${hi}`,`${a[mid]} > ${t} ← discard the right half: hi=${hi}`)})}}
 F.push({lo,hi,mid:-1,notfound:true,d:t2(`lo>hi ⇒ مقدار ${t} در آرایه نیست (${s} مقایسه)`,`lo>hi ⇒ the value ${t} is not in the array (${s} comparisons)`)});return F};

/* ---- BST / AVL ---- */
const H=n=>n?n.h:0,upd=n=>{n.h=1+Math.max(H(n.l),H(n.r))};
const bf=n=>n?H(n.l)-H(n.r):0;
L.bf=bf;
L.bstInsert=function(root,k){const path=[];if(!root)return{root:{k,h:1},path,added:true};let n=root;
 for(;;){path.push(n.k);if(k===n.k)return{root,path,added:false};if(k<n.k){if(!n.l){n.l={k,h:1};break}n=n.l}else{if(!n.r){n.r={k,h:1};break}n=n.r}}
 const fix=x=>{if(!x)return;fix(x.l);fix(x.r);upd(x)};fix(root);return{root,path,added:true}};
L.bstDelete=function(root,k){let found=false;const del=(n,k)=>{if(!n)return null;if(k<n.k)n.l=del(n.l,k);else if(k>n.k)n.r=del(n.r,k);else{found=true;if(!n.l)return n.r;if(!n.r)return n.l;let m=n.r;while(m.l)m=m.l;n.k=m.k;n.r=del(n.r,m.k)}upd(n);return n};
 const r=del(root,k);return{root:r,found}};
L.search=function(root,k){const p=[];let n=root;while(n){p.push(n.k);if(k===n.k)return{found:true,path:p};n=k<n.k?n.l:n.r}return{found:false,path:p}};
const rotR=y=>{const x=y.l;y.l=x.r;x.r=y;upd(y);upd(x);return x};
const rotL=x=>{const y=x.r;x.r=y.l;y.l=x;upd(x);upd(y);return y};
L.avlInsert=function(root,k,log){const ins=n=>{if(!n)return{k,h:1};if(k<n.k)n.l=ins(n.l);else if(k>n.k)n.r=ins(n.r);else return n;upd(n);const b=bf(n);
  if(b>1&&k<n.l.k){log.push(t2(`عدم تعادل در ${n.k} (حالت LL) ← چرخش راست`,`imbalance at ${n.k} (case LL) ← right rotation`));return rotR(n)}
  if(b<-1&&k>n.r.k){log.push(t2(`عدم تعادل در ${n.k} (حالت RR) ← چرخش چپ`,`imbalance at ${n.k} (case RR) ← left rotation`));return rotL(n)}
  if(b>1&&k>n.l.k){log.push(t2(`عدم تعادل در ${n.k} (حالت LR) ← چرخش چپ روی ${n.l.k} سپس چرخش راست`,`imbalance at ${n.k} (case LR) ← left rotation on ${n.l.k}, then right rotation`));n.l=rotL(n.l);return rotR(n)}
  if(b<-1&&k<n.r.k){log.push(t2(`عدم تعادل در ${n.k} (حالت RL) ← چرخش راست روی ${n.r.k} سپس چرخش چپ`,`imbalance at ${n.k} (case RL) ← right rotation on ${n.r.k}, then left rotation`));n.r=rotR(n.r);return rotL(n)}
  return n};return ins(root)};
L.layout=function(root){const pos=[];let x=0;const go=(n,d,par)=>{if(!n)return;go(n.l,d+1,n);const me={k:n.k,x:x++,y:d,n,par:par?par.k:null};pos.push(me);go(n.r,d+1,n)};go(root,0,null);return pos};
L.order=function(root,type){const o=[];const go=n=>{if(!n)return;if(type==='pre')o.push(n.k);go(n.l);if(type==='in')o.push(n.k);go(n.r);if(type==='post')o.push(n.k)};
 if(type==='level'){const q=root?[root]:[];while(q.length){const n=q.shift();o.push(n.k);n.l&&q.push(n.l);n.r&&q.push(n.r)}return o}go(root);return o};

/* ---- Trie ---- */
L.trieInsert=function(root,w){let n=root;for(const c of w){n=n.c[c]=n.c[c]||{c:{},end:false}}n.end=true};
L.trieNode=()=>({c:{},end:false});
L.trieWalk=function(root,p){let n=root;for(const c of p){if(!n.c[c])return null;n=n.c[c]}return n};
L.trieWords=function(n,pre){let o=[];if(n.end)o.push(pre);for(const c of Object.keys(n.c).sort())o=o.concat(L.trieWords(n.c[c],pre+c));return o};

/* ---- Graph ---- */
L.G1={dir:false,n:[{id:'A',x:70,y:130},{id:'B',x:200,y:50},{id:'C',x:200,y:210},{id:'D',x:340,y:50},{id:'E',x:340,y:210},{id:'F',x:470,y:130}],
 e:[{a:'A',b:'B',w:4},{a:'A',b:'C',w:2},{a:'B',b:'C',w:1},{a:'B',b:'D',w:5},{a:'C',b:'E',w:8},{a:'D',b:'E',w:2},{a:'D',b:'F',w:6},{a:'E',b:'F',w:3}]};
L.G2={dir:true,n:L.G1.n,e:[{a:'A',b:'B',w:4},{a:'A',b:'C',w:5},{a:'B',b:'D',w:-3},{a:'C',b:'B',w:-2},{a:'C',b:'E',w:3},{a:'D',b:'F',w:2},{a:'E',b:'D',w:4},{a:'E',b:'F',w:-1}]};
L.adj=function(g){const m={};g.n.forEach(x=>m[x.id]=[]);g.e.forEach(e=>{m[e.a].push({to:e.b,w:e.w});if(!g.dir)m[e.b].push({to:e.a,w:e.w})});for(const k in m)m[k].sort((p,q)=>p.to<q.to?-1:1);return m};
L.bfs=function(g,s){const m=L.adj(g),F=[],seen=new Set([s]),q=[s],ord=[],tree=[];F.push({q:[...q],seen:[...seen],cur:null,ord:[...ord],tree:[...tree],d:t2(`شروع از ${s}: درون صف می‌گذاریم و علامت می‌زنیم`,`start at ${s}: enqueue it and mark it`)});
 while(q.length){const u=q.shift();ord.push(u);F.push({q:[...q],seen:[...seen],cur:u,ord:[...ord],tree:[...tree],d:t2(`از صف ${u} را خارج می‌کنیم و همسایه‌ها را بررسی می‌کنیم`,`dequeue ${u} and examine its neighbours`)});
  for(const{to}of m[u]){if(!seen.has(to)){seen.add(to);q.push(to);tree.push([u,to]);F.push({q:[...q],seen:[...seen],cur:u,ord:[...ord],tree:[...tree],d:t2(`${to} دیده‌نشده بود ← علامت و وارد صف شد (از طریق ${u})`,`${to} was unseen ← mark and enqueue it (via ${u})`)})}}}
 F.push({q:[],seen:[...seen],cur:null,ord:[...ord],tree:[...tree],d:t2('پایان BFS — ترتیب بازدید: ','BFS finished — visit order: ')+ord.join(' → ')});return F};
L.dfs=function(g,s){const m=L.adj(g),F=[],seen=new Set(),st=[],ord=[],tree=[];
 const snap=(cur,d)=>F.push({q:[...st],seen:[...seen],cur,ord:[...ord],tree:[...tree],d});
 const go=(u,p)=>{seen.add(u);ord.push(u);st.push(u);if(p)tree.push([p,u]);snap(u,t2(`ورود به ${u} (روی پشته فراخوانی)`,`enter ${u} (on the call stack)`));
  for(const{to}of m[u]){if(!seen.has(to)){snap(u,t2(`از ${u} به همسایه دیده‌نشده ${to} می‌رویم (عمیق‌تر)`,`from ${u} go to the unseen neighbour ${to} (deeper)`));go(to,u)}}
  st.pop();snap(u,t2(`همه همسایه‌های ${u} تمام شد ← backtrack`,`all neighbours of ${u} are done ← backtrack`))};go(s,null);
 F.push({q:[],seen:[...seen],cur:null,ord:[...ord],tree:[...tree],d:t2('پایان DFS — ترتیب بازدید: ','DFS finished — visit order: ')+ord.join(' → ')});return F};
L.dijkstra=function(g,s){const m=L.adj(g),dist={},prev={},done=new Set(),F=[];g.n.forEach(x=>dist[x.id]=Infinity);dist[s]=0;
 const snap=(cur,d,rel)=>F.push({dist:Object.assign({},dist),prev:Object.assign({},prev),done:[...done],cur,rel:rel||null,d});snap(null,t2(`dist[${s}]=0 و بقیه ∞`,`dist[${s}]=0 and all others ∞`));
 while(true){let u=null;for(const x of g.n)if(!done.has(x.id)&&dist[x.id]<Infinity&&(u===null||dist[x.id]<dist[u]))u=x.id;if(u===null)break;
  done.add(u);snap(u,t2(`کم‌هزینه‌ترین رأس تثبیت‌نشده: ${u} با فاصله ${dist[u]} ← تثبیت می‌شود`,`cheapest unfinalized vertex: ${u} with distance ${dist[u]} ← finalize it`));
  for(const{to,w}of m[u]){if(done.has(to))continue;if(dist[u]+w<dist[to]){dist[to]=dist[u]+w;prev[to]=u;snap(u,t2(`Relax(${u}→${to}): فاصله ${to} به ${dist[to]} بهبود یافت`,`Relax(${u}→${to}): the distance of ${to} improved to ${dist[to]}`),[u,to])}else snap(u,t2(`Relax(${u}→${to}) بهبودی نداشت (${dist[u]}+${w} ≥ ${dist[to]})`,`Relax(${u}→${to}) gave no improvement (${dist[u]}+${w} ≥ ${dist[to]})`),[u,to])}}
 snap(null,t2('پایان — کوتاه‌ترین فاصله‌ها به‌دست آمد','done — the shortest distances are found'));return F};
L.bellman=function(g,s){const dist={},prev={},F=[];g.n.forEach(x=>dist[x.id]=Infinity);dist[s]=0;const snap=(d,rel,pass)=>F.push({dist:Object.assign({},dist),prev:Object.assign({},prev),rel,pass,d});
 snap(`dist[${s}]=0`,null,0);const V=g.n.length;let neg=false;
 for(let i=1;i<=V;i++){let ch=false;for(const e of g.e){const arcs=g.dir?[[e.a,e.b]]:[[e.a,e.b],[e.b,e.a]];for(const[u,v]of arcs){if(dist[u]<Infinity&&dist[u]+e.w<dist[v]){dist[v]=dist[u]+e.w;prev[v]=u;ch=true;
     if(i===V){neg=true}snap(t2(`دور ${i}: Relax(${u}→${v}, w=${e.w}) ⇒ dist[${v}]=${dist[v]}`,`round ${i}: Relax(${u}→${v}, w=${e.w}) ⇒ dist[${v}]=${dist[v]}`),[u,v],i)}}}
  if(!ch){snap(t2(`دور ${i}: هیچ تغییری نبود ⇒ توقف زودهنگام`,`round ${i}: no change ⇒ early stop`),null,i);break}}
 if(neg)snap(t2('در دور V هنوز بهبود رخ داد ⇒ دور منفی وجود دارد!','an improvement still happened in round V ⇒ a negative cycle exists!'),null,V);else snap(t2('پایان — دور منفی قابل‌دسترس وجود ندارد','done — no reachable negative cycle exists'),null,V);return F};
L.floyd=function(g){const ids=g.n.map(x=>x.id),n=ids.length,INF=Infinity;const D=ids.map((_,i)=>ids.map((_,j)=>i===j?0:INF));
 g.e.forEach(e=>{const i=ids.indexOf(e.a),j=ids.indexOf(e.b);D[i][j]=Math.min(D[i][j],e.w);if(!g.dir)D[j][i]=Math.min(D[j][i],e.w)});
 const F=[{D:D.map(r=>r.slice()),k:-1,ch:[],d:t2('ماتریس اولیه: وزن یال‌های مستقیم، قطر صفر، بقیه ∞','initial matrix: direct edge weights, zero diagonal, everything else ∞')}];
 for(let k=0;k<n;k++){const ch=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(D[i][k]+D[k][j]<D[i][j]){D[i][j]=D[i][k]+D[k][j];ch.push([i,j])}
  F.push({D:D.map(r=>r.slice()),k,ch,d:t2(`مرحله k=${ids[k]}: آیا عبور از ${ids[k]} مسیر کوتاه‌تری می‌سازد؟ ${ch.length} خانه بهبود یافت`,`step k=${ids[k]}: does going through ${ids[k]} give a shorter path? ${ch.length} cells improved`)})}return{F,ids}};

/* ---- Hash table ---- */
L.hash=function(s,m){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h%m};
/* ---- B+ tree ---- */
L.BPT=class{constructor(m){this.m=m;this.root={leaf:true,keys:[],kids:[],next:null}}
 insert(k){const r=this._i(this.root,k);if(r==='dup')return false;if(r)this.root={leaf:false,keys:[r.key],kids:[this.root,r.right]};return true}
 _i(n,k){if(n.leaf){if(n.keys.includes(k))return'dup';let i=0;while(i<n.keys.length&&n.keys[i]<k)i++;n.keys.splice(i,0,k);
   if(n.keys.length>this.m){const mid=Math.ceil(n.keys.length/2);const right={leaf:true,keys:n.keys.splice(mid),kids:[],next:n.next};n.next=right;return{key:right.keys[0],right}}return null}
  let i=0;while(i<n.keys.length&&k>=n.keys[i])i++;const r=this._i(n.kids[i],k);if(!r||r==='dup')return r;n.keys.splice(i,0,r.key);n.kids.splice(i+1,0,r.right);
  if(n.keys.length>this.m){const mid=Math.floor(n.keys.length/2);const up=n.keys[mid];const right={leaf:false,keys:n.keys.splice(mid+1),kids:n.kids.splice(mid+1)};n.keys.pop();return{key:up,right}}return null}
 search(k){const path=[];let n=this.root;while(!n.leaf){path.push(n);let i=0;while(i<n.keys.length&&k>=n.keys[i])i++;n=n.kids[i]}path.push(n);return{path,found:n.keys.includes(k)}}
 height(){let h=1,n=this.root;while(!n.leaf){n=n.kids[0];h++}return h}
 range(a,b){let n=this.root;while(!n.leaf){let i=0;while(i<n.keys.length&&a>=n.keys[i])i++;n=n.kids[i]}const out=[],leaves=[];while(n){leaves.push(n);for(const k of n.keys){if(k>b)return{out,leaves};if(k>=a)out.push(k)}n=n.next}return{out,leaves}}
 layout(){const W=k=>Math.max(1,k)*26+14,nodes=[];let cur=0;const GAP=14;
  const go=(n,d)=>{let x,w=W(n.keys.length);if(n.leaf){x=cur+w/2;cur+=w+GAP}else{const cs=n.kids.map(c=>go(c,d+1));x=(cs[0].x+cs[cs.length-1].x)/2}const o={n,x,y:d,w};nodes.push(o);return o};
  const root=go(this.root,0);return{nodes,width:cur,h:this.height()}}};
/* ---- DP / recursion ---- */
L.lcs=function(a,b){const m=a.length,n=b.length;const T=Array.from({length:m+1},()=>Array(n+1).fill(0));const F=[];const snap=(cur,d,path)=>F.push({T:T.map(r=>r.slice()),cur,d,path:path||[]});snap(null,t2('ردیف و ستون صفر = ۰ (رشته تهی)','row and column 0 = 0 (empty string)'));
 for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){if(a[i-1]===b[j-1]){T[i][j]=T[i-1][j-1]+1;snap([i,j],`${a[i-1]}=${b[j-1]} ⇒ T[${i}][${j}] = T[${i-1}][${j-1}]+1 = ${T[i][j]}`)}else{T[i][j]=Math.max(T[i-1][j],T[i][j-1]);snap([i,j],`${a[i-1]}≠${b[j-1]} ⇒ T[${i}][${j}] = max(${T[i-1][j]}, ${T[i][j-1]}) = ${T[i][j]}`)}}
 let i=m,j=n,s='',path=[[i,j]];while(i>0&&j>0){if(a[i-1]===b[j-1]){s=a[i-1]+s;i--;j--}else if(T[i-1][j]>=T[i][j-1])i--;else j--;path.push([i,j])}
 snap(null,t2(`بازسازی پاسخ (Traceback): LCS = "${s}" با طول ${T[m][n]}`,`reconstruct the answer (traceback): LCS = "${s}" with length ${T[m][n]}`),path);return{F,lcs:s}};
L.fibCount=function(n,memo){let calls=0;const M={};const f=k=>{calls++;if(k<2)return k;if(memo&&k in M)return M[k];const v=f(k-1)+f(k-2);if(memo)M[k]=v;return v};const v=f(n);return{v,calls}};
L.fibTree=function(n,memo){const M={};let id=0;const go=k=>{const node={k,id:id++,kids:[],hit:false};if(k<2)return node;if(memo&&k in M){node.hit=true;return node}node.kids=[go(k-1),go(k-2)];M[k]=1;return node};return go(n)};
L.queens=function(n){const F=[],cols=[];let cnt=0,sol=0;const ok=(r,c)=>{for(let i=0;i<r;i++)if(cols[i]===c||Math.abs(cols[i]-c)===r-i)return false;return true};
 const go=r=>{if(F.length>3000)return;if(r===n){sol++;F.push({q:cols.slice(),try:null,d:t2(`جواب شماره ${sol} پیدا شد!`,`solution number ${sol} found!`),sol:true});return}
  for(let c=0;c<n;c++){cnt++;if(ok(r,c)){cols[r]=c;F.push({q:cols.slice(0,r+1),try:[r,c],d:t2(`ردیف ${r}: ستون ${c} امن است ← قرار می‌دهیم`,`row ${r}: column ${c} is safe ← place a queen`)});go(r+1);cols.length=r;if(F.length<=3000)F.push({q:cols.slice(0,r),try:[r,c],d:t2(`Backtrack از ردیف ${r}، ستون ${c} — برمی‌گردیم`,`backtrack from row ${r}, column ${c} — go back`),back:true})}
   else F.push({q:cols.slice(0,r),try:[r,c],bad:true,d:t2(`ردیف ${r}: ستون ${c} با ملکه‌های قبلی تهدید می‌شود ✗`,`row ${r}: column ${c} is attacked by earlier queens ✗`)})}};go(0);return{F,tries:cnt,sol}};
L.coinGreedy=function(coins,t){const c=[...coins].sort((a,b)=>b-a);let r=t;const used=[];for(const x of c){while(r>=x){r-=x;used.push(x)}}return r?null:used};
L.coinDP=function(coins,t){const D=Array(t+1).fill(Infinity),P=Array(t+1).fill(-1);D[0]=0;for(let i=1;i<=t;i++)for(const c of coins)if(c<=i&&D[i-c]+1<D[i]){D[i]=D[i-c]+1;P[i]=c}
 if(D[t]===Infinity)return null;const used=[];let x=t;while(x>0){used.push(P[x]);x-=P[x]}return used};

/* ---- LRU buffer pool ---- */
L.lru=function(seq,cap){const pool=[];let hit=0;const F=[];seq.forEach(p=>{const i=pool.indexOf(p);let ev=null,h=false;if(i>=0){hit++;h=true;pool.splice(i,1);pool.push(p)}else{if(pool.length>=cap)ev=pool.shift();pool.push(p)}F.push({p,h,ev,pool:pool.slice()})});return{F,hit,rate:seq.length?hit/seq.length:0}};
/* ---- consistent hashing ---- */
L.h32=function(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}h^=h>>>13;h=Math.imul(h,0x5bd1e995)>>>0;h^=h>>>15;return h>>>0};
L.ring=function(nodes,vn){const r=[];nodes.forEach(n=>{for(let i=0;i<vn;i++)r.push({h:L.h32(n+'#'+i),n})});r.sort((a,b)=>a.h-b.h);return r};
L.ringLookup=function(r,key){const h=L.h32(key);for(const x of r)if(x.h>=h)return x.n;return r[0].n};
/* ---- functional dependencies ---- */
L.closure=function(attrs,fds){const s=new Set(attrs);let ch=true;while(ch){ch=false;for(const[l,r]of fds)if(l.every(a=>s.has(a))){for(const a of r)if(!s.has(a)){s.add(a);ch=true}}}return[...s].sort()};
L.candKeys=function(all,fds){const n=all.length,keys=[];for(let m=1;m<(1<<n);m++){const sub=all.filter((_,i)=>m&(1<<i));if(keys.some(k=>k.every(a=>sub.includes(a))))continue;if(L.closure(sub,fds).length===all.length)keys.push(sub)}
 return keys.sort((a,b)=>a.length-b.length)};
/* ---- isolation-level simulation ---- */
L._isoMk=()=>({
 dirty:{t:'Dirty Read',init:{x:100},steps:[['T1','write','x',200,t2('T1: UPDATE accounts SET x = 200 (هنوز commit نشده)','T1: UPDATE accounts SET x = 200 (not committed yet)')],['T2','read','x',null,'T2: SELECT x'],['T1','rollback',null,null,'T1: ROLLBACK'],['T2','read','x',null,t2('T2: دوباره SELECT x','T2: SELECT x again')]]},
 nonrep:{t:'Non-Repeatable Read',init:{x:100},steps:[['T1','read','x',null,'T1: SELECT x'],['T2','write','x',200,'T2: UPDATE x = 200'],['T2','commit',null,null,'T2: COMMIT'],['T1','read','x',null,t2('T1: دوباره SELECT x','T1: SELECT x again')]]},
 phantom:{t:'Phantom Read',init:{rows:3},steps:[['T1','count','rows',null,'T1: SELECT COUNT(*) WHERE dept=1'],['T2','insert','rows',null,t2('T2: INSERT یک ردیف جدید با dept=1','T2: INSERT a new row with dept=1')],['T2','commit',null,null,'T2: COMMIT'],['T1','count','rows',null,t2('T1: دوباره COUNT(*)','T1: COUNT(*) again')]]}});
Object.defineProperty(L,'isoScenarios',{get(){return L._isoMk()}});
L.isoRun=function(sc,level){const S=L.isoScenarios[sc],lv=['RU','RC','RR','SER'].indexOf(level);const committed=Object.assign({},S.init);let un=null,snap=null,blockedW=false;const log=[],reads=[];
 S.steps.forEach(([tx,op,key,val,txt])=>{let res='',note='';
  if(op==='write'||op==='insert'){
   if(lv===3&&sc!=='dirty'&&snap){res=t2('⏳ مسدود می‌شود: قفل/تداخل روی داده‌ای که T1 خوانده؛ تا پایان T1 اجرا نمی‌شود','⏳ blocked: lock/conflict on data that T1 read; it will not run until T1 ends');blockedW=true}
   else{un={key,val:op==='write'?val:(committed[key]||0)+1};res=t2('اعمال شد (هنوز commit نشده)','applied (not committed yet)')}}
  else if(op==='commit'){if(blockedW)res=t2('⏳ در انتظار (T2 هنوز پشت قفل است)','⏳ waiting (T2 is still behind a lock)');else{if(un){committed[un.key]=un.val;un=null}res=t2('commit شد','committed')}}
  else if(op==='rollback'){un=null;res=t2('تغییرات T1 لغو شد','T1\'s changes were rolled back')}
  else{if(lv>=2&&!snap)snap=Object.assign({},committed);let v;
   if(lv===0)v=(un&&un.key===key)?un.val:committed[key];else if(lv===1)v=committed[key];
   else{v=snap[key];if(lv===3&&un&&un.key===key&&sc==='dirty')res=t2('⏳ T2 تا پایان T1 مسدود می‌شود؛ سپس ','⏳ T2 is blocked until T1 finishes; then ')}
   res+=t2(`مقدار خوانده‌شده = ${v}`,`value read = ${v}`);reads.push(v)}
  log.push({tx,txt,res,note})});
 let anomaly=null;
 if(sc==='dirty'&&reads[0]===200)anomaly=t2('Dirty Read رخ داد: T2 مقداری (200) را دید که هرگز commit نشد و بعداً rollback شد.','A dirty read occurred: T2 saw a value (200) that was never committed and was later rolled back.');
 if(sc==='nonrep'&&reads[0]!==reads[1])anomaly=t2(`Non-Repeatable Read رخ داد: T1 یک ردیف را دو بار خواند و دو مقدار متفاوت (${reads[0]} و ${reads[1]}) دید.`,`A non-repeatable read occurred: T1 read the same row twice and saw two different values (${reads[0]} and ${reads[1]}).`);
 if(sc==='phantom'&&reads[0]!==reads[1])anomaly=t2(`Phantom Read رخ داد: شمارش ردیف‌های مطابق شرط از ${reads[0]} به ${reads[1]} تغییر کرد.`,`A phantom read occurred: the count of rows matching the condition changed from ${reads[0]} to ${reads[1]}.`);
 return{log,anomaly,reads}};

/* ---- Math ---- */
L.erf=x=>{const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x))};
L.npdf=(x,m,s)=>Math.exp(-0.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
L.ncdf=(x,m,s)=>0.5*(1+L.erf((x-m)/(s*Math.SQRT2)));
L.binom=(n,k,p)=>{let c=1;for(let i=1;i<=k;i++)c=c*(n-k+i)/i;return c*Math.pow(p,k)*Math.pow(1-p,n-k)};
L.mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
L.variance=(a,ddof)=>{const m=L.mean(a);return a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-(ddof||0))};
L.corr=(x,y)=>{const mx=L.mean(x),my=L.mean(y);let sxy=0,sxx=0,syy=0;x.forEach((v,i)=>{sxy+=(v-mx)*(y[i]-my);sxx+=(v-mx)**2;syy+=(y[i]-my)**2});return sxy/Math.sqrt(sxx*syy)};
L.matmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
L.T=A=>A[0].map((_,j)=>A.map(r=>r[j]));
L.solve=function(A,b){const n=A.length,M=A.map((r,i)=>[...r,b[i]]);for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;[M[i],M[p]]=[M[p],M[i]];
  for(let r=i+1;r<n;r++){const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}}
 const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=M[i][n];for(let j=i+1;j<n;j++)s-=M[i][j]*x[j];x[i]=s/M[i][i]}return x};
L.polyfit=function(xs,ys,deg,lam){const X=xs.map(x=>Array.from({length:deg+1},(_,k)=>Math.pow(x,k)));const Xt=L.T(X);const A=L.matmul(Xt,X);for(let i=1;i<=deg;i++)A[i][i]+=lam||0;
 const b=Xt.map(r=>r.reduce((s,v,i)=>s+v*ys[i],0));return L.solve(A,b)};
L.polyval=(w,x)=>w.reduce((s,c,k)=>s+c*Math.pow(x,k),0);
L.eig2=function(M){const[a,b,c,d]=[M[0][0],M[0][1],M[1][0],M[1][1]];const tr=a+d,det=a*d-b*c,disc=tr*tr/4-det;
 if(disc<-1e-12)return{complex:true,re:tr/2,im:Math.sqrt(-disc),tr,det};const s=Math.sqrt(Math.max(0,disc));const l=[tr/2+s,tr/2-s];
 const vec=lm=>{let v;if(Math.abs(c)>1e-12)v=[lm-d,c];else if(Math.abs(b)>1e-12)v=[b,lm-a];else v=Math.abs(lm-a)<1e-9?[1,0]:[0,1];const n=Math.hypot(v[0],v[1])||1;return[v[0]/n,v[1]/n]};
 return{complex:false,l,v:l.map(vec),tr,det}};
L.svd2=function(M){const[a,b,c,d]=[M[0][0],M[0][1],M[1][0],M[1][1]];const p=a*a+c*c,q=a*b+c*d,r=b*b+d*d;const th=0.5*Math.atan2(2*q,p-r);const cs=Math.cos(th),sn=Math.sin(th);
 let l1=p*cs*cs+2*q*cs*sn+r*sn*sn,l2=p*sn*sn-2*q*cs*sn+r*cs*cs;let v1=[cs,sn],v2=[-sn,cs];if(l2>l1){[l1,l2]=[l2,l1];[v1,v2]=[v2,v1]}
 const s1=Math.sqrt(Math.max(0,l1)),s2=Math.sqrt(Math.max(0,l2));const A=(v)=>[a*v[0]+b*v[1],c*v[0]+d*v[1]];
 const u1=s1>1e-9?A(v1).map(x=>x/s1):[1,0];const u2=s2>1e-9?A(v2).map(x=>x/s2):[-u1[1],u1[0]];return{s:[s1,s2],V:[v1,v2],U:[u1,u2]}};
L.softmax=a=>{const m=Math.max(...a);const e=a.map(x=>Math.exp(x-m));const s=e.reduce((x,y)=>x+y,0);return e.map(x=>x/s)};
L.sigmoid=x=>1/(1+Math.exp(-x));
return L})();
