import { promisePool } from '../db.js';
import { crearToken } from '../util/crearToken.js';

class Imagen {
  constructor(id_usuario, nombre_imagen) {
    this.id_usuario = id_usuario;
    this.nombre_imagen = nombre_imagen;
  }

  async crearImagen() {
    // en este caso el try/catch lo haremos en imagen.controller.js (crearImagen)
    // agregaremos el nombre de la imagen directamente al usuario, ya que este necesita una sola imagen y la imagen no necesita más atributos
    const [resultado] = await promisePool.execute(
      'UPDATE usuarios SET nombre_imagen = ? WHERE id_usuario = ?',
      [this.nombre_imagen, this.id_usuario]
    );
    // Para llegar aquí el usuario debió presentar un token válido, pero pudo ser eliminado después de la emisión de su token, entonces affectedRows sería 0
    // arrojamos un error para que sea atrapado por el catch del controller
    if (resultado.affectedRows === 0) throw new Error('El usuario no fue encontrado');

    // crea nuevo token, ya que el token contiene el nombre de la imagen, necesario para renderizar la imagen
    const token = await crearToken({
      coneccion: promisePool,
      id_usuario: this.id_usuario,
    });

    return { token };
  }
}

export { Imagen };
