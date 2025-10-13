const UserService = require('../../services/userService');
const userRepository = require('../../repositories/userRepository');
const userConfigRepository = require('../../repositories/userConfigRepository');

// Mock do repositório
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
  });

  describe('getUserById', () => {
    it('deve retornar um usuário por ID', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
      userRepository.getUserById.mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);
      expect(result).toEqual(mockUser);
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
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário', async () => {
      const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(1, 'John Smith', 'john.smith@example.com');
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário', async () => {
      userRepository.deleteUser.mockResolvedValue(true);

      await expect(UserService.deleteUser(1)).resolves.toBe(true);
    });
  });
});
