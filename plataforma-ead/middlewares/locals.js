// Deixa o usuário logado e a mensagem de aviso disponíveis em todas as views
module.exports = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  res.locals.currentPath = req.path;
  delete req.session.flash;
  next();
};
