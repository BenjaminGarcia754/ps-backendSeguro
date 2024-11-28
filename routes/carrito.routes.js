const router = require('express').Router();
const carrito = require('../controllers/carrito.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/carrito
router.get('/', Authorize('Usuario,Administrador'), carritos.getAll);

// GET: api/carrito/:id
router.get('/:id', Authorize('Usuario,Administrador'), carritos.get);

// POST: api/carrito
router.post('/', Authorize('Usuario,Administrador'), carritos.carritoValidator, carritos.create);

// PUT: api/carrito/:id
router.put('/:id', Authorize('Usuario,Administrador'), carritos.carritoValidator, carritos.update);

// DELETE: api/carrito/:id
router.delete('/:id', Authorize('Usuario,Administrador'), carritos.delete);

module.exports = router;
