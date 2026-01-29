// ESTADO
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let premium = localStorage.getItem("premium") === "true";
let meta = localStorage.getItem("meta") || null;
let graficoChart = null;

// SALVAR
function salvar(){
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

// RENDER
function render(){
  const lista = document.getElementById("lista");
  const totalEl = document.getElementById("total");
  if(!lista || !totalEl) return;

  lista.innerHTML = "";
  let total = 0;

  gastos.forEach(g=>{
    total += Number(g.valor);
    const li = document.createElement("li");
    li.innerHTML = `<span>${g.desc} (${g.cat})</span><strong>R$ ${g.valor}</strong>`;
    lista.appendChild(li);
  });

  totalEl.innerText = `Total do mês: R$ ${total}`;

  if(meta && total > meta){
    alert("⚠️ Você ultrapassou sua meta mensal!");
  }
}

// ADICIONAR GASTO
function addGasto(){
  const d = document.getElementById("descricao").value;
  const v = document.getElementById("valor").value;
  const c = document.getElementById("categoria").value;

  if(!d || !v){
    alert("Preencha descrição e valor");
    return;
  }

  gastos.push({ desc:d, valor:v, cat:c });
  salvar();
  render();

  document.getElementById("descricao").value="";
  document.getElementById("valor").value="";
}

// LIMPAR
function limparMes(){
  if(confirm("Deseja limpar todos os gastos?")){
    gastos = [];
    salvar();
    render();
  }
}

// PREMIUM
function ativarPremium(){
  const codigo = prompt("Digite o código Premium:");
  if(codigo === "LUAN2026"){
    premium = true;
    localStorage.setItem("premium","true");
    document.getElementById("premiumArea").classList.remove("hidden");
    gerarGrafico();
  }else{
    alert("Código inválido");
  }
}

// GRÁFICO
function gerarGrafico(){
  const canvas = document.getElementById("grafico");
  if(!canvas || gastos.length === 0) return;

  if(graficoChart){
    graficoChart.destroy();
  }

  const categorias = {};
  gastos.forEach(g=>{
    categorias[g.cat] = (categorias[g.cat] || 0) + Number(g.valor);
  });

  graficoChart = new Chart(canvas,{
    type:"doughnut",
    data:{
      labels:Object.keys(categorias),
      datasets:[{
        data:Object.values(categorias),
        backgroundColor:["#22c55e","#16a34a","#4ade80","#86efac","#bbf7d0"]
      }]
    }
  });
}

// META
function salvarMeta(){
  const metaValor = document.getElementById("meta").value;
  if(!metaValor){
    alert("Digite uma meta");
    return;
  }
  meta = metaValor;
  localStorage.setItem("meta", meta);
  alert("Meta salva!");
}

// BACKUP
function backup(){
  const blob = new Blob([JSON.stringify(gastos)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup-financeiro.json";
  a.click();
}

// RESTORE
function restore(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    gastos = JSON.parse(reader.result);
    salvar();
    render();
    if(premium) gerarGrafico();
  };
  reader.readAsText(file);
}

// ONBOARDING
function closeOnboarding(){
  document.getElementById("onboarding").style.display="none";
  localStorage.setItem("onboarding","ok");
}

// INIT
if(localStorage.getItem("onboarding")==="ok"){
  const ob = document.getElementById("onboarding");
  if(ob) ob.style.display="none";
}

render();

if(premium){
  const p = document.getElementById("premiumArea");
  if(p) p.classList.remove("hidden");
  gerarGrafico();
}
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnOnboarding");
  const onboarding = document.getElementById("onboarding");

  if(btn && onboarding){
    btn.addEventListener("click", () => {
      onboarding.style.display = "none";
      localStorage.setItem("onboarding", "ok");
    });
  }
});
