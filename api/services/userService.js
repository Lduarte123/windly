const userRepository = require('../repositories/userRepository');
const userConfigRepository = require('../repositories/userConfigRepository');

class UserService {
  static async createUser(name, email, password) {
    const user = await userRepository.createUser(name, email, password);
    await userConfigRepository.create(user.id);
    return user;
  }

  static async getUserById(id) {
    return await userRepository.getUserById(id);
  }

  static async getUserByEmail(email) {
    return await userRepository.getUserByEmail(email);
  }

  static async updateUser(id, name, email) {
    return await userRepository.updateUser(id, name, email);
  }

  static async deleteUser(id) {
    return await userRepository.deleteUser(id);
  }
}

module.exports = UserService;