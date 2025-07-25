// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// ——————————————————————————————
// 1) CORS configurado para producción y desarrollo
// ——————————————————————————————
const allowedOrigins = [
  'https://www.desdeaca.com',
  'https://paginas-nsm6rf03j-matias-sanchezs-projects-4f931374.vercel.app/', // Reemplaza con tu URL en Vercel
  'http://localhost:3000' // Para desarrollo local
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ——————————————————————————————
// 2) Middlewares básicos
// ——————————————————————————————
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ——————————————————————————————
// 3) Endpoint de salud (para probar que el backend funciona)
// ——————————————————————————————
app.get('/ping', (req, res) => {
  return res.send('pong');
});

// ——————————————————————————————
// 4) Rutas principales
// ——————————————————————————————
app.use('/api/properties', require('./routes/properties'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reservations', require('./routes/reservations'));

// ——————————————————————————————
// 5) Conexión a Postgres y inicio del servidor
// ——————————————————————————————
const PORT = process.env.PORT || 8080; // Railway usa 8080 por defecto

sequelize.authenticate()
  .then(() => {
    console.log('🔌 Conectado a Postgres');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Modelos sincronizados');
    app.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' es clave para Railway
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al iniciar la base de datos:', err);
  });

// ——————————————————————————————
// 6) Manejo básico de errores (opcional pero recomendado)
// ——————————————————————————————
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});