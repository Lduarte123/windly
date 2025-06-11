const express = require('express');
const controller = require('../controllers/profissionalController');
const ValidateProfissional = require('../middleware/validateProfissional');  // Importe a classe

class ProfissionalRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // Verifique se o ValidateProfissional.validate está sendo referenciado corretamente
    this.router.get('/', controller.getAll);
    this.router.get('/:matricula', controller.getById);
    this.router.post('/', ValidateProfissional.validate, controller.create);  // Middleware de validação
    this.router.put('/:matricula', ValidateProfissional.validate, controller.update);  // Middleware de validação
    this.router.delete('/:matricula', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new ProfissionalRoutes().getRouter();
