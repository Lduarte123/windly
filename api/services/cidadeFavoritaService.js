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

  static async remove(id, usuario_id) {
    return await repository.remove(id, usuario_id);
  }

  static async update(id, usuario_id, nome) {
    return await repository.update(id, usuario_id, nome);
  }

  static async getAllByUser(usuario_id) {
    return await repository.findAllByUser(usuario_id);
  }
}

module.exports = CidadeFavoritaService;