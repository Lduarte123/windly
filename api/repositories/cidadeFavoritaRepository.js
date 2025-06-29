const db = require('../db/db');
const CidadeFavorita = require('../models/cidadeFavoritaModel');

class CidadeFavoritaRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM cidade_favorita');
    return result.rows.map(row => new CidadeFavorita(row));
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM cidade_favorita WHERE id = $1', [id]);
    return result.rows[0] ? new CidadeFavorita(result.rows[0]) : null;
  }

  async create({ nome, usuario_id }) {
    const result = await db.query(
      'INSERT INTO cidade_favorita (nome, usuario_id) VALUES ($1, $2) RETURNING *',
      [nome, usuario_id]
    );
    return new CidadeFavorita(result.rows[0]);
  }

  async remove(id, usuario_id) {
    const result = await db.query(
      'DELETE FROM cidade_favorita WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuario_id]
    );
    return result.rows[0] ? new CidadeFavorita(result.rows[0]) : null;
  }

  async update(id, usuario_id, nome) {
    const result = await db.query(
      'UPDATE cidade_favorita SET nome = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
      [nome, id, usuario_id]
    );
    return result.rows[0] ? new CidadeFavorita(result.rows[0]) : null;
  }

  async findAllByUser(usuario_id) {
    const result = await db.query('SELECT * FROM cidade_favorita WHERE usuario_id = $1', [usuario_id]);
    return result.rows.map(row => new CidadeFavorita(row));
  }
}

module.exports = new CidadeFavoritaRepository();