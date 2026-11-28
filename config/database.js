const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, '..', 'ead.db'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'aluno'
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL, video_url TEXT, material_url TEXT
  );
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    text TEXT NOT NULL, options TEXT NOT NULL, correct INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS enrollments (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_id)
  );
  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, lesson_id)
  );
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    score INTEGER, total INTEGER, created TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Dados iniciais para testar a plataforma
if (!db.prepare('SELECT 1 FROM users').get()) {
  const addUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  addUser.run('Administrador', 'admin@ead.com', bcrypt.hashSync('admin123', 10), 'admin');
  const teacherId = addUser.run('Profa. Marina', 'prof@ead.com', bcrypt.hashSync('prof123', 10), 'professor').lastInsertRowid;
  addUser.run('Aluno Teste', 'aluno@ead.com', bcrypt.hashSync('aluno123', 10), 'aluno');

  const courseId = db.prepare('INSERT INTO courses (title, description, category, teacher_id) VALUES (?, ?, ?, ?)')
    .run('Introdução ao HTML e CSS', 'Aprenda a estruturar e estilizar suas primeiras páginas web.', 'Programação', teacherId).lastInsertRowid;
  const addLesson = db.prepare('INSERT INTO lessons (course_id, title, video_url, material_url) VALUES (?, ?, ?, ?)');
  addLesson.run(courseId, 'O que é HTML?', 'https://www.youtube.com/embed/UB1O30fR-EE', 'https://developer.mozilla.org/pt-BR/docs/Learn/HTML');
  addLesson.run(courseId, 'Primeiros passos com CSS', 'https://www.youtube.com/embed/yfoY53QXEnI', 'https://developer.mozilla.org/pt-BR/docs/Learn/CSS');
  db.prepare('INSERT INTO questions (course_id, text, options, correct) VALUES (?, ?, ?, ?)')
    .run(courseId, 'Qual tag define o título principal da página?', JSON.stringify(['<p>', '<h1>', '<div>', '<span>']), 1);
}

module.exports = db;
