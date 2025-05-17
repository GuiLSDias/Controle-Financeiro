const form = document.querySelector("#form");
const descTransacao = document.getElementById("descricao");
const valorTransacao = document.getElementById("montante");
const balanco = document.querySelector("#balanco");
const dinnegativo = document.querySelector("#din-negativo");
const dinpositivo = document.querySelector("#din-positivo");
const transacoesUL = document.querySelector("#transacoes");
const chave_transacoes_storage = "if_transacoes";

let transacoesSalvas;
try {
  transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_storage));
} catch (error) {
  transacoesSalvas = [];
}

if (transacoesSalvas == null) {
  transacoesSalvas = [];
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const descricao = descTransacao.value.trim();
  const valor = valorTransacao.value.trim();

  if (descricao === "") {
    alert("Campo descrição não pode ser vazio");
    descTransacao.focus();
    return;
  }

  if (valor === "") {
    alert("Campo valor não pode ser vazio");
    valorTransacao.focus();
    return;
  }

  const transacao = {
    id: parseInt(Math.random() * 5000),
    descricao: descricao,
    valor: parseFloat(valor),
  };

  somaAoSaldo(transacao);
  somaReceitaDespesa(transacao);
  addTransacaoALista(transacao);

  transacaosSalvas.push(transacao);
  localStorage.setItem(
    chave_transacoes_storage,
    JSON.stringify(transacoesSalvas)
  );
  descTransacao.value = "";
  valorTransacao.value = "";
});

function addTransacaoALista(transacao) {
  const operador = transacao.valor > 0 ? "" : "-";
  const classe = transacao.valor > 0 ? "positivo" : "negativo";

  let liStr = `
                ${transacao.descricao} <span>${operador} R$ ${transacao.valor}</span>
                <button class="delete-btn" id="${transacao.id}">x</button>
            `;
  const li = document.createElement("li");
  li.classList.add(classe);
  li.innerHTML = liStr;
  transacoesUL.appendChild(li);
}

function somaAoSaldo(transacao) {
  const valor = transacao.valor;
  let total = balanco.innerHTML.trim();
  total = total.replace("R$", "");
  total = parseFloat(total);

  total += valor;
  balanco.innerHTML = `R$ ${total.toFixed(2)}`;
}

function somaReceitaDespesa(transacao) {
  const elemento = transacao.valor > 0 ? dinpositivo : dinnegativo;
  const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

  let valor = elemento.innerHTML.trim().replace(substituir, "");
  valor = parseFloat(valor);
  valor = Math.abs(valor);
  valor += transacao.valor;
  elemento.innerHTML = `${substituir} ${valor.toFixed(2)}`;
}
