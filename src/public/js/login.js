const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  const email = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  // if (!email || !contrasena) return alert('Faltan datos');

  e.preventDefault();
  try {
    const response = await fetch('/api/usuario/inicio-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        contrasena,
      }),
    });

    const { error } = await response.json();

    if (error) {
      alert(error);
      return;
    }
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
