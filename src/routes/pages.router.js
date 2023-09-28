import { Router } from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// verificarToken: si usuario no tiene un token válido, es redireccionado al login

// Pagina principal
router.get('/', verificarToken, (req, res) => {
  res.render('home', {
    title: 'Inicio',
    layout: 'layouts/mainLayout',
  });
});

router.get('/mi-perfil', verificarToken, (req, res) => {
  res.render('profile', {
    title: 'Mi perfil',
    layout: 'layouts/mainLayout',
  });
});

router.get('/nueva-transferencia', verificarToken, (req, res) => {
  res.render('nuevaTransferencia', {
    title: 'Nueva transferencia',
    layout: 'layouts/mainLayout',
  });
});

export default router;
