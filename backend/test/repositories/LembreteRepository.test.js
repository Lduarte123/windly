const db = require('../../db/db');
const Lembrete = require('../../models/lembreteModel');
const lembreteRepo = require('../../repositories/lembreteRepository');

jest.mock('../../db/db');

describe('LembreteRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllByUser', () => {
    it('deve retornar uma lista de lembretes para um usuário', async () => {
      const mockRows = [
        { id: 1, usuario_id: 42, titulo: 'Titulo 1', descricao: 'Descricao 1', criado_em: '2025-10-02T10:00:00Z' },
        { id: 2, usuario_id: 42, titulo: 'Titulo 2', descricao: 'Descricao 2', criado_em: '2025-10-03T10:00:00Z' },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await lembreteRepo.findAllByUser(42);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM lembrete WHERE usuario_id = $1', [42]);
      expect(result).toHaveLength(2);
      result.forEach((lembrete, i) => {
        expect(lembrete).toBeInstanceOf(Lembrete);
        expect(lembrete.id).toBe(mockRows[i].id);
      });
    });
  });

  describe('findById', () => {
    it('deve retornar um lembrete pelo id', async () => {
      const mockRow = { id: 1, usuario_id: 42, titulo: 'Titulo 1', descricao: 'Descricao 1', criado_em: '2025-10-02T10:00:00Z' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await lembreteRepo.findById(1);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM lembrete WHERE id = $1', [1]);
      expect(result).toBeInstanceOf(Lembrete);
      expect(result.id).toBe(mockRow.id);
    });

    it('deve retornar null se não encontrar o lembrete', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await lembreteRepo.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um lembrete e retornar a instância', async () => {
      const mockRow = { id: 10, usuario_id: 42, titulo: 'Novo título', descricao: 'Nova descrição', criado_em: '2025-10-04T10:00:00Z' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const data = { usuario_id: 42, titulo: 'Novo título', descricao: 'Nova descrição' };
      const result = await lembreteRepo.create(data);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO lembrete (usuario_id, titulo, descricao) VALUES ($1, $2, $3) RETURNING *',
        [data.usuario_id, data.titulo, data.descricao]
      );
      expect(result).toBeInstanceOf(Lembrete);
      expect(result.titulo).toBe(data.titulo);
    });
  });

  describe('update', () => {
    it('deve atualizar um lembrete e retornar a instância atualizada', async () => {
      const mockRow = { id: 1, usuario_id: 42, titulo: 'Título atualizado', descricao: 'Descrição atualizada', criado_em: '2025-10-02T10:00:00Z' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const data = { titulo: 'Título atualizado', descricao: 'Descrição atualizada' };
      const result = await lembreteRepo.update(1, data);

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE lembrete SET titulo = $1, descricao = $2 WHERE id = $3 RETURNING *',
        [data.titulo, data.descricao, 1]
      );
      expect(result).toBeInstanceOf(Lembrete);
      expect(result.titulo).toBe(data.titulo);
    });

    it('deve retornar null se não encontrar o lembrete para atualizar', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await lembreteRepo.update(999, { titulo: 'x', descricao: 'y' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('deve remover um lembrete e retornar a instância removida', async () => {
      const mockRow = { id: 1, usuario_id: 42, titulo: 'Título', descricao: 'Descrição', criado_em: '2025-10-02T10:00:00Z' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await lembreteRepo.remove(1);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM lembrete WHERE id = $1 RETURNING *', [1]);
      expect(result).toBeInstanceOf(Lembrete);
      expect(result.id).toBe(mockRow.id);
    });

    it('deve retornar null se não encontrar o lembrete para remover', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await lembreteRepo.remove(999);

      expect(result).toBeNull();
    });
  });
});
