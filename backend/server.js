const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
// MongoDB bağlantısı ve Sunucu Başlatma
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kampus-sistemi';

    // Önce yerel MongoDB'yi dene
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB bağlantısı başarılı (Local)');
    } catch (localErr) {
      console.log('Yerel MongoDB bulunamadı, In-Memory DB deneniyor...');
      // Yerel başarısız olursa In-Memory dene
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB In-Memory bağlantısı başarılı');
      } catch (memErr) {
        console.error('MongoDB In-Memory başlatılamadı:', memErr.message);
        console.error('Lütfen MongoDB\'nin kurulu ve çalışır olduğundan emin olun veya npm install mongodb-memory-server çalıştırın.');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Sunucu başlatma hatası:', error);
  }
};

startServer();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

