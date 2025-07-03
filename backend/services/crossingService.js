const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY;

class PrevisaoService {
  static async getWeather(city) {
    try {
      const cityQuery = city.trim();

      // Datas para o intervalo (de uma semana atrás até hoje)
      const today = new Date();
      const endDate = today.toISOString().split('T')[0]; // yyyy-mm-dd

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const startDate = pastDate.toISOString().split('T')[0];

      const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(cityQuery)}/${startDate}/${endDate}?unitGroup=us&key=${apiKey}&contentType=json`;

      const response = await axios.get(baseUrl);

      // A API Visual Crossing não usa cod 404 na resposta, então essa checagem pode ser diferente, mas deixo pra você adaptar se quiser

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

module.exports = PrevisaoService;
