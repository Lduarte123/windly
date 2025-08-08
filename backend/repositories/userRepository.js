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
  const values = [name, email, hashedPassword];
  const result = await db.query(query, values);
  const user = new User(result.rows[0]);
  return user.toJSON();
};

const getUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, created_at FROM users WHERE email = $1;
  `;
  const result = await db.query(query, [email]);
  if (!result.rows[0]) return null;
  return result.rows[0];
};

const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at FROM users WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  if (!result.rows[0]) return null;
  const user = new User(result.rows[0]);
  return user.toJSON();
};

const updateUser = async (id, name, email) => {
  const query = `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING id, name, email, created_at;
  `;
  const result = await db.query(query, [name, email, id]);
  if (!result.rows[0]) return null;
  const user = new User(result.rows[0]);
  return user.toJSON();
};

const deleteUser = async (id) => {
  const query = `
    DELETE FROM users WHERE id = $1;
  `;
  await db.query(query, [id]);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser
};
