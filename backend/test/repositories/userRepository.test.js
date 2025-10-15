jest.mock('../../repositories/userRepository', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('../../repositories/userConfigRepository');
jest.mock('../../db/db');
jest.mock('bcryptjs');
jest.mock('../../models/userModel');

const userRepository = require('../../repositories/userRepository');
const userConfigRepository = require('../../repositories/userConfigRepository');
const db = require('../../db/db');
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const userService = require('../../services/userService');

describe('userService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar um novo usuário quando o email não está em uso', async () => {
      const fakeUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        created_at: new Date(),
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue(fakeUser);
      userConfigRepository.create.mockResolvedValue({ usuario_id: fakeUser.id });

      const result = await userService.createUser('Test', 'test@example.com', 'senha123');

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(userRepository.createUser).toHaveBeenCalledWith('Test', 'test@example.com', 'hashedPassword');
      expect(userConfigRepository.create).toHaveBeenCalledWith(fakeUser.id);
      expect(result).toEqual(fakeUser);
    });

    it('deve lançar erro se o email já estiver em uso', async () => {
      const existingUser = { id: 1, email: 'test@example.com' };
      userRepository.getUserByEmail.mockResolvedValue(existingUser);

      await expect(
        userService.createUser('Test', 'test@example.com', 'senha123')
      ).rejects.toThrow('EMAIL_IN_USE');

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.createUser).not.toHaveBeenCalled();
      expect(userConfigRepository.create).not.toHaveBeenCalled();
    });
  });
});
