const Server = require('./server');

async function start() {
  const server = new Server();
  await server.initDb();

  const PORT = process.env.PORT || 3000;
  server.app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
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