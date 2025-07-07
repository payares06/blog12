const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      if (this.connection) {
        console.log('✅ Using existing database connection');
        return this.connection;
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      // Usar la URI de MongoDB desde las variables de entorno
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mypersonalblog';
      
      this.connection = await mongoose.connect(mongoUri, options);
      
      console.log('✅ Connected to MongoDB successfully');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      console.log(`🌐 Host: ${this.connection.connection.host}`);
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('🔄 Intentando conectar a MongoDB local...');
      
      // Fallback a MongoDB local
      try {
        const localUri = 'mongodb://localhost:27017/mypersonalblog';
        this.connection = await mongoose.connect(localUri, options);
        console.log('✅ Connected to local MongoDB');
        return this.connection;
      } catch (localError) {
        console.error('❌ Local MongoDB connection failed:', localError.message);
        console.log('💡 Asegúrate de que MongoDB esté ejecutándose localmente');
        process.exit(1);
      }
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        console.log('🔌 Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = new Database();