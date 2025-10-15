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
    });
  });

  // Testes para remove, update e findAllByUser seguem padrão similar...

});
