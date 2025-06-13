require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const profissionalRoutes = require('./routes/profissionalRoutes');
const dbInit = require('./db/dbInit');
const userRoutes = require('./routes/userRoutes');
const lembreteRoutes = require('./routes/lembreteRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.configureMiddlewares();
    this.routes();
    this.initDb();
  }

  configureMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }

  routes() {
  // Rotas da aplicação
  this.app.use('/api/profissionais', profissionalRoutes);
  this.app.use('/api/users', userRoutes);
  this.app.use('/api/lembretes', lembreteRoutes);

  // Rota raiz
  this.app.get('/', (req, res) => {
    res.send('API de Profissionais está funcionando!');
  });
this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


  // Middleware de erro
  this.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  });
}


  async initDb() {
    try {
      await dbInit();
      console.log('Tabela criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela: ', err);
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }
}

module.exports = Server;
