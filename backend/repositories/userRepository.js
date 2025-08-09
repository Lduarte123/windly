const bcrypt = require('bcryptjs');
const db = require('../db/db');
const User = require('../models/userModel');

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await db.query(query, [name, email, hashedPassword]);
  return new User(rows[0]).toJSON();
}

async function getUserByEmail(email) {
  const query = `
    SELECT id, name, email, password, created_at
    FROM users
    WHERE email = $1;
  `;
  const { rows } = await db.query(query, [email]);
  return rows[0] || null;
}

async function getUserById(id) {
  const query = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] ? new User(rows[0]).toJSON() : null;
}

async function updateUser(id, name, email) {
  const query = `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await db.query(query, [name, email, id]);
  return rows[0] ? new User(rows[0]).toJSON() : null;
}

async function deleteUser(id) {
  await db.query(`DELETE FROM users WHERE id = $1;`, [id]);
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
};
