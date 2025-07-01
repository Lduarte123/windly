// api/index.js
const Server = require('../server');

let serverApp;

module.exports = async (req, res) => {
  if (!serverApp) {
    const server = new Server();
    await server.initDb();  // Inicializa DB se necessário
    serverApp = server.app;
  }

  return serverApp(req, res);  // Passa o request/response para o Express
};
