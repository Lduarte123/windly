const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { sendLoginNotification } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';

// Guardar os códigos 2FA temporariamente (em produção use Redis ou banco)
const twoFACodes = {};

const loginStepOne = async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  const code = Math.floor(100000 + Math.random() * 900000);
  const expires = Date.now() + 5 * 60 * 1000;

  twoFACodes[email] = { code, expires };

  await sendLoginNotification(email, `Seu código de verificação é: <strong>${code}</strong>`);

  res.json({ message: 'Código 2FA enviado por e-mail' });
};

const verify2FA = async (req, res) => {
  const { email, code } = req.body;
  const saved = twoFACodes[email];

  if (!saved || Date.now() > saved.expires || parseInt(code) !== saved.code) {
    return res.status(401).json({ error: 'Código inválido ou expirado' });
  }

  delete twoFACodes[email];

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ message: 'Login autorizado', token, user });
};

module.exports = { loginStepOne, verify2FA };
