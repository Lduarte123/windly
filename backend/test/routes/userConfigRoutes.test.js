const request = require('supertest');
const express = require('express');
const controller = require('../../controllers/userConfigController');

jest.mock('../../controllers/userConfigController');

const app = express();
app.use(express.json());

const userConfigRouter = require('../../routes/userConfigRoutes'); // ajuste o caminho conforme seu projeto
app.use('/api/user-config', userConfigRouter);

describe('UserConfig Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /:usuario_id should call getConfig controller and return data', async () => {
    const mockConfig = { usuario_id: 1, unidade: 'metric', notificacoes: true };
    controller.getConfig.mockImplementation((req, res) => {
      res.status(200).json(mockConfig);
    });

    const response = await request(app).get('/api/user-config/1');

    expect(controller.getConfig).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockConfig);
  });

  test('GET /:usuario_id returns 404 when config not found', async () => {
    controller.getConfig.mockImplementation((req, res) => {
      res.status(404).json({ error: 'Configuração não encontrada' });
    });

    const response = await request(app).get('/api/user-config/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Configuração não encontrada');
  });

  test('PUT /:usuario_id should call updateConfig controller and return updated data', async () => {
    const updatedConfig = { usuario_id: 1, unidade: 'imperial', notificacoes: false };
    controller.updateConfig.mockImplementation((req, res) => {
      res.status(200).json(updatedConfig);
    });

    const response = await request(app)
      .put('/api/user-config/1')
      .send({ unidade: 'imperial', notificacoes: false });

    expect(controller.updateConfig).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedConfig);
  });

  test('PUT /:usuario_id returns 404 when config not found', async () => {
    controller.updateConfig.mockImplementation((req, res) => {
      res.status(404).json({ error: 'Configuração não encontrada' });
    });

    const response = await request(app)
      .put('/api/user-config/999')
      .send({ unidade: 'imperial', notificacoes: false });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Configuração não encontrada');
  });
});
