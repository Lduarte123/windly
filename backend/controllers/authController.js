const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginNotification } = require('../services/emailService');
const UserService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET;
const CODE_EXPIRATION_MINUTES = 5;

const twoFACodes = {};

// Controle de tentativas de login
const loginAttempts = {};
const MAX_ATTEMPTS = 5; // máximo de tentativas
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

async function sendAlertEmail(email, message) {
  try {
    await sendLoginNotification(email, message);
  } catch (err) {
    console.error('Erro ao enviar e-mail de alerta:', err);
  }
}

async function handleFailedAttempt(email, res) {
  if (loginAttempts[email].count >= MAX_ATTEMPTS) {
    loginAttempts[email].blockedUntil = Date.now() + BLOCK_TIME_MS;

    await sendAlertEmail(
      email,
      `⚠️ Detectamos várias tentativas malsucedidas de acesso à sua conta.
      Por segurança, o login foi temporariamente bloqueado por ${BLOCK_TIME_MS / 60000} minutos.`
    );

    return res.status(429).json({ error: `Muitas tentativas falhas. Tente novamente em 15 minutos.` });
  }

  // Enviar alerta na primeira (ou outras) tentativas falhas
  if (loginAttempts[email].count === 1) {
    await sendAlertEmail(
      email,
      `⚠️ Detectamos uma tentativa de login malsucedida na sua conta.
      Se não foi você, recomendamos alterar sua senha imediatamente.`
    );
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
}

const loginStepOne = async (req, res) => {
  const { email, password } = req.body;
  const now = Date.now();

  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, blockedUntil: 0 };
  }

  if (now < loginAttempts[email].blockedUntil) {
    const minutesLeft = Math.ceil((loginAttempts[email].blockedUntil - now) / 60000);
    return res.status(429).json({ error: `Muitas tentativas falhas. Tente novamente em ${minutesLeft} minutos.` });
  }

  const user = await UserService.getUserByEmail(email);
  if (!user) {
    loginAttempts[email].count++;
    return await handleFailedAttempt(email, res);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    loginAttempts[email].count++;
    return await handleFailedAttempt(email, res);
  }

  // Reset contador se login correto
  loginAttempts[email] = { count: 0, blockedUntil: 0 };

  // Envio de código 2FA
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000;

  twoFACodes[email] = { code, expires };

  await sendLoginNotification(
    email,
    `Seu código de verificação é: <strong>${code}</strong>.<br>Ele expira em ${CODE_EXPIRATION_MINUTES} minutos.`
  );

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

  const user = await UserService.getUserByEmail(email);

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ message: 'Login autorizado', token, user });
};

module.exports = { loginStepOne, verify2FA };
