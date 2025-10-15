// Mock do módulo pg para evitar conexão real com banco
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: jest.fn()
  }))
}));

// Mock do dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

const { Pool } = require('pg');

describe('Database Connection', () => {
  let mockPool;
  
  beforeEach(() => {
    mockPool = {
      query: jest.fn()
    };
    Pool.mockImplementation(() => mockPool);
    // Limpa o cache do módulo para recarregar
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../db/db')];
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('deve conectar ao banco de dados com sucesso', () => {
    // Mock de console.log para capturar a mensagem de sucesso
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Recarrega o módulo db para testar a conexão, mas que djabeisso mds
    require('../../db/db');
    
    expect(Pool).toHaveBeenCalledWith({
      connectionString: process.env.DATABASE_URL
    });
    expect(consoleSpy).toHaveBeenCalledWith('✅ Conexão com o banco de dados estabelecida com sucesso.');
    
    consoleSpy.mockRestore();
  });

  test('deve exportar função query', () => {
    const db = require('../../db/db');
    expect(typeof db.query).toBe('function');
  });

  test('função query deve estar disponível', () => {
    const db = require('../../db/db');
    expect(typeof db.query).toBe('function');
    expect(db.query).toBeDefined();
  });
});
