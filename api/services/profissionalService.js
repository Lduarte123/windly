const repository = require('../repositories/profissionalRepository');

class ProfissionalService {
  static async getAll() {
    const profissionais = await repository.findAll();
    return profissionais;  // Já é um array de objetos Profissional
  }

  static async getById(id) {
    const profissional = await repository.findById(id);
    return profissional;  // Pode ser null ou um objeto Profissional
  }

  static async create(dados) {
    const novoProfissional = await repository.create(dados);
    return novoProfissional;  // Retorna um objeto Profissional
  }

  static async update(id, dados) {
    const profissionalAtualizado = await repository.update(id, dados);
    return profissionalAtualizado;  // Retorna um objeto Profissional
  }

  static async remove(id) {
    const profissionalRemovido = await repository.remove(id);
    return profissionalRemovido;  // Retorna um objeto Profissional ou null
  }
}

module.exports = ProfissionalService;
