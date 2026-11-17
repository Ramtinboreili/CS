/* ===================== LAB RUNNER (interactive-educator method: Puzzle → Explore → Name → Challenge) =====================
   A lab is one persistent visual stage + four screens of prompts/controls around it. State lives in `st` (never saved);
   only "challenge solved" is stored (S.labs[id]=1). Every text is a [fa,en] pair. */
window.LABS=[];
function LAB(o){window.LABS.push(o)}
const LABKEYS=['puzzle','explore','name','challenge'];
const LABNAMES=()=>[t2('۱ · معما','1 · Puzzle'),t2('۲ · کاوش','2 · Explore'),t2('۳ · نام‌گذاری','3 · Name'),t2('۴ · چالش','4 · Challenge')];

function pageLabs(){setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:t2('آزمایشگاه‌های تصویری','Visual labs')}]);const v=view();v.innerHTML='';
 v.append(h('h1',{},t2('🔬 آزمایشگاه‌های تصویری','🔬 Visual labs')),h('p',{},t2('هر آزمایشگاه یک ایده‌ی اصلی را در چهار مرحله می‌سازد: معما ← کاوش ← نام‌گذاری ← چالش. اول با دست خودت ایده را می‌یابی، بعد نامش را می‌فهمی، بعد در یک مسئله‌ی تازه به‌کارش می‌بری.','Each lab builds one core idea in four screens: Puzzle → Explore → Name → Challenge. You find the idea with your own hands first, then learn its name, then apply it to a new problem.')));
 for(const m in MODS){const M=MODS[m],ls=LABS.filter(b=>b.mod===m);if(!ls.length)continue;
  v.append(h('h2',{},M.ic+' '+mt(M)+' · '+ls.filter(b=>S.labs[b.id]).length+'/'+ls.length),h('div',{class:'grid g2'},ls.map(labCard)))}}

