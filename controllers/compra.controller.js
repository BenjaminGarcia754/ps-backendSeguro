'use strict';
const { compra, producto } = require('../models');
const CompraDTO = require('../DTO/carritoDTO');
const { body, validationResult } = require('express-validator');

let self = {};

self.compraValidator = [
    body().isArray().withMessage('El cuerpo de la solicitud debe ser un array de productos'),
    body('*.producto.id', 'El campo id es obligatorio').not().isEmpty(),
    body('*.cantidad', 'La cantidad debe ser un número válido').isInt({ min: 1 }),
    body('*.usuarioid', 'El campo id es obligatorio').not().isEmpty(),
    body('*.producto.precio', 'EL precio debe ser un numero valido').isFloat({ min: 1.00 })
];


// GET: api/compras
self.getAll = async function (req, res, next) {
    try {
        const data = await compra.findAll({
            attributes: ['id', 'cantidad']
        });
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// GET: api/compras/:id
self.get = async function (req, res, next) {
    try {
        const id = req.params.id;
        console.log(id);
        const data = await compra.findByPk(id);
        if (data) res.status(200).json(data);
        else res.status(404).send();
    } catch (error) {
        next(error);
    }
};

// POST: api/compras
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

        const productosDTO = req.body;
        console.log(productosDTO);

        if (Array.isArray(productosDTO)) {
            console.log("productosDT es un array");
        } else {
            console.log("productosDTO no es un array");
        }

        for (let i = 0; i < productosDTO.length; i++) {
            console.log(productosDTO[i].id);
            var dto = productosDTO[i];
            const productoData = dto.producto;
            console.log(productoData);
            const cantidad = dto.cantidad;
            console.log("cantidad" + cantidad);
            console.log("precio" + dto.producto.precio);
            var totalD = 0;

            if (cantidad < 1 || dto.producto.precio < 1) {
                throw new Error(`La cantidad o precio del producto ${productoData.id} debe ser un número positivo.`);
            }

            const productoEnBD = await producto.findByPk(productoData.id);
            if (!productoEnBD) {
                throw new Error(`El producto con ID ${productoData.id} no existe.`);
            }

            if (productoEnBD.stock < cantidad) {
                throw new Error(`No hay suficiente stock para el producto ${productoData.id}. Stock disponible: ${productoEnBD.stock}.`);
            }
            const compraDTO = new CompraDTO(productoData, cantidad);
            totalD = cantidad * productoData.precio;

            if (totalD > Number.MAX_VALUE){
                throw new Error('El total de la compra es demasiado grande');
            }

            const nuevaCompra = await compra.create({
                usuarioid: productosDTO[i].usuarioid,
                productoid: productoData.id,
                cantidad: cantidad,
                total: totalD,
                fecha: new Date()
            });
            await productoEnBD.update({
                stock: productoEnBD.stock - cantidad
            });
            req.bitacora('compra.crear', nuevaCompra.id);
        }

        res.status(201).json({ message: 'Compras procesadas correctamente' });
    } catch (error) {
        next(error);
    }
};

// PUT: api/compras/:id
self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

        const id = req.params.id;
        const [updated] = await compra.update(req.body, { where: { id } });

        if (updated) {
            req.bitacora('compra.editar', id);
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
};

// DELETE: api/compras/:id
self.delete = async function (req, res, next) {
    try {
        const id = req.params.id;
        const compraToDelete = await compra.findByPk(id);

        if (!compraToDelete) return res.status(404).send();

        await compra.destroy({ where: { id } });
        req.bitacora('compra.eliminar', id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = self;
