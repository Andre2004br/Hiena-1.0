async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  const dados = await res.json();

  if (res.ok) {
    localStorage.setItem('token', dados.token);
    localStorage.setItem('empresaId', dados.usuario.empresaId);
    alert('Login OK');
    // redirecionar para dashboard
  } else {
    alert(dados.erro || 'Erro no login');
  }
}
