document.getElementById('formProduto').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const quantidade = document.getElementById('quantidade').value;
  
    await fetch('http://localhost:3000/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, categoria, preco, quantidade })
    });
  
    carregarProdutos();
    e.target.reset();
  });
  
  async function carregarProdutos() {
    const res = await fetch('http://localhost:3000/api/produtos');
    const produtos = await res.json();
  
    const tabela = document.getElementById('tabelaProdutos');
    tabela.innerHTML = '';
  
    produtos.forEach(p => {
      tabela.innerHTML += `
        <tr>
          <td>${p.nome}</td>
          <td>${p.categoria}</td>
          <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
          <td>${p.quantidade}</td>
        </tr>
      `;
    });
  }
  
  carregarProdutos();

  