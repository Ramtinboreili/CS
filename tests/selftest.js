/* Injected into a copy of index.html by tests/run.py. Walks every lesson and lab in both languages and POSTs a JSON report. */
(async()=>{
const R={errors:[],lessons:0,labs:0,notes:[],widgetErr:[],schema:[],untranslated:[]};
window.addEventListener('error',e=>R.errors.push('onerror: '+e.message+' @'+(e.filename||'').split('/').pop()+':'+e.lineno));
const tick=(ms=15)=>new Promise(r=>setTimeout(r,ms));
const go=h=>{history.replaceState(null,'',h);route()};
const ALLOW_FB=new Set(['b6-1','b2-1']);
function schema(l,x,lang){const tag=l.id+'/'+lang;
 if(x.ex.length!==l.ex.length)R.schema.push(tag+' ex length');
 x.ex.forEach((e,i)=>{const b=l.ex[i],w=tag+'#'+(i+1);
  if(e.t!==b.t||e.l!==b.l)R.schema.push(w+' type/level drift');
  if(e.t==='mcq'){if(!Array.isArray(e.o)||e.o.length!==b.o.length)R.schema.push(w+' option count');if(!(e.a>=0&&e.a<e.o.length))R.schema.push(w+' bad answer idx')}
  if(e.t==='tf'&&typeof e.a!=='boolean')R.schema.push(w+' tf answer');
  if(e.t==='num'&&typeof e.a!=='number')R.schema.push(w+' num answer');
  if(e.t==='think'&&!(typeof e.a==='string'&&e.a.length>20||typeof e.e==='string'&&e.e.length>20))R.schema.push(w+' think has no sample answer');
  if(!e.q||!String(e.q).trim())R.schema.push(w+' empty q');
  if(e.t==='sql'){try{const d=SQL.clone(SQL.sampleDB());SQL.runAll(e.sol,d)}catch(er){R.schema.push(w+' sql sol fails: '+er.message)}if(e.sol!==b.sol)R.schema.push(w+' sql sol drift')}});
 if(!x.obj.length||!x.sum.length)R.schema.push(tag+' empty obj/sum')}
for(const lang of ['fa','en']){
 setLang(lang);await tick(50);
 for(const l of LESSONS){go('#/l/'+l.id);await tick(8);R.lessons++;
  const v=document.getElementById('view');
  if(!v.children.length)R.notes.push(lang+' '+l.id+' empty view');
  v.querySelectorAll('.fb.no').forEach(f=>{if(!ALLOW_FB.has(l.id))R.widgetErr.push(lang+' '+l.id+': '+f.textContent.slice(0,80))});
  const X=LX(l);schema(l,X,lang);
  if(lang==='en'&&!X.tr)R.untranslated.push(l.id);
  if(lang==='en'&&X.tr){const faRe=/[؀-ۿ]/;const exs=[];X.ex.forEach(e=>{exs.push(e.q,e.e,e.hint,typeof e.a==='string'?e.a:'');(e.o||[]).forEach(o=>exs.push(o))});const bad=[X.body,...X.obj,...X.sum,...X.mis,...exs].filter(s=>s&&faRe.test(String(s).replace(/<pre[\s\S]*?<\/pre>/g,'')));if(bad.length)R.notes.push('en '+l.id+' still has Persian chars in '+bad.length+' block(s)')}}
 for(const b of LABS){go('#/lab/'+b.id);await tick(8);R.labs++;
  const L=window._lab;if(!L||L.b!==b){R.notes.push(lang+' lab '+b.id+' did not mount');continue}
  const btns=[...document.querySelectorAll('.lstep .btn')];
  for(let i=0;i<4;i++){btns[i].click();await tick(5)}
  const hasYes=()=>!!document.querySelector('.chal.yes');
  if(hasYes())R.notes.push(lang+' lab '+b.id+' challenge is solved at start');
  if(!b.sol)R.notes.push(lang+' lab '+b.id+' has no .sol');else{Object.assign(L.st,b.sol);L.A.upd();await tick(5);if(!hasYes())R.notes.push(lang+' lab '+b.id+' sol does not solve the challenge');
   if(b.fail){Object.assign(L.st,b.fail);L.A.upd();if(hasYes())R.notes.push(lang+' lab '+b.id+' fail-state wrongly solves')}}
  document.querySelectorAll('.labpanel .hint,.labst .fb.no').forEach(f=>{if(f.classList.contains('no'))R.widgetErr.push(lang+' lab '+b.id+': '+f.textContent.slice(0,80))});
  for(let i=0;i<3;i++){btns[3].click();const hb=[...document.querySelectorAll('.hints')].length;await tick(3)}}
 for(const h of ['#/','#/labs','#/p','#/sql','#/m/A','#/m/B','#/m/C','#/m/X','#/m/D']){go(h);await tick(8)}}
R.done=true;
try{await fetch('/result',{method:'POST',body:JSON.stringify(R)})}catch(e){document.title='POSTFAIL'}
})();
