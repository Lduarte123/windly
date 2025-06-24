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

  async getAllByUser(req, res) {
    try {
      const { usuario_id } = req.params;
      const cidades = await CidadeFavoritaService.getAllByUser(usuario_id);
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
      const { nome, usuario_id } = req.body;
      if (!nome || !usuario_id) return res.status(400).json({ error: 'Nome e usuario_id são obrigatórios.' });
      const novaCidade = await CidadeFavoritaService.create({ nome, usuario_id });
      res.status(201).json({ message: 'Cidade favorita criada', data: novaCidade });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cidade favorita.' });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const { usuario_id } = req.body;
      const removida = await CidadeFavoritaService.remove(id, usuario_id);
      if (!removida) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json({ message: 'Cidade favorita removida.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover cidade favorita.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, usuario_id } = req.body;
      if (!nome || !usuario_id) return res.status(400).json({ error: 'Nome e usuario_id são obrigatórios.' });
      const atualizada = await CidadeFavoritaService.update(id, usuario_id, nome);
      if (!atualizada) return res.status(404).json({ error: 'Cidade não encontrada.' });
      res.status(200).json({ message: 'Cidade favorita atualizada', data: atualizada });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar cidade favorita.' });
    }
  }
}

module.exports = new CidadeFavoritaController();