const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rainRoutes = require('./routes/rainRoutes');
require('./config/dbInit');
const morgan = require('morgan'); // Adicione esta linha

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(morgan('dev')); // Adicione esta linha para logar as requisições

app.use('/api', rainRoutes);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
