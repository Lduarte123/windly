const repository = require('../repositories/cidadeFavoritaRepository');
const db = require('../db/db'); // para consultar usuários

class CidadeFavoritaService {
  static async getByUserId(id, usuario_id) {
    return await repository.findByUserId(id, usuario_id);
  }

  static async create(dados) {
    const userResult = await db.query('SELECT id FROM users WHERE id = $1', [dados.usuario_id]);
    // Verificação de exisitência de usuário
    if (userResult.rows.length === 0) {
      const err = new Error('Usuário não existe.');
      err.status = 400;
      throw err;
    }
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