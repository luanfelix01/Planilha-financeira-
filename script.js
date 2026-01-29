let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

function salvar(){
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function render(){
  const lista = document.getElementById("lista");
  const totalEl = document.getElementById("total");
  lista.innerHTML = "";
  let total = 0;

  gastos.forEach(g=>{
    total += Number(g.valor);
    const li = document.createElement("li");
    li.innerHTML = `<span>${g.desc} (${g.cat})</span><strong>R$ ${g.valor}</strong>`;
    lista.appendChild(li);
  });

  totalEl.innerText = `Total do mês: R$ ${total}`;
}

function addGasto(){
  const d = descricao.value;
  const v = valor.value;
  const c = categoria.value;

  if(!d || !v){
    alert("Preencha todos os campos");
    return;
  }

  gastos.push({desc:d, valor:v, cat:c});
  salvar();
  render();

  descricao.value="";
  valor.value="";
}

function limparMes(){
  if(confirm("Deseja limpar todos os gastos?")){
    gastos=[];
    salvar();
    render();
  }
}

function irParaVenda(){
  window.location.href = "venda.html";
}

document.addEventListener("DOMContentLoaded",()=>{
  const btn = document.getElementById("btnOnboarding");
  const onboarding = document.getElementById("onboarding");

  if(localStorage.getItem("onboarding")==="ok"){
    onboarding.style.display="none";
  }

  btn.addEventListener("click",()=>{
    onboarding.style.display="none";
    localStorage.setItem("onboarding","ok");
  });

  render();
});
