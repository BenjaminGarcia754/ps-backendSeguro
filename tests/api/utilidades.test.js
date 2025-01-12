const { usuario, rol } = require('../../models');
const bcrypt = require('bcrypt');
const utilidades = require('../../controllers/utilidades.controller');
const { validationResult } = require('express-validator');

jest.mock('../../models');
jest.mock('bcrypt'); //

describe('Utilidades Controller', () => {
    describe('create', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: {
                    id: '465123',
                    email: 'chessman@example.com',
                    passwordhash: 'Password123!',
                    nombre: 'Test User',
                    rolid: '1',
                },
                bitacora: jest.fn(),
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            next = jest.fn();
        });

        it('debería crear un usuario exitosamente', async () => {
            // Mocks
            usuario.findOne.mockResolvedValue(null); // Email no registrado
            rol.findOne.mockResolvedValue({ id: '1', nombre: 'admin' }); // Rol existente
            usuario.create.mockResolvedValue({
                id: '123',
                email: 'chessman@example.com',
                passwordhash: 'Password123!',
                nombre: 'Test User',
                rolid: '1',
            });
            bcrypt.hash.mockResolvedValue('hashedPassword123');

            await utilidades.create(req, res, next);

            // Verificaciones
            expect(usuario.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
            expect(rol.findOne).toHaveBeenCalledWith({ where: { id: req.body.rolid } });
            expect(usuario.create).toHaveBeenCalledWith(expect.objectContaining({
                email: req.body.email,
                nombre: req.body.nombre,
                rolid: req.body.rolid,
            }));
            expect(req.bitacora).toHaveBeenCalledWith('usuarios.crear', req.body.email);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: expect.any(String),
                email: req.body.email,
                nombre: req.body.nombre,
                rol: 'admin',
            }));
        });

        it('debería retornar un error si el correo ya está registrado', async () => {
            usuario.findOne.mockResolvedValue({ email: 'test@example.com' }); // Email registrado

            await utilidades.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'El correo electrónico ya está registrado.' });
        });

        it('debería retornar un error si el rol no existe', async () => {
            usuario.findOne.mockResolvedValue(null); // Email no registrado
            rol.findOne.mockResolvedValue(null); // Rol no existe

            await utilidades.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'El rol especificado no existe.' });
        });

        it('debería manejar errores de validación', async () => {
            // Mock de errores de validación
            const mockValidationErrors = [{ msg: 'El correo es obligatorio', param: 'email' }];
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => mockValidationErrors,
            });

            await utilidades.create(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toContain('El correo es obligatorio');
        });

        it('debería manejar errores inesperados', async () => {
            const error = new Error('Error inesperado');
            usuario.findOne.mockRejectedValue(error); // Error en la base de datos

            await utilidades.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
