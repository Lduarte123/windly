const UserService = require('../../services/userService');
const userRepository = require('../../repositories/userRepository');
const userConfigRepository = require('../../repositories/userConfigRepository');

jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/userConfigRepository');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve lançar erro se o e-mail já estiver em uso', async () => {
      userRepository.getUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(UserService.createUser('John Doe', 'test@example.com', 'password123'))
        .rejects
        .toThrow('EMAIL_IN_USE');
    });

    it('deve criar um novo usuário e configurar', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      
      userRepository.createUser.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      userConfigRepository.create.mockResolvedValue(true);

      const result = await UserService.createUser('John Doe', 'john.doe@example.com', 'password123');
      
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
      expect(userConfigRepository.create).toHaveBeenCalledWith(1); 
    });

    it('deve lançar erro se a criação da configuração do usuário falhar', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      
      userRepository.createUser.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      userConfigRepository.create.mockRejectedValue(new Error('Erro ao criar configuração'));

      await expect(UserService.createUser('John Doe', 'john.doe@example.com', 'password123'))
        .rejects
        .toThrow('Erro ao criar configuração');
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário por ID', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
      userRepository.getUserById.mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      const result = await UserService.getUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar uma lista de todos os usuários', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
      ];
      userRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();
      expect(result).toEqual(mockUsers);
    });

    it('deve retornar uma lista vazia quando não houver usuários', async () => {
      userRepository.getAllUsers.mockResolvedValue([]);

      const result = await UserService.getAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário', async () => {
      const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(1, 'John Smith', 'john.smith@example.com');
      expect(result).toEqual(updatedUser);
    });

    it('deve lançar erro se o usuário não for encontrado para atualizar', async () => {
      userRepository.updateUser.mockResolvedValue(null);

      await expect(UserService.updateUser(999, 'Non-existent', 'no.email@example.com'))
        .rejects
        .toThrow('Usuário não encontrado');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário', async () => {
      userRepository.deleteUser.mockResolvedValue(true);

      await expect(UserService.deleteUser(1)).resolves.toBe(true);
    });

    it('deve lançar erro se o usuário não for encontrado para deletar', async () => {
      userRepository.deleteUser.mockResolvedValue(false); 

      await expect(UserService.deleteUser(999)).rejects.toThrow('Usuário não encontrado');
    });
  });
});
