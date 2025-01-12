const { compra, producto } = require('../../models');
const compraController = require('../../controllers/compra.controller');
const { validationResult } = require('express-validator');
jest.mock('../../models'); // Mock del modelo
jest.mock('express-validator', () => ({
    ...jest.requireActual('express-validator'),
    validationResult: jest.fn(),
}));

describe('Compra Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    describe('create', () => {
        it('debería crear compras exitosamente', async () => {
            const req = {
                body: [
                    {
                        producto: { id: '123', precio: 50 },
                        cantidad: 2,
                        usuarioid: '1'
                    }
                ]
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            producto.findByPk.mockResolvedValue({
                id: '123',
                stock: 10,
                precio: 50
            });

            compra.create.mockResolvedValue({
                id: 'mocked-id',
                usuarioid: '1',
                productoid: '123',
                cantidad: 2,
                total: 100,
                fecha: new Date()
            });

            await compraController.create(req, res, next);

            expect(compra.create).toHaveBeenCalledWith({
                usuarioid: '1',
                productoid: '123',
                cantidad: 2,
                total: 100,
                fecha: expect.any(Date)
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Compras procesadas correctamente' });
        });

        it('debería manejar errores de validación', async () => {
            const req = {
                body: [
                    {
                        producto: { id: '123', precio: 50 },
                        cantidad: -1, // Cantidad inválida
                        usuarioid: '1'
                    }
                ]
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            validationResult.mockReturnValue({
                isEmpty: jest.fn(() => false),
                array: jest.fn(() => [{ msg: 'La cantidad debe ser un número válido' }]),
            });

            await compraController.create(req, res, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(next).toHaveBeenCalledWith(new Error(
                JSON.stringify([{ msg: 'La cantidad debe ser un número válido' }])
            ));
        });

        it('debería manejar productos con stock insuficiente', async () => {
            const req = {
                body: [
                    {
                        producto: { id: '123', precio: 50 },
                        cantidad: 20, // Mayor que el stock
                        usuarioid: '1'
                    }
                ]
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            producto.findByPk.mockResolvedValue({
                id: '123',
                stock: 5,
                precio: 50
            });

            await compraController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(new Error('No hay suficiente stock para el producto 123. Stock disponible: 5.'));
        });

        it('debería manejar errores inesperados', async () => {
            const req = {
                body: [
                    {
                        producto: { id: '123', precio: 50 },
                        cantidad: 2,
                        usuarioid: '1'
                    }
                ]
            };

            const res = {
                status: jest.fn(),
                json: jest.fn(),
            };

            const next = jest.fn();

            producto.findByPk.mockResolvedValue({
                id: '123',
                stock: 10,
                precio: 50
            });

            compra.create.mockRejectedValue(new Error('Database error'));

            await compraController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('getAll', () => {
        it('debería retornar todas las compras', async () => {
            const req = {};

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findAll.mockResolvedValue([
                { id: '1', cantidad: 2 },
                { id: '2', cantidad: 3 },
            ]);

            await compraController.getAll(req, res, next);

            expect(compra.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { id: '1', cantidad: 2 },
                { id: '2', cantidad: 3 },
            ]);
        });

        it('debería manejar errores inesperados', async () => {
            const req = {};

            const res = {
                status: jest.fn(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findAll.mockRejectedValue(new Error('Database error'));

            await compraController.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('get', () => {
        it('debería retornar una compra por su ID', async () => {
            const req = { params: { id: '1' } };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findByPk.mockResolvedValue({
                id: '1',
                usuarioid: '1',
                productoid: '123',
                cantidad: 2,
                total: 100,
                fecha: new Date()
            });

            await compraController.get(req, res, next);

            expect(compra.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: '1',
                usuarioid: '1',
                productoid: '123',
                cantidad: 2,
                total: 100,
                fecha: expect.any(Date),
            });
        });

        it('debería manejar compra no encontrada', async () => {
            const req = { params: { id: '999' } };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findByPk.mockResolvedValue(null);

            await compraController.get(req, res, next);

            expect(compra.findByPk).toHaveBeenCalledWith('999');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({});
        });
    });

    describe('delete', () => {
        it('debería eliminar una compra exitosamente', async () => {
            const req = { params: { id: '1' } };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findByPk.mockResolvedValue({
                id: '1',
                usuarioid: '1',
                productoid: '123',
                cantidad: 2,
                total: 100,
                fecha: new Date()
            });

            compra.destroy.mockResolvedValue(1); // 1 fila afectada

            await compraController.delete(req, res, next);

            expect(compra.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith();
        });

        it('debería manejar error si la compra no existe', async () => {
            const req = { params: { id: '999' } };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            compra.findByPk.mockResolvedValue(null);

            await compraController.delete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({});
        });
    });
});
