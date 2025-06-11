const repository = require('../repositories/cidadeFavoritaRepository');

class CidadeFavoritaService {
  static async getAll() {
    return await repository.findAll();
  }

  static async getById(id) {
    return await repository.findById(id);
  }

  static async create(dados) {
    return await repository.create(dados);
  }

  static async remove(id) {
    return await repository.remove(id);
  }
}

module.exports = CidadeFavoritaService;