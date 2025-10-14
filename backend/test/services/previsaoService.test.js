const axios = require('axios');
const PrevisaoService = require('../../services/previsaoService');

jest.mock('axios');

describe('PrevisaoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockApiResponse = {
    data: {
      list: [
        {
          dt_txt: '2025-10-14 00:00:00',
          main: { temp: 20, temp_min: 18, temp_max: 22 },
          weather: [{ main: 'Clear' }],
        },
        {
          dt_txt: '2025-10-14 03:00:00',
          main: { temp: 22, temp_min: 20, temp_max: 24 },
          weather: [{ main: 'Clear' }],
        },
        {
          dt_txt: '2025-10-15 00:00:00',
          main: { temp: 15, temp_min: 14, temp_max: 16 },
          weather: [{ main: 'Clouds' }],
        },
        {
          dt_txt: '2025-10-15 03:00:00',
          main: { temp: 17, temp_min: 16, temp_max: 18 },
          weather: [{ main: 'Rain' }],
        },
      ]
    }
  };

  it('deve retornar previsão agrupada e com médias corretas, desempate alfabético no clima', async () => {
    axios.get.mockResolvedValue(mockApiResponse);

    const result = await PrevisaoService.getForecast('São Paulo');

    expect(result).toEqual([
      {
        date: '2025-10-14',
        temp_avg: (20 + 22) / 2,
        temp_min_avg: (18 + 20) / 2,
        temp_max_avg: (22 + 24) / 2,
        weather: 'Clear',
      },
      {
        date: '2025-10-15',
        temp_avg: (15 + 17) / 2,
        temp_min_avg: (14 + 16) / 2,
        temp_max_avg: (16 + 18) / 2,
        weather: 'Clouds',
      },
    ]);
  });

  it('deve retornar erro caso a requisição falhe', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    const result = await PrevisaoService.getForecast('São Paulo');
    expect(result).toEqual({ error: 'Erro ao buscar previsão do tempo' });
  });

  it('deve lidar com array vazio de previsão', async () => {
    axios.get.mockResolvedValue({ data: { list: [] } });

    const result = await PrevisaoService.getForecast('São Paulo');
    expect(result).toEqual([]);
  });
});
