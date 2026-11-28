const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const back = (req, res, type, message) => {
  req.session.flash = { type, message };
  res.redirect('/admin');
};

exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    title: 'Painel do administrador',
    stats: {
      alunos: User.countByRole('aluno'),
      professores: User.countByRole('professor'),
      cursos: Course.count(),
      inscricoes: Enrollment.count(),
    },
    users: User.all(),
    courses: Course.all(),
  });
};

exports.createUser = (req, res) => {
  try {
    User.create(req.body);
    back(req, res, 'success', 'Usuário criado.');
  } catch (err) {
    back(req, res, 'error', err.message);
  }
};

exports.changeRole = (req, res) => {
  User.updateRole(req.params.id, req.body.role);
  back(req, res, 'success', 'Perfil atualizado.');
};

exports.deleteUser = (req, res) => {
  if (Number(req.params.id) === req.session.user.id) return back(req, res, 'error', 'Você não pode excluir a si mesmo.');
  User.remove(req.params.id);
  back(req, res, 'success', 'Usuário excluído.');
};
