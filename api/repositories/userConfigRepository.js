const db = require('../db/db');

const getConfigByUserId = async (usuario_id) => {
  const result = await db.query('SELECT * FROM user_config WHERE usuario_id = $1', [usuario_id]);
  return result.rows[0];
};

const upsertConfig = async (usuario_id, config) => {
  const { temp_unit, pressure_unit, wind_unit, notifications_enabled } = config;
  // Checa se já existe config para o usuário
  const existing = await getConfigByUserId(usuario_id);
  if (existing) {
    // Faz UPDATE
    const result = await db.query(`
      UPDATE user_config
      SET temp_unit = $2,
          pressure_unit = $3,
          wind_unit = $4,
          notifications_enabled = $5
      WHERE usuario_id = $1
      RETURNING *;
    `, [usuario_id, temp_unit, pressure_unit, wind_unit, notifications_enabled]);
    return result.rows[0];
  } else {
    // Faz INSERT
    const result = await db.query(`
      INSERT INTO user_config (usuario_id, temp_unit, pressure_unit, wind_unit, notifications_enabled)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [usuario_id, temp_unit, pressure_unit, wind_unit, notifications_enabled]);
    return result.rows[0];
  }
};

module.exports = { getConfigByUserId, upsertConfig };