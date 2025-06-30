const LembreteService = require('../services/lembreteService');

class LembreteController {
  async getAllByUser(req, res) {
    try {
      const { usuario_id } = req.params;
      const lembretes = await LembreteService.getAllByUser(usuario_id);
      res.status(200).json(lembretes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar lembretes.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const lembrete = await LembreteService.getById(id);
      if (!lembrete) return res.status(404).json({ error: 'Lembrete não encontrado.' });
      res.status(200).json(lembrete);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar lembrete.' });
    }
  }

  async create(req, res) {
    try {
      const { usuario_id, titulo, descricao } = req.body;
      if (!usuario_id || !titulo) {
        return res.status(400).json({ error: 'usuario_id e titulo são obrigatórios.' });
      }
      const novoLembrete = await LembreteService.create({ usuario_id, titulo, descricao });
      res.status(201).json({ message: 'Lembrete criado', data: novoLembrete });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar lembrete.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao } = req.body;
      const lembreteAtualizado = await LembreteService.update(id, { titulo, descricao });
      if (!lembreteAtualizado) {
        return res.status(404).json({ error: 'Lembrete não encontrado para atualizar.' });
      }
      res.status(200).json({ message: 'Lembrete atualizado', data: lembreteAtualizado });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar lembrete.' });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const removido = await LembreteService.remove(id);
      if (!removido) return res.status(404).json({ error: 'Lembrete não encontrado.' });
      res.status(200).json({ message: 'Lembrete removido.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover lembrete.' });
    }
  }
}

module.exports = new LembreteController();