const {
  getDailyClimateHistory,
  getTodayHourlyWeather,
  getMonthlyPrecipitation,
  getTodayPrecipProbability
} = require('../../controllers/crossingController');
const CrossingService = require('../../services/crossingService');
const {
  formatDailyClimateHistory,
  formatHourlyWeather,
  formatMonthlyPrecipitation,
  formatDailyPrecipitationProbability
} = require('../../utils/responseFormatter');

// Mock das dependências
jest.mock('../../services/crossingService');
jest.mock('../../utils/responseFormatter');

describe('CrossingController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks();
  });

  describe('getDailyClimateHistory', () => {
    it('deve retornar erro se parâmetro city não for fornecido', async () => {
      mockReq.query = {};

      await getDailyClimateHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Parâmetro city é obrigatório' });
      expect(CrossingService.fetchWeatherData).not.toHaveBeenCalled();
    });

    it('deve retornar histórico climático diário formatado', async () => {
      mockReq.query = { city: 'São Paulo' };
      const mockRawData = { daily: [{ date: '2024-01-01', temp: 25 }] };
      const mockFormattedData = { dias: [{ data: '2024-01-01', temperatura: 25 }] };

      CrossingService.fetchWeatherData.mockResolvedValue(mockRawData);
      formatDailyClimateHistory.mockReturnValue(mockFormattedData);

      await getDailyClimateHistory(mockReq, mockRes);

      expect(CrossingService.fetchWeatherData).toHaveBeenCalledWith('São Paulo', 7);
      expect(formatDailyClimateHistory).toHaveBeenCalledWith(mockRawData);
      expect(mockRes.json).toHaveBeenCalledWith(mockFormattedData);
    });

    it('deve retornar erro 404 se cidade não for encontrada', async () => {
      mockReq.query = { city: 'CidadeInexistente' };
      const mockErrorData = { error: 'Cidade não encontrada' };

      CrossingService.fetchWeatherData.mockResolvedValue(mockErrorData);

      await getDailyClimateHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada' });
    });

    it('deve retornar erro 500 se houver exceção', async () => {
      mockReq.query = { city: 'São Paulo' };

      CrossingService.fetchWeatherData.mockRejectedValue(new Error('Erro interno'));

      await getDailyClimateHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });

  describe('getTodayHourlyWeather', () => {
    it('deve retornar erro se parâmetro city não for fornecido', async () => {
      mockReq.query = {};

      await getTodayHourlyWeather(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Parâmetro city é obrigatório' });
    });

    it('deve retornar clima por hora formatado', async () => {
      mockReq.query = { city: 'São Paulo' };
      const mockRawData = { hourly: [{ time: '14:00', temp: 25 }] };
      const mockFormattedData = { horas: [{ hora: '14:00', temperatura: 25 }] };

      CrossingService.fetchWeatherData.mockResolvedValue(mockRawData);
      formatHourlyWeather.mockReturnValue(mockFormattedData);

      await getTodayHourlyWeather(mockReq, mockRes);

      expect(CrossingService.fetchWeatherData).toHaveBeenCalledWith('São Paulo', 1);
      expect(formatHourlyWeather).toHaveBeenCalledWith(mockRawData);
      expect(mockRes.json).toHaveBeenCalledWith(mockFormattedData);
    });

    it('deve retornar erro 500 se houver exceção', async () => {
      mockReq.query = { city: 'São Paulo' };

      CrossingService.fetchWeatherData.mockRejectedValue(new Error('Erro interno'));

      await getTodayHourlyWeather(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });

  describe('getMonthlyPrecipitation', () => {
    it('deve retornar erro se parâmetro city não for fornecido', async () => {
      mockReq.query = {};

      await getMonthlyPrecipitation(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Parâmetro city é obrigatório' });
    });

    it('deve retornar precipitação mensal formatada', async () => {
      mockReq.query = { city: 'São Paulo' };
      const mockRawData = { monthly: [{ month: 'Janeiro', precipitation: 150 }] };
      const mockFormattedData = { meses: [{ mes: 'Janeiro', precipitacao: 150 }] };

      CrossingService.fetchWeatherData.mockResolvedValue(mockRawData);
      formatMonthlyPrecipitation.mockReturnValue(mockFormattedData);

      await getMonthlyPrecipitation(mockReq, mockRes);

      expect(CrossingService.fetchWeatherData).toHaveBeenCalledWith('São Paulo', 30);
      expect(formatMonthlyPrecipitation).toHaveBeenCalledWith(mockRawData);
      expect(mockRes.json).toHaveBeenCalledWith(mockFormattedData);
    });

    it('deve retornar erro 500 se houver exceção', async () => {
      mockReq.query = { city: 'São Paulo' };

      CrossingService.fetchWeatherData.mockRejectedValue(new Error('Erro interno'));

      await getMonthlyPrecipitation(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });

  describe('getTodayPrecipProbability', () => {
    it('deve retornar erro se parâmetro city não for fornecido', async () => {
      mockReq.query = {};

      await getTodayPrecipProbability(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Parâmetro city é obrigatório' });
    });

    it('deve retornar probabilidade de precipitação de hoje', async () => {
      mockReq.query = { city: 'São Paulo' };
      const todayStr = new Date().toISOString().split('T')[0];
      const mockRawData = { daily: [{ date: todayStr, precipProbability: 0.3 }] };
      const mockFormattedData = [{ date: todayStr, precipProbability: 0.3 }];

      CrossingService.fetchWeatherData.mockResolvedValue(mockRawData);
      formatDailyPrecipitationProbability.mockReturnValue(mockFormattedData);

      await getTodayPrecipProbability(mockReq, mockRes);

      expect(CrossingService.fetchWeatherData).toHaveBeenCalledWith('São Paulo', 1);
      expect(formatDailyPrecipitationProbability).toHaveBeenCalledWith(mockRawData);
      expect(mockRes.json).toHaveBeenCalledWith({
        date: todayStr,
        precipProbability: 0.3
      });
    });

    it('deve retornar null para precipProbability se não encontrar dados de hoje', async () => {
      mockReq.query = { city: 'São Paulo' };
      const todayStr = new Date().toISOString().split('T')[0];
      const mockRawData = { daily: [{ date: '2024-01-01', precipProbability: 0.3 }] };
      const mockFormattedData = [{ date: '2024-01-01', precipProbability: 0.3 }];

      CrossingService.fetchWeatherData.mockResolvedValue(mockRawData);
      formatDailyPrecipitationProbability.mockReturnValue(mockFormattedData);

      await getTodayPrecipProbability(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        date: todayStr,
        precipProbability: null
      });
    });

    it('deve retornar erro 500 se houver exceção', async () => {
      mockReq.query = { city: 'São Paulo' };

      CrossingService.fetchWeatherData.mockRejectedValue(new Error('Erro interno'));

      await getTodayPrecipProbability(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });
});

