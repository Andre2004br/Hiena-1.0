document.getElementById('formImportarXML').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('xml', document.getElementById('xmlFile').files[0]);
  
    const res = await fetch('http://localhost:3000/api/importarXML', {
      method: 'POST',
      body: formData
    });
  
    const data = await res.json();
    document.getElementById('resultado').innerText = data.mensagem || 'Erro ao importar';
  });
  