const express = require('express');
const router = express.Router();
const utilidadesController = require('../controllers/utilidades.controller');
const { utilidadesValidator } = require('../controllers/utilidades.controller');
const Authorize = require("../middlewares/auth.middleware");
const compraController = require("../controllers/compra.controller");

// POST: api/utilidades
router.post('/', Authorize('Usuario,Administrador'), utilidadesValidator, utilidadesController.create);
module.exports = router;
