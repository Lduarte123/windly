// db/index.js
require('dotenv').config(); // Carrega variáveis de ambiente do .env

const { Pool } = require('pg'); // Módulo para conexão PostgreSQL

let pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Necessário para serviços como NeonDB
    },
  });
  console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
} catch (error) {
  console.error('❌ Erro ao conectar ao banco de dados:', error.message);
  process.exit(1); // Encerra a aplicação em caso de falha de conexão
}

// Função para executar queries
const query = (text, params) => pool.query(text, params);

module.exports = { query };
