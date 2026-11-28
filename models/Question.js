const db = require('../config/database');

const parse = (row) => ({ ...row, options: JSON.parse(row.options) });

const Question = {
  byCourse: (courseId) => db.prepare('SELECT * FROM questions WHERE course_id = ? ORDER BY id').all(courseId).map(parse),
  find: (id) => db.prepare('SELECT * FROM questions WHERE id = ?').get(id),

  create(courseId, { text, option0, option1, option2, option3, correct }) {
    const options = [option0, option1, option2, option3].filter(Boolean);
    if (!text || options.length < 2) throw new Error('Informe a pergunta e ao menos duas alternativas.');
    return db.prepare('INSERT INTO questions (course_id, text, options, correct) VALUES (?, ?, ?, ?)')
      .run(courseId, text, JSON.stringify(options), Number(correct));
  },
  remove: (id) => db.prepare('DELETE FROM questions WHERE id = ?').run(id),
};

module.exports = Question;
