const CidadeFavoritaService = require('../services/cidadeFavoritaService');

class CidadeFavoritaController {
  async getAllByUser(req, res, next) {
    try {
      const { usuario_id } = req.params;
      const cidades = await CidadeFavoritaService.getAllByUser(usuario_id);
      res.status(200).json(cidades);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { usuario_id } = req.query;
      const cidade = await CidadeFavoritaService.getByUserId(id, usuario_id);
      if (!cidade) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json(cidade);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { nome, usuario_id } = req.body;
      const novaCidade = await CidadeFavoritaService.create({ nome, usuario_id });
      res.status(201).json({ message: 'Cidade favorita criada', data: novaCidade });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const { usuario_id } = req.body;
      const removida = await CidadeFavoritaService.remove(id, usuario_id);
      if (!removida) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json({ message: 'Cidade favorita removida.' });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, usuario_id } = req.body;
      const atualizada = await CidadeFavoritaService.update(id, usuario_id, nome);
      if (!atualizada) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json({ message: 'Cidade favorita atualizada', data: atualizada });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CidadeFavoritaController();