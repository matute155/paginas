const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path'); // Te falta importar esto

const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservations');

// Middlewares
const cors = require('cors');

app.use(cors({
  origin: 'https://desdeaca.com', // o tu dominio real
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// Rutas estáticas para imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);

// Escuchar el servidor (solo UNA VEZ)
app.listen(3001, () => {
  console.log('Servidor escuchando en http://localhost:3001');
});
