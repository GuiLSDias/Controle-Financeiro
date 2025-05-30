const form = document.querySelector("#form");
const descTransacao = document.getElementById("descricao");
const valorTransacao = document.getElementById("montante");
const tipoTransacao = document.getElementById("tipo");
const balanco = document.querySelector("#balanco");
const dinnegativo = document.querySelector("#din-negativo");
const dinpositivo = document.querySelector("#din-positivo");
const transacoesUL = document.querySelector("#transacoes");
const chave_transacoes_storage = "if_transacoes";

let transacoesSalvas =
  JSON.parse(localStorage.getItem(chave_transacoes_storage)) || [];

// Garante IDs incrementais
function gerarNovoId() {
  if (transacoesSalvas.length === 0) return 0;
  return transacoesSalvas[transacoesSalvas.length - 1].id + 1;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const descricao = descTransacao.value.trim();
  const valor = parseFloat(valorTransacao.value);
  const tipo = tipoTransacao.value;

  if (!descricao) {
    alert("Campo descrição não pode ser vazio");
    descTransacao.focus();
    return;
  }

  if (isNaN(valor)) {
    alert("Campo valor não pode ser vazio ou inválido");
    valorTransacao.focus();
    return;
  }

  const valorFinal = tipo === "despesa" ? -Math.abs(valor) : Math.abs(valor);

  const transacao = {
    id: gerarNovoId(),
    descricao: descricao,
    valor: valorFinal,
  };

  transacoesSalvas.push(transacao);
  localStorage.setItem(
    chave_transacoes_storage,
    JSON.stringify(transacoesSalvas)
  );

  addTransacaoALista(transacao);
  atualizaValores();

  descTransacao.value = "";
  valorTransacao.value = "";
});

function addTransacaoALista(transacao) {
  const operador = transacao.valor > 0 ? "" : "-";
  const classe = transacao.valor > 0 ? "positivo" : "negativo";

  const li = document.createElement("li");
  li.classList.add(classe);
  li.setAttribute("data-id", transacao.id);
  li.innerHTML = `
    ${transacao.descricao} <span>${operador} R$ ${Math.abs(
    transacao.valor
  ).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransacao(${
      transacao.id
    })">x</button>
  `;
  transacoesUL.appendChild(li);
}

function atualizaValores() {
  let total = 0,
    receitas = 0,
    despesas = 0;

  transacoesSalvas.forEach((t) => {
    total += t.valor;
    if (t.valor > 0) receitas += t.valor;
    else despesas += t.valor;
  });

  balanco.innerHTML = `R$ ${total.toFixed(2)}`;
  dinpositivo.innerHTML = `+ R$ ${receitas.toFixed(2)}`;
  dinnegativo.innerHTML = `- R$ ${Math.abs(despesas).toFixed(2)}`;
}

function removeTransacao(id) {
  transacoesSalvas = transacoesSalvas.filter((t) => t.id !== id);
  localStorage.setItem(
    chave_transacoes_storage,
    JSON.stringify(transacoesSalvas)
  );

  const li = document.querySelector(`li[data-id='${id}']`);
  if (li) li.remove();

  atualizaValores();
}

function carregaDados() {
  transacoesSalvas.forEach((transacao) => {
    addTransacaoALista(transacao);
  });
  atualizaValores();
}

carregaDados();
