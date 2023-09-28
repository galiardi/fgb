import { Router } from 'express';

const router = Router();

// login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Inicio de sesión', layout: 'layouts/authLayout' });
});

// signup
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Registro', layout: 'layouts/authLayout' });
});

// logout
router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.redirect('/');
});

export default router;
