# Trilha EAD (MVC)

Node.js + Express + EJS + SQLite.

## Rodar
```
npm install
npm start
```
Acesse http://localhost:3000

Contas de teste: aluno@ead.com / aluno123 · prof@ead.com / prof123 · admin@ead.com / admin123

## Estrutura
- `app.js` – inicia o servidor e registra middlewares e rotas
- `config/database.js` – conexão, tabelas e dados iniciais
- `models/` – acesso ao banco (User, Course, Lesson, Question, Enrollment)
- `controllers/` – regras de cada tela (auth, course, student, teacher, admin, profile)
- `routes/` – URLs de cada área (public, student, teacher, admin)
- `middlewares/` – login, perfis de acesso e dados globais das views
- `views/` – páginas EJS em HTML semântico (`partials/` = cabeçalho, rodapé e card)
- `public/css/` – `main.css` importa base, layout, components e pages
