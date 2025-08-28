const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;

exports.gerarNotificacoes = async (cidade) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&lang=pt_br&units=metric`;

  const { data } = await axios.get(url);
  const { weather, main } = data;

  let notificacoes = [];

  if (weather[0].main.toLowerCase().includes('rain')) {
    notificacoes.push('🌧️ Leve um guarda-chuva! Pode chover hoje.');
  }

  if (main.temp > 30) {
    notificacoes.push('🥵 Muito calor! Beba bastante água.');
  }

  if (main.temp < 15) {
    notificacoes.push('🧥 Está frio, não esqueça o casaco!');
  }

  if (notificacoes.length === 0) {
    notificacoes.push('✅ Clima tranquilo, sem alertas importantes.');
  }

  return {
    cidade: data.name,
    clima: weather[0].description,
    temperatura: main.temp,
    notificacoes,
  };
};
