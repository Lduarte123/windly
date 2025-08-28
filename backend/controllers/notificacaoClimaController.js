const axios = require('axios');

const getNotificacoesClima = async (req, res) => {
  try {
    const cidade = req.query.cidade;

    if (!cidade) {
      return res.status(400).json({ error: 'Informe a cidade na query (?cidade=Nome)' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    const response = await axios.get(url);
    const dados = response.data;

    // ⚡ lógica simples de notificação
    let notificacoes = [];

    if (dados.weather[0].main === "Rain") {
      notificacoes.push("🌧️ Leve guarda-chuva, vai chover!");
    }
    if (dados.main.temp > 30) {
      notificacoes.push("🔥 Calor intenso, beba bastante água!");
    }
    if (dados.main.temp < 10) {
      notificacoes.push("🧥 Frio chegando, agasalhe-se bem!");
    }

    res.json({
      cidade: dados.name,
      clima: dados.weather[0].description,
      temperatura: dados.main.temp,
      notificacoes
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
};

module.exports = { getNotificacoesClima };
