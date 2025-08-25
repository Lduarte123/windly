const db = require('../db/db');
const Profissional = require('../models/profissionalModel');

class ProfissionalRepository {
  // Método para buscar todos os profissionais
  async findAll() {
    const result = await db.query('SELECT * FROM profissional');
    return result.rows.map(row => new Profissional(row));  // Retorna um array de objetos Profissional
  }

  // Método para buscar um profissional por ID
  async findById(id) {
    const result = await db.query('SELECT * FROM profissional WHERE matricula = $1', [id]);
    return result.rows[0] ? new Profissional(result.rows[0]) : null;  // Retorna um objeto Profissional ou null
  }

  // Método para criar um novo profissional
  async create({ nome, profissao, salario, setor, cidade, estado }) {
    const result = await db.query(
      'INSERT INTO profissional (nome, profissao, salario, setor, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, profissao, salario, setor, cidade, estado]
    );
    return new Profissional(result.rows[0]);  // Retorna uma instância de Profissional
  }

  // Método para atualizar um profissional
  async update(id, { nome, profissao, salario, setor, cidade, estado }) {
    const result = await db.query(
      'UPDATE profissional SET nome=$1, profissao=$2, salario=$3, setor=$4, cidade=$5, estado=$6 WHERE matricula=$7 RETURNING *',
      [nome, profissao, salario, setor, cidade, estado, id]
    );
    return new Profissional(result.rows[0]);  // Retorna a instância atualizada de Profissional
  }

  // Método para remover um profissional
  async remove(id) {
    const result = await db.query('DELETE FROM profissional WHERE matricula = $1 RETURNING *', [id]);
    return result.rows[0] ? new Profissional(result.rows[0]) : null;  // Retorna o profissional deletado ou null
  }
}

module.exports = new ProfissionalRepository();  // Exporte uma instância única da classe
