const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busque o usuário completo, incluindo a senha
    const dbUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!dbUser.rows[0]) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const valid = await bcrypt.compare(password, dbUser.rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    // Não envie a senha no token!
    const token = jwt.sign(
      { id: dbUser.rows[0].id, name: dbUser.rows[0].name, email: dbUser.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: dbUser.rows[0].id, name: dbUser.rows[0].name, email: dbUser.rows[0].email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { login };