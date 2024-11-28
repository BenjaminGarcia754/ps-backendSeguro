const { carrito, usuario, producto } = require('../models');
const { body, validationResult } = require('express-validator');

let self = {};

// Validadores para los datos del carrito
self.carritoValidator = [
    body('usuarioid', 'El campo {0} es obligatorio').not().isEmpty(),
    body('productoid', 'El campo {0} es obligatorio').not().isEmpty(),
    body('cantidad', 'El campo {0} debe ser un número mayor a 0').isInt({ min: 1 })
];

// GET: api/carritos
self.getAll = async function (req, res, next) {
    try {
        let data = await carrito.findAll({
            attributes: ['id', 'usuarioid', 'productoid', 'cantidad'],
            include: [
                { model: usuario, attributes: ['id', 'nombre', 'email'] },
                { model: producto, attributes: ['id', 'titulo', 'precio'] }
            ]
        });
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// GET: api/carritos/:id
self.get = async function (req, res, next) {
    try {
        let id = req.params.id;
        let data = await carrito.findByPk(id, {
            attributes: ['id', 'usuarioid', 'productoid', 'cantidad'],
            include: [
                { model: usuario, attributes: ['id', 'nombre', 'email'] },
                { model: producto, attributes: ['id', 'titulo', 'precio'] }
            ]
        });
        if (data) res.status(200).json(data);
        else res.status(404).send();
    } catch (error) {
        next(error);
    }
};

// POST: api/carritos
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let data = await carrito.create({
            usuarioid: req.body.usuarioid,
            productoid: req.body.productoid,
            cantidad: req.body.cantidad
        });

        // Bitacora
        req.bitacora("carrito.crear", data.id);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

// PUT: api/carritos/:id
self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let id = req.params.id;
        let body = req.body;
        let data = await carrito.update(body, { where: { id: id } });

        if (data[0] === 0) return res.status(404).send();

        // Bitacora
        req.bitacora("carrito.editar", id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// DELETE: api/carritos/:id
self.delete = async function (req, res, next) {
    try {
        const id = req.params.id;
        let data = await carrito.findByPk(id);

        if (!data) return res.status(404).send();

        await carrito.destroy({ where: { id: id } });

        // Bitacora
        req.bitacora("carrito.eliminar", id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = self;
