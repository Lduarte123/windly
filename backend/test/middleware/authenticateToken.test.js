// __tests__/authenticateToken.test.js
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../middleware/authMiddleware'); // ajuste o caminho

jest.mock('jsonwebtoken');

describe('authenticateToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('deve retornar 401 se o token não for fornecido', () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o token for inválido', () => {
    req.headers['authorization'] = 'Bearer token_invalido';

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se o token for válido', () => {
    const fakeUser = { id: 1, name: 'Lucas' };
    req.headers['authorization'] = 'Bearer token_valido';

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, fakeUser);
    });

    authenticateToken(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
