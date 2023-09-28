import bcrypt from 'bcrypt';

class Credencial {
  constructor({ email, contrasena, id_usuario }) {
    this.email = email;
    this.contrasena = contrasena;
    this.id_usuario = id_usuario;
  }

  // esta operación debe estar dentro de la transacción al crear un usuario, por esto pasamos la conección como argumento (conn)
  async crear(conn) {
    try {
      const contrasena_hasheada = await bcrypt.hash(this.contrasena, 10);

      const [resultado] = await conn.execute(
        'INSERT INTO credenciales (email, contrasena, id_usuario) VALUES (?, ?, ?)',
        [this.email, contrasena_hasheada, this.id_usuario]
      );
      return resultado.insertId;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') throw new Error('El email ya existe'); // capturado por el catch en usuario.model.js
      return null;
    }
  }

  // esta operación debe estar dentro de la transacción al actualizar un usuario, por esto pasamos la conección como argumento
  async actualizar(conn) {
    try {
      const contrasena_hasheada = await bcrypt.hash(this.contrasena, 10);

      const [resultado] = await conn.execute(
        'UPDATE credenciales SET email = ?, contrasena = ? WHERE id_usuario = ?',
        [this.email, contrasena_hasheada, this.id_usuario]
      );

      // INNECESARIO, affectedRows seria 0 si id_usuario no existe, pero ya fue verificado al actualizar usuario
      // if (resultado.affectedRows === 0) return null;

      return true;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') throw new Error('El email ya existe'); // capturado por el catch en usuario.model.js
      return null;
    }
  }
}

export { Credencial };
