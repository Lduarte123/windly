const { loginStepOne, verify2FA } = require('../../controllers/authController');
const UserService = require('../../services/userService');
const { sendLoginNotification } = require('../../services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock das dependências
jest.mock('../../services/userService');
jest.mock('../../services/emailService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    
    // Limpar mocks
    jest.clearAllMocks();
    
    // Mock do emailService
    sendLoginNotification.mockResolvedValue();
  });

  describe('loginStepOne', () => {
    it('deve retornar erro se email não for fornecido', async () => {
      mockReq.body = { password: '123456' };

      await loginStepOne(mockReq, mockRes);

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(undefined);
    });

    it('deve retornar erro se usuário não existir', async () => {
      mockReq.body = { email: 'test@test.com', password: '123456' };
      UserService.getUserByEmail.mockResolvedValue(null);

      await loginStepOne(mockReq, mockRes);

      expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('deve retornar erro se senha estiver incorreta', async () => {
      mockReq.body = { email: 'test@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await loginStepOne(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed_password');
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('deve enviar código 2FA se credenciais estiverem corretas', async () => {
      mockReq.body = { email: 'test@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed_password');
      expect(sendLoginNotification).toHaveBeenCalledWith(
        'test@test.com',
        expect.stringContaining('Seu código de verificação é:')
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Código 2FA enviado')
        })
      );
    });

    it('deve bloquear login após muitas tentativas falhas', async () => {
      mockReq.body = { email: 'blocked@test.com', password: 'wrong' };
      UserService.getUserByEmail.mockResolvedValue(null);

      // Simular 5 tentativas falhas
      for (let i = 0; i < 5; i++) {
        await loginStepOne(mockReq, mockRes);
      }

      // 6ª tentativa deve ser bloqueada
      await loginStepOne(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Muitas tentativas falhas. Tente novamente em 15 minutos.'
      });
    });

    it('deve retornar erro de bloqueio se usuário estiver bloqueado', async () => {
      mockReq.body = { email: 'blocked@test.com', password: 'wrong' };
      UserService.getUserByEmail.mockResolvedValue(null);

      // Simular 5 tentativas falhas para bloquear o usuário
      for (let i = 0; i < 5; i++) {
        await loginStepOne(mockReq, mockRes);
      }

      // 6ª tentativa deve ser bloqueada
      await loginStepOne(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Muitas tentativas falhas')
        })
      );
    });

    it('deve enviar alerta na primeira tentativa falha', async () => {
      mockReq.body = { email: 'alert@test.com', password: 'wrong' };
      UserService.getUserByEmail.mockResolvedValue(null);

      await loginStepOne(mockReq, mockRes);

      expect(sendLoginNotification).toHaveBeenCalledWith(
        'alert@test.com',
        expect.stringContaining('Detectamos uma tentativa de login malsucedida')
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('deve resetar contador de tentativas em login bem-sucedido', async () => {
      mockReq.body = { email: 'reset@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'reset@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Código 2FA enviado')
        })
      );
    });
  });

  describe('verify2FA', () => {
    it('deve retornar erro se não houver código gerado', async () => {
      mockReq.body = { email: 'noCode@test.com', code: '123456' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });

    it('deve retornar erro se código estiver expirado', async () => {
      // Primeiro, gerar um código válido através do loginStepOne
      const loginReq = { body: { email: 'expired@test.com', password: '123456' } };
      const loginRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const mockUser = { id: 1, email: 'expired@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(loginReq, loginRes);

      // Agora simular que o código expirou (avançar o tempo)
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 6 * 60 * 1000); // 6 minutos depois

      mockReq.body = { email: 'expired@test.com', code: '123456' };
      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Código expirado. Solicite um novo login.'
      });

      // Restaurar Date.now
      Date.now = originalDateNow;
    });

    it('deve retornar erro se código estiver incorreto', async () => {
      // Primeiro, gerar um código válido através do loginStepOne
      const loginReq = { body: { email: 'wrong@test.com', password: '123456' } };
      const loginRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const mockUser = { id: 1, email: 'wrong@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(loginReq, loginRes);

      // Tentar com código incorreto
      mockReq.body = { email: 'wrong@test.com', code: '654321' };
      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Código inválido.'
      });
    });

    it('deve retornar token se código estiver correto', async () => {
      // Primeiro, gerar um código válido através do loginStepOne
      const loginReq = { body: { email: 'success@test.com', password: '123456' } };
      const loginRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const mockUser = { id: 1, name: 'Test User', email: 'success@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(loginReq, loginRes);

      // Agora verificar o código 2FA
      mockReq.body = { email: 'success@test.com', code: '123456' };
      jwt.sign.mockReturnValue('mock-jwt-token');

      await verify2FA(mockReq, mockRes);

      expect(UserService.getUserByEmail).toHaveBeenCalledWith('success@test.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, name: 'Test User', email: 'success@test.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login autorizado',
        token: 'mock-jwt-token',
        user: mockUser
      });
    });

    it('deve retornar erro se email não for fornecido', async () => {
      mockReq.body = { code: '123456' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });

    it('deve retornar erro se código não for fornecido', async () => {
      mockReq.body = { email: 'test@test.com' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });
  });

  describe('Email Alert Functionality', () => {
    it('deve enviar alerta de bloqueio após 5 tentativas falhas', async () => {
      mockReq.body = { email: 'blocked@test.com', password: 'wrong' };
      UserService.getUserByEmail.mockResolvedValue(null);

      // Simular 5 tentativas falhas
      for (let i = 0; i < 5; i++) {
        await loginStepOne(mockReq, mockRes);
      }

      // Verificar se o alerta de bloqueio foi enviado
      expect(sendLoginNotification).toHaveBeenCalledWith(
        'blocked@test.com',
        expect.stringContaining('Detectamos várias tentativas malsucedidas')
      );
    });

    it('deve lidar com erro no envio de email de alerta', async () => {
      mockReq.body = { email: 'error@test.com', password: 'wrong' };
      UserService.getUserByEmail.mockResolvedValue(null);
      
      // Simular erro no envio de email
      sendLoginNotification.mockRejectedValueOnce(new Error('Email service error'));

      await loginStepOne(mockReq, mockRes);

      // Deve continuar funcionando mesmo com erro no email
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('deve enviar alerta de login bem-sucedido', async () => {
      mockReq.body = { email: 'success@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'success@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginStepOne(mockReq, mockRes);

      expect(sendLoginNotification).toHaveBeenCalledWith(
        'success@test.com',
        expect.stringContaining('Seu código de verificação é:')
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('deve lidar com erro no UserService.getUserByEmail', async () => {
      mockReq.body = { email: 'error@test.com', password: '123456' };
      UserService.getUserByEmail.mockRejectedValue(new Error('Database error'));

      await expect(loginStepOne(mockReq, mockRes)).rejects.toThrow('Database error');
    });

    it('deve lidar com erro no bcrypt.compare', async () => {
      mockReq.body = { email: 'error@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'error@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await expect(loginStepOne(mockReq, mockRes)).rejects.toThrow('Bcrypt error');
    });

    it('deve lidar com erro no envio de email durante login', async () => {
      mockReq.body = { email: 'error@test.com', password: '123456' };
      const mockUser = { id: 1, email: 'error@test.com', password: 'hashed_password' };
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      sendLoginNotification.mockRejectedValue(new Error('Email error'));

      await expect(loginStepOne(mockReq, mockRes)).rejects.toThrow('Email error');
    });
  });
});
