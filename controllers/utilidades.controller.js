const { usuario, rol } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult, body } = require('express-validator');

let self = {};

// POST: api/utilidades
self.create = [
    // Validaciones
    body('email')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no tiene un formato válido'),
    body('password', 'La contraseña debe cumplir con los requisitos de seguridad')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto válido'),
    body('rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isString().withMessage('El rol debe ser un texto válido'),

    // Lógica para crear usuario
    async function (req, res, next) {
        try {
            // Verificar los errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Verificar si el correo ya existe
            const emailExists = await usuario.findOne({ where: { email: req.body.email } });
            if (emailExists) {
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
            }

            // Verificar si el rol existe
            const rolUsuario = await rol.findOne({ where: { nombre: req.body.rol } });
            if (!rolUsuario) {
                return res.status(400).json({ error: 'El rol especificado no existe.' });
            }

            // Crear nuevo usuario
            const newUser = await usuario.create({
                id: crypto.randomUUID(),
                email: req.body.email,
                passwordhash: await bcrypt.hash(req.body.password, 10),
                nombre: req.body.nombre,
                rolid: rolUsuario.id,
            });

            // Bitacora
            req.bitacora('usuarios.crear', newUser.email);

            res.status(201).json({
                id: newUser.id,
                email: newUser.email,
                nombre: newUser.nombre,
                rol: rolUsuario.nombre,
            });
        } catch (error) {
            next(error);
        }
    },
];

module.exports = self;
