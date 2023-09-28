const imgForm = document.getElementById('img-form');
const updateForm = document.getElementById('update-form');

imgForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('file').files[0];
  if (!file) return alert('Debe seleccionar un archivo');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`/api/imagen`, {
      method: 'POST',
      body: formData,
    });
    const { data, error } = await response.json();

    if (error) return alert(error);

    window.location.reload();
  } catch (error) {
    alert(error);
  }
});

updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();
  const repetirContrasena = document.getElementById('repetir-contrasena').value.trim();

  if (!nombre || !direccion || !telefono || !email || !contrasena)
    return alert('Faltan parámetros');
  if (contrasena !== repetirContrasena) return alert('Las contraseñas no coinciden');

  try {
    // la constante id_usuario es asignada en un script al renderizar la pagina (profile.hbs)
    const response = await fetch(`/api/usuario/${id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        direccion,
        telefono,
        email,
        contrasena,
      }),
    });
    const { error } = await response.json();

    if (error) {
      alert(error);
      return;
    }

    alert('Usuario actualizado correctamente');
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
