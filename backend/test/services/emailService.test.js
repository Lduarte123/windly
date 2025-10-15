// test/services/emailService.test.js
jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn().mockResolvedValue(true);
  return {
    createTransport: () => ({
      sendMail: sendMailMock,
    }),
    __sendMailMock: sendMailMock,
  };
});

const nodemailer = require('nodemailer');
const { sendLoginNotification, sendAdminNotification } = require('../../services/emailService');

describe('Email Service', () => {
  const sendMailMock = nodemailer.__sendMailMock;

  beforeEach(() => {
    sendMailMock.mockClear();
    process.env.EMAIL_USER = 'admin@example.com';
  });

  it('deve enviar e-mail de notificação de login com os parâmetros corretos', async () => {
    await sendLoginNotification('user@example.com', 'User');

    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      to: 'user@example.com',
      subject: 'Login realizado com sucesso!',
      html: expect.stringContaining('User'),
      from: `"Windly" <admin@example.com>`,
    }));
  });

  it('deve enviar e-mail administrativo com os parâmetros corretos', async () => {
    const subject = 'Alerta';
    const message = 'Mensagem de alerta';

    await sendAdminNotification(subject, message);

    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      to: 'admin@example.com',
      subject,
      html: `<p>${message}</p>`,
      from: `"Windly" <admin@example.com>`,
    }));
  });
});
