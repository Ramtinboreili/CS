/* ===================== LIB 1: Mini SQL engine (pure JS) ===================== */
const SQL=(function(){
const KW=new Set('SELECT FROM WHERE GROUP BY HAVING ORDER LIMIT OFFSET JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT IN IS NULL LIKE BETWEEN DISTINCT CASE WHEN THEN ELSE END ASC DESC WITH OVER PARTITION EXISTS INSERT INTO VALUES UPDATE SET DELETE TRUE FALSE'.split(' '));
const AGG=new Set(['COUNT','SUM','AVG','MIN','MAX']);
const WINF=new Set(['ROW_NUMBER','RANK','DENSE_RANK','LAG','LEAD','COUNT','SUM','AVG','MIN','MAX']);
function tokenize(s){const t=[];let i=0;while(i<s.length){const c=s[i];
 if(/\s/.test(c)){i++;continue}
 if(c==='-'&&s[i+1]==='-'){while(i<s.length&&s[i]!=='\n')i++;continue}
 if(/[0-9]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;t.push({k:'num',v:parseFloat(s.slice(i,j)),p:i,e:j});i=j;continue}
 if(c==="'"){let j=i+1,v='';while(j<s.length){if(s[j]==="'"){if(s[j+1]==="'"){v+="'";j+=2;continue}break}v+=s[j++]}
  if(j>=s.length)throw new Error('Unterminated string literal');t.push({k:'str',v,p:i,e:j+1});i=j+1;continue}
 if(/[A-Za-z_]/.test(c)){let j=i;while(j<s.length&&/[A-Za-z0-9_]/.test(s[j]))j++;const w=s.slice(i,j);t.push({k:'id',v:w.toLowerCase(),u:w.toUpperCase(),p:i,e:j});i=j;continue}
 const two=s.substr(i,2);if(['<=','>=','<>','!=','||'].includes(two)){t.push({k:'op',v:two==='!='?'<>':two,p:i,e:i+2});i+=2;continue}
 if('=<>+-*/%(),.;'.includes(c)){t.push({k:'op',v:c,p:i,e:i+1});i++;continue}
 throw new Error('Unexpected character: '+c)}
 t.push({k:'eof',p:s.length,e:s.length});return t}

function parse(src){const tk=tokenize(src);let p=0;
 const err=m=>new Error(m+' (near token '+(p+1)+')');
 const kw=u=>tk[p].k==='id'&&tk[p].u===u;
 const acc=u=>kw(u)?(p++,true):false;
 const exp=u=>{if(!acc(u))throw err('Expected '+u)};
 const op=v=>tk[p].k==='op'&&tk[p].v===v;
 const accOp=v=>op(v)?(p++,true):false;
 const expOp=v=>{if(!accOp(v))throw err('Expected "'+v+'"')};
 const ident=()=>{const x=tk[p];if(x.k!=='id'||KW.has(x.u))throw err('Expected identifier');p++;return x.v};
 const isIdent=()=>tk[p].k==='id'&&!KW.has(tk[p].u);
 function statement(){let q;
  if(kw('WITH')||kw('SELECT'))q=query();
  else if(acc('INSERT')){exp('INTO');const t=ident();let cols=null;if(accOp('(')){cols=[];do cols.push(ident());while(accOp(','));expOp(')')}
   exp('VALUES');const rows=[];do{expOp('(');const r=[];do r.push(expr());while(accOp(','));expOp(')');rows.push(r)}while(accOp(','));q={t:'insert',tbl:t,cols,rows}}
  else if(acc('UPDATE')){const t=ident();exp('SET');const sets=[];do{const c=ident();expOp('=');sets.push({c,e:expr()})}while(accOp(','));let w=null;if(acc('WHERE'))w=expr();q={t:'update',tbl:t,sets,where:w}}
  else if(acc('DELETE')){exp('FROM');const t=ident();let w=null;if(acc('WHERE'))w=expr();q={t:'delete',tbl:t,where:w}}
  else throw err('Supported statements: SELECT, WITH, INSERT, UPDATE, DELETE');
  accOp(';');if(tk[p].k!=='eof')throw err('Unexpected trailing input');return q}
 function query(){if(acc('WITH')){const ctes=[];do{const n=ident();exp('AS');expOp('(');const s=query();expOp(')');ctes.push({name:n,q:s})}while(accOp(','));const q=select();q.ctes=ctes;return q}return select()}
 function source(){if(accOp('(')){const sub=query();expOp(')');acc('AS');return{sub,al:ident()}}
  const n=ident();let al=n;if(acc('AS'))al=ident();else if(isIdent())al=ident();return{tbl:n,al}}
 function select(){exp('SELECT');const q={t:'select',items:[],joins:[],ctes:null};q.distinct=acc('DISTINCT');
  do{if(op('*')){p++;q.items.push({e:{t:'star'},txt:'*'})}else{const s=tk[p].p;const e=expr();const en=tk[p-1].e;let al=null;if(acc('AS'))al=ident();else if(isIdent())al=ident();q.items.push({e,al,txt:src.slice(s,en)})}}while(accOp(','));
  if(acc('FROM')){q.from=source();for(;;){let ty=null;
    if(acc('JOIN'))ty='INNER';else if(acc('INNER')){exp('JOIN');ty='INNER'}
    else if(kw('LEFT')||kw('RIGHT')||kw('FULL')){ty=tk[p].u;p++;acc('OUTER');exp('JOIN')}
    else if(acc('CROSS')){exp('JOIN');ty='CROSS'}else if(accOp(','))ty='CROSS';else break;
    const s2=source();let on=null;if(ty!=='CROSS'){exp('ON');on=expr()}q.joins.push({type:ty,src:s2,on})}}
  if(acc('WHERE'))q.where=expr();
  if(acc('GROUP')){exp('BY');q.group=[];do q.group.push(expr());while(accOp(','))}
  if(acc('HAVING'))q.having=expr();
  if(acc('ORDER')){exp('BY');q.order=[];do{const e=expr();let d=false;if(acc('DESC'))d=true;else acc('ASC');q.order.push({e,d})}while(accOp(','))}
  if(acc('LIMIT')){q.limit=tk[p++].v;if(acc('OFFSET'))q.offset=tk[p++].v}
  return q}
 function expr(){return orE()}
 function orE(){let l=andE();while(acc('OR'))l={t:'bin',op:'OR',l,r:andE()};return l}
 function andE(){let l=notE();while(acc('AND'))l={t:'bin',op:'AND',l,r:notE()};return l}
 function notE(){if(acc('NOT'))return{t:'not',e:notE()};return cmpE()}
 function cmpE(){let l=addE();
  for(;;){
   if(tk[p].k==='op'&&['=','<>','<','>','<=','>='].includes(tk[p].v)){const o=tk[p++].v;l={t:'bin',op:o,l,r:addE()};continue}
   if(acc('IS')){const neg=acc('NOT');exp('NULL');l={t:'isnull',e:l,neg};continue}
   let neg=false;const save=p;if(kw('NOT')){neg=true;p++}
   if(acc('IN')){expOp('(');if(kw('SELECT')||kw('WITH')){const q=query();expOp(')');l={t:'in',e:l,sub:q,neg}}else{const list=[];do list.push(expr());while(accOp(','));expOp(')');l={t:'in',e:l,list,neg}}continue}
   if(acc('BETWEEN')){const lo=addE();exp('AND');const hi=addE();l={t:'between',e:l,lo,hi,neg};continue}
   if(acc('LIKE')){l={t:'like',e:l,pat:addE(),neg};continue}
   p=save;break}
  return l}
 function addE(){let l=mulE();while(tk[p].k==='op'&&['+','-','||'].includes(tk[p].v)){const o=tk[p++].v;l={t:'bin',op:o,l,r:mulE()}}return l}
 function mulE(){let l=unE();while(tk[p].k==='op'&&['*','/','%'].includes(tk[p].v)){const o=tk[p++].v;l={t:'bin',op:o,l,r:unE()}}return l}
 function unE(){if(accOp('-'))return{t:'un',e:unE()};return prim()}
 function prim(){const x=tk[p];
  if(x.k==='num'){p++;return{t:'lit',v:x.v}}
  if(x.k==='str'){p++;return{t:'lit',v:x.v}}
  if(accOp('(')){if(kw('SELECT')||kw('WITH')){const q=query();expOp(')');return{t:'sub',q}}const e=expr();expOp(')');return e}
  if(x.k==='id'){
   if(acc('NULL'))return{t:'lit',v:null};if(acc('TRUE'))return{t:'lit',v:true};if(acc('FALSE'))return{t:'lit',v:false};
   if(acc('EXISTS')){expOp('(');const q=query();expOp(')');return{t:'exists',q}}
   if(acc('CASE')){const whens=[];let els=null;let base=null;if(!kw('WHEN'))base=expr();while(acc('WHEN')){const c=expr();exp('THEN');whens.push([c,expr()])}if(acc('ELSE'))els=expr();exp('END');return{t:'case',base,whens,els}}
   if(KW.has(x.u))throw err('Unexpected keyword '+x.u);
   p++;
   if(op('(')){p++;const f={t:'fn',name:x.u,args:[],star:false,distinct:false,over:null};
    if(accOp('*')){f.star=true}else if(!op(')')){f.distinct=acc('DISTINCT');do f.args.push(expr());while(accOp(','))}
    expOp(')');
    if(acc('OVER')){expOp('(');const o={part:[],order:[]};if(acc('PARTITION')){exp('BY');do o.part.push(expr());while(accOp(','))}
     if(acc('ORDER')){exp('BY');do{const e=expr();let d=false;if(acc('DESC'))d=true;else acc('ASC');o.order.push({e,d})}while(accOp(','))}expOp(')');f.over=o}
    return f}
   if(accOp('.')){if(accOp('*'))return{t:'star',tbl:x.v};const n=ident();return{t:'col',tbl:x.v,name:n}}
   return{t:'col',name:x.v}}
  throw err('Unexpected token')}
 return statement()}

/* ---------- execution ---------- */
function walk(n,f){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(x=>walk(x,f));return}
 if(f(n)===false)return;if(n.t==='sub'||n.t==='exists')return;for(const k in n){if(k==='sub'||k==='q')continue;walk(n[k],f)}}
const hasAgg=e=>{let r=false;walk(e,n=>{if(n.t==='fn'&&AGG.has(n.name)&&!n.over){r=true;return false}});return r};
const collectWin=e=>{const r=[];walk(e,n=>{if(n.t==='fn'&&n.over)r.push(n)});return r};
const cmpv=(a,b)=>a===b?0:(a<b?-1:1);
function cmpNull(a,b){if(a===null&&b===null)return 0;if(a===null)return -1;if(b===null)return 1;return cmpv(a,b)}
function like(s,p){const re=new RegExp('^'+String(p).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/%/g,'.*').replace(/_/g,'.')+'$','i');return re.test(String(s))}

