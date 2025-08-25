const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.OPENWEATHER_API_KEY;

class ClimaService {
  static async getWeather(city) {
    try {
      const cityQuery = city.trim();

      console.log(`Buscando clima para: ${cityQuery}`);

      const response = await axios.get(baseUrl, {
        params: {
          q: cityQuery,
          appid: apiKey,
          lang: 'pt_br',
          units: 'metric',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Erro ao fazer requisição:', error.response ? error.response.data : error.message);

      if (error.response && error.response.status === 404) {
        return { error: 'Cidade não encontrada' };
      }

      return { error: 'Erro ao buscar o clima: ' + error.message };
    }
  }
}

module.exports = ClimaService;
