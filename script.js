let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let premium = localStorage.getItem("premium") === "true";
let meta = localStorage.getItem("meta") || null;

function salvar(){
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function render(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  gastos.forEach((g,i)=>{
    total += Number(g.valor);
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${g.desc} (${g.cat})</span>
      <strong>R$ ${g.valor}</strong>
    `;
    lista.appendChild(li);
  });

  document.getElementById("total").innerText =
    `Total do mês: R$ ${total}`;

  if(meta && total > meta){
    alert("⚠️ Você ultrapassou sua meta mensal!");
  }
}

function addGasto(){
  const d = descricao.value;
  const v = valor.value;
  const c = categoria.value;

  if(!d || !v) return;

  gastos.push({desc:d, valor:v, cat:c});
  salvar();
  render();

  descricao.value="";
  valor.value="";
}

function limparMes(){
  if(confirm("Deseja limpar todos os gastos do mês?")){
    gastos=[];
    salvar();
    render();
  }
}

function ativarPremium(){
  const codigo = prompt("Digite o código Premium:");
  if(codigo === "LUAN2026"){
    premium = true;
    localStorage.setItem("premium","true");
    document.getElementById("premiumArea").classList.remove("hidden");
    gerarGrafico();
  } else {
    alert("Código inválido");
  }
}

function gerarGrafico(){
  const ctx = document.getElementById("grafico");
  const categorias = {};
  gastos.forEach(g=>{
    categorias[g.cat]=(categorias[g.cat]||0)+Number(g.valor);
  });

  new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:Object.keys(categorias),
      datasets:[{
        data:Object.values(categorias)
      }]
    }
  });
}

function salvarMeta(){
  meta = metaInput.value;
  localStorage.setItem("meta", meta);
  alert("Meta salva!");
}

function backup(){
  const blob = new Blob([JSON.stringify(gastos)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download="backup-financeiro.json";
  a.click();
}

function restore(e){
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload=()=>{
    gastos = JSON.parse(reader.result);
    salvar();
    render();
    if(premium) gerarGrafico();
  };
  reader.readAsText(file);
}

function closeOnboarding(){
  document.getElementById("onboarding").style.display="none";
  localStorage.setItem("onboarding","ok");
}

if(localStorage.getItem("onboarding")==="ok"){
  document.getElementById("onboarding").style.display="none";
}

render();
if(premium){
  document.getElementById("premiumArea").classList.remove("hidden");
  gerarGrafico();
}
