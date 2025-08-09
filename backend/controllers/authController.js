const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginNotification } = require('../services/emailService');
const UserService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET;
const CODE_EXPIRATION_MINUTES = 5;

const twoFACodes = {};

const loginStepOne = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserService.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000;

  twoFACodes[email] = { code, expires };

  await sendLoginNotification(email, `Seu código de verificação é: <strong>${code}</strong>.<br>Ele expira em ${CODE_EXPIRATION_MINUTES} minutos.`);

  res.json({ message: `Código 2FA enviado para o e-mail. Ele expira em ${CODE_EXPIRATION_MINUTES} minutos.` });
};

const verify2FA = async (req, res) => {
  const { email, code } = req.body;
  const saved = twoFACodes[email];

  if (!saved) {
    return res.status(401).json({ error: 'Nenhum código gerado para este e-mail. Faça login novamente.' });
  }

  if (Date.now() > saved.expires) {
    delete twoFACodes[email];
    return res.status(401).json({ error: 'Código expirado. Solicite um novo login.' });
  }

  if (code !== saved.code) {
    return res.status(401).json({ error: 'Código inválido.' });
  }

  delete twoFACodes[email];

  const user = await userRepository.getUserByEmail(email);

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ message: 'Login autorizado', token, user });
};

module.exports = { loginStepOne, verify2FA };
