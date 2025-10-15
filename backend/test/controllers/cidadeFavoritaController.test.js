const CidadeFavoritaController = require('../../controllers/cidadeFavoritaController');
const CidadeFavoritaService = require('../../services/cidadeFavoritaService');

// Mock do serviço
jest.mock('../../services/cidadeFavoritaService');

describe('CidadeFavoritaController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getAllByUser', () => {
    it('deve retornar todas as cidades favoritas do usuário', async () => {
      mockReq.params = { usuario_id: '1' };
      const mockCidades = [
        { id: 1, nome: 'São Paulo', usuario_id: 1 },
        { id: 2, nome: 'Rio de Janeiro', usuario_id: 1 }
      ];
      CidadeFavoritaService.getAllByUser.mockResolvedValue(mockCidades);

      await CidadeFavoritaController.getAllByUser(mockReq, mockRes, mockNext);

      expect(CidadeFavoritaService.getAllByUser).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCidades);
    });

    it('deve chamar next com erro se houver problema', async () => {
      mockReq.params = { usuario_id: '1' };
      const mockError = new Error('Erro no banco');
      CidadeFavoritaService.getAllByUser.mockRejectedValue(mockError);

      await CidadeFavoritaController.getAllByUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getById', () => {
    it('deve retornar cidade favorita por ID', async () => {
      mockReq.params = { id: '1' };
      mockReq.query = { usuario_id: '1' };
      const mockCidade = { id: 1, nome: 'São Paulo', usuario_id: 1 };
      CidadeFavoritaService.getByUserId.mockResolvedValue(mockCidade);

      await CidadeFavoritaController.getById(mockReq, mockRes, mockNext);

      expect(CidadeFavoritaService.getByUserId).toHaveBeenCalledWith('1', '1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCidade);
    });

    it('deve retornar 404 se cidade não for encontrada', async () => {
      mockReq.params = { id: '999' };
      mockReq.query = { usuario_id: '1' };
      CidadeFavoritaService.getByUserId.mockResolvedValue(null);

      await CidadeFavoritaController.getById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada.' });
    });
  });

  describe('create', () => {
    it('deve criar nova cidade favorita', async () => {
      mockReq.body = { nome: 'São Paulo', usuario_id: '1' };
      const mockCidade = { id: 1, nome: 'São Paulo', usuario_id: 1 };
      CidadeFavoritaService.create.mockResolvedValue(mockCidade);

      await CidadeFavoritaController.create(mockReq, mockRes, mockNext);

      expect(CidadeFavoritaService.create).toHaveBeenCalledWith({ nome: 'São Paulo', usuario_id: '1' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cidade favorita criada',
        data: mockCidade
      });
    });

    it('deve chamar next com erro se houver problema na criação', async () => {
      mockReq.body = { nome: 'São Paulo', usuario_id: '1' };
      const mockError = new Error('Erro no banco');
      CidadeFavoritaService.create.mockRejectedValue(mockError);

      await CidadeFavoritaController.create(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('remove', () => {
    it('deve remover cidade favorita', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { usuario_id: '1' };
      CidadeFavoritaService.remove.mockResolvedValue(true);

      await CidadeFavoritaController.remove(mockReq, mockRes, mockNext);

      expect(CidadeFavoritaService.remove).toHaveBeenCalledWith('1', '1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cidade favorita removida.' });
    });

    it('deve retornar 404 se cidade não for encontrada para remoção', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { usuario_id: '1' };
      CidadeFavoritaService.remove.mockResolvedValue(false);

      await CidadeFavoritaController.remove(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada.' });
    });
  });

  describe('update', () => {
    it('deve atualizar cidade favorita', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { nome: 'São Paulo Atualizada', usuario_id: '1' };
      const mockCidade = { id: 1, nome: 'São Paulo Atualizada', usuario_id: 1 };
      CidadeFavoritaService.update.mockResolvedValue(mockCidade);

      await CidadeFavoritaController.update(mockReq, mockRes, mockNext);

      expect(CidadeFavoritaService.update).toHaveBeenCalledWith('1', '1', 'São Paulo Atualizada');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cidade favorita atualizada',
        data: mockCidade
      });
    });

    it('deve retornar 404 se cidade não for encontrada para atualização', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { nome: 'São Paulo Atualizada', usuario_id: '1' };
      CidadeFavoritaService.update.mockResolvedValue(null);

      await CidadeFavoritaController.update(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cidade não encontrada.' });
    });
  });
});

