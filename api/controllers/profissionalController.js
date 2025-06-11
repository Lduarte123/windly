const ProfissionalService = require('../services/profissionalService');

class ProfissionalController {
  // Buscar todos os profissionais
  async getAll(req, res) {
    try {
      const profissionais = await ProfissionalService.getAll();
      res.status(200).json(profissionais);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      res.status(500).json({ error: 'Erro ao buscar profissionais.' });
    }
  }

  // Buscar por matrícula
  async getById(req, res) {
    try {
      const { matricula } = req.params;
      const profissional = await ProfissionalService.getById(matricula);

      if (!profissional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      res.status(200).json(profissional);
    } catch (error) {
      console.error('Erro ao buscar profissional por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar profissional.' });
    }
  }

  // Criar profissional
  async create(req, res) {
    try {
      const dados = req.body;
      const novoProfissional = await ProfissionalService.create(dados);
      res.status(201).json({ message: 'Profissional criado', data: novoProfissional });
    } catch (error) {
      console.error('Erro ao criar profissional:', error);
      res.status(500).json({ error: 'Erro ao criar profissional.' });
    }
  }

  // Atualizar profissional
  async update(req, res) {
    try {
      const { matricula } = req.params;
      const dados = req.body;
      const profissionalAtualizado = await ProfissionalService.update(matricula, dados);

      if (!profissionalAtualizado) {
        return res.status(404).json({ error: 'Profissional não encontrado para atualizar.' });
      }

      res.status(200).json({ message: 'Profissional atualizado', data: profissionalAtualizado });
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      res.status(500).json({ error: 'Erro ao atualizar profissional.' });
    }
  }

  // Remover profissional
  async remove(req, res) {
    try {
      const { matricula } = req.params;
      const resultado = await ProfissionalService.remove(matricula);

      if (!resultado) {
        return res.status(404).json({ error: 'Profissional não encontrado para remover.' });
      }

      res.status(200).json({ message: 'Profissional removido com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover profissional:', error);
      res.status(500).json({ error: 'Erro ao remover profissional.' });
    }
  }
}

module.exports = new ProfissionalController();
