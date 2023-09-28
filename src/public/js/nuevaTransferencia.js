const transferirForm = document.getElementById('transferir-form');

transferirForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const rut = document.getElementById('rut').value.trim();
  const email = document.getElementById('email').value.trim();
  const monto = document.getElementById('monto').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  // if (!nombre || !rut || !email || !monto || !contrasena) return alert('Faltan datos');

  try {
    const response = await fetch('/api/operacion/transferir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        rut,
        email,
        monto,
        contrasena,
      }),
    });
    const { data, error } = await response.json();
    if (error) return alert(error);

    alert('Transferencia exitosa');
    window.location.href = '/';
  } catch (error) {
    console.log(error);
  }
});
