// Exige usuário logado
function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.session.flash = { type: 'error', message: 'Faça login para continuar.' };
  res.redirect('/login');
}

// Exige um dos perfis informados (aluno, professor, admin)
function requireRole(...roles) {
  return [requireLogin, (req, res, next) => {
    if (roles.includes(req.session.user.role)) return next();
    res.status(403).render('error', { title: 'Acesso negado', message: 'Você não tem permissão para acessar esta página.' });
  }];
}

module.exports = { requireLogin, requireRole };
