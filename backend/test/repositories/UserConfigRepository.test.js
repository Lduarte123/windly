// test/repositories/UserConfigRepository.test.js

const db = require('../../db/db');
const userConfigRepo = require('../../repositories/userConfigRepository');

jest.mock('../../db/db', () => ({
  query: jest.fn(),
}));


describe('UserConfigRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('deve retornar config do usuário quando existir', async () => {
      const mockRow = {
        usuario_id: 42,
        temp_unit: 'C',
        pressure_unit: 'hPa',
        wind_unit: 'm/s',
        notifications_enabled: true,
      };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await userConfigRepo.findByUserId(42);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM user_config WHERE usuario_id = $1',
        [42]
      );
      expect(result).toEqual(mockRow);
    });

    it('deve retornar null quando não encontrar config', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await userConfigRepo.findByUserId(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar configuração default para o usuário', async () => {
      const mockRow = {
        usuario_id: 42,
        temp_unit: 'C',
        pressure_unit: 'hPa',
        wind_unit: 'm/s',
        notifications_enabled: true,
      };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await userConfigRepo.create(42);

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO user_config (usuario_id, temp_unit, pressure_unit, wind_unit, notifications_enabled) VALUES ($1, 'C', 'hPa', 'm/s', true) RETURNING *",
        [42]
      );
      expect(result).toEqual(mockRow);
    });
  });

  describe('update', () => {
    it('deve atualizar a configuração do usuário e retornar o resultado', async () => {
      const mockRow = {
        usuario_id: 42,
        temp_unit: 'F',
        pressure_unit: 'psi',
        wind_unit: 'mph',
        notifications_enabled: false,
      };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const data = {
        temp_unit: 'F',
        pressure_unit: 'psi',
        wind_unit: 'mph',
        notifications_enabled: false,
      };

      const result = await userConfigRepo.update(42, data);

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE user_config SET temp_unit = $1, pressure_unit = $2, wind_unit = $3, notifications_enabled = $4 WHERE usuario_id = $5 RETURNING *",
        [data.temp_unit, data.pressure_unit, data.wind_unit, data.notifications_enabled, 42]
      );
      expect(result).toEqual(mockRow);
    });

    it('deve retornar null se não encontrar config para atualizar', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const data = {
        temp_unit: 'F',
        pressure_unit: 'psi',
        wind_unit: 'mph',
        notifications_enabled: false,
      };

      const result = await userConfigRepo.update(999, data);

      expect(result).toBeNull();
    });
  });
});
