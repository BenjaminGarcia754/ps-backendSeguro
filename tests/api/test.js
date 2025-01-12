const request = require('supertest');
const app = require('../../index'); // Asegúrate de que la app sea exportada desde index.js
const { usuario, rol } = require('../../models'); // Modelos originales
const bcrypt = require('bcrypt');

jest.mock('../../models'); // Mockeamos los modelos
jest.mock('../../services/jwttoken.service', () => ({
    GeneraToken: jest.fn(() => 'mocked-token'),
    TiempoRestanteToken: jest.fn(() => 3600),
}));

describe('Auth Controller', () => {
    describe('POST /api/auth (login)', () => {
        it('should return 200 and a JWT token on successful login', async () => {
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                nombre: 'Test User',
                passwordhash: await bcrypt.hash('password123', 10),
                rol: { nombre: 'admin' },
            };

            // Mock del modelo `usuario` y su método `findOne`
            usuario.findOne.mockResolvedValue({
                ...mockUser,
                raw: true,
                rol: mockUser.rol.nombre,
            });

            const res = await request(app).post('/api/auth').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('email', 'test@example.com');
            expect(res.body).toHaveProperty('jwt', 'mocked-token');
            expect(res.body).toHaveProperty('rol', 'admin');
        });

        it('should return 404 for invalid email', async () => {
            usuario.findOne.mockResolvedValue(null);

            const res = await request(app).post('/api/auth').send({
                email: 'wrong@example.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Usuario o contraseña incorrectos');
        });

        it('should return 404 for invalid password', async () => {
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                nombre: 'Test User',
                passwordhash: await bcrypt.hash('password123', 10),
                rol: { nombre: 'admin' },
            };

            usuario.findOne.mockResolvedValue({
                ...mockUser,
                raw: true,
                rol: mockUser.rol.nombre,
            });

            const res = await request(app).post('/api/auth').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Usuario o contraseña incorrectos');
        });

        it('should return 500 if there is a server error', async () => {
            usuario.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/api/auth').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(500);
        });
    });

});
