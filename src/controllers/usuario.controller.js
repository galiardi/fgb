import { Usuario } from '../models/usuario.model.js';

async function registrarUsuario(req, res) {
  const response = {
    message: 'Registrar usuario',
    data: null,
    error: null,
  };

  // balance inicial por defecto 100000
  const { nombre, rut, direccion, telefono, email, contrasena } = req.body;
  if (!nombre || !rut || !direccion || !telefono || !email || !contrasena) {
    response.error = 'Faltan parámetros requeridos';
    return res.status(400).send(response);
  }

  const usuario = new Usuario(req.body);
  const resultado = await usuario.crear();

  if (resultado === null) {
    response.error = 'Error registrando usuario';
    return res.status(500).send(response);
  }

  if (resultado === 'El rut ya existe' || resultado === 'El email ya existe') {
    response.error = resultado;
    return res.status(409).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  res
    .cookie('access_token', resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function loguearUsuario(req, res) {
  const response = {
    message: 'Loguear usuario',
    data: null,
    error: null,
  };

  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    response.error = 'Faltan parámetros requeridos';
    return res.status(400).send(response);
  }

  const resultado = await Usuario.loguear(req.body);

  if (resultado === null) {
    response.error = 'Error logueando usuario';
    return res.status(500).send(response);
  }

  if (resultado === false) {
    response.error = 'Usuario y/o contraseña inválidos';
    return res.status(401).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  res
    .cookie('access_token', resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function actualizarUsuario(req, res) {
  const response = {
    message: 'Actualizar usuario',
    data: null,
    error: null,
  };

  const { id_usuario } = req.params;

  //valida existencia de parametros
  //rut no puede actualizarse
  const { nombre, direccion, telefono, email, contrasena } = req.body;
  if (!nombre || !direccion || !telefono || !email || !contrasena) {
    response.error = 'Faltan parámetros requeridos';
    return res.status(400).send(response);
  }

  const usuario = new Usuario({ id_usuario, ...req.body });
  const resultado = await usuario.actualizar();

  if (resultado === null) {
    response.error = 'Error actualizando usuario';
    return res.status(500).send(response);
  }

  // si el usuario intenta actualizar email a un valor que ya existe (email UNIQUE)
  if (resultado === 'El email ya existe') {
    response.error = resultado;
    return res.status(409).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  return res
    .cookie('access_token', resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

export { registrarUsuario, loguearUsuario, actualizarUsuario };
