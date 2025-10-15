const userConfigController = require('../../controllers/userConfigController');
const userConfigService = require('../../services/userConfigService');

// Mock do serviço
jest.mock('../../services/userConfigService');

describe('UserConfigController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks();
  });

  describe('getConfig', () => {
    it('deve retornar configuração existente do usuário', async () => {
      mockReq.params = { usuario_id: '1' };
      const mockConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'celsius',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: true
      };
      userConfigService.getConfig.mockResolvedValue(mockConfig);

      await userConfigController.getConfig(mockReq, mockRes);

      expect(userConfigService.getConfig).toHaveBeenCalledWith('1');
      expect(userConfigService.createConfig).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockConfig);
    });

    it('deve criar nova configuração se não existir', async () => {
      mockReq.params = { usuario_id: '1' };
      const mockConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'celsius',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: true
      };
      userConfigService.getConfig.mockResolvedValue(null);
      userConfigService.createConfig.mockResolvedValue(mockConfig);

      await userConfigController.getConfig(mockReq, mockRes);

      expect(userConfigService.getConfig).toHaveBeenCalledWith('1');
      expect(userConfigService.createConfig).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockConfig);
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { usuario_id: '1' };
      userConfigService.getConfig.mockRejectedValue(new Error('Erro no banco'));

      await userConfigController.getConfig(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar configuração' });
    });
  });

  describe('updateConfig', () => {
    it('deve atualizar configuração existente', async () => {
      mockReq.params = { usuario_id: '1' };
      mockReq.body = {
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      };
      const mockUpdatedConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      };
      const mockExistingConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'celsius',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: true
      };

      userConfigService.getConfig.mockResolvedValue(mockExistingConfig);
      userConfigService.updateConfig.mockResolvedValue(mockUpdatedConfig);

      await userConfigController.updateConfig(mockReq, mockRes);

      expect(userConfigService.getConfig).toHaveBeenCalledWith('1');
      expect(userConfigService.createConfig).not.toHaveBeenCalled();
      expect(userConfigService.updateConfig).toHaveBeenCalledWith('1', {
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedConfig);
    });

    it('deve criar configuração se não existir antes de atualizar', async () => {
      mockReq.params = { usuario_id: '1' };
      mockReq.body = {
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      };
      const mockCreatedConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'celsius',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: true
      };
      const mockUpdatedConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      };

      userConfigService.getConfig.mockResolvedValue(null);
      userConfigService.createConfig.mockResolvedValue(mockCreatedConfig);
      userConfigService.updateConfig.mockResolvedValue(mockUpdatedConfig);

      await userConfigController.updateConfig(mockReq, mockRes);

      expect(userConfigService.getConfig).toHaveBeenCalledWith('1');
      expect(userConfigService.createConfig).toHaveBeenCalledWith('1');
      expect(userConfigService.updateConfig).toHaveBeenCalledWith('1', {
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedConfig);
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      mockReq.params = { usuario_id: '1' };
      mockReq.body = {
        temp_unit: 'fahrenheit',
        notifications_enabled: false
      };
      const mockExistingConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'celsius',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: true
      };
      const mockUpdatedConfig = {
        id: 1,
        usuario_id: 1,
        temp_unit: 'fahrenheit',
        pressure_unit: 'hPa',
        wind_unit: 'kmh',
        notifications_enabled: false
      };

      userConfigService.getConfig.mockResolvedValue(mockExistingConfig);
      userConfigService.updateConfig.mockResolvedValue(mockUpdatedConfig);

      await userConfigController.updateConfig(mockReq, mockRes);

      expect(userConfigService.updateConfig).toHaveBeenCalledWith('1', {
        temp_unit: 'fahrenheit',
        pressure_unit: undefined,
        wind_unit: undefined,
        notifications_enabled: false
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedConfig);
    });

    it('deve retornar erro 500 se houver problema na atualização', async () => {
      mockReq.params = { usuario_id: '1' };
      mockReq.body = {
        temp_unit: 'fahrenheit',
        pressure_unit: 'mmHg',
        wind_unit: 'mph',
        notifications_enabled: false
      };

      userConfigService.getConfig.mockRejectedValue(new Error('Erro no banco'));

      await userConfigController.updateConfig(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar configuração' });
    });
  });
});

