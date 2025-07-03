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
    date: item.date,
    temperature: item.main.temp,
    temp_max: item.main.temp_max,
    temp_min: item.main.temp_min,
    weatherMain: item.weather[0].main,
    description: item.weather[0].description,
    windSpeed: item.wind.speed,
    humidity: item.main.humidity,
  }));
}

module.exports = {
  formatResponse,
  formatForecastResponse,
};
