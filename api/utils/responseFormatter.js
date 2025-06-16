export function formatResponse(weatherData) {
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
    cloudiness: weatherData.clouds.all
  };
}


export function formatForecastResponse(forecastData) {
  return forecastData.map(item => ({
    date: item.date,
    temperature: item.main.temp,
    weatherMain: item.weather[0].main,
    description: item.weather[0].description,
    windSpeed: item.wind.speed,
    humidity: item.main.humidity,
  }));
}