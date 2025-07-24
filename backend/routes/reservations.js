// backend/routes/reservations.js

const express = require('express');
const router = express.Router();
const { Reservation, Property } = require('../models'); // Modelos Sequelize

// POST /api/reservations
// Crear una nueva reserva
router.post('/', async (req, res) => {
  const { propertyId, name, email, checkIn, checkOut, guests } = req.body;

  // Validación de campos obligatorios
  if (!propertyId || !name || !email || !checkIn || !checkOut || !guests) {
    return res
      .status(400)
      .json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Crear la reserva en Postgres
    const nuevaReserva = await Reservation.create({
      propertyId,
      name,
      email,
      checkIn,
      checkOut,
      guests
    });

    res
      .status(201)
      .json({ success: true, id: nuevaReserva.id });
  } catch (err) {
    console.error('Error creando reserva:', err);
    res
      .status(500)
      .json({ error: err.message });
  }
});

// GET /api/reservations
// Obtener todas las reservas con datos de la propiedad
router.get('/', async (req, res) => {
  try {
    const reservas = await Reservation.findAll({
      include: {
        model: Property,
        attributes: ['id', 'title', 'location']
      }
    });

    // Formatear la respuesta
    const result = reservas.map(r => {
      const { id, propertyId, name, email, checkIn, checkOut, guests, Property: prop } = r.toJSON();
      return {
        id,
        propertyId,
        propertyTitle: prop.title,
        propertyLocation: prop.location,
        name,
        email,
        checkIn,
        checkOut,
        guests
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error obteniendo reservas:', err);
    res
      .status(500)
      .json({ error: err.message });
  }
});

module.exports = router;
