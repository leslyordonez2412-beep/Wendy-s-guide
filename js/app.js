const $=(s,r=document)=>r.querySelector(s);
const store={get(k,d){try{return JSON.parse(localStorage.getItem("wg:"+k))??d}catch(e){return d}},
 set(k,v){try{localStorage.setItem("wg:"+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
let editDir=false;
const dir=()=>store.get("dir","");
const urlOf=it=>typeof it.url==="function"?(dir()?it.url(dir()):"#inicio"):it.url;
let favs=store.get("favs",[]),done=store.get("done",{}),notas=store.get("notas",[]);

function card(it){
 const f=favs.includes(it.id),u=urlOf(it),ext=u.startsWith("http")||u.startsWith("tel:")&&false,acc=(typeof it.url==="function"&&!dir())?"Añadir dirección":it.acc;
 return `<div class="card ${it.sos?"sos":""}"><div class="txt"><b>${esc(it.t)}</b><small>${esc(it.d)}</small></div>
 <a class="go" href="${esc(u)}" ${u.startsWith("http")?'target="_blank" rel="noopener"':""}>${acc}</a>
 <button class="fav" data-fav="${it.id}" aria-pressed="${f}" aria-label="${f?"Quitar de favoritos":"Guardar en favoritos"}">${f?"♥":"♡"}</button></div>`;
}
function porCat(list){
 const g={};list.forEach(i=>(g[i.cat]=g[i.cat]||[]).push(i));
 return Object.entries(g).map(([c,a])=>`<h2>${esc(c)}</h2>${a.map(card).join("")}`).join("");
}
function dirBlock(){
 if(!dir()||editDir)return `<h2>Mi dirección</h2><p class="vacio" style="padding-top:0">Escríbela una vez para activar las rutas y las búsquedas cerca de casa. Se guarda solo en este teléfono.</p>
 <input type="text" id="dir" value="${esc(dir())}" placeholder="Calle y número, Granada" aria-label="Mi dirección" autocomplete="street-address" style="width:100%;font:inherit;padding:14px 16px;border-radius:14px;border:1px solid var(--linea);background:var(--crema);color:var(--tinta)">
 <button class="btn" id="saveDir" style="width:100%;border:0;margin-top:10px;font:inherit;font-weight:600">Guardar dirección</button>`;
 return `<div class="card" style="margin-top:14px"><div class="txt"><b>${esc(dir())}</b><small>Tu dirección (solo en este teléfono)</small></div><button class="fav" id="chgDir" style="font-size:1rem;color:var(--terra)">Cambiar</button></div>`;
}
const views={
 inicio(){
  const fl=ITEMS.filter(i=>favs.includes(i.id));
  return `<section class="hero"><h1>Hola, Wendy ♡</h1><p>Tu nueva vida en Granada empieza aquí.</p><div class="arc" aria-hidden="true"></div></section>
  <p class="frase">Aunque estés lejos, siempre hay un pedacito de casa contigo.</p>
  <div class="btnrow"><a class="btn" href="${esc(urlOf(ITEMS.find(i=>i.id==="ruta-google")))}" ${dir()?'target="_blank" rel="noopener"':""}>Ruta a la UGR</a>
  <a class="btn alt" href="tel:112">Llamar al 112</a></div>
  ${dirBlock()}<h2>Tus favoritos</h2>${fl.length?fl.map(card).join(""):'<p class="vacio">Toca ♡ en cualquier tarjeta para guardarla aquí.</p>'}
  <h2>Próximamente</h2><div class="soon">${PROXIMAMENTE.map(p=>`<div>${p[0]}<small>${p[1]}</small></div>`).join("")}</div>
  <p class="aviso">Estas secciones se publicarán cuando sus datos estén comprobados en fuentes oficiales.</p>`;
 },
 buscar(){
  return `<h1>Buscar</h1><p style="margin:.6rem 0 14px;color:var(--gris)">Servicios, rutas, enlaces y tareas.</p>
  <input type="search" id="q" placeholder="¿Qué necesitas encontrar?" aria-label="Buscar" autocomplete="off"><div id="res"></div>`;
 },
 lista(){
  const all=CHECK.flatMap(g=>g[1]),n=all.filter(t=>done[t]).length,p=Math.round(n/all.length*100);
  return `<h1>Mi lista</h1><p style="margin:.6rem 0 0;color:var(--gris)">${n} de ${all.length} completadas</p>
  <div class="prog" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>
  ${CHECK.map(([g,ts])=>`<div class="grupo">${g}</div>${ts.map(t=>`<label class="chk"><input type="checkbox" data-t="${esc(t)}" ${done[t]?"checked":""}><span>${esc(t)}</span></label>`).join("")}`).join("")}`;
 },
 notas(){
  return `<h1>Un pedacito de casa</h1><p class="frase" style="margin-left:0">Escribe aquí recordatorios y cosas que no quieres olvidar.</p>
  <textarea id="nt" placeholder="Escribe una nota…" aria-label="Nueva nota"></textarea>
  <button class="btn" id="add" style="width:100%;border:0;margin-top:10px;font:inherit;font-weight:600">Guardar nota</button>
  <h2>Mis notas</h2>${notas.length?notas.map((n,i)=>`<div class="card nota"><div class="txt"><b style="font-weight:400;white-space:pre-wrap">${esc(n.t)}</b><small>${esc(n.f)}</small></div><button class="del" data-del="${i}" aria-label="Borrar nota">✕</button></div>`).join(""):'<p class="vacio">Aún no hay notas.</p>'}`;
 }
};
function render(){
 const t=(location.hash||"#inicio").slice(1),v=views[t]?t:"inicio";
 $("#app").innerHTML=views[v]();
 document.querySelectorAll(".tabs a").forEach(a=>a.dataset.tab===v?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
 if(v==="buscar"){const q=$("#q");q.oninput=()=>buscar(q.value);buscar("")}
}
function buscar(txt){
 const k=norm(txt.trim()),r=$("#res");
 if(!k){r.innerHTML=porCat(ITEMS);return}
 const a=ITEMS.filter(i=>norm(i.t+" "+i.d+" "+i.cat).includes(k));
 const c=CHECK.flatMap(([g,ts])=>ts.map(t=>[g,t])).filter(([g,t])=>norm(t+" "+g).includes(k));
 const h=a.map(card).join("")+(c.length?`<h2>En tu lista</h2>${c.map(([g,t])=>`<div class="card"><div class="txt"><b>${esc(t)}</b><small>${g}</small></div><a class="go" href="#lista">Ver</a></div>`).join("")}`:"");
 r.innerHTML=h||'<p class="vacio">Sin resultados. Prueba con otra palabra, por ejemplo “farmacia” o “banco”.</p>';
}
document.addEventListener("click",e=>{
 if(e.target.id==="saveDir"){const v=$("#dir").value.trim();if(!v)return;store.set("dir",v);editDir=false;render();return}
 if(e.target.id==="chgDir"){editDir=true;render();return}
 const f=e.target.closest("[data-fav]");
 if(f){const id=f.dataset.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];store.set("favs",favs);
  const q=$("#q"),v=q?q.value:null,y=scrollY;render();if(v!==null){$("#q").value=v;buscar(v)}scrollTo(0,y);return}
 if(e.target.id==="add"){const t=$("#nt").value.trim();if(!t)return;
  notas.unshift({t,f:new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})});store.set("notas",notas);render()}
 const d=e.target.closest("[data-del]");if(d){notas.splice(+d.dataset.del,1);store.set("notas",notas);render()}
});
document.addEventListener("change",e=>{
 if(e.target.dataset.t){done[e.target.dataset.t]=e.target.checked;store.set("done",done);const y=scrollY;render();scrollTo(0,y)}
});
addEventListener("hashchange",()=>{render();scrollTo(0,0)});
render();
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
