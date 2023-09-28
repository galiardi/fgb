import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

function verificarToken(req, res, next) {
  const token = req.cookies.access_token;

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    // si no hay un token válido, redirecciona al login
    if (err) {
      return res.redirect('/auth/login');
    }
    // guarda la información del usuario (proveniente del token) en res.locals.user
    res.locals.user = decoded;
    next();
  });
}

export { verificarToken };
