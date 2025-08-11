const PrevisaoService = require('../services/previsaoService');
const { formatResponse, formatForecastResponse } = require('../utils/responseFormatter');

class PrevisaoController {
  static async getForecast(req, res, next) {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: 'Cidade é obrigatória' });
    }

    try {
      const forecastData = await PrevisaoService.getForecast(city);

      if (forecastData.error) {
        return res.status(404).json({ error: forecastData.error });
      }

      return res.json(forecastData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PrevisaoController;