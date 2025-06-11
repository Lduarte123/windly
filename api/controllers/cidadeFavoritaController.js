const CidadeFavoritaService = require('../services/cidadeFavoritaService');

class CidadeFavoritaController {
  async getAll(req, res) {
    try {
      const cidades = await CidadeFavoritaService.getAll();
      res.status(200).json(cidades);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cidades favoritas.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const cidade = await CidadeFavoritaService.getById(id);
      if (!cidade) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json(cidade);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cidade favorita.' });
    }
  }

  async create(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
      const novaCidade = await CidadeFavoritaService.create({ nome });
      res.status(201).json({ message: 'Cidade favorita criada', data: novaCidade });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cidade favorita.' });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const removida = await CidadeFavoritaService.remove(id);
      if (!removida) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json({ message: 'Cidade favorita removida.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover cidade favorita.' });
    }
  }
}

module.exports = new CidadeFavoritaController();