const express = require('express');
const controller = require('../controllers/cidadeFavoritaController');
const cidadeFavoritaRoutes = require('./routes/cidadeFavoritaRoutes');

class CidadeFavoritaRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/', controller.getAll);
    this.router.get('/:id', controller.getById);
    this.router.post('/', controller.create);
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new CidadeFavoritaRoutes().getRouter();

this.app.use('/api/cidades-favoritas', cidadeFavoritaRoutes);