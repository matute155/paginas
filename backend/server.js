// backend/server.js
require('dotenv').config();
const express = require('express');
const path    = require('path');
const { sequelize } = require('./models');

const app = express();

// ——————————————————————————————
// 1) CORS CONFIGURADO PARA PRODUCCIÓN
// ——————————————————————————————
app.use((req, res, next) => {
  // CAMBIO CLAVE AQUÍ 👇
  // Se especifica el dominio exacto del frontend para permitir la conexión.
  res.header('Access-Control-Allow-Origin', 'https://www.desdeaca.com'); 
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // El navegador envía una petición OPTIONS (preflight) antes de peticiones como PUT o DELETE.
  // Con esto respondemos que sí están permitidas.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ——————————————————————————————
// 1b) Endpoint de salud (ping)
// ——————————————————————————————
app.get('/ping', (req, res) => {
  return res.send('pong');
});

// ——————————————————————————————
// 2) Middlewares y rutas
// ——————————————————————————————
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/properties',   require('./routes/properties'));
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/reservations', require('./routes/reservations'));

// ——————————————————————————————
// 3) Arrancar el servidor INMEDIATAMENTE
// ——————————————————————————————
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

// ——————————————————————————————
// 4) Conectar a la base y sincronizar (en background)
// ——————————————————————————————
sequelize.authenticate()
  .then(() => console.log('🔌 Conectado a Postgres'))
  .then(() => sequelize.sync())
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => {
    console.error('❌ No fue posible iniciar la base de datos:', err);
    // No hacemos process.exit para que el servidor siga vivo
  });