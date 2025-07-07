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

      // Configuración actualizada para MongoDB (sin opciones deprecadas)
      const options = {
        // Configuraciones de conexión modernas
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Usar IPv4
      };

      // Intentar conectar con la URI principal
      let mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        console.log('⚠️  No se encontró MONGODB_URI, usando MongoDB local...');
        mongoUri = 'mongodb://127.0.0.1:27017/mypersonalblog';
      }

      console.log('🔄 Conectando a MongoDB...');
      
      this.connection = await mongoose.connect(mongoUri, options);
      
      console.log('✅ Connected to MongoDB successfully');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      console.log(`🌐 Host: ${this.connection.connection.host}`);
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      
      // Si falla la conexión principal, intentar con MongoDB local
      if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')) {
        console.log('🔄 Intentando conectar a MongoDB local como fallback...');
        
        try {
          const localUri = 'mongodb://127.0.0.1:27017/mypersonalblog';
          const localOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
          };
          
          this.connection = await mongoose.connect(localUri, localOptions);
          console.log('✅ Connected to local MongoDB');
          return this.connection;
        } catch (localError) {
          console.error('❌ Local MongoDB connection failed:', localError.message);
          console.log('\n💡 SOLUCIONES POSIBLES:');
          console.log('1. Instalar MongoDB localmente: https://www.mongodb.com/try/download/community');
          console.log('2. Usar MongoDB Atlas (nube): https://www.mongodb.com/atlas');
          console.log('3. Usar Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
          console.log('\n🔧 Para instalar MongoDB en Windows:');
          console.log('   - Descargar desde: https://www.mongodb.com/try/download/community');
          console.log('   - Ejecutar como servicio de Windows');
          console.log('   - O usar MongoDB Compass para gestión visual\n');
          
          process.exit(1);
        }
      } else {
        console.log('\n💡 SOLUCIONES POSIBLES:');
        console.log('1. Instalar MongoDB localmente: https://www.mongodb.com/try/download/community');
        console.log('2. Usar MongoDB Atlas (nube): https://www.mongodb.com/atlas');
        console.log('3. Usar Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
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