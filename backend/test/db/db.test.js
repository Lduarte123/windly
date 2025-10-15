const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis do backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

// Mocka pg.Pool
jest.mock('pg', () => ({
  Pool: jest.fn()
}));

const { Pool } = require('pg');

describe('Database Connection', () => {
  let mockPool;

  beforeEach(() => {
    // Simula pool com apenas o evento connect
    mockPool = {
      on: jest.fn((event, callback) => {
        if (event === 'connect') callback();
      }),
      query: jest.fn()
    };

    Pool.mockImplementation(() => mockPool);
    delete require.cache[require.resolve('../../db/db')];
  });

  test('deve conectar ao banco de dados com sucesso', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    require('../../db/db'); // Executa db.js

    expect(Pool).toHaveBeenCalledWith({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'postgres',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '✅ Conexão com o banco de dados estabelecida com sucesso.'
    );

    consoleSpy.mockRestore();
  });

  test('deve exportar função query', () => {
    const db = require('../../db/db');
    expect(typeof db.query).toBe('function');
  });
});
