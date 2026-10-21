const STORE_KEY = "marvi_granja_rifa_v1";
const DEFAULT_STATE = { price: 10000, drawDate: "", orders: [] };
let state, chosen = new Set();
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number(n)||0);
const pad = n => String(n).padStart(2,"0");
function loadState(){try{state={...DEFAULT_STATE,...JSON.parse(localStorage.getItem(STORE_KEY) || "{}")};if(!state.price)state.price=10000;if(!Array.isArray(state.orders))state.orders=[];}catch{state={...DEFAULT_STATE,orders:[]};}}
function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state));}
function toast(message){$("toast").textContent=message;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2600);}
function openModal(id){$(id).classList.add("open");}
function closeModal(id){$(id).classList.remove("open");}
function allNumbers(){return state.orders.flatMap(o=>o.numbers.map(number=>({number,status:o.status,order:o})));}
function getRecord(n){return allNumbers().find(r=>r.number===n);}
function render(){
  $("priceDisplay").textContent=state.price?money(state.price):"Por definir";
  $("numberGrid").innerHTML="";
  for(let n=0;n<100;n++){
    const rec=getRecord(n), btn=document.createElement("button");
    btn.type="button";btn.className="number";btn.textContent=pad(n);
    if(rec){btn.classList.add(rec.status);btn.disabled=true;btn.title=rec.status==="paid"?"Pago confirmado":"Reservado";}
    else if(chosen.has(n))btn.classList.add("is-selected");
    btn.addEventListener("click",()=>{chosen.has(n)?chosen.delete(n):chosen.add(n);renderSelection();renderGridSelection();});
    $("numberGrid").appendChild(btn);
  }
  renderSelection();renderAdmin();
}
function renderGridSelection(){[...$("numberGrid").children].forEach((b,n)=>{if(!getRecord(n))b.classList.toggle("is-selected",chosen.has(n));});}
function renderSelection(){
  const nums=[...chosen].sort((a,b)=>a-b);
  $("selectionText").textContent=nums.length?nums.map(pad).join(", "):"Ninguno seleccionado";
  $("totalText").textContent=state.price?money(nums.length*state.price):"Configura el precio";
  $("reserveBtn").disabled=!nums.length;
}
$("reserveBtn").addEventListener("click",()=>{
  const name=$("buyerName").value.trim(),phone=$("buyerPhone").value.trim(),nums=[...chosen].sort((a,b)=>a-b);
  if(!name||!phone){toast("Escribe tu nombre y WhatsApp antes de continuar.");return;}
  if(!state.price||state.price<1){toast("El organizador debe configurar el precio por número.");return;}
  if(!nums.length){toast("Selecciona al menos un número.");return;}
  if(nums.some(n=>getRecord(n))){toast("Uno de tus números ya no está disponible. Actualiza la selección.");chosen.clear();render();return;}
  const order={id:Date.now().toString(36),name,phone,numbers:nums,status:"pending",created:new Date().toISOString()};
  state.orders.push(order);saveState();chosen.clear();render();
  const message=`🐓 *RIFA MARVI EN LA GRANJA*\nPremio: 2 parejas de pollos criollos gigantes colombianos\nNombre: ${name}\nWhatsApp: ${phone}\nNúmeros: ${nums.map(pad).join(", ")}\nValor por número: ${money(state.price)}\nTotal: ${money(nums.length*state.price)}\nPago por Nequi: 3157238632\nTitular: Edwin Rodríguez\n\nAdjuntaré el comprobante de pago cuando realice la transferencia.`;
  window.open("https://wa.me/573157238632?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
  toast("Solicitud registrada en este navegador. Espera la confirmación del organizador.");
});
$("copyNequi").addEventListener("click",async()=>{try{await navigator.clipboard.writeText("3157238632");toast("Número de Nequi copiado.");}catch{toast("Nequi: 3157238632");}});
$("shareBtn").addEventListener("click",()=>{
  const message="🐓 ¡RIFA MARVI EN LA GRANJA!\nPremio: 2 parejas de pollos criollos gigantes colombianos.\nEscoge tus números del 00 al 99.\nPago por Nequi: 3157238632 · Titular: Edwin Rodríguez.";
  window.open("https://wa.me/?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
});
$("adminBtn").addEventListener("click",()=>{syncSettings();renderAdmin();openModal("adminModal");});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id);}));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===b));
  ["reservas","ajustes"].forEach(t=>$("panel-"+t).classList.toggle("hidden",t!==b.dataset.tab));
}));
function syncSettings(){$("priceInput").value=state.price||"";$("dateInput").value=state.drawDate||"";}
$("saveSettings").addEventListener("click",()=>{
  const p=Number($("priceInput").value);
  if(!p||p<1){toast("Ingresa un precio válido para cada número.");return;}
  state.price=p;state.drawDate=$("dateInput").value;saveState();render();toast("Ajustes guardados en este navegador.");
});
function renderAdmin(){
  const paid=state.orders.filter(o=>o.status==="paid").reduce((sum,o)=>sum+o.numbers.length,0);
  $("adminPaid").textContent=paid;$("adminPending").textContent=state.orders.filter(o=>o.status==="pending").length;
  const host=$("ordersList"),orders=[...state.orders].reverse();
  if(!orders.length){host.innerHTML='<div class="empty">Todavía no hay reservas.</div>';return;}
  host.innerHTML=orders.map(o=>`<article class="order"><div><strong>${escapeHtml(o.name)} · ${o.numbers.map(pad).join(", ")}</strong><p>${escapeHtml(o.phone)} · ${o.status==="paid"?"Pago confirmado":"Pendiente de pago"}</p><p>${new Date(o.created).toLocaleString("es-CO")}</p></div><div class="order-actions">${o.status==="pending"?`<button class="mini-btn" data-action="paid" data-id="${o.id}">Confirmar pago</button>`:""}<button class="mini-btn cancel" data-action="cancel" data-id="${o.id}">Cancelar</button></div></article>`).join("");
  host.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{
    const o=state.orders.find(x=>x.id===b.dataset.id);if(!o)return;
    if(b.dataset.action==="paid"){o.status="paid";toast("Pago marcado como confirmado. Verifica la transferencia.");}
    else{if(!confirm("¿Cancelar la reserva y liberar los números?"))return;state.orders=state.orders.filter(x=>x.id!==o.id);toast("Reserva cancelada.");}
    saveState();render();
  }));
}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("resetData").addEventListener("click",()=>{if(confirm("¿Borrar todas las reservas y el precio configurado? Esta acción no se puede deshacer.")){state={...DEFAULT_STATE,orders:[]};chosen.clear();saveState();syncSettings();render();toast("Datos locales borrados.");}});
loadState();render();syncSettings();
