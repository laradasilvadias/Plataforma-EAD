const router = require('express').Router();
const auth = require('../controllers/authController');
const courses = require('../controllers/courseController');
const profile = require('../controllers/profileController');
const { requireLogin } = require('../middlewares/auth');

router.get('/', courses.home);
router.get('/cursos', courses.index);
router.get('/cursos/:id', courses.show);

router.get('/login', auth.showLogin);
router.post('/login', auth.login);
router.get('/cadastro', auth.showRegister);
router.post('/cadastro', auth.register);
router.post('/logout', auth.logout);

router.get('/painel', requireLogin, auth.panel);
router.get('/perfil', requireLogin, profile.show);

module.exports = router;
