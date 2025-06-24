const repository = require('../repositories/userConfigRepository');

class UserConfigService {
  async getConfig(usuario_id) {
    return await repository.findByUserId(usuario_id);
  }

  async createConfig(usuario_id) {
    return await repository.create(usuario_id);
  }

  async updateConfig(usuario_id, config) {
    return await repository.update(usuario_id, config);
  }
}

module.exports = new UserConfigService();