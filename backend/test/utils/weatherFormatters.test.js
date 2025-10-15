// __tests__/weatherFormatters.test.js
const {
  formatResponse,
  formatForecastResponse,
  formatDailyClimateHistory,
  formatHourlyWeather,
  formatMonthlyPrecipitation,
  formatDailyPrecipitationProbability
} = require('../../utils/responseFormatter'); // ajuste o caminho

describe('Funções de formatação de dados climáticos', () => {
  // Mock fixo de Date para evitar diferenças de timezone durante os testes
  const fixedDate = new Date('2025-07-04T12:00:00Z');
  const originalDate = global.Date;
  beforeAll(() => {
    global.Date = class extends Date {
      constructor(...args) {
        if (args.length) return super(...args);
        return fixedDate;
      }
    };
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  describe('formatResponse', () => {
    it('deve formatar corretamente os dados do clima atual', () => {
      const weatherData = {
        name: 'Fortaleza',
        timezone: 10800, // 3h
        main: {
          temp: 30,
          feels_like: 32,
          humidity: 70,
          pressure: 1012
        },
        weather: [
          { main: 'Clouds', description: 'nublado' }
        ],
        wind: { speed: 5 },
        visibility: 10000,
        clouds: { all: 75 },
        sys: {
          sunrise: 1625400000,
          sunset: 1625443200
        }
      };

      const result = formatResponse(weatherData);
      expect(result.city).toBe('Fortaleza');
      expect(result.temperature).toBe(30);
      expect(result.weatherMain).toBe('Clouds');
      expect(result.sunrise).toMatch(/\d{2}:\d{2}/);
      expect(result.sunset).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatForecastResponse', () => {
    it('deve formatar corretamente os dados de previsão', () => {
      const forecastData = [
        {
          date: '2025-07-05',
          main: { temp_avg: 28, temp_max_avg: 30, temp_min_avg: 25, humidity: 60 },
          weather: [{ main: 'Rain', description: 'chuva leve' }],
          wind: { speed: 4 }
        }
      ];

      const result = formatForecastResponse(forecastData);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2025-07-05');
      expect(result[0].temperature).toBe(28);
      expect(result[0].weatherMain).toBe('Rain');
    });

    it('deve lidar com campos ausentes', () => {
      const forecastData = [{}];
      const result = formatForecastResponse(forecastData)[0];

      expect(result.date).toBe('Data não disponível');
      expect(result.temperature).toBe('Temp não disponível');
      expect(result.weatherMain).toBe('Condição não disponível');
    });
  });

  describe('formatDailyClimateHistory', () => {
    it('deve formatar corretamente o histórico diário', () => {
      const weatherData = {
        days: [
          { datetime: '2025-07-01', tempmin: 23, tempmax: 30, conditions: 'Sol' },
          { datetime: '2025-07-02', tempmin: 24, tempmax: 31, conditions: 'Nuvens' }
        ]
      };

      const result = formatDailyClimateHistory(weatherData);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: '2025-07-01',
        tempMin: 23,
        tempMax: 30,
        conditions: 'Sol'
      });
    });
  });

  describe('formatHourlyWeather', () => {
    it('deve achatar corretamente os dados hora a hora', () => {
      const weatherData = {
        days: [
          {
            datetime: '2025-07-04',
            hours: [
              { datetime: '00:00:00', temp: 25, conditions: 'Céu limpo' },
              { datetime: '01:00:00', temp: 24, conditions: 'Nublado' }
            ]
          }
        ]
      };

      const result = formatHourlyWeather(weatherData);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        datetime: '2025-07-04 00:00',
        temp: 25,
        conditions: 'Céu limpo'
      });
    });
  });

  describe('formatMonthlyPrecipitation', () => {
    it('deve agrupar e somar corretamente a precipitação por mês', () => {
      const weatherData = {
        days: [
          { datetime: '2025-07-01', precip: 10.5 },
          { datetime: '2025-07-15', precip: 5.25 },
          { datetime: '2025-08-01', precip: 2 }
        ]
      };

      const result = formatMonthlyPrecipitation(weatherData);
      expect(result).toContainEqual({ month: '2025-07', precip: 15.75 });
      expect(result).toContainEqual({ month: '2025-08', precip: 2.00 });
    });
  });

  describe('formatDailyPrecipitationProbability', () => {
    it('deve formatar corretamente a probabilidade diária de precipitação', () => {
      const weatherData = {
        days: [
          { datetime: '2025-07-01', precipprob: 80 },
          { datetime: '2025-07-02', precipprob: 20 }
        ]
      };

      const result = formatDailyPrecipitationProbability(weatherData);
      expect(result).toEqual([
        { date: '2025-07-01', precipProbability: 80 },
        { date: '2025-07-02', precipProbability: 20 }
      ]);
    });
  });
});
