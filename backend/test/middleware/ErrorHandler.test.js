// __tests__/ErrorHandler.test.js
const ErrorHandler = require('../../middleware/errorMiddleware'); // ajuste o caminho correto

describe('ErrorHandler middleware', () => {
  let err;
  let req;
  let res;
  let next;

  beforeEach(() => {
    err = new Error('Erro simulado');
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Espionar console.error para não poluir o terminal
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve logar o erro e retornar status 500 com a mensagem padrão', () => {
    ErrorHandler.handle(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith(err.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor.' });
    expect(next).not.toHaveBeenCalled();
  });
});
