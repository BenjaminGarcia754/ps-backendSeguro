const express = require('express');
const router = express.Router();
const utilidadesController = require('../controllers/utilidades.controller');
const { utilidadesValidator } = require('../controllers/utilidades.controller');

// POST: api/utilidades
router.post('/', utilidadesValidator, utilidadesController.create);
module.exports = router;
