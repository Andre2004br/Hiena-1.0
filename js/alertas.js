async function buscarAlertas() {
  const resEstoque = await fetch('/api/alertas/estoque-baixo');
  const alertasEstoque = await resEstoque.json();
  const ulEstoque = document.getElementById('alertasEstoque');
  ulEstoque.innerHTML = '';
  alertasEstoque.forEach(produto => {
    const li = document.createElement('li');
    li.textContent = `Produto: ${produto.nome} - Estoque: ${produto.quantidade}`;
    ulEstoque.appendChild(li);
  });

  const resVencimento = await fetch('/api/alertas/vencimento');
  const alertasVencimento = await resVencimento.json();
  const ulVencimento = document.getElementById('alertasVencimento');
  ulVencimento.innerHTML = '';
  alertasVencimento.forEach(produto => {
    const li = document.createElement('li');
    li.textContent = `Produto: ${produto.nome} - Vencimento: ${produto.vencimento}`;
    ulVencimento.appendChild(li);
  });
}

buscarAlertas();

