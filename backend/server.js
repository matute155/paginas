// backend/server.js

// 1) Carga variables de entorno
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// 2) Importa la instancia de Sequelize
const { sequelize } = require('./models');

// 3) Importa tus rutas
const propertiesRoutes = require('./routes/properties');
const authRoutes       = require('./routes/auth');
const adminRoutes      = require('./routes/admin');
const reservationRoutes= require('./routes/reservations');

// 4) Middlewares
app.use(cors({
  origin: [
    'https://desdeaca.com',
    'https://www.desdeaca.com',
    process.env.FRONTEND_URL  // opcional: añade tu URL de Vercel
  ],
  methods: ['GET','POST','PUT','DELETE']
}));
app.use(express.json());

// 5) Rutas estáticas (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6) Rutas de la API
app.use('/api/properties',   propertiesRoutes);
app.use('/api/auth',         authRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/reservations', reservationRoutes);

// 7) Sincronizar modelos y levantar servidor
const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => console.log('🔌 Conectado a Postgres'))
  .then(() => sequelize.sync())
  .then(() => console.log('✅ Modelos sincronizados con la base de datos'))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ No fue posible iniciar la base de datos:', err);
    process.exit(1);
  });
