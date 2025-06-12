const db = require('../db/db');
const User = require('../models/userModel');

// Criar novo usuário
const createUser = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const values = [name, email, password];
  const result = await db.query(query, values);
  const user = new User(result.rows[0]);
  return user.toJSON();
};

// Buscar usuário por e-mail (ex: login)
const getUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users WHERE email = $1;
  `;
  const result = await db.query(query, [email]);
  if (!result.rows[0]) return null;
  const user = new User(result.rows[0]);
  return user.toJSON();
};

// Buscar por ID
const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at FROM users WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  if (!result.rows[0]) return null;
  const user = new User(result.rows[0]);
  return user.toJSON();
};

// Atualizar nome ou e-mail (não senha)
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

// Deletar usuário
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
