require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const propertyRoutes = require('./routes/properties'); // ✅ Importar las rutas

const app = express();

// =====================
// 1) Middleware
// =====================
const allowedOrigins = [
  'https://www.desdeaca.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // ✅ Necesario para leer JSON del body

// =====================
// 2) Rutas
// =====================
app.use('/api/properties', propertyRoutes); // ✅ Montar las rutas

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});


app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});


// =====================
// 3) Iniciar servidor con reconexión
// =====================
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
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
        await new Promise(res => setTimeout(res, 5000));
      }
    }

    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
      setInterval(() => sequelize.query('SELECT 1').catch(() => {}), 30000);
    });

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
