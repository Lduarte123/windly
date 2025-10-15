const LembreteController = require('../../controllers/lembreteController');
const LembreteService = require('../../services/lembreteService');

// Mock do serviço
jest.mock('../../services/lembreteService');

describe('LembreteController', () => {
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

  describe('getAllByUser', () => {
    it('deve retornar todos os lembretes do usuário', async () => {
      mockReq.params = { usuario_id: '1' };
      const mockLembretes = [
        { id: 1, titulo: 'Lembrete 1', usuario_id: 1 },
        { id: 2, titulo: 'Lembrete 2', usuario_id: 1 }
      ];
      LembreteService.getAllByUser.mockResolvedValue(mockLembretes);

      await LembreteController.getAllByUser(mockReq, mockRes);

      expect(LembreteService.getAllByUser).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockLembretes);
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { usuario_id: '1' };
      LembreteService.getAllByUser.mockRejectedValue(new Error('Erro no banco'));

      await LembreteController.getAllByUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar lembretes.' });
    });
  });

  describe('getById', () => {
    it('deve retornar lembrete por ID', async () => {
      mockReq.params = { id: '1' };
      const mockLembrete = { id: 1, titulo: 'Lembrete Teste', usuario_id: 1 };
      LembreteService.getById.mockResolvedValue(mockLembrete);

      await LembreteController.getById(mockReq, mockRes);

      expect(LembreteService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockLembrete);
    });

    it('deve retornar 404 se lembrete não for encontrado', async () => {
      mockReq.params = { id: '999' };
      LembreteService.getById.mockResolvedValue(null);

      await LembreteController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lembrete não encontrado.' });
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { id: '1' };
      LembreteService.getById.mockRejectedValue(new Error('Erro no banco'));

      await LembreteController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar lembrete.' });
    });
  });

  describe('create', () => {
    it('deve criar novo lembrete com dados válidos', async () => {
      mockReq.body = { usuario_id: '1', titulo: 'Novo Lembrete', descricao: 'Descrição do lembrete' };
      const mockLembrete = { id: 1, titulo: 'Novo Lembrete', descricao: 'Descrição do lembrete', usuario_id: 1 };
      LembreteService.create.mockResolvedValue(mockLembrete);

      await LembreteController.create(mockReq, mockRes);

      expect(LembreteService.create).toHaveBeenCalledWith({
        usuario_id: '1',
        titulo: 'Novo Lembrete',
        descricao: 'Descrição do lembrete'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Lembrete criado',
        data: mockLembrete
      });
    });

    it('deve retornar erro 400 se usuario_id não for fornecido', async () => {
      mockReq.body = { titulo: 'Novo Lembrete' };

      await LembreteController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'usuario_id e titulo são obrigatórios.' });
      expect(LembreteService.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 se titulo não for fornecido', async () => {
      mockReq.body = { usuario_id: '1' };

      await LembreteController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'usuario_id e titulo são obrigatórios.' });
      expect(LembreteService.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro 500 se houver problema na criação', async () => {
      mockReq.body = { usuario_id: '1', titulo: 'Novo Lembrete' };
      LembreteService.create.mockRejectedValue(new Error('Erro no banco'));

      await LembreteController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao criar lembrete.' });
    });
  });

  describe('update', () => {
    it('deve atualizar lembrete existente', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { titulo: 'Lembrete Atualizado', descricao: 'Nova descrição' };
      const mockLembrete = { id: 1, titulo: 'Lembrete Atualizado', descricao: 'Nova descrição' };
      LembreteService.update.mockResolvedValue(mockLembrete);

      await LembreteController.update(mockReq, mockRes);

      expect(LembreteService.update).toHaveBeenCalledWith('1', { titulo: 'Lembrete Atualizado', descricao: 'Nova descrição' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Lembrete atualizado',
        data: mockLembrete
      });
    });

    it('deve retornar 404 se lembrete não for encontrado para atualização', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { titulo: 'Lembrete Atualizado' };
      LembreteService.update.mockResolvedValue(null);

      await LembreteController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lembrete não encontrado para atualizar.' });
    });

    it('deve retornar erro 500 se houver problema na atualização', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { titulo: 'Lembrete Atualizado' };
      LembreteService.update.mockRejectedValue(new Error('Erro no banco'));

      await LembreteController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar lembrete.' });
    });
  });

  describe('remove', () => {
    it('deve remover lembrete existente', async () => {
      mockReq.params = { id: '1' };
      LembreteService.remove.mockResolvedValue(true);

      await LembreteController.remove(mockReq, mockRes);

      expect(LembreteService.remove).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Lembrete removido.' });
    });

    it('deve retornar 404 se lembrete não for encontrado para remoção', async () => {
      mockReq.params = { id: '999' };
      LembreteService.remove.mockResolvedValue(false);

      await LembreteController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lembrete não encontrado.' });
    });

    it('deve retornar erro 500 se houver problema na remoção', async () => {
      mockReq.params = { id: '1' };
      LembreteService.remove.mockRejectedValue(new Error('Erro no banco'));

      await LembreteController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao remover lembrete.' });
    });
  });
});

