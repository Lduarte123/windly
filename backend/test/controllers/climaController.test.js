const ClimaController = require('../../controllers/climaController');
const ClimaService = require('../../services/climaService');
const { formatResponse } = require('../../utils/responseFormatter');

// Mock das dependências
jest.mock('../../services/climaService');
jest.mock('../../utils/responseFormatter');

describe('ClimaController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    it('deve retornar erro se cidade não for fornecida', async () => {
      mockReq.params = {};

      await ClimaController.getWeather(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade é obrigatória' });
      expect(ClimaService.getWeather).not.toHaveBeenCalled();
    });

    it('deve retornar dados do clima formatados para cidade válida', async () => {
      mockReq.params = { city: 'São Paulo' };
      const mockWeatherData = {
        temperature: 25,
        humidity: 60,
        description: 'Ensolarado'
      };
      const mockFormattedData = {
        temperatura: 25,
        umidade: 60,
        descricao: 'Ensolarado'
      };

      ClimaService.getWeather.mockResolvedValue(mockWeatherData);
      formatResponse.mockReturnValue(mockFormattedData);

      await ClimaController.getWeather(mockReq, mockRes, mockNext);

      expect(ClimaService.getWeather).toHaveBeenCalledWith('São Paulo');
      expect(formatResponse).toHaveBeenCalledWith(mockWeatherData);
      expect(mockRes.json).toHaveBeenCalledWith(mockFormattedData);
    });

    it('deve retornar erro 404 se cidade não for encontrada', async () => {
      mockReq.params = { city: 'CidadeInexistente' };
      const mockErrorData = { error: 'Cidade não encontrada' };

      ClimaService.getWeather.mockResolvedValue(mockErrorData);

      await ClimaController.getWeather(mockReq, mockRes, mockNext);

      expect(ClimaService.getWeather).toHaveBeenCalledWith('CidadeInexistente');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada' });
      expect(formatResponse).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro se houver exceção', async () => {
      mockReq.params = { city: 'São Paulo' };
      const mockError = new Error('Erro interno');

      ClimaService.getWeather.mockRejectedValue(mockError);

      await ClimaController.getWeather(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('deve processar cidade com espaços corretamente', async () => {
      mockReq.params = { city: 'Rio de Janeiro' };
      const mockWeatherData = {
        temperature: 28,
        humidity: 70,
        description: 'Parcialmente nublado'
      };
      const mockFormattedData = {
        temperatura: 28,
        umidade: 70,
        descricao: 'Parcialmente nublado'
      };

      ClimaService.getWeather.mockResolvedValue(mockWeatherData);
      formatResponse.mockReturnValue(mockFormattedData);

      await ClimaController.getWeather(mockReq, mockRes, mockNext);

      expect(ClimaService.getWeather).toHaveBeenCalledWith('Rio de Janeiro');
      expect(formatResponse).toHaveBeenCalledWith(mockWeatherData);
      expect(mockRes.json).toHaveBeenCalledWith(mockFormattedData);
    });
  });
});

