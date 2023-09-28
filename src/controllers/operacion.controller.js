import { Operacion } from '../models/operacion.model.js';

async function transferir(req, res) {
  const response = {
    message: 'Transferir',
    data: null,
    error: null,
  };

  const { nombre, rut, email, monto, contrasena } = req.body;
  if (!nombre || !rut || !email || !monto || !contrasena) {
    response.error = 'Faltan parámetros requeridos';
    return res.status(400).send(response);
  }

  console.log(res.locals.user);
  const { id_usuario } = res.locals.user;

  const { data, error } = await Operacion.transferir({ ...req.body, id_usuario });

  // Capta todos los posibles errores que no son captados en la siguiente validacion (ver operacion.model.js)
  if (error === 'Error al realizar la transferencia') {
    response.error = error;
    return res.status(500).send(response);
  }

  // errores del cliente captados en operacion.model.js
  if (error) {
    response.error = error;
    return res.status(400).send(response);
  }

  response.data = data;
  return res.status(201).send(response);
}

async function obtenerMovimientos(req, res) {
  const response = {
    message: 'Obtener movimientos',
    data: null,
    error: null,
  };

  const { id_usuario } = res.locals.user;

  const resultado = await Operacion.obtenerMovimientos(id_usuario);

  if (resultado === null) {
    response.error = 'Error obteniendo los movimientos';
    return res.status(500).send(response);
  }

  response.data = resultado;
  return res.status(200).send(response);
}

async function solicitarPrestamo(req, res) {
  const response = {
    message: 'Solicitar prestamo',
    data: null,
    error: null,
  };

  // seteado en verificar token
  const { id_usuario } = res.locals.user;

  const { monto, cuotas } = req.body;

  if (!monto || !cuotas) {
    response.error = 'Faltan parámetros obligatorios';
    return res.status(400).send(response);
  }

  const resultado = await Operacion.solicitarPrestamo({ id_usuario, ...req.body });

  if (resultado === null) {
    response.error = 'Error al solicitar prestamo';
    return res.status(500).send(response);
  }

  response.data = true;
  return res.status(200).send(response);
}

export { transferir, obtenerMovimientos, solicitarPrestamo };
