const User = require('../models/User');

const HOME_BY_ROLE = { aluno: '/aluno', professor: '/professor', admin: '/admin' };

const startSession = (req, found) => {
  req.session.user = { id: found.id, name: found.name, email: found.email, role: found.role };
};

exports.showLogin = (req, res) => res.render('auth/login', { title: 'Entrar' });

exports.login = (req, res) => {
  const found = User.authenticate(req.body.email, req.body.password);
  if (!found) {
    req.session.flash = { type: 'error', message: 'E-mail ou senha incorretos.' };
    return res.redirect('/login');
  }
  startSession(req, found);
  res.redirect(HOME_BY_ROLE[found.role]);
};

exports.showRegister = (req, res) => res.render('auth/register', { title: 'Criar conta' });

exports.register = (req, res) => {
  try {
    const id = User.create({ ...req.body, role: 'aluno' });
    startSession(req, { id, name: req.body.name, email: req.body.email, role: 'aluno' });
    res.redirect('/aluno');
  } catch (err) {
    req.session.flash = { type: 'error', message: err.message };
    res.redirect('/cadastro');
  }
};

exports.logout = (req, res) => req.session.destroy(() => res.redirect('/'));

exports.panel = (req, res) => res.redirect(HOME_BY_ROLE[req.session.user.role]);
