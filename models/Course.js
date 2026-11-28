const db = require('../config/database');

const SELECT = `
  SELECT c.*, u.name AS teacher_name,
    (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lesson_count,
    (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS student_count
  FROM courses c JOIN users u ON u.id = c.teacher_id`;

const Course = {
  all(search = '') {
    const like = `%${search}%`;
    return db.prepare(`${SELECT} WHERE c.title LIKE ? OR c.category LIKE ? ORDER BY c.id DESC`).all(like, like);
  },
  find: (id) => db.prepare(`${SELECT} WHERE c.id = ?`).get(id),
  byTeacher: (teacherId) => db.prepare(`${SELECT} WHERE c.teacher_id = ? ORDER BY c.id DESC`).all(teacherId),

  create({ title, description, category }, teacherId) {
    if (!title) throw new Error('Informe o título do curso.');
    return db.prepare('INSERT INTO courses (title, description, category, teacher_id) VALUES (?, ?, ?, ?)')
      .run(title, description || '', category || 'Geral', teacherId).lastInsertRowid;
  },
  update: (id, { title, description, category }) =>
    db.prepare('UPDATE courses SET title = ?, description = ?, category = ? WHERE id = ?').run(title, description, category, id),
  remove: (id) => db.prepare('DELETE FROM courses WHERE id = ?').run(id),
  count: () => db.prepare('SELECT COUNT(*) AS n FROM courses').get().n,
};

module.exports = Course;
