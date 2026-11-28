<div align="center">

# 🎓 Trilha EAD

**Plataforma de Educação a Distância com perfis de aluno, professor e administrador.**

![Node.js](https://img.shields.io/badge/Node.js-18+-6d28d9?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-4c1d95?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-banco-6d28d9?style=for-the-badge&logo=sqlite&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-views-4c1d95?style=for-the-badge&logo=ejs&logoColor=white)

</div>

---

## 📖 Sobre o projeto

A **Trilha EAD** é um projeto acadêmico de Programação Web que simula uma plataforma de cursos online. O aluno se inscreve nos cursos, assiste às videoaulas, baixa materiais, responde a atividades e emite certificado. O professor cadastra e gerencia o conteúdo, e o administrador controla usuários e acompanha as estatísticas.

O código segue o padrão **MVC** (Model, View, Controller), com páginas em **HTML semântico** e CSS organizado em arquivos por responsabilidade.

## ✨ Funcionalidades

### 👩‍🎓 Aluno
- Cadastro e login
- Catálogo de cursos com busca
- Inscrição em cursos
- Videoaulas e download de materiais
- Marcar aulas como concluídas, com barra de progresso
- Atividades com correção automática e nota
- Certificado para imprimir ou salvar em PDF

### 👨‍🏫 Professor
- Criar, editar e excluir cursos
- Adicionar e remover aulas (links de vídeo e material)
- Criar perguntas de múltipla escolha
- Ver os alunos inscritos, com progresso e melhor nota

### 🛠️ Administrador
- Estatísticas da plataforma
- Cadastrar, trocar o perfil e excluir usuários
- Acesso à gestão de todos os cursos

## 🧰 Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Servidor | Node.js + Express |
| Views | EJS (HTML semântico) |
| Banco de dados | SQLite (`better-sqlite3`) |
| Autenticação | `express-session` + `bcryptjs` |
| Estilo | CSS puro, fonte Montserrat |
| Interação | JavaScript puro (efeito de clique) |

## 🚀 Como rodar

**Pré-requisito:** [Node.js](https://nodejs.org) 18 ou superior.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor
npm start
```

Acesse **http://localhost:3000**. O banco `ead.db` é criado sozinho na primeira execução, já com um curso de exemplo.

### 🔑 Contas de teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Aluno | aluno@ead.com | aluno123 |
| Professor | prof@ead.com | prof123 |
| Administrador | admin@ead.com | admin123 |

> ⚠️ Troque essas senhas antes de publicar o projeto em qualquer lugar.

## 🗂️ Estrutura do projeto

```
plataforma-ead/
├── app.js                 # inicia o servidor, middlewares e rotas
├── config/
│   └── database.js        # conexão, tabelas e dados iniciais
├── models/                # M: acesso ao banco de dados
│   ├── User.js
│   ├── Course.js
│   ├── Lesson.js
│   ├── Question.js
│   └── Enrollment.js      # inscrições, progresso e notas
├── views/                 # V: páginas EJS
│   ├── partials/          # cabeçalho, rodapé e card de curso
│   ├── auth/  courses/  student/  teacher/  admin/
│   └── home.ejs  profile.ejs  error.ejs
├── controllers/           # C: lógica de cada tela
│   ├── authController.js
│   ├── courseController.js
│   ├── studentController.js
│   ├── teacherController.js
│   ├── adminController.js
│   └── profileController.js
├── routes/                # URLs de cada área
│   ├── public.js  student.js  teacher.js  admin.js
├── middlewares/
│   ├── auth.js            # login e controle de perfil
│   └── locals.js          # usuário e avisos disponíveis nas views
└── public/
    ├── css/               # main, base, layout, components, pages
    └── js/interactions.js # efeito de onda ao clicar
```

## 🔄 Como funciona o MVC aqui

```
Navegador → Rota → Controller → Model → Banco (SQLite)
                       │
                       └──→ View (EJS) → HTML → Navegador
```

1. A **rota** recebe a URL e chama o **controller** certo.
2. O **controller** pede os dados ao **model** e escolhe a **view**.
3. O **model** é o único que fala com o banco.
4. A **view** só desenha a página com os dados recebidos.

## 🗺️ Principais rotas

| Área | Rota | O que faz |
| --- | --- | --- |
| Pública | `/` · `/cursos` · `/cursos/:id` | Início, catálogo e detalhes |
| Pública | `/login` · `/cadastro` | Acesso à plataforma |
| Aluno | `/aluno` · `/aluno/cursos` | Painel e minhas aulas |
| Aluno | `/aluno/cursos/:id/aulas` | Assistir às aulas |
| Aluno | `/aluno/cursos/:id/atividade` | Prova do curso |
| Aluno | `/aluno/certificados` | Certificados conquistados |
| Professor | `/professor` · `/professor/cursos/:id` | Painel e gestão do curso |
| Admin | `/admin` | Painel do administrador |

## 🏅 Regra do certificado

O certificado é liberado quando o aluno:
1. conclui **todas as aulas** do curso, e
2. tira **60% ou mais** na prova (se o curso tiver perguntas).

A nota mínima fica em `models/Enrollment.js` (`MIN_SCORE`).

## 🎨 Personalização

- **Cores:** variáveis no começo de `public/css/base.css`.
- **Fonte:** link do Google Fonts em `views/partials/header.ejs`.
- **Vídeos do curso de exemplo:** `config/database.js` (só vale com o banco vazio). Em uso normal, troque os vídeos pelo painel do professor.

## 📌 Limitações e próximos passos

- Vídeos e materiais entram por **link**, não por upload de arquivo.
- Ainda não há botão de **editar aula**; é preciso excluir e adicionar de novo.
- Ideias para evoluir: fórum de dúvidas, comentários nas aulas, notificações e relatórios de desempenho.

---

<div align="center">

Feito para a disciplina de **Programação Web** 💜

</div>
