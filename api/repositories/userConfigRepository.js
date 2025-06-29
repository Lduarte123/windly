const db = require('../db/db');

class UserConfigRepository {
  async findByUserId(usuario_id) {
    const result = await db.query(
      `SELECT * FROM user_config WHERE usuario_id = $1`,
      [usuario_id]
    );
    return result.rows[0] || null;
  }

  async create(usuario_id) {
    const result = await db.query(
      `INSERT INTO user_config (usuario_id, temp_unit, pressure_unit, wind_unit, notifications_enabled)
       VALUES ($1, 'C', 'hPa', 'm/s', true)
       RETURNING *`,
      [usuario_id]
    );
    return result.rows[0] || null;
  }

  async update(usuario_id, { temp_unit, pressure_unit, wind_unit, notifications_enabled }) {
    const result = await db.query(
      `UPDATE user_config
       SET temp_unit = $1,
           pressure_unit = $2,
           wind_unit = $3,
           notifications_enabled = $4
       WHERE usuario_id = $5
       RETURNING *`,
      [temp_unit, pressure_unit, wind_unit, notifications_enabled, usuario_id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new UserConfigRepository();