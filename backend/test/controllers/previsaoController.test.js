const PrevisaoController = require('../../controllers/previsaoController');
const PrevisaoService = require('../../services/previsaoService');
const { formatResponse, formatForecastResponse } = require('../../utils/responseFormatter');

// Mock das dependências
jest.mock('../../services/previsaoService');
jest.mock('../../utils/responseFormatter');

describe('PrevisaoController', () => {
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

  describe('getForecast', () => {
    it('deve retornar erro se cidade não for fornecida', async () => {
      mockReq.params = {};

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade é obrigatória' });
      expect(PrevisaoService.getForecast).not.toHaveBeenCalled();
    });

    it('deve retornar dados de previsão formatados para cidade válida', async () => {
      mockReq.params = { city: 'São Paulo' };
      const mockForecastData = {
        daily: [
          { date: '2024-01-01', temp_max: 28, temp_min: 18, description: 'Ensolarado' },
          { date: '2024-01-02', temp_max: 25, temp_min: 16, description: 'Parcialmente nublado' }
        ]
      };
      const mockFormattedData = {
        previsoes: [
          { data: '2024-01-01', temp_maxima: 28, temp_minima: 18, descricao: 'Ensolarado' },
          { data: '2024-01-02', temp_maxima: 25, temp_minima: 16, descricao: 'Parcialmente nublado' }
        ]
      };

      PrevisaoService.getForecast.mockResolvedValue(mockForecastData);
      formatForecastResponse.mockReturnValue(mockFormattedData);

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(PrevisaoService.getForecast).toHaveBeenCalledWith('São Paulo');
      expect(formatForecastResponse).toHaveBeenCalledWith(mockForecastData);
      expect(mockRes.json).toHaveBeenCalledWith(mockForecastData);
    });

    it('deve retornar erro 404 se cidade não for encontrada', async () => {
      mockReq.params = { city: 'CidadeInexistente' };
      const mockErrorData = { error: 'Cidade não encontrada' };

      PrevisaoService.getForecast.mockResolvedValue(mockErrorData);

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(PrevisaoService.getForecast).toHaveBeenCalledWith('CidadeInexistente');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada' });
      expect(formatForecastResponse).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro se houver exceção', async () => {
      mockReq.params = { city: 'São Paulo' };
      const mockError = new Error('Erro interno');

      PrevisaoService.getForecast.mockRejectedValue(mockError);

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('deve processar cidade com espaços corretamente', async () => {
      mockReq.params = { city: 'Rio de Janeiro' };
      const mockForecastData = {
        daily: [
          { date: '2024-01-01', temp_max: 30, temp_min: 22, description: 'Ensolarado' }
        ]
      };

      PrevisaoService.getForecast.mockResolvedValue(mockForecastData);
      formatForecastResponse.mockReturnValue({});

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(PrevisaoService.getForecast).toHaveBeenCalledWith('Rio de Janeiro');
      expect(formatForecastResponse).toHaveBeenCalledWith(mockForecastData);
      expect(mockRes.json).toHaveBeenCalledWith(mockForecastData);
    });

    it('deve retornar dados sem formatação se formatForecastResponse não for chamado', async () => {
      mockReq.params = { city: 'São Paulo' };
      const mockForecastData = {
        daily: [
          { date: '2024-01-01', temp_max: 28, temp_min: 18, description: 'Ensolarado' }
        ]
      };

      PrevisaoService.getForecast.mockResolvedValue(mockForecastData);

      await PrevisaoController.getForecast(mockReq, mockRes, mockNext);

      expect(PrevisaoService.getForecast).toHaveBeenCalledWith('São Paulo');
      expect(mockRes.json).toHaveBeenCalledWith(mockForecastData);
    });
  });
});

