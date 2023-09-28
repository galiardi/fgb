import { Router } from 'express';
import usuarioRouter from './usuario.router.js';
import operacionRouter from './operacion.router.js';
import imagenRouter from './imagen.router.js';

const router = Router();

router.use('/usuario', usuarioRouter);
router.use('/operacion', operacionRouter);
router.use('/imagen', imagenRouter);

export default router;
