// services/weatherService.js
const axios = require('axios');

// Definindo diretamente o baseUrl da API e a chave da API
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = '69b60137458925882b3d327be216c401';  // Substitua com sua chave de API

class PrevisaoService {
  static async getWeather(city) {
    try {
      // O nome da cidade agora será passado sem o código do país
      const cityQuery = city.trim();

      console.log(`Buscando clima para: ${cityQuery}`);

      const response = await axios.get(baseUrl, {
        params: {
          q: cityQuery,  // Buscando somente pela cidade
          appid: apiKey,
          lang: 'pt_br',  // Resposta em português
          units: 'metric',  // Temperatura em Celsius
        }
      });

      // Se a resposta não for encontrada (código 404)
      if (response.data.cod === '404') {
        return { error: 'Cidade não encontrada' };  // Retorna um erro com a mensagem
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer requisição:', error.response ? error.response.data : error.message);

      // Se o erro for relacionado ao OpenWeatherMap ou se a cidade não foi encontrada
      if (error.response && error.response.data.cod === '404') {
        return { error: 'Cidade não encontrada' };
      }

      // Se outro erro ocorrer, retorna uma mensagem genérica
      return { error: 'Erro ao buscar o clima: ' + error.message };
    }
  }
}

module.exports = PrevisaoService;
