// __tests__/validateUser.test.js
const validateUser = require('../../middleware/validateUser'); // ajuste o caminho correto

describe('validateUser middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve retornar 400 se algum campo estiver faltando', () => {
    // falta name, email e password
    validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Todos os campos são obrigatórios.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se apenas alguns campos forem fornecidos', () => {
    req.body = { name: 'Lucas', email: '' }; // password faltando
    validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Todos os campos são obrigatórios.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se todos os campos forem fornecidos', () => {
    req.body = { name: 'Lucas', email: 'lucas@email.com', password: '123456' };

    validateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
