const request = require('supertest');
const express = require('express');

jest.mock('../../middleware/validateUser', () => {
  return jest.fn((req, res, next) => next());
});

jest.mock('../../controllers/userController', () => ({
  createUser: jest.fn((req, res) => res.status(201).json(req.body)),
  getUserByEmail: jest.fn((req, res) => res.status(200).json({ email: req.query.email })),
  getUserById: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
  updateUser: jest.fn((req, res) => res.status(200).json(req.body)),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'Usuário deletado com sucesso' })),
}));

const userController = require('../../controllers/userController');
const validateUser = require('../../middleware/validateUser');

const userRouter = require('../../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/users - cria um novo usuário', async () => {
    const newUser = { name: 'João Silva', email: 'joao@email.com', password: 'senha123' };

    const res = await request(app).post('/api/users').send(newUser);

    expect(validateUser).toHaveBeenCalled();
    expect(userController.createUser).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newUser);
  });

  it('GET /api/users?email= - busca usuário pelo email', async () => {
    const email = 'joao@email.com';

    const res = await request(app).get('/api/users').query({ email });

    expect(userController.getUserByEmail).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  it('GET /api/users/:id - busca usuário pelo id', async () => {
    const id = '1';

    const res = await request(app).get(`/api/users/${id}`);

    expect(userController.getUserById).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('PUT /api/users/:id - atualiza usuário', async () => {
    const id = '1';
    const updatedUser = { name: 'João Silva', email: 'joao2@email.com' };

    const res = await request(app).put(`/api/users/${id}`).send(updatedUser);

    expect(validateUser).toHaveBeenCalled();
    expect(userController.updateUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedUser);
  });

  it('DELETE /api/users/:id - deleta usuário', async () => {
    const id = '1';

    const res = await request(app).delete(`/api/users/${id}`);

    expect(userController.deleteUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Usuário deletado com sucesso' });
  });
});
