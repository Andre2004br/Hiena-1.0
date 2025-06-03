document.getElementById('formVenda').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const produtoId = document.getElementById('produtoVenda').value;
    const quantidade = document.getElementById('quantidadeVenda').value;
  
    await fetch('http://localhost:3000/api/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produtoId, quantidade })
    });
  
    // Atualizar o estoque na tela
    carregarProdutos();
  });

  