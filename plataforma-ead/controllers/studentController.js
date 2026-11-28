const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');

// Garante que o curso existe e que o aluno está inscrito
function loadEnrolledCourse(req, res) {
  const course = Course.find(req.params.id);
  if (!course || !Enrollment.isEnrolled(req.session.user.id, course.id)) {
    req.session.flash = { type: 'error', message: 'Inscreva-se no curso para acessar este conteúdo.' };
    res.redirect(course ? `/cursos/${course.id}` : '/cursos');
    return null;
  }
  return course;
}

exports.dashboard = (req, res) => {
  const courses = Enrollment.forStudent(req.session.user.id);
  const lessonTotal = courses.reduce((sum, c) => sum + c.lesson_total, 0);
  const lessonDone = courses.reduce((sum, c) => sum + c.lesson_done, 0);
  res.render('student/dashboard', {
    title: 'Painel do aluno',
    stats: {
      courses: courses.length,
      percent: lessonTotal ? Math.round((lessonDone / lessonTotal) * 100) : 0,
      certificates: courses.filter((c) => c.certified).length,
    },
  });
};

exports.myCourses = (req, res) => {
  res.render('student/my-courses', { title: 'Minhas aulas', courses: Enrollment.forStudent(req.session.user.id) });
};

exports.enroll = (req, res) => {
  Enrollment.enroll(req.session.user.id, req.params.id);
  req.session.flash = { type: 'success', message: 'Inscrição realizada!' };
  res.redirect(`/aluno/cursos/${req.params.id}/aulas`);
};

exports.lesson = (req, res) => {
  const course = loadEnrolledCourse(req, res);
  if (!course) return;

  const lessons = Lesson.byCourse(course.id);
  const lesson = lessons.find((l) => l.id === Number(req.params.lessonId)) || lessons[0];
  if (!lesson) {
    req.session.flash = { type: 'error', message: 'Este curso ainda não tem aulas.' };
    return res.redirect(`/cursos/${course.id}`);
  }
  const done = Enrollment.completedLessonIds(req.session.user.id, course.id);
  res.render('student/lesson', { title: lesson.title, course, lessons, lesson, done });
};

exports.completeLesson = (req, res) => {
  const lesson = Lesson.find(req.params.id);
  if (lesson && Enrollment.isEnrolled(req.session.user.id, lesson.course_id)) {
    Enrollment.completeLesson(req.session.user.id, lesson.id);
    req.session.flash = { type: 'success', message: 'Aula concluída!' };
    return res.redirect(`/aluno/cursos/${lesson.course_id}/aulas/${lesson.id}`);
  }
  res.redirect('/aluno/cursos');
};

exports.activity = (req, res) => {
  const course = loadEnrolledCourse(req, res);
  if (!course) return;
  res.render('student/activity', {
    title: `Atividades – ${course.title}`,
    course,
    questions: Question.byCourse(course.id),
    best: Enrollment.bestScore(req.session.user.id, course.id),
    result: null,
  });
};

exports.submitActivity = (req, res) => {
  const course = loadEnrolledCourse(req, res);
  if (!course) return;

  const questions = Question.byCourse(course.id);
  const score = questions.filter((q) => Number(req.body[`q${q.id}`]) === q.correct).length;
  if (questions.length) Enrollment.saveAttempt(req.session.user.id, course.id, score, questions.length);

  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  res.render('student/activity', {
    title: `Atividades – ${course.title}`,
    course,
    questions,
    best: Enrollment.bestScore(req.session.user.id, course.id),
    result: { score, total: questions.length, percent, approved: percent >= Enrollment.MIN_SCORE },
  });
};

exports.certificates = (req, res) => {
  const certified = Enrollment.forStudent(req.session.user.id).filter((c) => c.certified);
  res.render('student/certificates', { title: 'Certificados', certified, minScore: Enrollment.MIN_SCORE });
};

exports.certificate = (req, res) => {
  const course = Enrollment.forStudent(req.session.user.id).find((c) => c.id === Number(req.params.id) && c.certified);
  if (!course) {
    req.session.flash = { type: 'error', message: 'Certificado ainda não disponível.' };
    return res.redirect('/aluno/certificados');
  }
  res.render('student/certificate', { title: `Certificado – ${course.title}`, course, date: new Date().toLocaleDateString('pt-BR') });
};
