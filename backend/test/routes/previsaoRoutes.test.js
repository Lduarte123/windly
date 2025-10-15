const request = require('supertest');
const express = require('express');
const PrevisaoController = require('../../controllers/previsaoController');

jest.mock('../../controllers/previsaoController');

const app = express();
app.use(express.json());

const previsaoRouter = require('../../routes/previsaoRoutes');
app.use('/api/previsao', previsaoRouter);

describe('Previsao Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /forecast/:city calls getForecast controller and returns data', async () => {
    const mockData = { city: 'São Paulo', forecast: 'Sol com nuvens' };
    PrevisaoController.getForecast.mockImplementation(async (req, res) => {
      res.status(200).json(mockData);
    });

    const response = await request(app).get('/api/previsao/forecast/São Paulo');

    expect(PrevisaoController.getForecast).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('GET /forecast/:city returns 500 on controller error', async () => {
    PrevisaoController.getForecast.mockImplementationOnce((req, res, next) => {
      next(new Error('Erro no servidor'));
    });

    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    const response = await request(app).get('/api/previsao/forecast/Rio');

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});