function run(sqlText,db){const ast=typeof sqlText==='string'?parse(sqlText):sqlText;const st={scanned:0};
 let res;if(ast.t==='select')res=runSelect(ast,db,null,{},st);else res=runDML(ast,db,st);res.scanned=st.scanned;return res}

function getTable(db,name){const t=db.tables[name.toLowerCase()];if(!t)throw new Error('no such table: '+name);return t}
function rowObj(al,cols,r){const o={};cols.forEach((c,i)=>o[al+'.'+c]=r[i]);return o}

function runSelect(q,db,outer,cte,st){
 cte=Object.assign({},cte);
 if(q.ctes)for(const c of q.ctes){const r=runSelect(c.q,db,outer,cte,st);cte[c.name]=r}
 const sources=[];let rows=[{}];
 const load=s=>{let cols,data;if(s.sub){const r=runSelect(s.sub,db,outer,cte,st);cols=r.cols.map(c=>c.toLowerCase());data=r.rows}
  else if(cte[s.tbl]){cols=cte[s.tbl].cols.map(c=>c.toLowerCase());data=cte[s.tbl].rows}
  else{const t=getTable(db,s.tbl);cols=t.cols;data=t.rows;st.scanned+=data.length}
  return{al:s.al,cols,data}};
 if(q.from){const s=load(q.from);sources.push({al:s.al,cols:s.cols});rows=s.data.map(r=>rowObj(s.al,s.cols,r));
  for(const j of q.joins){const s2=load(j.src);const nullR=rowObj(s2.al,s2.cols,s2.cols.map(()=>null));
   const nullL={};sources.forEach(x=>x.cols.forEach(c=>nullL[x.al+'.'+c]=null));
   const right=s2.data.map(r=>rowObj(s2.al,s2.cols,r));const usedR=new Set();const out=[];
   for(const l of rows){let m=false;for(let i=0;i<right.length;i++){const mg=Object.assign({},l,right[i]);
     if(j.type==='CROSS'||ev(j.on,{row:mg,outer,st,db,cte})===true){out.push(mg);m=true;usedR.add(i)}}
    if(!m&&(j.type==='LEFT'||j.type==='FULL'))out.push(Object.assign({},l,nullR))}
   if(j.type==='RIGHT'||j.type==='FULL')right.forEach((r,i)=>{if(!usedR.has(i))out.push(Object.assign({},nullL,r))});
   rows=out;sources.push({al:s2.al,cols:s2.cols})}}
 const mk=r=>({row:r,outer,st,db,cte});
 let units=rows.map(mk);
 if(q.where)units=units.filter(u=>ev(q.where,u)===true);
 const aggQ=q.group||q.items.some(i=>hasAgg(i.e))||(q.having&&hasAgg(q.having))||(q.order&&q.order.some(o=>hasAgg(o.e)));
 if(aggQ){const groups=new Map();
  if(q.group){const ge=q.group.map(g=>{if(g.t==='col'&&!g.tbl){const it=q.items.find(i=>i.al===g.name);if(it)return it.e}return g});for(const u of units){const key=JSON.stringify(ge.map(g=>ev(g,u)));if(!groups.has(key))groups.set(key,[]);groups.get(key).push(u.row)}}
  else groups.set('',units.map(u=>u.row));
  units=[...groups.values()].map(rs=>({row:rs[0]||{},rows:rs,outer,st,db,cte}));
  if(q.having)units=units.filter(u=>ev(q.having,u)===true)}
 // window functions
 const wins=[];q.items.forEach(i=>wins.push(...collectWin(i.e)));if(q.order)q.order.forEach(o=>wins.push(...collectWin(o.e)));
 wins.forEach(w=>computeWindow(w,units));
 // expand select items
 const names=[],getters=[];
 q.items.forEach(it=>{
  if(it.e.t==='star'){const tb=it.e.tbl;sources.forEach(s=>{if(tb&&s.al!==tb)return;s.cols.forEach(c=>{names.push(c);getters.push(u=>u.row[s.al+'.'+c])})});if(tb&&!sources.some(s=>s.al===tb))throw new Error('no such table alias: '+tb)}
  else{names.push(it.al||(it.e.t==='col'?it.e.name:it.txt));getters.push(u=>ev(it.e,u))}});
 let out=units.map(u=>{const vals=getters.map(g=>g(u));return{u,vals}});
 if(q.order){const keyf=(o,rec)=>{ // alias / ordinal support
   if(o.e.t==='lit'&&typeof o.e.v==='number')return rec.vals[o.e.v-1];
   if(o.e.t==='col'&&!o.e.tbl){const ix=q.items.findIndex(i=>i.al===o.e.name);if(ix>=0)return rec.vals[names.indexOf(o.e.name)]}
   return ev(o.e,rec.u)};
  const keyed=out.map(r=>({r,k:q.order.map(o=>keyf(o,r))}));
  keyed.sort((a,b)=>{for(let i=0;i<q.order.length;i++){const c=cmpNull(a.k[i],b.k[i]);if(c)return q.order[i].d?-c:c}return 0});out=keyed.map(x=>x.r)}
 let rowsOut=out.map(r=>r.vals);
 if(q.distinct){const seen=new Set();rowsOut=rowsOut.filter(r=>{const k=JSON.stringify(r);if(seen.has(k))return false;seen.add(k);return true})}
 if(q.offset)rowsOut=rowsOut.slice(q.offset);if(q.limit!=null)rowsOut=rowsOut.slice(0,q.limit);
 return{cols:names,rows:rowsOut}}

