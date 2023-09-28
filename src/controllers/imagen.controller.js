import path from 'path';
import fs from 'fs/promises';
import { get__dirname } from '../util/get__dirname.js';
import { Imagen } from '../models/imagen.model.js';

const __dirname = get__dirname(import.meta.url);

async function crearImagen(req, res) {
  const response = {
    message: 'Crear imagen',
    data: null,
    error: null,
  };

  const file = req.files?.file;
  const { id_usuario } = res.locals.user;

  if (!file) {
    response.error = 'No ha enviado un archivo';
    return res.status(400).send(response);
  }

  const { ext } = path.parse(file.name);
  const nombre_imagen = id_usuario + '_' + Date.now() + ext;
  const carpeta = path.join(__dirname, '..', 'storage', 'images');

  try {
    // guarda la imagen
    await fs.writeFile(path.join(carpeta, nombre_imagen), file.data);

    // guarda la nombre de la imagen en el usuario correspondiente en la base de datos
    const imagen = new Imagen(id_usuario, nombre_imagen);
    const resultado = await imagen.crearImagen();

    response.data = true;
    // setea el token en las cookies del cliente
    res
      .cookie('access_token', resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .send(response);
  } catch (error) {
    console.log(error);
    response.error = 'Error al guardar la imagen';
    return res.status(500).send(response);
  }
}

async function obtenerImagen(req, res) {
  const { nombre_imagen } = res.locals.user;

  // PROBAR SIN TRY CATCH
  try {
    const fullPath = path.join(__dirname, '..', 'storage', 'images', nombre_imagen);
    res.sendFile(fullPath);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Error al obtener imagen' });
  }
}

export { crearImagen, obtenerImagen };
