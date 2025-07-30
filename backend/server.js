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
  'https://paginas-qhonlubz6-matias-sanchezs-projects-4f931374.vercel.app',
  'https://www.desdeaca.com',
  'https://desdeaca.com',
  'https://paginas-production.up.railway.app', // tu backend en Railway
  process.env.FRONTEND_URL,                    // opcional, desde .env
  'http://localhost:3000',                     // desarrollo local
  /^https:\/\/.*\.vercel\.app$/                // previews Vercel
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
// =====================
app.all('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// =====================
// 4) Levantar servidor
// =====================
const PORT = process.env.PORT || 8080;
console.log('🖥️  Puerto usado por Express:', PORT);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

// =====================
// 5) Conexión a DB
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
