const db = require('../db/db');
const Empresa = require('../models/empresaModel');  // Supondo que você tenha um modelo Empresa

class EmpresaRepository {
  // Método para buscar todas as empresas
  async findAll() {
    const result = await db.query('SELECT * FROM empresa');
    return result.rows.map(row => new Empresa(row));  // Retorna um array de objetos Empresa
  }

  // Método para buscar uma empresa por ID
  async findById(id) {
    const result = await db.query('SELECT * FROM empresa WHERE id = $1', [id]);
    return result.rows[0] ? new Empresa(result.rows[0]) : null;  // Retorna um objeto Empresa ou null
  }

  // Método para criar uma nova empresa
  async create({ nome, ramo, logradouro, cidade, estado }) {
    const result = await db.query(
      'INSERT INTO empresa (nome, ramo, logradouro, cidade, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, ramo, logradouro, cidade, estado]
    );
    return new Empresa(result.rows[0]);
  }

  // Método para atualizar uma empresa
  async update(id, { nome, ramo, logradouro, cidade, estado }) {
    const result = await db.query(
      'UPDATE empresa SET nome=$1, ramo=$2, logradouro=$3, cidade=$4, estado=$5 WHERE id=$6 RETURNING *',
      [nome, ramo, logradouro, cidade, estado, id]
    );
    return new Empresa(result.rows[0]);  // Retorna a instância atualizada de Empresa
  }

  // Método para remover uma empresa
  async remove(id) {
    const result = await db.query('DELETE FROM empresa WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ? new Empresa(result.rows[0]) : null;  // Retorna a empresa deletada ou null
  }
}

module.exports = new EmpresaRepository();  // Exporte uma instância única da classe
