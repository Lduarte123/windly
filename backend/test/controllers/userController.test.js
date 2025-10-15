const userController = require('../../controllers/userController');
const UserService = require('../../services/userService');

// Mock do serviço
jest.mock('../../services/userService');

describe('UserController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar usuário com dados válidos', async () => {
      mockReq.body = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: '123456'
      };
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com'
      };
      UserService.createUser.mockResolvedValue(mockUser);

      await userController.createUser(mockReq, mockRes);

      expect(UserService.createUser).toHaveBeenCalledWith('João Silva', 'joao@test.com', '123456');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar erro 400 se email já estiver em uso', async () => {
      mockReq.body = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: '123456'
      };
      const mockError = new Error('EMAIL_IN_USE');
      UserService.createUser.mockRejectedValue(mockError);

      await userController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Este email já está sendo utilizado' });
    });

    it('deve retornar erro 500 se houver outro tipo de erro', async () => {
      mockReq.body = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: '123456'
      };
      const mockError = new Error('Erro interno');
      UserService.createUser.mockRejectedValue(mockError);

      await userController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao criar usuário' });
    });
  });

  describe('getUserById', () => {
    it('deve retornar usuário por ID', async () => {
      mockReq.params = { id: '1' };
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'hashed_password'
      };
      UserService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(mockReq, mockRes);

      expect(UserService.getUserById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@test.com'
      });
    });

    it('deve retornar erro 404 se usuário não for encontrado', async () => {
      mockReq.params = { id: '999' };
      UserService.getUserById.mockResolvedValue(null);

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { id: '1' };
      UserService.getUserById.mockRejectedValue(new Error('Erro no banco'));

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
    });
  });

  describe('getUserByEmail', () => {
    it('deve retornar usuário por email', async () => {
      mockReq.query = { email: 'joao@test.com' };
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'hashed_password'
      };
      UserService.getUserByEmail.mockResolvedValue(mockUser);

      await userController.getUserByEmail(mockReq, mockRes);

      expect(UserService.getUserByEmail).toHaveBeenCalledWith('joao@test.com');
      expect(mockRes.json).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@test.com'
      });
    });

    it('deve retornar erro 404 se usuário não for encontrado', async () => {
      mockReq.query = { email: 'inexistente@test.com' };
      UserService.getUserByEmail.mockResolvedValue(null);

      await userController.getUserByEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.query = { email: 'joao@test.com' };
      UserService.getUserByEmail.mockRejectedValue(new Error('Erro no banco'));

      await userController.getUserByEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 1, name: 'João Silva', email: 'joao@test.com' },
        { id: 2, name: 'Maria Santos', email: 'maria@test.com' }
      ];
      UserService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockReq, mockRes);

      expect(UserService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('deve retornar erro 404 se não houver usuários', async () => {
      UserService.getAllUsers.mockResolvedValue(null);

      await userController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Nenhum usuário encontrado' });
    });

    it('deve retornar erro 500 se houver problema', async () => {
      UserService.getAllUsers.mockRejectedValue(new Error('Erro no banco'));

      await userController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuários' });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário com dados válidos', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@test.com'
      };
      const mockUpdatedUser = {
        id: 1,
        name: 'João Silva Atualizado',
        email: 'joao.novo@test.com'
      };
      UserService.updateUser.mockResolvedValue(mockUpdatedUser);

      await userController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith('1', 'João Silva Atualizado', 'joao.novo@test.com');
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@test.com'
      };
      UserService.updateUser.mockRejectedValue(new Error('Erro no banco'));

      await userController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar usuário' });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      mockReq.params = { id: '1' };
      UserService.deleteUser.mockResolvedValue();

      await userController.deleteUser(mockReq, mockRes);

      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });
    });

    it('deve retornar erro 500 se houver problema', async () => {
      mockReq.params = { id: '1' };
      UserService.deleteUser.mockRejectedValue(new Error('Erro no banco'));

      await userController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao deletar usuário' });
    });
  });
});

