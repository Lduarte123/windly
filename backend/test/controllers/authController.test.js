const { loginStepOne, verify2FA } = require('../../controllers/authController');
const UserService = require('../../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock das dependências
jest.mock('../../services/userService');
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
    
    // Limpar códigos 2FA entre testes
    global.twoFACodes = {};
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
      mockReq.body = { email: 'expired@test.com', code: '123456' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });

    it('deve retornar erro se código estiver incorreto', async () => {
      mockReq.body = { email: 'wrong@test.com', code: '654321' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });

    it('deve retornar token se código estiver correto', async () => {
      mockReq.body = { email: 'success@test.com', code: '123456' };

      await verify2FA(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum código gerado para este e-mail. Faça login novamente.'
      });
    });
  });
});
