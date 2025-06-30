require('dotenv').config();
const express = require('express');
const figlet = require('figlet');
const cors = require('cors');
const morgan = require('morgan');
const dbInit = require('./db/dbInit');
const userRoutes = require('./routes/userRoutes');
const lembreteRoutes = require('./routes/lembreteRoutes');
const previsaoRoutes = require('./routes/previsaoRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const climaRoutes = require('./routes/climaRoutes')
const authRoutes = require('./routes/authRoutes');
const cidadeFavoritaRoutes = require('./routes/cidadeFavoritaRoutes');
const userConfigRoutes = require('./routes/userConfigRoutes');
const os = require('os');

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
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/lembretes', lembreteRoutes);
    this.app.use('/api/weather', previsaoRoutes);
    this.app.use('/api/clima_atual', climaRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/cidades-favoritas', cidadeFavoritaRoutes);
    this.app.use('/api/user-config', userConfigRoutes);

    // Rota raiz
    this.app.get('/', (req, res) => {
      res.redirect('/api-docs')
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
    } catch (err) {
      console.error('\x1b[31m\x1b[37m\x1b[1m[DB] Erro ao criar a tabela:\x1b[0m', err);
    }
  }

  start() {
    figlet('Windly API', (err, data) => {
      if (err) {
        console.log('\x1b[31m\x1b[37mErro ao gerar ASCII art\x1b[0m');
        return;
      }

      console.log('\x1b[32m' + data + '\x1b[0m');

      console.log(
        '\n\x1b[35m[SERVIÇO DE EMAIL]\x1b[0m',
        '\n',
        '\x1b[35mSERVICE:\x1b[0m', process.env.EMAIL_SERVICE,
        '\n',
        '\x1b[35mUSER:\x1b[0m', process.env.EMAIL_USER,
        '\n',
        '\x1b[35mPASS:\x1b[0m', process.env.EMAIL_PASS ? '***' : 'NÃO DEFINIDO',
        '\n'
      );

      // Aguarda o dbInit terminar para mostrar os destaques juntos
      this.initDb().then(() => {
        console.log('\x1b[34m\x1b[37m\x1b[1m[DB] Inicialização concluída (veja mensagens acima)\x1b[0m');
        console.log('\x1b[34m\x1b[37m\x1b[1m[DB] Tabelas criadas com sucesso!\x1b[0m');

        // IPs locais
        const nets = os.networkInterfaces();
        let localIps = [];
        for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
              localIps.push(net.address);
            }
          }
        }
        const ipsMsg = localIps.length
          ? localIps.map(ip => `http://${ip}:${this.port}`).join('   ')
          : `http://localhost:${this.port}`;

        console.log(
          '\n\x1b[32m[API INICIADA]\x1b[0m',
          '\n',
          '\x1b[32mServidor rodando em:\x1b[0m',
          '\n',
          '\x1b[33m' + ipsMsg + '\x1b[0m',
          '\n',
          '\x1b[32mDocumentação Swagger:\x1b[0m',
          '\x1b[33m http://localhost:' + this.port + '/api-docs\x1b[0m',
          '\n'
        );

        this.app.listen(this.port, () => {});
      });
    });
  }
}

module.exports = Server;
