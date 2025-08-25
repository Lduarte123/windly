const axios = require('axios');

class PrevisaoService {
  static async getForecast(city) {
    const apiKey = '69b60137458925882b3d327be216c401'
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await axios.get(url);
      const list = response.data.list;

      // Agrupa por dia e pega o status das 12:00 (ou o mais próximo)
      const daily = {};
      list.forEach(item => {
        const [date, hour] = item.dt_txt.split(' ');
        // Se ainda não tem ou se está mais próximo das 12:00
        if (
          !daily[date] ||
          Math.abs(parseInt(hour.split(':')[0]) - 12) < Math.abs(parseInt(daily[date].hour.split(':')[0]) - 12)
        ) {
          daily[date] = { ...item, hour };
        }
      });

      // Retorna um array com a data
      return Object.entries(daily).map(([date, item]) => ({
        date,
        ...item
      }));
    } catch (error) {
      return { error: 'Erro ao buscar previsão do tempo' };
    }
  }
}

module.exports = PrevisaoService;