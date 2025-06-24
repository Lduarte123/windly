const db = require('./db'); // Importa a conexão com o banco de dados

// Script SQL para criar as tabelas users e cidade_favorita
const createTable = async () => {
  // Verifica se a tabela users existe
  const checkUsersTableQuery = `SELECT to_regclass('public.users');`;
  // Verifica se a tabela cidade_favorita existe
  const checkCidadeFavoritaTableQuery = `SELECT to_regclass('public.cidade_favorita');`;
  // Verifica se a tabela lembrete existe
  const checkLembreteTableQuery = `SELECT to_regclass('public.lembrete');`;
  // Verifica se a tabela user_config existe
  const checkUserConfigTableQuery = `SELECT to_regclass('public.user_config');`;

  try {
    // Users (Cadastro/Login)
    const resultUsers = await db.query(checkUsersTableQuery);
    if (resultUsers.rows[0].to_regclass === null) {
      const createUsersQuery = `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await db.query(createUsersQuery);
      console.log('Tabela "users" criada com sucesso!');
    } else {
      console.log('Tabela "users" já existe.');
    }

    // Cidade Favorita
    const resultCidadeFavorita = await db.query(checkCidadeFavoritaTableQuery);
    if (resultCidadeFavorita.rows[0].to_regclass === null) {
      const createCidadeFavoritaQuery = `
        CREATE TABLE cidade_favorita (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          usuario_id INTEGER NOT NULL REFERENCES users(id)
        );
      `;
      await db.query(createCidadeFavoritaQuery);
      console.log('Tabela "cidade_favorita" criada com sucesso!');
    } else {
      console.log('Tabela "cidade_favorita" já existe.');
    }

    // Lembrete
    const resultLembrete = await db.query(checkLembreteTableQuery);
    if (resultLembrete.rows[0].to_regclass === null) {
      const createLembreteQuery = `
        CREATE TABLE lembrete (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await db.query(createLembreteQuery);
      console.log('Tabela "lembrete" criada com sucesso!');
    } else {
      console.log('Tabela "lembrete" já existe.');
    }

    // Configuração do usuário
    const resultUserConfig = await db.query(checkUserConfigTableQuery);
    if (resultUserConfig.rows[0].to_regclass === null) {
      const createUserConfigQuery = `
        CREATE TABLE user_config (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          temp_unit VARCHAR(10) DEFAULT 'C',
          pressure_unit VARCHAR(10) DEFAULT 'hPa',
          wind_unit VARCHAR(10) DEFAULT 'm/s',
          notifications_enabled BOOLEAN DEFAULT true
        );
      `;
      await db.query(createUserConfigQuery);
      console.log('Tabela "user_config" criada com sucesso!');
    } else {
      console.log('Tabela "user_config" já existe.');
    }

  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message);
  }
};

module.exports = createTable;
