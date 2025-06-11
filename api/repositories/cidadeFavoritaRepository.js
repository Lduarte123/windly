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

  async create({ nome }) {
    const result = await db.query(
      'INSERT INTO cidade_favorita (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return new CidadeFavorita(result.rows[0]);
  }

  async remove(id) {
    const result = await db.query('DELETE FROM cidade_favorita WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ? new CidadeFavorita(result.rows[0]) : null;
  }
}

module.exports = new CidadeFavoritaRepository();