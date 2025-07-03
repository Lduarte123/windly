const Server = require('./server');

async function start() {
  const server = new Server();
  await server.initDb();

  const PORT = process.env.PORT || 3000;
  server.app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

start().catch(err => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
