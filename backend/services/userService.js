const userRepository = require('../repositories/userRepository');
const userConfigRepository = require('../repositories/userConfigRepository');

class UserService {
  static async createUser(name, email, password) {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) throw new Error('EMAIL_IN_USE');

    const user = await userRepository.createUser(name, email, password);
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

  static updateUser(id, name, email) {
    return userRepository.updateUser(id, name, email);
  }

  static deleteUser(id) {
    return userRepository.deleteUser(id);
  }
}

module.exports = UserService;
