const bcrypt = require('bcryptjs');
const db = require('../db/db');
const User = require('../models/userModel');

const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await db.query(query, [name, email, hashedPassword]);
  return new User(rows[0]).toJSON();
};

const findUser = async (field, value) => {
  const query = `SELECT id, name, email, created_at FROM users WHERE ${field} = $1;`;
  const { rows } = await db.query(query, [value]);
  return rows[0] ? new User(rows[0]).toJSON() : null;
};

const updateUser = async (id, name, email) => {
  const query = `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await db.query(query, [name, email, id]);
  return rows[0] ? new User(rows[0]).toJSON() : null;
};

const deleteUser = async (id) => {
  await db.query(`DELETE FROM users WHERE id = $1;`, [id]);
};

module.exports = {
  createUser,
  getUserByEmail: (email) => findUser('email', email),
  getUserById: (id) => findUser('id', id),
  updateUser,
  deleteUser,
};
