const repository = require('../repositories/empresaRepository');

class EmpresaService {
  // Método para buscar todas as empresas
  static async getAll() {
    const empresas = await repository.findAll();
    return empresas;  // Já é um array de objetos Empresa
  }

  // Método para buscar uma empresa por ID
  static async getById(id) {
    const empresa = await repository.findById(id);
    return empresa;  // Pode ser null ou um objeto Empresa
  }

  // Método para criar uma nova empresa
  static async create(dados) {
    const novaEmpresa = await repository.create(dados);
    return novaEmpresa;  // Retorna um objeto Empresa
  }

  // Método para atualizar uma empresa existente
  static async update(id, dados) {
    const empresaAtualizada = await repository.update(id, dados);
    return empresaAtualizada;  // Retorna um objeto Empresa
  }

  // Método para remover uma empresa
  static async remove(id) {
    const empresaRemovida = await repository.remove(id);
    return empresaRemovida;  // Retorna um objeto Empresa ou null
  }
}

module.exports = EmpresaService;