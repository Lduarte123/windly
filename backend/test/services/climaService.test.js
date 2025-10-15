const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const ClimaService = require('../../services/climaService');

const mock = new MockAdapter(axios);

describe('ClimaService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('deve retornar dados do clima com sucesso', async () => {
    const mockResponse = {
      weather: [{ description: 'nuvens dispersas' }],
      main: { temp: 25 },
      name: 'São Paulo'
    };

    mock.onGet('http://api.openweathermap.org/data/2.5/weather').reply(200, mockResponse);

    const data = await ClimaService.getWeather('São Paulo');
    
    expect(data.weather[0].description).toBe('nuvens dispersas');
    expect(data.main.temp).toBe(25);
    expect(data.name).toBe('São Paulo');
  });

  it('deve retornar erro quando a cidade não for encontrada', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'city not found' }
      }
    };

    mock.onGet('http://api.openweathermap.org/data/2.5/weather').reply(404, mockError.response.data);

    const data = await ClimaService.getWeather('Cidade Inexistente');
    
    expect(data.error).toBe('Cidade não encontrada');
  });

  it('deve retornar erro genérico em caso de falha na requisição', async () => {
    const mockError = new Error('Network Error');

    mock.onGet('http://api.openweathermap.org/data/2.5/weather').networkErrorOnce();

    const data = await ClimaService.getWeather('São Paulo');

    expect(data.error).toBe('Erro ao buscar o clima: Network Error');
  });

  it('deve remover espaços extras ao redor do nome da cidade', async () => {
    const mockResponse = {
      weather: [{ description: 'ensolarado' }],
      main: { temp: 30 },
      name: 'Rio de Janeiro'
    };

    mock.onGet('http://api.openweathermap.org/data/2.5/weather').reply(200, mockResponse);

    const data = await ClimaService.getWeather('  Rio de Janeiro   ');

    expect(data.weather[0].description).toBe('ensolarado');
    expect(data.main.temp).toBe(30);
    expect(data.name).toBe('Rio de Janeiro');
  });
});
