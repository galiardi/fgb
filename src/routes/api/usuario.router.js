import { Router } from 'express';
import {
  registrarUsuario,
  loguearUsuario,
  actualizarUsuario,
} from '../../controllers/usuario.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPropiedad } from '../../middlewares/verificarPropiedad.js';

const router = Router();

router.post('/crear', registrarUsuario);
router.post('/inicio-sesion', loguearUsuario);
router.put('/:id_usuario', verificarToken, verificarPropiedad, actualizarUsuario);

export default router;
