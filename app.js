const PL={tournament:[10,8,6,4,2,2,1,1],social:[5,4,3,2,1,1,0,0]};
const cfg=window.APP_CONFIG||{},sb=(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase)?supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
let P=[],T=[],tid=100;
let S={tab:'home',staff:false,auth:false,q:'',dark:(()=>{try{return localStorage.theme!=='light'}catch(e){return true}})(),load:true,open:null,edit:null,del:null,pl:null,toast:'',flash:null};
const $=s=>document.querySelector(s),R=document.getElementById('app'),K=k=>k=='tournament'?'Tournament':'Americano / Mexicano';
const tot=n=>T.reduce((a,t)=>a+t.es.filter(e=>e.n==n).reduce((b,e)=>b+(+e.p||0),0),0);
const ranked=()=>P.map((n,i)=>({n,i,t:tot(n)})).sort((a,b)=>b.t-a.t||a.i-b.i).map((x,r)=>({...x,rank:r+1}));
function toast(t){S.toast=t;render();setTimeout(()=>{S.toast='';render()},2200)}
function give(n,v){let a=T.find(t=>t.type=='manual');if(!a){a={id:0,name:'Manual adjustments',type:'manual',date:'',es:[]};T.push(a)}a.es.push({n,p:v});S.flash=n;saveT(a);render()}
function pdf(){const{jsPDF}=window.jspdf,d=new jsPDF();d.setFontSize(20);d.text('Padel Shuffle Leaderboard',14,18);d.autoTable({startY:26,head:[['#','Player','Points']],body:ranked().map(r=>[r.rank,r.n,r.t]),headStyles:{fillColor:[255,75,43]}});d.save('leaderboard.pdf')}
const opts=s=>'<option value="">Player…</option>'+P.map(p=>`<option ${p==s?'selected':''}>${p}</option>`).join('');
const real=()=>T.filter(t=>t.type!='manual');
function home(){const r=ranked(),z=r[0]||{t:0,n:'-'};return `<div class=hero><img src="assets/logo.jpg"><h1>PADEL <span>SHUFFLE</span></h1><p>Our padel community ranking. Join a shuffle, get new partners every round, play Gold and Silver finals and climb the season leaderboard. Every tournament result is counted automatically.</p>
<div class=row><button class=pri onclick="S.tab='lb';render()">Leaderboard</button><button onclick="S.tab='t';render()">Tournaments</button></div></div>
<div class=stats><div><b>${P.length}</b><small>Players</small></div><div><b>${real().length}</b><small>Tournaments</small></div><div><b>${z.t}</b><small>Top score · ${z.n.split(' ')[0]}</small></div></div>
<h3>Top 5</h3>${r.slice(0,5).map(x=>`<div class="card row sp" style="margin:.4rem 0"><span><span class=rk>${x.rank}</span>&nbsp; ${x.n}</span><b>${x.t}</b></div>`).join('')}
<div class=how style="margin-top:1rem"><div class=card><i>01</i><h3>Join</h3><p class=muted>Register and check in for the next event.</p></div><div class=card><i>02</i><h3>Play</h3><p class=muted>New partners each round, then Gold and Silver.</p></div><div class=card><i>03</i><h3>Climb</h3><p class=muted>Your finish becomes points on the leaderboard.</p></div></div>`}
function lb(){const r=ranked(),mx=(r[0]||{}).t||1,f=r.filter(x=>x.n.toLowerCase().includes(S.q.toLowerCase()));
return `<div class=podium>${r.slice(0,3).map(x=>`<div class="pod p${x.rank}"><b>${x.rank}</b><span>${x.n}</span><em>${x.t} pts</em></div>`).join('')}</div>
${S.staff?`<div class="card add"><h3>Admin</h3><div class=row><input id=np placeholder="New player name" style="flex:1"><button class=pri onclick="addP()">Add player</button></div><small class=muted>Points are counted automatically from tournaments. Use + / − for quick adjustments.</small></div>`:''}
<div class=bar><input id=q placeholder="Search player…" value="${S.q}"><button onclick="pdf()">⬇ PDF</button></div>
<table><thead><tr><th>#</th><th>Player</th><th>Pts</th></tr></thead><tbody>${f.map(x=>`<tr class="r${x.rank} ${S.flash==x.n?'fl':''}"><td><span class=rk>${x.rank}</span></td><td><a onclick="S.pl='${x.n.replace(/'/g,"\\'")}';render()">${x.n}</a><div class=bar2><i style="width:${x.t/mx*100}%"></i></div></td>
<td><b>${x.t}</b>${S.staff?`<button class=pm onclick="give('${x.n.replace(/'/g,"\\'")}',-1)">−</button><button class=pm onclick="give('${x.n.replace(/'/g,"\\'")}',1)">+</button>`:''}</td></tr>`).join('')}</tbody></table>`}
function card(t){const o=S.open==t.id,e=S.edit==t.id,es=t.es.slice().sort((a,b)=>b.p-a.p),w=es[0];
let b='';if(o||e){b=e?`${t.es.map((x,i)=>`<div class=ent><select onchange="T.find(t=>t.id==${t.id}).es[${i}].n=this.value;render()">${opts(x.n)}</select><input type=number min=1 placeholder=Pl value="${x.pl||''}" onchange="const x=T.find(t=>t.id==${t.id}).es[${i}];x.pl=+this.value;x.p=PL['${t.type}'][Math.min(x.pl,8)-1]??0;render()"><input type=number value="${x.p}" onchange="T.find(t=>t.id==${t.id}).es[${i}].p=+this.value;render()"><button class=mini onclick="T.find(t=>t.id==${t.id}).es.splice(${i},1);render()">✕</button></div>`).join('')}
<div class=row><button onclick="T.find(t=>t.id==${t.id}).es.push({n:'',p:0});render()">+ Add player</button><button class=pri onclick="done(${t.id})">Done</button></div><small class=muted>Pick a place and points fill in automatically (editable).</small>`
:es.map((x,i)=>`<div class="ent v"><b>${i+1}</b><span>${x.n}</span><em style="color:var(--b);font-weight:700">+${x.p}</em></div>`).join('')||'<p class=muted>No results yet.</p>'}
return `<div class="card tc"><div class="row sp" onclick="S.open=${o?'null':t.id};render()"><span><b>${t.name}</b><br><small class=muted>${t.date||'Season'} · ${K(t.type)} · ${t.es.length} players${w?' · 🏆 '+w.n:''}</small></span><span class="tag done">${t.es.length?'Completed':'Upcoming'}</span></div>${b?'<div style="margin-top:.6rem">'+b+'</div>':''}
${S.staff?`<div class=row><button onclick="${e?'S.edit=null;load()':'S.edit='+t.id+';S.open='+t.id+';render()'}">${e?'Cancel':'Edit'}</button>${S.del==t.id?`<button class=dng onclick="delT(${t.id})">Confirm delete</button>`:`<button class=mini onclick="S.del=${t.id};render()">Delete</button>`}</div>`:''}</div>`}
function tour(){return `<h2 style="margin:.2rem 0">Tournaments</h2>`+(S.staff?`<div class="card add"><div class=row><input id=tn placeholder="New tournament name" style="flex:1"><select id=tk><option value=tournament>Tournament</option><option value=social>Americano / Mexicano</option></select><input id=td type=date><button class=pri onclick="addT()">Create</button></div></div>`:'')+real().slice().reverse().map(card).join('')}
function modal(){const n=S.pl;const rows=T.filter(t=>t.es.some(e=>e.n==n));return `<div class=modal onclick="S.pl=null;render()"><div class=card onclick="event.stopPropagation()"><h2>${n}</h2><p class=muted>${tot(n)} pts · rank #${ranked().find(x=>x.n==n).rank}</p>${rows.map(t=>`<div class="row sp"><span>${t.name}</span><b>+${t.es.filter(e=>e.n==n).reduce((a,e)=>a+e.p,0)}</b></div>`).join('')||'<p class=muted>No events yet.</p>'}</div></div>`}
function render(){document.documentElement.dataset.theme=S.dark?'dark':'light';
const main=S.load?'<p class=loading>Loading…</p>':{home,lb,t:tour}[S.tab]();
R.innerHTML=`<header><b class=logo><img src="assets/logo.jpg">PADEL SHUFFLE</b><nav>${[['home','Home'],['lb','Leaderboard'],['t','Tournaments']].map(t=>`<a class="${S.tab==t[0]?'on':''}" onclick="S.tab='${t[0]}';render()">${t[1]}</a>`).join('')}</nav><span><button class=mini onclick="S.dark=!S.dark;try{localStorage.theme=S.dark?'dark':'light'}catch(e){}render()">${S.dark?'☀':'☾'}</button>${S.staff?'<button class=mini onclick="out()">Sign out</button>':'<button class=pri onclick="S.auth=true;render()">Admin login</button>'}</span></header><main>${main}</main><footer>Padel Shuffle · community leaderboard</footer>`+(S.pl?modal():'')+(S.toast?`<div class=toast>${S.toast}</div>`:'')+
(S.auth?`<div class=auth><div class=orbs>${[0,1,2,3,4,5,6].map(i=>`<i style="--i:${i}"></i>`).join('')}</div><form class=card onsubmit="event.preventDefault();magic()"><button type=button class=x onclick="S.auth=false;render()">✕</button><h2>Admin login</h2>
<button type=button class="oa google" onclick="oauth('google')">Continue with Google</button><button type=button class="oa apple" onclick="oauth('apple')">Continue with Apple</button><div class=or>or</div><input id=em type=email placeholder="Admin email" autocomplete=email required><button class=pri>Email me a sign-in link</button><small class=muted>Only approved admin emails can edit. Everyone else can view.</small></form></div>`:'');
const q=$('#q');if(q){q.oninput=e=>{S.q=e.target.value;const p=e.target.selectionStart;render();const n=$('#q');n.focus();n.setSelectionRange(p,p)}}}
/* ---------- data (Supabase) ---------- */
async function db(p){if(!p)return;const{error}=await p;if(error)toast('Save failed: '+error.message)}
const saveT=t=>db(sb&&sb.from('tournaments').upsert({id:t.id,name:t.name,type:t.type,date:t.date||'',entries:t.es}));
async function load(){
  if(!sb){if(!T.length){P=SEED.P.slice();T=JSON.parse(JSON.stringify(SEED.T))}S.edit=null;S.load=false;return render()}
  const[a,b]=await Promise.all([sb.from('players').select('name').order('id'),sb.from('tournaments').select('*').order('id')]);
  if(a.error||b.error){S.load=false;render();return toast('Could not load data: '+(a.error||b.error).message)}
  P=a.data.map(x=>x.name);T=b.data.map(r=>({id:r.id,name:r.name,type:r.type,date:r.date||'',es:r.entries||[]}));S.load=false;render()}
