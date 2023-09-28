import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import routes from './routes/index.js';

const app = express();

// setup de handlebars
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// middlewares
app.use(morgan('dev'));
app.use(cookieParser()); // guardaremos el jwt en las cookies para saber si el usuario esta logeado antes de renderizar las vistas
app.use(express.json());
app.use(fileupload());
app.use(express.static('src/public'));

// rutas
app.use('/', routes);

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

export default app;
