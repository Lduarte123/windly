const db = require('../db/db');
const Lembrete = require('../models/lembreteModel');

class LembreteRepository {
  async findAllByUser(usuario_id) {
    const result = await db.query('SELECT * FROM lembrete WHERE usuario_id = $1', [usuario_id]);
    return result.rows.map(row => new Lembrete(row));
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM lembrete WHERE id = $1', [id]);
    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async create({ usuario_id, titulo, descricao }) {
    const result = await db.query(
      'INSERT INTO lembrete (usuario_id, titulo, descricao) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, titulo, descricao]
    );
    return new Lembrete(result.rows[0]);
  }

  async update(id, { titulo, descricao }) {
    const result = await db.query(
      'UPDATE lembrete SET titulo = $1, descricao = $2 WHERE id = $3 RETURNING *',
      [titulo, descricao, id]
    );
    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async remove(id) {
    const result = await db.query('DELETE FROM lembrete WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }
}

module.exports = new LembreteRepository();