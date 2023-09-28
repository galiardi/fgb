const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const rut = document.getElementById('rut').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();
  const repetirContrasena = document.getElementById('repetir-contrasena').value.trim();

  if (!nombre || !rut || !direccion || !telefono || !email || !contrasena)
    return alert('Faltan parámetros');
  if (contrasena !== repetirContrasena) return alert('Las contraseñas no coinciden');

  try {
    const response = await fetch('/api/usuario/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        rut,
        direccion,
        telefono,
        email,
        contrasena,
      }),
    });

    const { error: error } = await response.json();

    if (error) return alert(error);

    alert('Usuario registrado correctamente');
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
