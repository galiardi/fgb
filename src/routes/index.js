import { Router } from 'express';
import apiRouter from './api/index.js';
import authRouter from './auth.router.js';
import pagesRouter from './pages.router.js';

const router = Router();

router.use('/api', apiRouter);
router.use('/auth', authRouter); // rutas para renderizar signup, login y para hacer logout
router.use('/', pagesRouter); // rutas para renderizar las paginas

export default router;
