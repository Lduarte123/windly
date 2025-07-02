require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dbInit = require('./db/dbInit');
const userRoutes = require('./routes/userRoutes');
const lembreteRoutes = require('./routes/lembreteRoutes');
const previsaoRoutes = require('./routes/previsaoRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const climaRoutes = require('./routes/climaRoutes');
const authRoutes = require('./routes/authRoutes');
const cidadeFavoritaRoutes = require('./routes/cidadeFavoritaRoutes');
const userConfigRoutes = require('./routes/userConfigRoutes');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.routes();
  }

  configureMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }

  routes() {
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/lembretes', lembreteRoutes);
    this.app.use('/api/weather', previsaoRoutes);
    this.app.use('/api/clima_atual', climaRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/cidades-favoritas', cidadeFavoritaRoutes);
    this.app.use('/api/user-config', userConfigRoutes);

    this.app.get('/', (req, res) => {
      res.redirect('/api-docs');
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    });
  }

  async initDb() {
    try {
      await dbInit();
      console.log('[DB] Tabelas criadas com sucesso!');
    } catch (err) {
      console.error('[DB] Erro ao criar a tabela:', err);
    }
  }
}

if (require.main === module) {
  const server = new Server();
  server.initDb().then(() => {
    const PORT = process.env.PORT || 3000;
    server.app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  });
}

module.exports = Server;
