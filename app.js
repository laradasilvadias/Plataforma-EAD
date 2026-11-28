const path = require('path');
const express = require('express');
const session = require('express-session');
const locals = require('./middlewares/locals');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'troque-este-segredo',
  resave: false,
  saveUninitialized: false,
}));
app.use(locals);

app.use('/', require('./routes/public'));
app.use('/aluno', require('./routes/student'));
app.use('/professor', require('./routes/teacher'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('error', { title: 'Página não encontrada', message: 'A página que você procura não existe.' });
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Erro', message: 'Algo deu errado. Tente novamente.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Plataforma EAD em http://localhost:${PORT}`));