async function addP(){const v=$('#np').value.trim();if(!v||P.includes(v))return;P.push(v);await db(sb&&sb.from('players').insert({name:v}));toast('Added '+v)}
async function addT(){const t={name:$('#tn').value||'New tournament',type:$('#tk').value,date:$('#td').value,es:[]};
  if(sb){const{data,error}=await sb.from('tournaments').insert({name:t.name,type:t.type,date:t.date,entries:[]}).select().single();if(error)return toast(error.message);t.id=data.id}else t.id=++tid;
  T.push(t);S.open=t.id;S.edit=t.id;render()}
function done(id){const t=T.find(x=>x.id==id);t.es=t.es.filter(e=>e.n);saveT(t);S.edit=null;toast('Saved · rankings updated')}
function delT(id){T=T.filter(x=>x.id!=id);S.del=null;db(sb&&sb.from('tournaments').delete().eq('id',id));toast('Deleted · points recalculated')}
/* ---------- admin auth (admins are listed in supabase/1-admins.sql) ---------- */
async function who(s){S.user=s?s.user:null;S.staff=false;
  if(S.user){const{data}=await sb.rpc('is_admin');S.staff=!!data;if(!S.staff){await sb.auth.signOut();return toast(S.user.email+' is not an admin')}}
  S.auth=false;render()}
async function magic(){if(!sb)return toast('Add your Supabase keys in js/config.js first');
  const{error}=await sb.auth.signInWithOtp({email:$('#em').value.trim(),options:{emailRedirectTo:location.origin+location.pathname}});toast(error?error.message:'Check your email for the sign-in link')}
async function oauth(p){if(!sb)return toast('Add your Supabase keys in js/config.js first');
  const{error}=await sb.auth.signInWithOAuth({provider:p,options:{redirectTo:location.origin+location.pathname,...(p=='google'?{queryParams:{prompt:'select_account'}}:{})}});if(error)toast(error.message)}
async function out(){if(sb)await sb.auth.signOut();S.staff=false;S.user=null;render()}
async function boot(){render();await load();if(!sb)return;
  const u=new URLSearchParams(location.search+'&'+location.hash.slice(1)),er=u.get('error_description');
  if(er){toast(er);history.replaceState(null,'',location.pathname)}
  const{data:{session}}=await sb.auth.getSession();await who(session);
  sb.auth.onAuthStateChange((_e,s)=>setTimeout(()=>who(s),0));
  sb.channel('live').on('postgres_changes',{event:'*',schema:'public'},()=>{if(!S.edit)load()}).subscribe()}
boot();
