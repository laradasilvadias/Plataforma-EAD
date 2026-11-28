const router = require('express').Router();
const teacher = require('../controllers/teacherController');
const { requireRole } = require('../middlewares/auth');

router.use(requireRole('professor', 'admin'));

router.get('/', teacher.dashboard);
router.post('/cursos', teacher.create);
router.get('/cursos/:id', teacher.manage);
router.post('/cursos/:id', teacher.update);
router.post('/cursos/:id/excluir', teacher.destroy);
router.post('/cursos/:id/aulas', teacher.addLesson);
router.post('/aulas/:id/excluir', teacher.removeLesson);
router.post('/cursos/:id/perguntas', teacher.addQuestion);
router.post('/perguntas/:id/excluir', teacher.removeQuestion);

module.exports = router;
