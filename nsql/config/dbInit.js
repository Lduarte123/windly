const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URL || process.env.MONGODB_URI;
const dbName = 'dias_sem_chuva';
const collectionName = 'rain';

async function initDb() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);

    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      console.log("Tabela já criada.");
    } else {
      await db.createCollection(collectionName);
      console.log("Coleção 'rain' criada com sucesso.");
    }
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
  } finally {
    await client.close();
  }
}

initDb();