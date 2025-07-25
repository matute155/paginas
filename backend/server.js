// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// =====================
// 1) Configuración CORS
// =====================
const allowedOrigins = [
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
// 3) Health Checks (CRÍTICO para Railway)
// =====================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    db_status: sequelize.authenticate() ? 'connected' : 'disconnected'
  });
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

// Configuración mejorada para PostgreSQL en Railway
sequelize.authenticate()
  .then(() => {
    console.log('🔌 Conectado a Postgres');
    return sequelize.sync({ alter: true }); // Sync seguro para producción
  })
  .then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      
      // Health check automático para Railway
      setTimeout(() => {
        axios.get(`http://localhost:${PORT}/health`)
          .catch(() => process.exit(1)); // Si falla, reinicia
      }, 5000);
    });

    // Manejo elegante de cierre
    process.on('SIGTERM', () => {
      server.close(() => {
        sequelize.close();
        console.log('🛑 Servidor cerrado');
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error('❌ Error de inicio:', err);
    process.exit(1); // Falla explícita para reinicio
  });

// =====================
// 6) Manejo de errores
// =====================
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Keep-alive para Railway
setInterval(() => {
  sequelize.query('SELECT 1');
}, 30000);