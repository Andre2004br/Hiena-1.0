document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const empresa = document.getElementById('empresa').value;
    const senha = document.getElementById('senha').value;
  
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa, senha })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      localStorage.setItem('empresaId', data.empresaId);
      window.location.href = 'index.html';
    } else {
      document.getElementById('loginStatus').innerText = data.message;
    }
  });

  