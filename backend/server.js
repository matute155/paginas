require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const propertyRoutes = require('./routes/properties');

const app = express();

// =====================
// 1) Middleware CORS
// =====================
const allowedOrigins = [
  'https://www.desdeaca.com',
  'https://desdeaca.com',
  'https://tudominio.vercel.app',
  'http://localhost:3000',
  // Add your Vercel domain here
  process.env.FRONTEND_URL,
  // Allow all Vercel preview deployments
  /^https:\/\/.*\.vercel\.app$/
];
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      return cb(null, true);
    }
    
    console.warn('CORS DENIED for origin:', origin);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());

// =====================
// 2) Rutas
// =====================
app.use('/api/properties', propertyRoutes);
app.get('/', (_req, res) => {
  res.send('Backend funcionando correctamente');
});

// =====================
// 3) Health Check
//    Responde rápido a cualquier método
// =====================
app.all('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// =====================
// 4) Levantar servidor YA
// =====================
const PORT = process.env.PORT || 8080;
console.log('🖥️  Puerto usado por Express:', PORT);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

// =====================
// 5) Conexión a DB en background
// =====================
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a Postgres');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
  } catch (err) {
    console.error('❌ Error DB:', err);
  }
})();

// =====================
// 6) Graceful shutdown handling
// =====================
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor gracefully...`);
  
  server.close(async () => {
    console.log('✅ Servidor HTTP cerrado');
    
    try {
      await sequelize.close();
      console.log('✅ Conexión a base de datos cerrada');
    } catch (err) {
      console.error('❌ Error cerrando DB:', err);
    }
    
    console.log('✅ Proceso terminado gracefully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forzando cierre después de 10 segundos');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});
