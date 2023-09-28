import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';
import { crearToken } from '../util/crearToken.js';
import { Credencial } from './credencial.model.js';

class Usuario {
  constructor({
    id_usuario = null,
    nombre,
    rut,
    direccion,
    telefono,
    email,
    contrasena,
    nombre_imagen = null, // se actualiza al subir una imagen
  }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.rut = rut;
    this.direccion = direccion;
    this.telefono = telefono;
    this.email = email;
    this.contrasena = contrasena;
    this.nombre_imagen = nombre_imagen;
  }

  async crear() {
    let conn = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      // crea el usuario
      const [resultado] = await conn.execute(
        'INSERT INTO usuarios (nombre, rut, direccion, telefono, balance) VALUES (?, ?, ?, ?, ?)',
        [this.nombre, this.rut, this.direccion, this.telefono, 100000]
      );

      // crea la credencial
      const credencial = new Credencial({
        email: this.email,
        contrasena: this.contrasena,
        id_usuario: resultado.insertId,
      });
      // pasamos conn como argumento para que la creación de la credencial se ejecute dentro de esta transacción
      const resultado_credencial = await credencial.crear(conn);
      if (!resultado_credencial) throw new Error('Error al crear credencial'); // capturado por el catch

      //crea el token
      const token = await crearToken({
        coneccion: conn,
        id_usuario: resultado.insertId,
      });

      await conn.commit();
      conn.release();
      return { token };
    } catch (error) {
      console.log(error);

      // getConnection podría fallar (conn = null)
      if (conn) {
        await conn.rollback(); // se revierte la transaccion
        conn.release(); // se libera la coneccion
      }

      if (error.code === 'ER_DUP_ENTRY') return 'El rut ya existe'; // rut UNIQUE
      if (error.code === 'El email ya existe') return error.code; // email UNIQUE (este error proviene de credencial.model.js)

      return null;
    }
  }

  static async loguear({ email, contrasena }) {
    try {
      // solicita la credencial a la base de datos
      const [rows] = await promisePool.execute(
        'SELECT * FROM credenciales WHERE email = ?',
        [email]
      );

      if (rows.length === 0) return false;

      // compara los contrasenas
      const contrasena_hasheada = rows[0].contrasena;
      const contrasenaCoincide = await bcrypt.compare(contrasena, contrasena_hasheada);

      if (contrasenaCoincide === false) return false;
      console.log(rows[0]);
      // crea el token
      const token = await crearToken({
        coneccion: promisePool,
        id_usuario: rows[0].id_usuario,
      });

      return { token };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async actualizar() {
    let conn = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      // actualiza el usuario
      const [result] = await conn.execute(
        `
        UPDATE usuarios SET nombre = ?, direccion = ?, telefono = ?
        WHERE id_usuario = ?;`,
        [this.nombre, this.direccion, this.telefono, this.id_usuario]
      );
      // podría succeder que el usuario fue eliminado pero aun posee un token válido
      if (result.affectedRows === 0) throw new Error('Usuario no existe'); // capturado por catch

      // actualiza la credencial
      const credencial = new Credencial({
        email: this.email,
        contrasena: this.contrasena,
        id_usuario: this.id_usuario,
      });
      const resultado_credencial = await credencial.actualizar(conn);

      if (resultado_credencial === null) throw new Error('Error actualizando credencial'); // capturado en el catch

      // crea el nuevo token
      const token = await crearToken({ coneccion: conn, id_usuario: this.id_usuario });

      await conn.commit();
      conn.release();
      return { token };
    } catch (error) {
      console.log(error);
      // conn podria ser null
      if (conn) {
        await conn.rollback();
        conn.release();
      }

      if (error.code === 'El email ya existe') return error.code; // email UNIQUE (este error proviene de credencial.model.js)

      return null;
    }
  }
}

export { Usuario };
