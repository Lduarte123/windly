const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("A variável MONGODB_URI não está definida no arquivo .env");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro de conexão com o MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
