const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const CrossingService = require('../../services/crossingService');

const mock = new MockAdapter(axios);

describe('CrossingService', () => {
  afterEach(() => {
    mock.reset();
  });

  const city = 'São Paulo';
  const today = new Date().toISOString().split('T')[0];
  const monthKey = today.slice(0, 7);

  const mockApiResponse = {
    days: [
      {
        datetime: today,
        tempmin: 18,
        tempmax: 28,
        conditions: 'Partly Cloudy',
        precip: 2,
        precipprob: 55,
        hours: [
          { datetime: '00:00:00', temp: 20, conditions: 'Clear' },
          { datetime: '01:00:00', temp: 19, conditions: 'Cloudy' }
        ]
      }
    ]
  };

  describe('fetchWeatherData', () => {
    it('deve retornar dados do clima com sucesso', async () => {
      const urlPart = encodeURIComponent(city);
      mock.onGet(new RegExp(`.*${urlPart}.*`)).reply(200, mockApiResponse);

      const data = await CrossingService.fetchWeatherData(city, 1);
      expect(data).toEqual(mockApiResponse);
    });

    it('deve retornar erro de cidade não encontrada (404)', async () => {
      mock.onGet(/.*/).reply(404, { message: 'City not found' });

      const data = await CrossingService.fetchWeatherData('CidadeInexistente');
      expect(data).toEqual({ error: 'Cidade não encontrada' });
    });

    it('deve retornar erro genérico de rede', async () => {
      mock.onGet(/.*/).networkError();

      const data = await CrossingService.fetchWeatherData(city);
      expect(data.error).toMatch(/Erro ao buscar o clima:/);
    });
  });

  describe('getDailyClimateHistory', () => {
    it('deve retornar histórico climático diário dos últimos 7 dias', async () => {
      mock.onGet(/.*/).reply(200, mockApiResponse);

      const result = await CrossingService.getDailyClimateHistory(city);
      expect(result).toEqual([
        {
          date: today,
          tempMin: 18,
          tempMax: 28,
          conditions: 'Partly Cloudy'
        }
      ]);
    });

    it('deve retornar erro vindo do fetchWeatherData', async () => {
      mock.onGet(/.*/).reply(404, {});

      const result = await CrossingService.getDailyClimateHistory('CidadeInexistente');
      expect(result.error).toBe('Cidade não encontrada');
    });

    it('deve retornar array vazio se não houver dias', async () => {
      mock.onGet(/.*/).reply(200, { days: [] });

      const result = await CrossingService.getDailyClimateHistory(city);
      expect(result).toEqual([]);
    });
  });

  describe('getTodayHourlyWeather', () => {
    it('deve retornar clima por hora de hoje', async () => {
      mock.onGet(/.*/).reply(200, mockApiResponse);

      const result = await CrossingService.getTodayHourlyWeather(city);
      expect(result).toEqual([
        {
          datetime: `${today} 00:00`,
          temp: 20,
          conditions: 'Clear'
        },
        {
          datetime: `${today} 01:00`,
          temp: 19,
          conditions: 'Cloudy'
        }
      ]);
    });

    it('deve retornar erro se dados de hoje não forem encontrados', async () => {
      mock.onGet(/.*/).reply(200, { days: [] });

      const result = await CrossingService.getTodayHourlyWeather(city);
      expect(result.error).toBe('Dados de hoje não encontrados');
    });

    it('deve retornar erro vindo do fetchWeatherData', async () => {
      mock.onGet(/.*/).reply(404, {});

      const result = await CrossingService.getTodayHourlyWeather('CidadeInexistente');
      expect(result.error).toBe('Cidade não encontrada');
    });
  });

  describe('getMonthlyPrecipitation', () => {
    it('deve retornar precipitação agrupada por mês', async () => {
      mock.onGet(/.*/).reply(200, mockApiResponse);

      const result = await CrossingService.getMonthlyPrecipitation(city);
      expect(result).toEqual([
        {
          month: monthKey,
          precip: 2.0
        }
      ]);
    });

    it('deve retornar array vazio se não houver dias', async () => {
      mock.onGet(/.*/).reply(200, { days: [] });

      const result = await CrossingService.getMonthlyPrecipitation(city);
      expect(result).toEqual([]);
    });

    it('deve retornar erro vindo do fetchWeatherData', async () => {
      mock.onGet(/.*/).reply(404, {});

      const result = await CrossingService.getMonthlyPrecipitation('CidadeInexistente');
      expect(result.error).toBe('Cidade não encontrada');
    });
  });

  describe('getTodayPrecipProbability', () => {
    it('deve retornar probabilidade de chuva de hoje', async () => {
      mock.onGet(/.*/).reply(200, mockApiResponse);

      const result = await CrossingService.getTodayPrecipProbability(city);
      expect(result).toEqual({
        date: today,
        precipProbability: 55
      });
    });

    it('deve retornar erro se dados de hoje não forem encontrados', async () => {
      mock.onGet(/.*/).reply(200, { days: [] });

      const result = await CrossingService.getTodayPrecipProbability(city);
      expect(result.error).toBe('Dados de hoje não encontrados');
    });

    it('deve retornar erro vindo do fetchWeatherData', async () => {
      mock.onGet(/.*/).reply(404, {});

      const result = await CrossingService.getTodayPrecipProbability('CidadeInexistente');
      expect(result.error).toBe('Cidade não encontrada');
    });
  });
});
