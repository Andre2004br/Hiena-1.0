document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/dashboard', {
    headers: { Authorization: token }
  });
  const data = await res.json();

  // Gráfico de vendas por hora
  new Chart(document.getElementById('vendasChart'), {
    type: 'bar',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
      datasets: [{
        label: 'Vendas por hora',
        data: data.vendasPorHora,
        backgroundColor: '#4CAF50'
      }]
    }
  });

  // Gráfico de mais vendidos
  new Chart(document.getElementById('maisVendidosChart'), {
    type: 'pie',
    data: {
      labels: data.maisVendidos.map(v => v[0]),
      datasets: [{
        label: 'Mais Vendidos',
        data: data.maisVendidos.map(v => v[1]),
        backgroundColor: ['#f44336', '#2196F3', '#FFC107', '#8BC34A', '#FF9800']
      }]
    }
  });

  // Gráfico de estoque
  new Chart(document.getElementById('estoqueChart'), {
    type: 'bar',
    data: {
      labels: data.estoque.map(p => p.nome),
      datasets: [{
        label: 'Estoque Atual',
        data: data.estoque.map(p => p.quantidade),
        backgroundColor: '#03A9F4'
      }]
    }
  });
});
