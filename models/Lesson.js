const db = require('../config/database');

// Converte links normais do YouTube para o formato de incorporação (embed)
function toEmbed(url = '') {
  const match = url.match(/(?:watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

const Lesson = {
  byCourse: (courseId) => db.prepare('SELECT * FROM lessons WHERE course_id = ? ORDER BY id').all(courseId),
  find: (id) => db.prepare('SELECT * FROM lessons WHERE id = ?').get(id),

  create(courseId, { title, video_url, material_url }) {
    if (!title) throw new Error('Informe o título da aula.');
    return db.prepare('INSERT INTO lessons (course_id, title, video_url, material_url) VALUES (?, ?, ?, ?)')
      .run(courseId, title, toEmbed(video_url), material_url || '');
  },
  remove: (id) => db.prepare('DELETE FROM lessons WHERE id = ?').run(id),
};

module.exports = Lesson;
