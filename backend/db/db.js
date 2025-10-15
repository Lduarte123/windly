// db/index.js
require('dotenv').config(); // Carrega variáveis de ambiente do .env
const { Pool } = require('pg'); // Módulo para conexão PostgreSQL

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres', // atenção ao nome da variável
  database: process.env.DB_NAME || 'postgres',
});

pool.on('connect', () => {
  console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
});

pool.on('error', (err) => {
  console.error('❌ Erro com o pool do banco de dados:', err.message);
  process.exit(1);
});

// Função para executar queries
const query = (text, params) => pool.query(text, params);

module.exports = { query };
