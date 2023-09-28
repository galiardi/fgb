# Versiones

- MySQL: 8.0.34
- Node: 18.12.0

# Iniciar la app

1.  Para crear la base de datos, ejecutar en **MySQL** las queries disponibles en el archivo **schema.sql**, ubicado en la raíz del proyecto. Estas incluyen **creación de base de datos, tablas y un procedimeinto almacenado**.

2.  En el archivo **.env** disponible en la raíz del proyecto, modificar las variables **DB_USER** y **DB_PASSWORD** con sus valores locales.

3.  Instalar las dependencias:

```
npm install
```

4. Levantar servidor:

```
npm run dev
```

5. Visitar http://localhost:3000

6. Para transferir registre al menos dos usuarios cuyos datos pueda recordar, ya que seran requeridos.
   <br></br>

# Solicitar prestamo

Para solicitar un prestamo se ha adjuntado el archivo fgb.postman_collection.json el cual se puede abrir con postman.
Primero debe loguear un usuario (cambiar credenciales) y luego crear un prestamo. No hay frontend para prestamos, ni crear, ni visualizar.

# Almacenamiento de JWT en el cliente

**El json web token será almacenado en las cookies** del cliente al registrarse, loguearse o actualizar sus datos. De esta forma, el jwt será enviado al servidor automáticamente en cada petición. Esto nos permitirá, además de proteger las rutas de la api, verificar si el usuario posee un token válido antes de renderizar las vistas.
<br></br>

# Transferencias

Las transferencias son realizadas mediante un **procedimiento almacenado** el cual es llamado desde una **transacción** realizada en el método transferir de la clase operación (operacion.model.js). Este procedimiento se encuentra en el archivo **schema.sql**, después de la definición de las tablas.
<br></br>

# Aclaración sobre la estructura del HTML

Las páginas presentan la siguiente organización general:

```
<nav></nav>
<main>
<header></header>
</main>
<footer></footer>
```

La barra de navegación y el footer son renderizados en el layout, mientras que el main es renderizado por las vistas parciales. El header se ha incluido dentro del main, lo cual rompe con la estructura tradicional, pero nos resulta práctico en este proyecto.

Las páginas de autenticación no incluyen barra de navegación.
<br></br>

# Consultas a la base de datos con mysql2

Como se comenta en https://github.com/sidorares/node-mysql2/issues/745,

```
await = pool.execute(query);
```

es equivalente a:

```
const conn = await pool.getConnection();
await conn.execute(query);
conn.release();
```

Considerando lo anterior, cuando sea posible se utilizará la primera alternativa con el objetivo de hacer el código más fácil de leer.
<br></br>
