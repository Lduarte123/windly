// db/dbInit.js
const db = require('./db'); // Importa a conexão com o banco de dados

// Script SQL para criar as tabelas profissional e cidade_favorita
const createTable = async () => {
  // Verifica se a tabela profissional existe
  const checkProfissionalTableQuery = `SELECT to_regclass('public.profissional');`;
  // Verifica se a tabela cidade_favorita existe
  const checkCidadeFavoritaTableQuery = `SELECT to_regclass('public.cidade_favorita');`;

  try {
    // Profissional
    const resultProfissional = await db.query(checkProfissionalTableQuery);
    if (resultProfissional.rows[0].to_regclass === null) {
      const createProfissionalQuery = `
        CREATE TABLE profissional (
          matricula SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          profissao VARCHAR(255) NOT NULL,
          salario DECIMAL(10, 2) NOT NULL,
          setor VARCHAR(255) NOT NULL,
          cidade VARCHAR(255) NOT NULL,
          estado CHAR(2) NOT NULL
        );
      `;
      await db.query(createProfissionalQuery);
      console.log('Tabela "profissional" criada com sucesso!');
    } else {
      console.log('Tabela "profissional" já existe.');
    }

    // Cidade Favorita
    const resultCidadeFavorita = await db.query(checkCidadeFavoritaTableQuery);
    if (resultCidadeFavorita.rows[0].to_regclass === null) {
      const createCidadeFavoritaQuery = `
        CREATE TABLE cidade_favorita (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL
        );
      `;
      await db.query(createCidadeFavoritaQuery);
      console.log('Tabela "cidade_favorita" criada com sucesso!');
    } else {
      console.log('Tabela "cidade_favorita" já existe.');
    }

  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message);
  }
};

module.exports = createTable;
