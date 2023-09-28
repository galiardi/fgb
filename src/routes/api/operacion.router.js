import { Router } from 'express';
import {
  transferir,
  // transferirDespues,
  solicitarPrestamo,
  obtenerMovimientos,
  // borrarCuenta,
} from '../../controllers/operacion.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';

const router = Router();

router.post('/transferir', verificarToken, transferir);
// router.post('/transferencia-futura', verificarToken, transferirDespues);
router.post('/prestamo', verificarToken, solicitarPrestamo);
router.get('/movimientos-usuario', verificarToken, obtenerMovimientos);
// router.delete('/eliminar', borrarCuenta);

export default router;
