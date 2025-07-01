const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginNotification } = require('../services/emailService');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';

const twoFACodes = {};

const loginStepOne = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.getUserByEmail(email);
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

  const user = await userRepository.getUserByEmail(email);

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ message: 'Login autorizado', token, user });
};

module.exports = { loginStepOne, verify2FA };
