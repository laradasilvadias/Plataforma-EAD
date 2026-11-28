const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

exports.home = (req, res) => {
  res.render('home', { title: 'Início', courses: Course.all().slice(0, 3) });
};

exports.index = (req, res) => {
  const search = (req.query.q || '').trim();
  res.render('courses/index', { title: 'Cursos', courses: Course.all(search), search });
};

exports.show = (req, res) => {
  const course = Course.find(req.params.id);
  if (!course) return res.status(404).render('error', { title: 'Curso não encontrado', message: 'Este curso não existe.' });

  const user = req.session.user;
  res.render('courses/show', {
    title: course.title,
    course,
    lessons: Lesson.byCourse(course.id),
    enrolled: !!user && Enrollment.isEnrolled(user.id, course.id),
    isOwner: !!user && (user.role === 'admin' || user.id === course.teacher_id),
  });
};
