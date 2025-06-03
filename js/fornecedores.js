async function listar() {
  const res = await fetch('/api/fornecedores');
  const dados = await res.json();

  const ul = document.getElementById('listaFornecedores');
  ul.innerHTML = '';
  dados.forEach(f => {
    const li = document.createElement('li');
    li.textContent = `${f.nome} - ${f.cnpj}`;
    li.innerHTML += ` <button onclick="remover(${f.id})">Excluir</button>`;
    ul.appendChild(li);
  });
}

async function salvar() {
  const fornecedor = {
    nome: document.getElementById('nome').value,
    cnpj: document.getElementById('cnpj').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value
  };

  await fetch('/api/fornecedores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fornecedor)
  });

  listar();
}

async function remover(id) {
  await fetch(`/api/fornecedores/${id}`, {
    method: 'DELETE'
  });

  listar();
}

listar();
