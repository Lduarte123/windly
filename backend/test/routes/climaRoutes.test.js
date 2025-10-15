const request = require('supertest');
const express = require('express');

const ClimaController = require('../../controllers/climaController');

jest.mock('../../controllers/climaController');

const app = express();

const router = require('../../routes/climaRoutes');
app.use('/api/clima', router);

describe('Clima Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/clima/:city - should call getWeather controller', async () => {
    const mockWeatherData = { city: 'São Paulo', temperature: 25, description: 'Ensolarado' };
    ClimaController.getWeather.mockImplementation((req, res) => {
      res.status(200).json(mockWeatherData);
    });

    const response = await request(app).get('/api/clima/São Paulo');

    expect(ClimaController.getWeather).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.city).toBe('São Paulo');
    expect(response.body.temperature).toBe(25);
    expect(response.body.description).toBe('Ensolarado');
  });
});
