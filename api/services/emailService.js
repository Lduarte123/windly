// services/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? '***' : 'NÃO DEFINIDO');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLoginNotification = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Seu App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Login realizado com sucesso!',
      html: `
        <p>Olá <strong>${name}</strong>,</p>
        <p>Detectamos um novo login na sua conta.</p>
        <p>Se não foi você, recomendamos alterar sua senha imediatamente.</p>
      `
    });

    console.log(`✅ E-mail enviado com sucesso para ${to}`);
  } catch (error) {
    console.error("❌ Erro ao enviar o e-mail:", error.message);
  }
};

const sendAdminNotification = async (subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Seu App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // envia para seu próprio email do .env
      subject,
      html: `<p>${message}</p>`
    });

    console.log(`✅ E-mail administrativo enviado: ${subject}`);
  } catch (error) {
    console.error("❌ Erro no envio do e-mail administrativo:", error.message);
  }
};

module.exports = { sendLoginNotification, sendAdminNotification };
