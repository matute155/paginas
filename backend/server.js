require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const axios = require('axios'); // ¡Importación faltante!

const app = express();

// =====================
// 1) Configuración CORS
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
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// =====================
// 2) Middlewares
// =====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================
// 3) Health Checks
// =====================
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: 'ok',
      db_status: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      db_status: 'disconnected'
    });
  }
});

app.get('/ping', (req, res) => res.send('pong'));

// =====================
// 4) Rutas principales
// =====================
app.use('/api/properties', require('./routes/properties'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reservations', require('./routes/reservations'));

// =====================
// 5) Conexión a DB y Server
// =====================
const PORT = process.env.PORT || 8080;

// Configuración mejorada para PostgreSQL
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a Postgres');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });

    // Keep-alive mejorado para PostgreSQL
    setInterval(() => {
      sequelize.query('SELECT 1').catch(() => process.exit(1));
    }, 30000);

    process.on('SIGTERM', () => {
      server.close(() => {
        sequelize.close();
        console.log('🛑 Servidor cerrado');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Error de inicio:', error);
    process.exit(1);
  }
};

startServer();