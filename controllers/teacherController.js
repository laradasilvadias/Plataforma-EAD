const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');

// Professor só mexe nos próprios cursos; admin mexe em todos
function loadOwnedCourse(req, res, courseId = req.params.id) {
  const course = Course.find(courseId);
  const { id, role } = req.session.user;
  if (!course || (role !== 'admin' && course.teacher_id !== id)) {
    res.status(403).render('error', { title: 'Acesso negado', message: 'Este curso não pertence a você.' });
    return null;
  }
  return course;
}

// Executa uma ação, avisa o resultado e volta para a página do curso
function handle(req, res, courseId, action, successMessage) {
  try {
    action();
    req.session.flash = { type: 'success', message: successMessage };
  } catch (err) {
    req.session.flash = { type: 'error', message: err.message };
  }
  res.redirect(`/professor/cursos/${courseId}`);
}

exports.dashboard = (req, res) => {
  const { id, role } = req.session.user;
  const courses = role === 'admin' ? Course.all() : Course.byTeacher(id);
  res.render('teacher/dashboard', { title: 'Painel do professor', courses });
};

exports.create = (req, res) => {
  try {
    const id = Course.create(req.body, req.session.user.id);
    req.session.flash = { type: 'success', message: 'Curso criado! Agora adicione as aulas.' };
    res.redirect(`/professor/cursos/${id}`);
  } catch (err) {
    req.session.flash = { type: 'error', message: err.message };
    res.redirect('/professor');
  }
};

exports.manage = (req, res) => {
  const course = loadOwnedCourse(req, res);
  if (!course) return;
  res.render('teacher/manage', {
    title: `Gerenciar – ${course.title}`,
    course,
    lessons: Lesson.byCourse(course.id),
    questions: Question.byCourse(course.id),
    students: Enrollment.studentsOfCourse(course.id),
  });
};

exports.update = (req, res) => {
  const course = loadOwnedCourse(req, res);
  if (course) handle(req, res, course.id, () => Course.update(course.id, req.body), 'Curso atualizado.');
};

exports.destroy = (req, res) => {
  const course = loadOwnedCourse(req, res);
  if (!course) return;
  Course.remove(course.id);
  req.session.flash = { type: 'success', message: 'Curso excluído.' };
  res.redirect('/professor');
};

exports.addLesson = (req, res) => {
  const course = loadOwnedCourse(req, res);
  if (course) handle(req, res, course.id, () => Lesson.create(course.id, req.body), 'Aula adicionada.');
};

exports.removeLesson = (req, res) => {
  const lesson = Lesson.find(req.params.id);
  const course = lesson && loadOwnedCourse(req, res, lesson.course_id);
  if (course) handle(req, res, course.id, () => Lesson.remove(lesson.id), 'Aula excluída.');
};

exports.addQuestion = (req, res) => {
  const course = loadOwnedCourse(req, res);
  if (course) handle(req, res, course.id, () => Question.create(course.id, req.body), 'Pergunta adicionada.');
};

exports.removeQuestion = (req, res) => {
  const question = Question.find(req.params.id);
  const course = question && loadOwnedCourse(req, res, question.course_id);
  if (course) handle(req, res, course.id, () => Question.remove(question.id), 'Pergunta excluída.');
};
