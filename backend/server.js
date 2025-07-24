// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// ——————————————————————————————
// 1) CONFIGURACIÓN DE CORS
// ——————————————————————————————
const corsOptions = {
  origin: [
    'https://desdeaca.com',
    'https://www.desdeaca.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

// Aplica CORS a todas las rutas
app.use(cors(corsOptions));

// ——————————————————————————————
// 2) Resto de middlewares y rutas
// ——————————————————————————————
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/properties',   require('./routes/properties'));
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/reservations', require('./routes/reservations'));

// ——————————————————————————————
// 3) Sincronizar y levantar servidor
// ——————————————————————————————
const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => console.log('🔌 Conectado a Postgres'))
  .then(() => sequelize.sync())
  .then(() => console.log('✅ Modelos sincronizados'))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ No fue posible iniciar la base de datos:', err);
    process.exit(1);
  });
