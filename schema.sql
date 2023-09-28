CREATE SCHEMA fgb;

USE fgb;

CREATE TABLE usuarios(
  id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(12) NOT NULL UNIQUE,
  direccion VARCHAR(255) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  balance DECIMAL(15, 2) NOT NULL CHECK (balance >= 0),
  nombre_imagen VARCHAR(255)
);

CREATE TABLE credenciales(
  id_credencial INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE movimientos(
  id_movimiento INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  tipo ENUM('transferencia', 'transferencia_futura', 'prestamo') NOT NULL,
  monto DECIMAL(15 ,2) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE transferencias(
  id_transferencia INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- id_emisor INT UNSIGNED NOT NULL,
  id_receptor INT UNSIGNED NOT NULL,
  id_movimiento INT UNSIGNED NOT NULL,
  -- FOREIGN KEY (id_emisor) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_receptor) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento)
);

CREATE TABLE transf_futuras(
  id_transf_futuras INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_emisor INT UNSIGNED NOT NULL,
  id_receptor INT UNSIGNED NOT NULL,
  id_movimiento INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_emisor) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_receptor) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento)
);

CREATE TABLE prestamos(
  id_prestamo INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_movimiento INT UNSIGNED NOT NULL,
  cuotas INT NOT NULL,
  FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento)
);

DELIMITER **
    CREATE PROCEDURE transferir(
        IN emisor INT UNSIGNED, -- id_usuario
        IN receptor INT UNSIGNED, -- id_destinatario
        IN _monto DECIMAL(15, 2) -- monto
    )
    
    BEGIN
    -- lanza error si emisor es igual a receptor
    -- si son iguales, el usuario sumara dinero a su cuenta en vez de quedar igual
    IF (emisor = receptor) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El emisor no puede ser igual al receptor';
    END IF;

    SET @balance_emisor = (SELECT balance FROM usuarios WHERE id_usuario= emisor);
    SET @balance_receptor = (SELECT balance FROM usuarios WHERE id_usuario= receptor);
    SET @nuevo_balance_emisor = @balance_emisor - _monto;
    SET @nuevo_balance_receptor = @balance_receptor + _monto;

    UPDATE usuarios SET balance = @nuevo_balance_emisor WHERE id_usuario = emisor;
    UPDATE usuarios SET balance = @nuevo_balance_receptor WHERE id_usuario = receptor;

    INSERT INTO movimientos (id_usuario, tipo, monto) VALUES (emisor, 'transferencia', _monto);
    SET @id_movimiento = (SELECT LAST_INSERT_ID());

    INSERT INTO transferencias (id_receptor, id_movimiento) VALUES (receptor, @id_movimiento);
    
    SELECT LAST_INSERT_ID();
    END **
DELIMITER ;