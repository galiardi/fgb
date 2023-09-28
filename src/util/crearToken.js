import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

// El argumento coneccion se ha creado por si se desea pasar una conneccion que esta siendo utilizada en una transaccion
async function crearToken({ coneccion, id_usuario }) {
  // (sin try/catch) si hay un error será capturado en el try/catch de la función que la llama
  // solicita la información del usuario a la base de datos para crear un token
  const [rows] = await coneccion.execute(
    `SELECT usuarios.id_usuario, nombre, rut, direccion, telefono, email, nombre_imagen
    FROM usuarios JOIN credenciales
    on usuarios.id_usuario = credenciales.id_usuario
    WHERE usuarios.id_usuario = ?`,
    [id_usuario]
  );
  // crea un token
  const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

  return token;
}

export { crearToken };
