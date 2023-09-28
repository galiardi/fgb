import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';

class Operacion {
  static async transferir({ nombre, rut, email, monto, contrasena, id_usuario }) {
    let conn = null;
    const respuesta = {
      data: null,
      error: null,
    };

    try {
      // solicita credencial
      const [rows1] = await promisePool.execute(
        'SELECT contrasena FROM credenciales WHERE id_usuario = ?',
        [id_usuario]
      );
      if (rows1.length === 0) throw new Error('Usuario no existe'); // si usuario fue eliminado // va al catch

      // compara los contrasenas
      const contrasena_hasheada = rows1[0].contrasena;
      const contrasenaCoincide = await bcrypt.compare(contrasena, contrasena_hasheada);

      if (!contrasenaCoincide) throw new Error('Contrasena incorrecta'); // va al catch

      // valida los datos del destinatario solicitando sus datos
      const [rows2] = await promisePool.execute(
        `
        SELECT usuarios.id_usuario
        FROM usuarios JOIN credenciales
        on usuarios.id_usuario = credenciales.id_usuario
        WHERE rut = ? AND email = ? AND nombre = ?`,
        [rut, email, nombre]
      );
      const id_destinatario = rows2[0]?.id_usuario;
      if (!id_destinatario) throw new Error('Revise los datos del destinatario'); // va al catch

      // transferencia
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      // ejecuta procedimiento almacenado transferir
      const [result] = await conn.execute('CALL transferir(?, ?, ?);', [
        id_usuario,
        id_destinatario,
        monto,
      ]);

      await conn.commit();
      conn.release();

      console.log(result);

      respuesta.data = true;
    } catch (error) {
      console.log(error);

      if (conn) {
        await conn.rollback();
        conn.release();
      }

      if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        respuesta.error = 'Saldo insuficiente';
      } else if (
        error.message === 'Usuario no existe' ||
        error.message === 'Contrasena incorrecta' ||
        error.message === 'Revise los datos del destinatario' ||
        error.message === 'El emisor no puede ser igual al receptor' // proviene del procedimiento almacenado
      ) {
        respuesta.error = error.message;
      } else {
        respuesta.error = 'Error al realizar la transferencia';
      }
    }
    return respuesta;
  }

  static async obtenerMovimientos(id_usuario) {
    try {
      // solicita los movimientos hechos por el usuario
      // join con transferencias para obtener id_receptor. join con usuarios para obtener el nombre del receptor
      const [movimientos_realizados] = await promisePool.execute(
        `
        SELECT movimientos.id_movimiento, tipo, monto, fecha, usuarios.nombre as nombre_receptor
        FROM movimientos JOIN transferencias
        on movimientos.id_movimiento = transferencias.id_movimiento
        JOIN usuarios
        on transferencias.id_receptor = usuarios.id_usuario
        WHERE movimientos.id_usuario = ?
        ORDER BY fecha DESC
        `,
        [id_usuario]
      );

      // solicita las transferencias recibidas por el usuario
      const [transferencias_recibidas] = await promisePool.execute(
        `
        SELECT movimientos.id_movimiento, monto, fecha
        FROM movimientos JOIN transferencias
        on movimientos.id_movimiento = transferencias.id_movimiento
        WHERE transferencias.id_receptor = ?
        ORDER BY fecha DESC
        `,
        [id_usuario]
      );

      transferencias_recibidas.forEach((transferencia) => {
        transferencia.tipo = 'transferencia recibida';
        transferencia.nombre_receptor = '--';
      });

      return [...movimientos_realizados, ...transferencias_recibidas];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async solicitarPrestamo({ id_usuario, monto, cuotas }) {
    let conn = null;
    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      const [result1] = await conn.execute(
        'INSERT INTO movimientos (id_usuario, tipo, monto) VALUES (?, ?, ?)',
        [id_usuario, 'prestamo', monto]
      );

      const [result2] = await conn.execute(
        'INSERT INTO prestamos (id_movimiento, cuotas) VALUES (?, ?)',
        [result1.insertId, cuotas]
      );

      await conn.commit();
      conn.release();

      return true;
    } catch (error) {
      console.log(error);
      if (conn) {
        await conn.rollback();
        conn.release();
      }
      return null;
    }
  }
}

export { Operacion };
