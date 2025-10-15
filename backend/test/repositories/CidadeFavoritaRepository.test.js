// test/CidadeFavoritaRepository.test.js
const db = require('../../db/db');
const CidadeFavorita = require('../../models/cidadeFavoritaModel');
const cidadeFavoritaRepo = require('../../repositories/cidadeFavoritaRepository');

jest.mock('../../db/db');

describe('CidadeFavoritaRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('deve retornar uma instância de CidadeFavorita quando encontrar', async () => {
      const mockRow = { id: 1, nome: 'São Paulo', usuario_id: 42 };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await cidadeFavoritaRepo.findByUserId(1, 42);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM cidade_favorita WHERE id = $1 AND usuario_id = $2 ',
        [1, 42]
      );
      expect(result).toBeInstanceOf(CidadeFavorita);
      expect(result.id).toBe(mockRow.id);
      expect(result.nome).toBe(mockRow.nome);
      expect(result.usuario_id).toBe(mockRow.usuario_id);
    });

    it('deve retornar null quando não encontrar', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await cidadeFavoritaRepo.findByUserId(99, 99);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar uma nova cidade favorita e retornar a instância', async () => {
      const mockRow = { id: 10, nome: 'Rio de Janeiro', usuario_id: 42 };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const data = { nome: 'Rio de Janeiro', usuario_id: 42 };
      const result = await cidadeFavoritaRepo.create(data);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO cidade_favorita (nome, usuario_id) VALUES ($1, $2) RETURNING *',
        [data.nome, data.usuario_id]
      );
      expect(result).toBeInstanceOf(CidadeFavorita);
      expect(result.nome).toBe(data.nome);
      expect(result.usuario_id).toBe(data.usuario_id);
    });
  });

  describe('remove', () => {
    it('deve remover e retornar a cidade favorita quando encontrada', async () => {
      const mockRow = { id: 5, nome: 'Curitiba', usuario_id: 42 };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await cidadeFavoritaRepo.remove(5, 42);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM cidade_favorita WHERE id = $1 AND usuario_id = $2 RETURNING *',
        [5, 42]
      );
      expect(result).toBeInstanceOf(CidadeFavorita);
      expect(result.id).toBe(5);
    });

    it('deve retornar null quando não encontrar', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await cidadeFavoritaRepo.remove(999, 42);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar a cidade favorita quando encontrada', async () => {
      const mockRow = { id: 7, nome: 'Fortaleza', usuario_id: 42 };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await cidadeFavoritaRepo.update(7, 42, 'Fortaleza');

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE cidade_favorita SET nome = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
        ['Fortaleza', 7, 42]
      );
      expect(result).toBeInstanceOf(CidadeFavorita);
      expect(result.nome).toBe('Fortaleza');
    });

    it('deve retornar null quando não encontrar', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await cidadeFavoritaRepo.update(999, 42, 'Nova Cidade');

      expect(result).toBeNull();
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar uma lista de instâncias de CidadeFavorita', async () => {
      const mockRows = [
        { id: 1, nome: 'São Paulo', usuario_id: 42 },
        { id: 2, nome: 'Rio de Janeiro', usuario_id: 42 },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await cidadeFavoritaRepo.findAllByUser(42);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM cidade_favorita WHERE usuario_id = $1',
        [42]
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(CidadeFavorita);
      expect(result[1].nome).toBe('Rio de Janeiro');
    });

    it('deve retornar uma lista vazia quando não houver registros', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await cidadeFavoritaRepo.findAllByUser(999);

      expect(result).toEqual([]);
    });
  });
});
