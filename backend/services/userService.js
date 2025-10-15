const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const userConfigRepository = require('../repositories/userConfigRepository');

class UserService {
  static async createUser(name, email, password) {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) throw new Error('EMAIL_IN_USE');

    // ✅ Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser(name, email, hashedPassword);
    await userConfigRepository.create(user.id);
    return user;
  }

  static getUserById(id) {
    return userRepository.getUserById(id);
  }

  static getAllUsers() {
    return userRepository.getAllUsers();
  }

  static getUserByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  static async updateUser(id, name, email) {
    const updatedUser = await userRepository.updateUser(id, name, email);
    if (!updatedUser) throw new Error('Usuário não encontrado');
    return updatedUser;
  }

  static async deleteUser(id) {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) throw new Error('Usuário não encontrado');
    return deleted;
  }
}

module.exports = UserService;
