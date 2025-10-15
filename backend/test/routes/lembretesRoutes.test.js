const request = require('supertest');
const express = require('express');

const lembreteRouter = require('../../routes/lembreteRoutes');
const controller = require('../../controllers/lembreteController');
const authenticateToken = require('../../middleware/authMiddleware');

jest.mock('../../controllers/lembreteController');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/lembretes', lembreteRouter);

authenticateToken.mockImplementation((req, res, next) => next());

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Erro interno' });
});

describe('Lembrete Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    controller.getAllByUser.mockImplementation(async (req, res) => {
      res.status(200).json([{ id: 1, titulo: 'Teste' }]);
    });

    controller.getById.mockImplementation(async (req, res) => {
      res.status(200).json({ id: 1, titulo: 'Teste' });
    });

    controller.create.mockImplementation(async (req, res) => {
      res.status(201).json({ id: 1, ...req.body });
    });

    controller.update.mockImplementation(async (req, res) => {
      res.status(200).json({ id: req.params.id, ...req.body });
    });

    controller.remove.mockImplementation(async (req, res) => {
      res.status(200).json({ message: 'Lembrete removido' });
    });
  });

  test('GET /usuario/:usuario_id calls authenticateToken and getAllByUser', async () => {
    const res = await request(app).get('/api/lembretes/usuario/123');

    expect(authenticateToken).toHaveBeenCalled();
    expect(controller.getAllByUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /:id calls getById', async () => {
    const res = await request(app).get('/api/lembretes/1');

    expect(controller.getById).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('POST / calls create', async () => {
    const payload = { usuario_id: 1, titulo: 'Novo lembrete' };
    const res = await request(app).post('/api/lembretes').send(payload);

    expect(controller.create).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe(payload.titulo);
  });

  test('PUT /:id calls update', async () => {
    const payload = { titulo: 'Atualizado' };
    const res = await request(app).put('/api/lembretes/1').send(payload);

    expect(controller.update).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe(payload.titulo);
  });

  test('DELETE /:id calls remove', async () => {
    const res = await request(app).delete('/api/lembretes/1');

    expect(controller.remove).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Lembrete removido');
  });

  test('GET /usuario/:usuario_id returns 500 on controller error', async () => {
    controller.getAllByUser.mockImplementationOnce((req, res, next) => {
      next(new Error('Erro inesperado'));
    });

    const res = await request(app).get('/api/lembretes/usuario/123');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
