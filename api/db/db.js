import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = toString(process.env.MONGO_URI);
console.log(mongoURI)

export async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

connectDB();