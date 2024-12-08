const router = require('express').Router();
const compraController = require('../controllers/compra.controller');
const Authorize = require('../middlewares/auth.middleware');
const { compraValidator } = require('../controllers/compra.controller');

// GET: api/compras
router.get('/', Authorize('Usuario,Administrador'), compraController.getAll);

// GET: api/compras/:id
router.get('/:id', Authorize('Usuario,Administrador'), compraController.get);

// POST: api/compras
router.post('/', Authorize('Usuario,Administrador'), compraValidator, compraController.create);

// PUT: api/compras/:id
router.put('/:id', Authorize('Administrador'), compraValidator, compraController.update);

// DELETE: api/compras/:id
router.delete('/:id', Authorize('Administrador'), compraController.delete);

module.exports = router;
