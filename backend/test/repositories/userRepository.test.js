const bcrypt = require('bcryptjs');
const db = require('../../db/db');
const User = require('../../models/userModel');
const userRepository = require('../../repositories/userRepository');

// Mockando db e bcrypt
jest.mock('../../db/db');
jest.mock('bcryptjs');

describe('userRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar um usuário e retornar o JSON', async () => {
      const mockUserData = { id: 1, name: 'Lucas', email: 'lucas@test.com', created_at: new Date() };
      const hashedPassword = 'hashedPassword';

      bcrypt.hash.mockResolvedValue(hashedPassword);
      db.query.mockResolvedValue({ rows: [mockUserData] });
      User.prototype.toJSON = jest.fn().mockReturnValue(mockUserData);

      const result = await userRepository.createUser('Lucas', 'lucas@test.com', '123456');

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['Lucas', 'lucas@test.com', hashedPassword]);
      expect(result).toEqual(mockUserData);
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [{ name: 'Lucas', email: 'lucas@test.com' }];
      db.query.mockResolvedValue({ rows: users });

      const result = await userRepository.getAllUsers();
      expect(result).toEqual(users);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT name, email FROM'));
    });
  });

  describe('getUserByEmail', () => {
    it('deve retornar um usuário existente pelo email', async () => {
      const user = { id: 1, name: 'Lucas', email: 'lucas@test.com', password: '123', created_at: new Date() };
      db.query.mockResolvedValue({ rows: [user] });

      const result = await userRepository.getUserByEmail('lucas@test.com');
      expect(result).toEqual(user);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['lucas@test.com']);
    });

    it('deve retornar null se o usuário não existir', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.getUserByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo id', async () => {
      const userData = { id: 1, name: 'Lucas', email: 'lucas@test.com', created_at: new Date() };
      db.query.mockResolvedValue({ rows: [userData] });
      User.prototype.toJSON = jest.fn().mockReturnValue(userData);

      const result = await userRepository.getUserById(1);
      expect(result).toEqual(userData);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    });

    it('deve retornar null se o usuário não existir', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.getUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário e retornar o JSON', async () => {
      const updatedUser = { id: 1, name: 'Novo Nome', email: 'novo@test.com', created_at: new Date() };
      db.query.mockResolvedValue({ rows: [updatedUser] });
      User.prototype.toJSON = jest.fn().mockReturnValue(updatedUser);

      const result = await userRepository.updateUser(1, 'Novo Nome', 'novo@test.com');
      expect(result).toEqual(updatedUser);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['Novo Nome', 'novo@test.com', 1]);
    });

    it('deve retornar null se não encontrar o usuário', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.updateUser(999, 'Nome', 'email@test.com');
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário pelo id', async () => {
      db.query.mockResolvedValue({});

      await userRepository.deleteUser(1);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM users WHERE id ='), [1]);
    });
  });
});
