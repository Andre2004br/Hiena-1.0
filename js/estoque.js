const token = localStorage.getItem('token');

fetch('/api/estoque', {
  headers: {
    'Authorization': token
  }
})
.then(res => res.json())
.then(data => {
  const tbody = document.querySelector('#tabelaEstoque tbody');
  tbody.innerHTML = '';

  data.forEach(prod => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${prod.nome}</td>
      <td>${prod.quantidade}</td>
      <td>${prod.validade || '-'}</td>
      <td>
        <input type="number" min="1" id="entrada-${prod.id}">
        <button onclick="ajustarEstoque(${prod.id}, 'entrada')">➕</button>
      </td>
      <td>
        <input type="number" min="1" id="saida-${prod.id}">
        <button onclick="ajustarEstoque(${prod.id}, 'saida')">➖</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
});

function ajustarEstoque(id, tipo) {
  const quantidade = parseInt(document.querySelector(`#${tipo}-${id}`).value);

  fetch(`/api/estoque/${tipo}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ id, quantidade })
  })
    .then(res => res.json())
    .then(() => location.reload());
}
