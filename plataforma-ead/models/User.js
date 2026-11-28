const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  all: () => db.prepare('SELECT id, name, email, role FROM users ORDER BY id').all(),

  findByEmail: (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email),

  create({ name, email, password, role = 'aluno' }) {
    if (!name || !email || !password || password.length < 6) {
      throw new Error('Preencha todos os campos (senha com no mínimo 6 caracteres).');
    }
    if (User.findByEmail(email)) throw new Error('Este e-mail já está cadastrado.');
    return db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, bcrypt.hashSync(password, 10), role).lastInsertRowid;
  },

  authenticate(email, password) {
    const found = User.findByEmail(email);
    return found && bcrypt.compareSync(password || '', found.password) ? found : null;
  },

  updateRole: (id, role) => db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id),
  remove: (id) => db.prepare('DELETE FROM users WHERE id = ?').run(id),
  countByRole: (role) => db.prepare('SELECT COUNT(*) AS n FROM users WHERE role = ?').get(role).n,
};

module.exports = User;
