const request = require('supertest');
const express = require('express');

const router = require('../../routes/cidadeFavoritaRoutes');

const controller = require('../../controllers/cidadeFavoritaController');
const {
  validateUsuarioIdInQuery,
  validateUsuarioIdInBody,
  validateNomeAndUsuarioIdInBody,
} = require('../../middleware/cidadeMiddleware');

jest.mock('../../controllers/cidadeFavoritaController');
jest.mock('../../middleware/cidadeMiddleware');

const app = express();
app.use(express.json());
app.use('/api/cidades-favoritas', router);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Erro interno' });
});

describe('CidadeFavorita Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    validateUsuarioIdInQuery.mockImplementation((req, res, next) => next());
    validateUsuarioIdInBody.mockImplementation((req, res, next) => next());
    validateNomeAndUsuarioIdInBody.mockImplementation((req, res, next) => next());

    controller.getAllByUser.mockImplementation(async (req, res) => {
      return res.status(200).json([{ id: 1, nome: 'São Paulo', usuario_id: 1 }]);
    });

    controller.getById.mockImplementation(async (req, res) => {
      return res.status(200).json({ id: 1, nome: 'São Paulo', usuario_id: 1 });
    });

    controller.create.mockImplementation(async (req, res) => {
      return res.status(201).json({ id: 1, nome: 'Rio de Janeiro', usuario_id: 1 });
    });

    controller.update.mockImplementation(async (req, res) => {
      return res.status(200).json({ id: 1, nome: 'Curitiba', usuario_id: 1 });
    });

    controller.remove.mockImplementation(async (req, res) => {
      return res.status(200).json({ message: 'Cidade favorita removida' });
    });
  });


  test('GET /usuario/:usuario_id - should call getAllByUser controller', async () => {
    const response = await request(app).get('/api/cidades-favoritas/usuario/1');

    expect(controller.getAllByUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].nome).toBe('São Paulo');
  });

  test('GET /:id - should call getById controller', async () => {
    const response = await request(app)
      .get('/api/cidades-favoritas/1')
      .query({ usuario_id: 1 });

    expect(validateUsuarioIdInQuery).toHaveBeenCalled();
    expect(controller.getById).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('São Paulo');
  });

  test('POST / - should call create controller', async () => {
    const response = await request(app)
      .post('/api/cidades-favoritas')
      .send({ nome: 'Rio de Janeiro', usuario_id: 1 });

    expect(validateNomeAndUsuarioIdInBody).toHaveBeenCalled();
    expect(controller.create).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body.nome).toBe('Rio de Janeiro');
  });

  test('PUT /:id - should call update controller', async () => {
    const response = await request(app)
      .put('/api/cidades-favoritas/1')
      .send({ nome: 'Curitiba', usuario_id: 1 });

    expect(validateNomeAndUsuarioIdInBody).toHaveBeenCalled();
    expect(controller.update).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Curitiba');
  });

  test('DELETE /:id - should call remove controller', async () => {
    const response = await request(app)
      .delete('/api/cidades-favoritas/1')
      .send({ usuario_id: 1 });

    expect(validateUsuarioIdInBody).toHaveBeenCalled();
    expect(controller.remove).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Cidade favorita removida');
  });

  // Testes de erro

  test('GET /usuario/:usuario_id - returns 500 on controller error', async () => {
    controller.getAllByUser.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const response = await request(app).get('/api/cidades-favoritas/usuario/1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });

  test('GET /:id - returns 500 on controller error', async () => {
    controller.getById.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const response = await request(app)
      .get('/api/cidades-favoritas/1')
      .query({ usuario_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });

  test('POST / - returns 500 on controller error', async () => {
    controller.create.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const response = await request(app)
      .post('/api/cidades-favoritas')
      .send({ nome: 'Rio de Janeiro', usuario_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });

  test('PUT /:id - returns 500 on controller error', async () => {
    controller.update.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const response = await request(app)
      .put('/api/cidades-favoritas/1')
      .send({ nome: 'Curitiba', usuario_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });

  test('DELETE /:id - returns 500 on controller error', async () => {
    controller.remove.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const response = await request(app)
      .delete('/api/cidades-favoritas/1')
      .send({ usuario_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});
