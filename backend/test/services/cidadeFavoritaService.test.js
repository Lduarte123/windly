const CidadeFavoritaService = require('../../services/cidadeFavoritaService');
const repository = require('../../repositories/cidadeFavoritaRepository');
const db = require('../../db/db');

jest.mock('../../repositories/cidadeFavoritaRepository');
jest.mock('../../db/db');

describe('CidadeFavoritaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getByUserId', () => {
    it('deve retornar cidade favorita pelo ID e usuário', async () => {
      const mockData = { id: 1, nome: 'São Paulo', usuario_id: 10 };
      repository.findByUserId.mockResolvedValue(mockData);

      const result = await CidadeFavoritaService.getByUserId(1, 10);
      expect(result).toEqual(mockData);
      expect(repository.findByUserId).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('create', () => {
    it('deve criar cidade favorita se usuário existir', async () => {
      const dados = { nome: 'Curitiba', usuario_id: 2 };
      
      db.query.mockResolvedValue({ rows: [{ id: 2 }] });

      const mockCreated = { id: 5, ...dados };
      repository.create.mockResolvedValue(mockCreated);

      const result = await CidadeFavoritaService.create(dados);
      expect(db.query).toHaveBeenCalledWith('SELECT id FROM users WHERE id = $1', [2]);
      expect(repository.create).toHaveBeenCalledWith(dados);
      expect(result).toEqual(mockCreated);
    });

    it('deve lançar erro se o usuário não existir', async () => {
      const dados = { nome: 'Recife', usuario_id: 99 };

      db.query.mockResolvedValue({ rows: [] });

      await expect(CidadeFavoritaService.create(dados)).rejects.toThrow('Usuário não existe.');
      expect(db.query).toHaveBeenCalledWith('SELECT id FROM users WHERE id = $1', [99]);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover cidade favorita', async () => {
      repository.remove.mockResolvedValue(true);

      const result = await CidadeFavoritaService.remove(3, 1);
      expect(repository.remove).toHaveBeenCalledWith(3, 1);
      expect(result).toBe(true);
    });
  });

  describe('update', () => {
    it('deve atualizar nome da cidade favorita', async () => {
      const updated = { id: 2, nome: 'Florianópolis', usuario_id: 1 };
      repository.update.mockResolvedValue(updated);

      const result = await CidadeFavoritaService.update(2, 1, 'Florianópolis');
      expect(repository.update).toHaveBeenCalledWith(2, 1, 'Florianópolis');
      expect(result).toEqual(updated);
    });
  });

  describe('getAllByUser', () => {
    it('deve retornar todas as cidades favoritas do usuário', async () => {
      const lista = [
        { id: 1, nome: 'Rio de Janeiro', usuario_id: 4 },
        { id: 2, nome: 'Salvador', usuario_id: 4 },
      ];
      repository.findAllByUser.mockResolvedValue(lista);

      const result = await CidadeFavoritaService.getAllByUser(4);
      expect(repository.findAllByUser).toHaveBeenCalledWith(4);
      expect(result).toEqual(lista);
    });
  });
});
