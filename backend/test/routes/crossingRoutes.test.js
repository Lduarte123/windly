const request = require('supertest');
const express = require('express');

const router = require('../../routes/crossingRoutes');
const crossingController = require('../../controllers/crossingController');

jest.mock('../../controllers/crossingController');

const app = express();
app.use('/api/crossing', router);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Erro interno' });
});

describe('Crossing Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    crossingController.getDailyClimateHistory.mockImplementation(async (req, res) => {
      res.status(200).json({ data: 'daily climate history' });
    });

    crossingController.getTodayHourlyWeather.mockImplementation(async (req, res) => {
      res.status(200).json({ data: 'hourly weather' });
    });

    crossingController.getMonthlyPrecipitation.mockImplementation(async (req, res) => {
      res.status(200).json({ data: 'monthly precipitation' });
    });

    crossingController.getTodayPrecipProbability.mockImplementation(async (req, res) => {
      res.status(200).json({ data: 'precipitation probability' });
    });
  });

  test('GET /climate-history calls controller and responds 200', async () => {
    const res = await request(app).get('/api/crossing/climate-history');

    expect(crossingController.getDailyClimateHistory).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('daily climate history');
  });

  test('GET /hourly-weather calls controller and responds 200', async () => {
    const res = await request(app).get('/api/crossing/hourly-weather');

    expect(crossingController.getTodayHourlyWeather).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('hourly weather');
  });

  test('GET /monthly-precipitation calls controller and responds 200', async () => {
    const res = await request(app).get('/api/crossing/monthly-precipitation');

    expect(crossingController.getMonthlyPrecipitation).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('monthly precipitation');
  });

  test('GET /precipitation-probability calls controller and responds 200', async () => {
    const res = await request(app).get('/api/crossing/precipitation-probability');

    expect(crossingController.getTodayPrecipProbability).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('precipitation probability');
  });

  test('GET /climate-history returns 500 on controller error', async () => {
    crossingController.getDailyClimateHistory.mockImplementation(async (req, res, next) => {
      return next(new Error('Erro no controller'));
    });

    const res = await request(app).get('/api/crossing/climate-history');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
