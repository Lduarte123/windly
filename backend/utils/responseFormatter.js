function formatTime(unix, offsetInSeconds = 0) {
  const localUnix = unix + offsetInSeconds;
  const date = new Date(localUnix * 1000);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatResponse(weatherData) {
  const offset = weatherData.timezone;

  return {
    city: weatherData.name,
    temperature: weatherData.main.temp,
    feelsLike: weatherData.main.feels_like,
    weatherMain: weatherData.weather[0].main,
    description: weatherData.weather[0].description,
    windSpeed: weatherData.wind.speed,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
    cloudiness: weatherData.clouds.all,
    sunrise: formatTime(weatherData.sys.sunrise, offset),
    sunset: formatTime(weatherData.sys.sunset, offset),
  };
}

function formatForecastResponse(forecastData) {
  return forecastData.map((item) => ({
    date: item.date || "Data não disponível", // Para o caso de item.date ser undefined
    temperature: item.main ? item.main.temp_avg : "Temp não disponível", 
    temp_max: item.main ? item.main.temp_max_avg : "Max temp não disponível",
    temp_min: item.main ? item.main.temp_min_avg : "Min temp não disponível",
    weatherMain: item.weather && item.weather[0] ? item.weather[0].main : "Condição não disponível",
    description: item.weather && item.weather[0] ? item.weather[0].description : "Descrição não disponível",
    windSpeed: item.wind ? item.wind.speed : "Velocidade do vento não disponível",
    humidity: item.main ? item.main.humidity : "Umidade não disponível",
  }));
}

// 1. Histórico climático diário
function formatDailyClimateHistory(weatherData) {
  return weatherData.days.map(day => ({
    date: day.datetime,
    tempMin: day.tempmin,
    tempMax: day.tempmax,
    conditions: day.conditions
  }));
}

// 2. Clima hora a hora (renomeada)
function formatHourlyWeather(weatherData) {
  const hourlyData = [];

  weatherData.days.forEach(day => {
    day.hours.forEach(hour => {
      hourlyData.push({
        datetime: `${day.datetime} ${hour.datetime.slice(0, 5)}`, // "2025-07-04 00:00"
        temp: hour.temp,
        conditions: hour.conditions
      });
    });
  });

  return hourlyData;
}


// 3. Quantidade de chuva por mês
function formatMonthlyPrecipitation(weatherData) {
  const monthly = {};

  weatherData.days.forEach(day => {
    const [year, month] = day.datetime.split("-");
    const key = `${year}-${month}`;

    if (!monthly[key]) {
      monthly[key] = 0;
    }

    monthly[key] += day.precip || 0;
  });

  return Object.entries(monthly).map(([month, precip]) => ({
    month,
    precip: parseFloat(precip.toFixed(2))
  }));
}

// 4. Probabilidade de chuva por dia
function formatDailyPrecipitationProbability(weatherData) {
  return weatherData.days.map(day => ({
    date: day.datetime,
    precipProbability: day.precipprob // em porcentagem (%)
  }));
}



module.exports = {
  formatResponse,
  formatForecastResponse,
  formatDailyClimateHistory,
  formatHourlyWeather,
  formatMonthlyPrecipitation,
  formatDailyPrecipitationProbability
};
