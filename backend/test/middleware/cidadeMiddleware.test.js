// __tests__/cidadeMiddleware.test.js
const {
  validateUsuarioIdInQuery,
  validateUsuarioIdInBody,
  validateNomeAndUsuarioIdInBody,
} = require('../../middleware/cidadeMiddleware'); // ajuste o caminho correto

describe('cidadeMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // ------------------------
  // validateUsuarioIdInQuery
  // ------------------------
  describe('validateUsuarioIdInQuery', () => {
    it('deve retornar 400 se usuario_id não for fornecido na query', () => {
      validateUsuarioIdInQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'usuario_id é obrigatório.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se usuario_id estiver presente na query', () => {
      req.query.usuario_id = '123';

      validateUsuarioIdInQuery(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // ------------------------
  // validateUsuarioIdInBody
  // ------------------------
  describe('validateUsuarioIdInBody', () => {
    it('deve retornar 400 se usuario_id não for fornecido no body', () => {
      validateUsuarioIdInBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'usuario_id é obrigatório.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se usuario_id estiver presente no body', () => {
      req.body.usuario_id = '456';

      validateUsuarioIdInBody(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------
  // validateNomeAndUsuarioIdInBody
  // -----------------------------------
  describe('validateNomeAndUsuarioIdInBody', () => {
    it('deve retornar 400 se nome ou usuario_id não forem fornecidos', () => {
      validateNomeAndUsuarioIdInBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome e usuario_id são obrigatórios.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se nome e usuario_id estiverem presentes no body', () => {
      req.body = { nome: 'Fortaleza', usuario_id: '789' };

      validateNomeAndUsuarioIdInBody(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
