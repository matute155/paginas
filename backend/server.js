require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const propertyRoutes = require('./routes/properties');

const app = express();

// =====================
// 1) Middleware
// =====================
const allowedOrigins = [
  'https://www.desdeaca.com',
  'https://desdeaca.com',
  'https://tudominio.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) {
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

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// Health check inmediato
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// =====================
// 3) Iniciar servidor primero
// =====================
const PORT = process.env.PORT || 8080;
console.log('🖥️ Puerto usado por Express:', PORT);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

// =====================
// 4) Conectar y sincronizar DB en background
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
