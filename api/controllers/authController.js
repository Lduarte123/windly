const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { sendLoginNotification } = require('../services/emailService'); // <-- importar o serviço de email

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!dbUser.rows[0]) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const valid = await bcrypt.compare(password, dbUser.rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    // Geração do token
    const token = jwt.sign(
      { id: dbUser.rows[0].id, name: dbUser.rows[0].name, email: dbUser.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Notificação por e-mail
    await sendLoginNotification(dbUser.rows[0].email, dbUser.rows[0].name);

    res.json({ token, user: { id: dbUser.rows[0].id, name: dbUser.rows[0].name, email: dbUser.rows[0].email } });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { login };
