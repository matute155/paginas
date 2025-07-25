require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();

// =====================
// 1) Configuración CORS (Actualizada)
// =====================
const allowedOrigins = [
  'https://paginas-lz8twfnyp-matias-sanchezs-projects-4f931374.vercel.app/',
  'https://paginas-matias-sanchezs-projects-4f931374.vercel.app/',
  'https://paginas-two.vercel.app/',
  'https://www.desdeaca.com',
  'https://paginas-1vnh09kud-matias-sanchezs-projects-4f931374.vercel.app',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

// =====================
// 2) Health Check Mejorado
// =====================
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate(); // Verifica conexión a DB
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// =====================
// 3) Conexión a PostgreSQL con Reconexión
// =====================
const PORT = process.env.PORT || 8080;

// Configuración robusta para Railway
const startServer = async () => {
  try {
    // Intenta reconectar a PostgreSQL hasta 3 veces
    let retries = 3;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('🔌 Conectado a Postgres');
        break;
      } catch (dbError) {
        retries--;
        console.error(`❌ Error DB (${retries} intentos restantes):`, dbError.message);
        if (retries === 0) throw dbError;
        await new Promise(res => setTimeout(res, 5000)); // Espera 5s
      }
    }

    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
      
      // Keep-alive para PostgreSQL
      setInterval(() => sequelize.query('SELECT 1').catch(() => {}), 30000);
    });

    // Manejo de SIGTERM (para Railway)
    process.on('SIGTERM', () => {
      console.log('🛑 Recibido SIGTERM');
      server.close(() => sequelize.close().then(() => process.exit(0)));
    });
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
};

startServer();