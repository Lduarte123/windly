// Mock do módulo db
const mockDb = {
  query: jest.fn()
};

jest.mock('../../db/db', () => mockDb);

describe('Database Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Limpa o cache do módulo para recarregar
    delete require.cache[require.resolve('../../db/dbInit')];
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('deve exportar função createTable', () => {
    const createTable = require('../../db/dbInit');
    expect(typeof createTable).toBe('function');
  });

  test('deve criar tabela users se não existir', async () => {
    // Mock: tabela users não existe
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] }) // users não existe
      .mockResolvedValueOnce({}) // criação da tabela users
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'cidade_favorita' }] }) // cidade_favorita existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'lembrete' }] }) // lembrete existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'user_config' }] }); // user_config existe

    const createTable = require('../../db/dbInit');
    await createTable();

    // Verifica se foi chamada a query para verificar se users existe
    expect(mockDb.query).toHaveBeenCalledWith("SELECT to_regclass('public.users');");
    
    // Verifica se foi chamada a query para criar a tabela users
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE users'));
  });

  test('deve criar tabela cidade_favorita se não existir', async () => {
    // Mock: tabela cidade_favorita não existe
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'users' }] }) // users existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] }) // cidade_favorita não existe
      .mockResolvedValueOnce({}) // criação da tabela cidade_favorita
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'lembrete' }] }) // lembrete existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'user_config' }] }); // user_config existe

    const createTable = require('../../db/dbInit');
    await createTable();

    // Verifica se foi chamada a query para verificar se cidade_favorita existe
    expect(mockDb.query).toHaveBeenCalledWith("SELECT to_regclass('public.cidade_favorita');");
    
    // Verifica se foi chamada a query para criar a tabela cidade_favorita
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE cidade_favorita'));
  });

  test('deve criar tabela lembrete se não existir', async () => {
    // Mock: tabela lembrete não existe
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'users' }] }) // users existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'cidade_favorita' }] }) // cidade_favorita existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] }) // lembrete não existe
      .mockResolvedValueOnce({}) // criação da tabela lembrete
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'user_config' }] }); // user_config existe

    const createTable = require('../../db/dbInit');
    await createTable();

    // Verifica se foi chamada a query para verificar se lembrete existe
    expect(mockDb.query).toHaveBeenCalledWith("SELECT to_regclass('public.lembrete');");
    
    // Verifica se foi chamada a query para criar a tabela lembrete
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE lembrete'));
  });

  test('deve criar tabela user_config se não existir', async () => {
    // Mock: tabela user_config não existe
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'users' }] }) // users existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'cidade_favorita' }] }) // cidade_favorita existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'lembrete' }] }) // lembrete existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] }) // user_config não existe
      .mockResolvedValueOnce({}); // criação da tabela user_config

    const createTable = require('../../db/dbInit');
    await createTable();

    // Verifica se foi chamada a query para verificar se user_config existe
    expect(mockDb.query).toHaveBeenCalledWith("SELECT to_regclass('public.user_config');");
    
    // Verifica se foi chamada a query para criar a tabela user_config
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE user_config'));
  });

  test('não deve criar tabelas se já existirem', async () => {
    // Mock: todas as tabelas já existem
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'users' }] }) // users existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'cidade_favorita' }] }) // cidade_favorita existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'lembrete' }] }) // lembrete existe
      .mockResolvedValueOnce({ rows: [{ to_regclass: 'user_config' }] }); // user_config existe

    const createTable = require('../../db/dbInit');
    await createTable();

    // Verifica se foram chamadas as queries de verificação
    expect(mockDb.query).toHaveBeenCalledTimes(4);
    
    // Verifica se não foram chamadas queries de criação (apenas verificação)
    expect(mockDb.query).not.toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE'));
  });

  test('deve tratar erro ao criar tabelas', async () => {
    // Mock: erro ao criar tabela
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockDb.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] }) // users não existe
      .mockRejectedValueOnce(new Error('Erro de conexão')); // erro ao criar users

    const createTable = require('../../db/dbInit');
    await createTable();

    expect(consoleSpy).toHaveBeenCalledWith('Erro ao criar tabelas:', 'Erro de conexão');
    
    consoleSpy.mockRestore();
  });
});
