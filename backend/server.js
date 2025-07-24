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
const allowedOrigins = [
  'https://desdeaca.com',
  'https://www.desdeaca.com'
  // puedes agregar más dominios si los necesitas
];

app.use(cors({
  origin(origin, callback) {
    // permitir peticiones sin origin (por ejemplo desde Postman o mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
}));

// Para responder OPTIONS preflight
app.options('*', cors({
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

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
