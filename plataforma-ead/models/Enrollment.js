const db = require('../config/database');

const MIN_SCORE = 60; // nota mínima (%) para receber o certificado

const Enrollment = {
  MIN_SCORE,

  enroll: (userId, courseId) => db.prepare('INSERT OR IGNORE INTO enrollments VALUES (?, ?)').run(userId, courseId),
  isEnrolled: (userId, courseId) => !!db.prepare('SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId),
  count: () => db.prepare('SELECT COUNT(*) AS n FROM enrollments').get().n,

  // Cursos do aluno com progresso e situação do certificado
  forStudent(userId) {
    const rows = db.prepare(`
      SELECT c.id, c.title, c.category, u.name AS teacher_name,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lesson_total,
        (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id = p.lesson_id
          WHERE p.user_id = @userId AND l.course_id = c.id) AS lesson_done,
        (SELECT COUNT(*) FROM questions WHERE course_id = c.id) AS question_total,
        (SELECT MAX(score * 100 / total) FROM attempts WHERE user_id = @userId AND course_id = c.id) AS best_score
      FROM enrollments e JOIN courses c ON c.id = e.course_id JOIN users u ON u.id = c.teacher_id
      WHERE e.user_id = @userId`).all({ userId });

    return rows.map((r) => ({
      ...r,
      percent: r.lesson_total ? Math.round((r.lesson_done / r.lesson_total) * 100) : 0,
      certified: r.lesson_total > 0 && r.lesson_done === r.lesson_total &&
        (r.question_total === 0 || (r.best_score || 0) >= MIN_SCORE),
    }));
  },

  completedLessonIds: (userId, courseId) => db.prepare(`
    SELECT p.lesson_id FROM progress p JOIN lessons l ON l.id = p.lesson_id
    WHERE p.user_id = ? AND l.course_id = ?`).all(userId, courseId).map((r) => r.lesson_id),

  completeLesson: (userId, lessonId) => db.prepare('INSERT OR IGNORE INTO progress VALUES (?, ?)').run(userId, lessonId),

  saveAttempt: (userId, courseId, score, total) =>
    db.prepare('INSERT INTO attempts (user_id, course_id, score, total) VALUES (?, ?, ?, ?)').run(userId, courseId, score, total),

  bestScore: (userId, courseId) =>
    db.prepare('SELECT MAX(score * 100 / total) AS best FROM attempts WHERE user_id = ? AND course_id = ?').get(userId, courseId).best,

  // Alunos inscritos em um curso (visão do professor)
  studentsOfCourse: (courseId) => db.prepare(`
    SELECT u.name, u.email,
      (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = u.id AND l.course_id = @courseId) AS lesson_done,
      (SELECT COUNT(*) FROM lessons WHERE course_id = @courseId) AS lesson_total,
      (SELECT MAX(score * 100 / total) FROM attempts WHERE user_id = u.id AND course_id = @courseId) AS best_score
    FROM enrollments e JOIN users u ON u.id = e.user_id WHERE e.course_id = @courseId`).all({ courseId }),
};

module.exports = Enrollment;
