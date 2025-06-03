function gerarRelatorio() {
  const tipo = document.getElementById('tipoRelatorio').value;
  const data = document.getElementById('dataRelatorio').value;
  const produto = document.getElementById('produtoNome').value;
  const token = localStorage.getItem('token');

  let url = `/api/relatorios/${tipo}?`;

  if (data) url += `data=${data}`;
  if (tipo === 'produto' && produto) url += `&produto=${produto}`;

  fetch(url, {
    headers: { 'Authorization': token }
  })
    .then(res => res.json())
    .then(dados => {
      const resultado = document.getElementById('relatorioResultado');
      resultado.innerHTML = JSON.stringify(dados, null, 2);
    })
    .catch(err => console.error(err));
}