function pageLab(id,start){const b=LABS.find(x=>x.id===id);if(!b)return pageLabs();const M=MODS[b.mod];
 setCrumb([{t:t2('داشبورد','Dashboard'),href:'#/'},{t:t2('آزمایشگاه‌ها','Labs'),href:'#/labs'},{t:lt(b.t)}]);
 const v=view();v.innerHTML='';const st=b.st();let scr=0;const names=LABNAMES();
 const idx=LABS.indexOf(b),nextLab=LABS[idx+1];
 const stepper=h('div',{class:'tabs lstep'},names.map((n,i)=>h('button',{type:'button',class:'btn',onclick:()=>show(i)},n)));
 const stageBody=h('div',{class:'wb labst'}),stageCard=h('div',{class:'wbox labstage'},h('div',{class:'wt'},t2('صحنه‌ی ثابت — در هر چهار مرحله همین تصویر را می‌بینید','Persistent stage — the same picture on all four screens')),stageBody);
 const panel=h('div',{class:'card labpanel'});
 v.append(h('div',{class:'chips'},h('span',{class:'chip'},M.ic+' '+b.g),h('span',{class:'chip'},'🔬 Lab')),h('h1',{},lt(b.t)),h('p',{class:'aha'},h('b',{},t2('ایده‌ی کلیدی: ','The aha: ')),lt(b.aha)),stepper,h('div',{class:'labgrid'},stageCard,panel));
 const A={st,keys:LABKEYS,get scr(){return LABKEYS[scr]},upd(){draw(LABKEYS[scr],st);check()},lt,fmt};
 window._lab={b,st,A};
 let draw=b.stage(stageBody,st,A)||(()=>{});
 let hintN=0,chalEl=null,winEl=null;
 function check(){if(LABKEYS[scr]!=='challenge'||!chalEl)return;const sp=b.screens.challenge;let ok=false;try{ok=!!sp.ok(st)}catch(e){}
  stageCard.classList.toggle('solved',ok);chalEl.className='chal '+(ok?'yes':'');chalEl.textContent=ok?t2('✔ شرط برقرار شد — تصویر همین را نشان می‌دهد','✔ The condition holds — the picture confirms it'):t2('هنوز برقرار نیست — به تصویر نگاه کنید','Not yet — look at the picture');
  winEl.style.display=ok?'block':'none';if(ok&&!S.labs[b.id]){S.labs[b.id]=1;save();buildNav(null);toast(t2('چالش حل شد 🎉','Challenge solved 🎉'))}}
 function P(pair,cls){return h('div',{class:cls||'lp',html:rich(lt(pair))})}
 function show(n){scr=n;const k=LABKEYS[n],sp=b.screens[k];panel.innerHTML='';hintN=0;chalEl=null;
  $$('.lstep .btn',v).forEach((x,i)=>{x.classList.toggle('on',i===n);x.classList.toggle('done',i<n)});
  panel.append(h('div',{class:'ltag'},names[n]));
  if(k==='puzzle'){const g=b.big;panel.append(h('div',{class:'big',html:rich('<b>'+t2('🧭 کجای مسیر هستیم؟','🧭 Where are we?')+'</b><br>'+'<span class="bg">'+t2('قبلاً دیدیم','Already')+'</span> '+lt(g.had)+'<br><span class="bg">'+t2('هنوز مشکل است','Still missing')+'</span> '+lt(g.miss)+'<br><span class="bg">'+t2('این آزمایشگاه','This lab')+'</span> '+lt(g.fix))}))}
  if(sp.claim)panel.append(h('div',{class:'claim',html:rich('<b>'+t2('ادعا: ','Claim: ')+'</b>'+lt(sp.claim))}));
  if(sp.ask)panel.append(P(sp.ask,'ask'));
  if(sp.do)panel.append(P(sp.do,'lp'));
  if(sp.ctl){const cs=sp.ctl(st,A);if(cs&&cs.length)panel.append(h('div',{class:'ctl lctl'},cs.map(c=>c.el||c)))}
  if(sp.see)panel.append(h('div',{class:'see',html:rich('<b>'+t2('نتیجه: ','Result: ')+'</b>'+lt(sp.see))}));
  if(k==='name'){(sp.says||[]).forEach(x=>panel.append(P(x)));(sp.tex||[]).forEach(t=>panel.append(h('div',{html:rich('$$'+t+'$$')})));
   if(sp.legend)panel.append(h('div',{class:'legend',html:'<table class="dt'+(LANG==='en'?'':' fa')+'">'+sp.legend.map(r=>'<tr><td>'+rich('$'+r[0]+'$')+'</td><td>'+rich(lt(r[1]))+'</td></tr>').join('')+'</table>'}));
   const g=b.big;panel.append(h('div',{class:'big',html:rich('<b>'+t2('🔗 حلقه بسته شد','🔗 Closing the loop')+'</b><br>'+lt(g.close))}))}
  if(k==='challenge'){chalEl=h('div',{class:'chal'});winEl=h('div',{class:'win',style:{display:'none'},html:rich(lt(sp.win))});
   const hb=h('div',{class:'hints'});const hbtn=btn(t2('🤔 گیر کرده‌ام؟ راهنمایی','🤔 Stuck? Hint'),()=>{if(hintN<sp.hints.length){hb.append(h('div',{class:'hint',html:rich('💡 '+(hintN+1)+'/'+sp.hints.length+' · '+lt(sp.hints[hintN]))}));hintN++;renderMath(hb);if(hintN>=sp.hints.length)hbtn.disabled=true}});
   panel.append(chalEl,winEl,h('div',{class:'ctl'},hbtn),hb)}
  const nav=h('div',{class:'ctl lnavb'},n>0?btn(t2('→ قبلی','← Back'),()=>show(n-1)):h('span'),btn(t2('↺ از نو','↺ Reset'),()=>{Object.keys(st).forEach(x=>delete st[x]);Object.assign(st,b.st());show(scr)}));
  if(n<3)nav.append(btn(t2('بعدی ←','Next →'),()=>show(n+1),'pri'));
  else{(b.lessons||[]).forEach(id=>{const l=byId(id);if(l)nav.append(h('a',{class:'btn',href:'#/l/'+id,style:{textDecoration:'none'}},'📖 '+ttl(l)))});if(nextLab)nav.append(h('a',{class:'btn pri',href:'#/lab/'+nextLab.id,style:{textDecoration:'none'}},lt(nextLab.t)+(LANG==='en'?' →':' ←')))}
  panel.append(nav);renderMath(panel);A.upd();window.scrollTo({top:Math.max(0,v.offsetTop-10)})}
 show(Math.max(0,Math.min(3,(+start||1)-1)));
 if(/[?&]solve=1/.test(location.search)&&b.sol){Object.assign(st,b.sol);A.upd()}}
