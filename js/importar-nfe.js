function enviarXML() {
  const fileInput = document.getElementById('xmlFile');
  const file = fileInput.files[0];
  const token = localStorage.getItem('token');

  if (!file) return alert("Selecione um arquivo XML!");

  const formData = new FormData();
  formData.append('xml', file);

  fetch('/api/nfe/importar', {
    method: 'POST',
    headers: { 'Authorization': token },
    body: formData
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => alert("Erro ao importar XML."));
}

