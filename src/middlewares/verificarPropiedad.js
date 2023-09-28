// Valida que el recurso al que se esta accediendo pertenece a quién accede
// Debe ir después de verifyUserToken o ifTokenSetUser ya que estos agregan el user a res.locals

function verificarPropiedad(req, res, next) {
  // toma el userId de la url
  const splitedUrl = req.originalUrl.split('/');
  const userIdFromUrl = splitedUrl.slice(-1);

  // verifica que el userId de la url coincida con el id_usuario de la información obtenida del token, guardada en res.locals.user
  if (userIdFromUrl != res.locals.user.id_usuario) {
    return res.status(403).send({ error: 'Propiedad inválida' });
  }
  next();
}

export { verificarPropiedad };
