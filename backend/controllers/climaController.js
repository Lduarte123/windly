// controllers/weatherController.js
const ClimaService = require('../services/ClimaService');
const { formatResponse } = require('../utils/responseFormatter');

class ClimaController {
  static async getWeather(req, res, next) {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: 'Cidade é obrigatória' });
    }

    try {
      const weatherData = await ClimaService.getWeather(city);

      // Verifica se o retorno contém um erro
      if (weatherData.error) {
        return res.status(404).json({ error: weatherData.error });
      }

      const formattedData = formatResponse(weatherData);
      return res.json(formattedData);
    } catch (error) {
      next(error); // Passa o erro para o middleware de erro
    }
  }
}

module.exports = ClimaController;