function computeWindow(w,units){const map=new Map();w._m=map;const part=new Map();
 units.forEach(u=>{const k=JSON.stringify(w.over.part.map(e=>ev(e,u)));if(!part.has(k))part.set(k,[]);part.get(k).push(u)});
 for(const us of part.values()){
  const keys=new Map(us.map(u=>[u,w.over.order.map(o=>ev(o.e,u))]));
  if(w.over.order.length)us.sort((a,b)=>{const ka=keys.get(a),kb=keys.get(b);for(let i=0;i<ka.length;i++){const c=cmpNull(ka[i],kb[i]);if(c)return w.over.order[i].d?-c:c}return 0});
  const same=(a,b)=>JSON.stringify(keys.get(a))===JSON.stringify(keys.get(b));
  us.forEach((u,i)=>{let v;const nm=w.name;
   if(nm==='ROW_NUMBER')v=i+1;
   else if(nm==='RANK'){let j=i;while(j>0&&same(us[j-1],u))j--;v=j+1}
   else if(nm==='DENSE_RANK'){let c=1;for(let j=1;j<=i;j++)if(!same(us[j-1],us[j]))c++;v=c}
   else if(nm==='LAG'||nm==='LEAD'){const off=w.args[1]?ev(w.args[1],u):1;const t=us[nm==='LAG'?i-off:i+off];v=t?ev(w.args[0],t):(w.args[2]?ev(w.args[2],u):null)}
   else{let frame=us;if(w.over.order.length){let e=i;while(e+1<us.length&&same(us[e+1],u))e++;frame=us.slice(0,e+1)}
    v=aggregate(nm,w,frame.map(x=>x.row?x:x),true,u)}
   map.set(u,v)})}}

