const request = require('supertest');
const express = require('express');

// Mock dos controladores
const { loginStepOne, verify2FA } = require('../../controllers/authController');

jest.mock('../../controllers/authController');

const app = express();
app.use(express.json());
const router = require('../../routes/authRoutes');
app.use('/api/auth', router);

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/login - should call loginStepOne controller', async () => {
    loginStepOne.mockImplementation((req, res) => res.status(200).json({ message: 'Código 2FA enviado por e-mail' }));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@email.com', password: 'senha123' });

    expect(loginStepOne).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Código 2FA enviado por e-mail');
  });

  test('POST /api/auth/verify-2fa - should call verify2FA controller', async () => {
    verify2FA.mockImplementation((req, res) =>
      res.status(200).json({
        message: 'Login autorizado',
        token: 'JWT_TOKEN_AQUI',
        user: { id: 1, email: 'usuario@email.com' }
      })
    );

    const response = await request(app)
      .post('/api/auth/verify-2fa')
      .send({ email: 'usuario@email.com', code: '123456' });

    expect(verify2FA).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login autorizado');
    expect(response.body.token).toBe('JWT_TOKEN_AQUI');
    expect(response.body.user.email).toBe('usuario@email.com');
  });
});
