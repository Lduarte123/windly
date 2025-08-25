// controllers/weatherController.js
const ClimaService = require('../services/climaService');
const { formatResponse } = require('../utils/responseFormatter');

class ClimaController {
  static async getWeather(req, res, next) {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: 'Cidade é obrigatória' });
    }

    try {
      const weatherData = await ClimaService.getWeather(city);
      if (weatherData.error) {
        return res.status(404).json({ error: weatherData.error });
      }

      const formattedData = formatResponse(weatherData);
      return res.json(formattedData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClimaController;