function aggregate(nm,f,items,isWin,ctx){
 const rowsOf=items.map(x=>x.row?x:{row:x});
 const mkctx=r=>({row:r.row,outer:ctx.outer,st:ctx.st,db:ctx.db,cte:ctx.cte});
 if(nm==='COUNT'&&f.star)return rowsOf.length;
 let vals=rowsOf.map(r=>ev(f.args[0],mkctx(r))).filter(v=>v!==null);
 if(f.distinct)vals=[...new Set(vals)];
 if(nm==='COUNT')return vals.length;
 if(!vals.length)return null;
 if(nm==='SUM')return vals.reduce((a,b)=>a+b,0);
 if(nm==='AVG')return vals.reduce((a,b)=>a+b,0)/vals.length;
 if(nm==='MIN')return vals.reduce((a,b)=>b<a?b:a);
 if(nm==='MAX')return vals.reduce((a,b)=>b>a?b:a)}

function lookup(e,ctx){let c=ctx;
 while(c){const r=c.row;if(r){if(e.tbl){const k=e.tbl+'.'+e.name;if(k in r)return r[k]}
   else{const hits=Object.keys(r).filter(k=>k.endsWith('.'+e.name)&&k.slice(0,-e.name.length-1).indexOf('.')<0);if(hits.length>1&&!c.outerOnly)throw new Error('ambiguous column: '+e.name);if(hits.length===1)return r[hits[0]]}}
  c=c.outer}
 throw new Error('no such column: '+(e.tbl?e.tbl+'.':'')+e.name)}

function ev(e,ctx){switch(e.t){
 case'lit':return e.v;
 case'col':return lookup(e,ctx);
 case'un':{const v=ev(e.e,ctx);return v===null?null:-v}
 case'not':{const v=ev(e.e,ctx);return v===null?null:!v}
 case'bin':{const o=e.op;
  if(o==='AND'){const a=ev(e.l,ctx);if(a===false)return false;const b=ev(e.r,ctx);if(b===false)return false;return(a===null||b===null)?null:true}
  if(o==='OR'){const a=ev(e.l,ctx);if(a===true)return true;const b=ev(e.r,ctx);if(b===true)return true;return(a===null||b===null)?null:false}
  const a=ev(e.l,ctx),b=ev(e.r,ctx);if(a===null||b===null)return null;
  switch(o){case'=':return a===b;case'<>':return a!==b;case'<':return a<b;case'>':return a>b;case'<=':return a<=b;case'>=':return a>=b;
   case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':if(b===0)return null;return a/b;case'%':return a%b;case'||':return String(a)+String(b)}break}
 case'isnull':{const v=ev(e.e,ctx);return e.neg?v!==null:v===null}
 case'between':{const v=ev(e.e,ctx),lo=ev(e.lo,ctx),hi=ev(e.hi,ctx);if(v===null||lo===null||hi===null)return null;const r=v>=lo&&v<=hi;return e.neg?!r:r}
 case'like':{const v=ev(e.e,ctx),p=ev(e.pat,ctx);if(v===null||p===null)return null;const r=like(v,p);return e.neg?!r:r}
 case'in':{const v=ev(e.e,ctx);if(v===null)return null;let vals;
  if(e.sub)vals=runSelect(e.sub,ctx.db,ctx,ctx.cte,ctx.st).rows.map(r=>r[0]);else vals=e.list.map(x=>ev(x,ctx));
  if(vals.includes(v))return e.neg?false:true;if(vals.includes(null))return null;return e.neg?true:false}
 case'exists':{const r=runSelect(e.q,ctx.db,ctx,ctx.cte,ctx.st);return r.rows.length>0}
 case'sub':{const r=runSelect(e.q,ctx.db,ctx,ctx.cte,ctx.st);if(r.rows.length>1)throw new Error('scalar subquery returned more than one row');return r.rows.length?r.rows[0][0]:null}
 case'case':{const b=e.base?ev(e.base,ctx):undefined;for(const[c,v]of e.whens){const cv=ev(c,ctx);if(e.base?cv===b:cv===true)return ev(v,ctx)}return e.els?ev(e.els,ctx):null}
 case'fn':{const nm=e.name;
  if(e.over){if(!e._m)throw new Error('window function not allowed here');return e._m.get(ctx)}
  if(AGG.has(nm)){if(!ctx.rows)throw new Error('aggregate function '+nm+' not allowed here');return aggregate(nm,e,ctx.rows,false,ctx)}
  const a=e.args.map(x=>ev(x,ctx));
  switch(nm){case'ROUND':return a[0]===null?null:Math.round(a[0]*Math.pow(10,a[1]||0))/Math.pow(10,a[1]||0);
   case'ABS':return a[0]===null?null:Math.abs(a[0]);case'UPPER':return a[0]===null?null:String(a[0]).toUpperCase();
   case'LOWER':return a[0]===null?null:String(a[0]).toLowerCase();case'LENGTH':return a[0]===null?null:String(a[0]).length;
   case'COALESCE':case'IFNULL':return a.find(x=>x!==null&&x!==undefined)??null;case'NULLIF':return a[0]===a[1]?null:a[0];
   case'SUBSTR':return a[0]===null?null:String(a[0]).substr(a[1]-1,a[2]);
   default:throw new Error('unknown function: '+nm)}}
 case'star':throw new Error('* not allowed here')}
 throw new Error('cannot evaluate '+e.t)}

/* ---------- DML & constraints ---------- */
function checkRow(db,tn,t,row,skip){
 t.cols.forEach((c,i)=>{if((t.nn||[]).includes(c)&&row[i]===null)throw new Error('NOT NULL constraint failed: '+tn+'.'+c)});
 const keys=[...(t.pk?[t.pk]:[]),...(t.uq||[])];
 for(const k of keys){const ix=k.map(c=>t.cols.indexOf(c));
  if(k===t.pk&&ix.some(i=>row[i]===null))throw new Error('PRIMARY KEY cannot be NULL: '+tn+'.'+k.join(','));
  if(ix.some(i=>row[i]===null))continue;
  t.rows.forEach((r,ri)=>{if(ri===skip)return;if(ix.every(i=>r[i]===row[i]))throw new Error((k===t.pk?'PRIMARY KEY':'UNIQUE')+' constraint failed: duplicate value in '+tn+'('+k.join(',')+')')})}
 for(const fk of t.fk||[]){const v=row[t.cols.indexOf(fk.c)];if(v===null)continue;
  const rt=getTable(db,fk.t);const ci=rt.cols.indexOf(fk.rc);if(!rt.rows.some(r=>r[ci]===v))throw new Error('FOREIGN KEY constraint failed: '+tn+'.'+fk.c+' = '+v+' has no matching row in '+fk.t+'.'+fk.rc)}}
function runDML(a,db,st){const tn=a.tbl;const t=getTable(db,tn);const ctx0={row:{},outer:null,st,db,cte:{}};
 if(a.t==='insert'){const cols=a.cols||t.cols;let n=0;const staged=[];
  for(const vs of a.rows){if(vs.length!==cols.length)throw new Error('column count does not match value count');
   const row=t.cols.map(()=>null);cols.forEach((c,i)=>{const ix=t.cols.indexOf(c);if(ix<0)throw new Error('no such column: '+c);row[ix]=ev(vs[i],ctx0)});
   checkRow(db,tn,t,row,-1);t.rows.push(row);staged.push(row);n++}
  return{cols:[],rows:[],msg:n+' row(s) inserted into '+tn}}
 if(a.t==='update'){let n=0;const upd=[];
  t.rows.forEach((r,ri)=>{const ctx={row:rowObj(tn,t.cols,r),outer:null,st,db,cte:{}};if(!a.where||ev(a.where,ctx)===true){const nr=r.slice();a.sets.forEach(s=>{const ix=t.cols.indexOf(s.c);if(ix<0)throw new Error('no such column: '+s.c);nr[ix]=ev(s.e,ctx)});upd.push([ri,nr])}});
  upd.forEach(([ri,nr])=>{checkRow(db,tn,t,nr,ri)});upd.forEach(([ri,nr])=>{t.rows[ri]=nr;n++});
  return{cols:[],rows:[],msg:n+' row(s) updated in '+tn}}
 if(a.t==='delete'){const keep=[],del=[];
  t.rows.forEach(r=>{const ctx={row:rowObj(tn,t.cols,r),outer:null,st,db,cte:{}};(!a.where||ev(a.where,ctx)===true?del:keep).push(r)});
  for(const on in db.tables){const o=db.tables[on];for(const fk of o.fk||[]){if(fk.t!==tn)continue;const rci=t.cols.indexOf(fk.rc),ci=o.cols.indexOf(fk.c);
    del.forEach(d=>{if(o.rows.some(r=>r[ci]===d[rci]))throw new Error('FOREIGN KEY constraint failed: '+on+'.'+fk.c+' still references '+tn+'.'+fk.rc+' = '+d[rci])})}}
  t.rows=keep;return{cols:[],rows:[],msg:del.length+' row(s) deleted from '+tn}}}

/* ---------- sample database ---------- */
function sampleDB(){return{tables:{
 departments:{cols:['id','name','city'],pk:['id'],nn:['name'],rows:[[1,'Engineering','Tehran'],[2,'Sales','Tabriz'],[3,'HR','Tehran'],[4,'Research','Isfahan']]},
 employees:{cols:['id','name','dept_id','salary','hire_year','manager_id'],pk:['id'],nn:['name','salary'],fk:[{c:'dept_id',t:'departments',rc:'id'}],
  rows:[[1,'Ali',1,5200,2015,null],[2,'Sara',1,4100,2018,1],[3,'Reza',2,3900,2019,1],[4,'Maryam',2,4500,2017,3],[5,'Omid',1,4800,2016,1],[6,'Neda',3,3600,2020,1],[7,'Kian',2,3900,2021,4],[8,'Lida',1,5600,2014,1],[9,'Pouya',3,3300,2022,6],[10,'Nima',null,3000,2023,null]]},
 projects:{cols:['id','name','dept_id'],pk:['id'],nn:['name'],fk:[{c:'dept_id',t:'departments',rc:'id'}],rows:[[1,'Search Engine',1],[2,'CRM',2],[3,'Recruiting Portal',3],[4,'Recommender',1]]},
 assignments:{cols:['emp_id','project_id','hours'],pk:['emp_id','project_id'],fk:[{c:'emp_id',t:'employees',rc:'id'},{c:'project_id',t:'projects',rc:'id'}],
  rows:[[1,1,120],[2,1,200],[5,1,150],[2,4,80],[8,4,160],[3,2,90],[4,2,110],[7,2,60],[6,3,100],[9,3,70]]}}}}
function clone(db){return JSON.parse(JSON.stringify(db))}
function sameResult(a,b,ordered){const norm=r=>r.map(v=>typeof v==='number'?Math.round(v*1e4)/1e4:v);
 if(a.rows.length!==b.rows.length)return false;if(a.cols.length!==b.cols.length)return false;
 const A=a.rows.map(r=>JSON.stringify(norm(r))),B=b.rows.map(r=>JSON.stringify(norm(r)));
 if(ordered)return A.every((x,i)=>x===B[i]);return JSON.stringify([...A].sort())===JSON.stringify([...B].sort())}
function splitStmts(s){const out=[];let cur='',q=false,i=0;while(i<s.length){const c=s[i];if(!q&&c==='-'&&s[i+1]==='-'){while(i<s.length&&s[i]!=='\n')i++;continue}if(c==="'"){if(q&&s[i+1]==="'"){cur+="''";i+=2;continue}q=!q}if(c===';'&&!q){out.push(cur);cur='';i++;continue}cur+=c;i++}out.push(cur);return out.map(x=>x.trim()).filter(Boolean)}
function runAll(text,db){const st=splitStmts(text);if(!st.length)throw new Error('empty statement');let last=null;const msgs=[];let scanned=0;st.forEach(x=>{last=run(x,db);scanned+=last.scanned;if(last.msg)msgs.push(last.msg)});last.scanned=scanned;last.msgs=msgs;return last}
return{parse,run,runAll,sampleDB,clone,sameResult}})();
