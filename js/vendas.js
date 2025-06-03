const token = localStorage.getItem('token');
let carrinho = [];

fetch('/api/estoque', {
  headers: { 'Authorization': token }
})
.then(res => res.json())
.then(data => {
  const container = document.getElementById('produtosContainer');

  data.forEach(prod => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${prod.nome}</strong> - R$${prod.preco.toFixed(2)}<br>
      <input type="number" min="0" max="${prod.quantidade}" value="0" id="qtd-${prod.id}">
      <button onclick="adicionarAoCarrinho(${prod.id}, '${prod.nome}', ${prod.preco})">Adicionar</button>
      <hr>
    `;
    container.appendChild(div);
  });
});

function adicionarAoCarrinho(id, nome, preco) {
  const qtd = parseInt(document.getElementById(`qtd-${id}`).value);
  if (qtd > 0) {
    carrinho.push({ id, nome, preco, quantidade: qtd });
    alert(`${nome} adicionado ao carrinho!`);
  }
}

function finalizarVenda() {
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  fetch('/api/vendas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ itens: carrinho })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    });
}
