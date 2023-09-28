import { Router } from 'express';
import { crearImagen, obtenerImagen } from '../../controllers/imagen.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPropiedad } from '../../middlewares/verificarPropiedad.js';
const router = Router();

router.post('/', verificarToken, crearImagen);
router.get('/:id_usuario', verificarToken, verificarPropiedad, obtenerImagen);

export default router;
