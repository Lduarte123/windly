const repository = require('../repositories/lembreteRepository');

class LembreteService {
  static async getAllByUser(usuario_id) {
    return await repository.findAllByUser(usuario_id);
  }

  static async getById(id) {
    return await repository.findById(id);
  }

  static async create(dados) {
    return await repository.create(dados);
  }

  static async update(id, dados) {
    return await repository.update(id, dados);
  }

  static async remove(id) {
    return await repository.remove(id);
  }
}

module.exports = LembreteService;