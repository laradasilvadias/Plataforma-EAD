const router = require('express').Router();
const admin = require('../controllers/adminController');
const { requireRole } = require('../middlewares/auth');

router.use(requireRole('admin'));

router.get('/', admin.dashboard);
router.post('/usuarios', admin.createUser);
router.post('/usuarios/:id/perfil', admin.changeRole);
router.post('/usuarios/:id/excluir', admin.deleteUser);

module.exports = router;
