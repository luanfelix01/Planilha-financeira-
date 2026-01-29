let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let premium = localStorage.getItem("premium") === "true";

function salvar() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  gastos.forEach(g => {
    const li = document.createElement("li");
    li.textContent = `${g.desc} - R$ ${g.valor}`;
    lista.appendChild(li);
  });
}

function addGasto() {
  const d = descricao.value;
  const v = valor.value;
  if(!d || !v) return;
  gastos.push({desc:d, valor:v});
  salvar();
  render();
}

function ativarPremium() {
  const codigo = prompt("Digite o código Premium:");
  if(codigo === "LUAN2026") {
    premium = true;
    localStorage.setItem("premium","true");
    document.getElementById("premiumArea").classList.remove("hidden");
    grafico();
  } else {
    alert("Código inválido");
  }
}

function grafico() {
  const ctx = document.getElementById("grafico");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: gastos.map(g=>g.desc),
      datasets: [{
        data: gastos.map(g=>g.valor)
      }]
    }
  });
}

function backup() {
  const blob = new Blob([JSON.stringify(gastos)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup.json";
  a.click();
}

function restore(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    gastos = JSON.parse(reader.result);
    salvar();
    render();
  };
  reader.readAsText(file);
}

function nextStep(){
  document.getElementById("onboarding").style.display="none";
}

render();
if(premium){
  document.getElementById("premiumArea").classList.remove("hidden");
  grafico();
}
