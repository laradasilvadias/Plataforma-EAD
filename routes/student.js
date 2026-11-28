const router = require('express').Router();
const student = require('../controllers/studentController');
const { requireRole } = require('../middlewares/auth');

router.use(requireRole('aluno'));

router.get('/', student.dashboard);
router.get('/cursos', student.myCourses);
router.post('/cursos/:id/inscricao', student.enroll);
router.get('/cursos/:id/aulas/:lessonId?', student.lesson);
router.post('/aulas/:id/concluir', student.completeLesson);
router.get('/cursos/:id/atividade', student.activity);
router.post('/cursos/:id/atividade', student.submitActivity);
router.get('/certificados', student.certificates);
router.get('/certificados/:id', student.certificate);

module.exports = router;
