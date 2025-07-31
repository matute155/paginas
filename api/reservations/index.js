const { getModels } = require('../_lib/db');

// Headers para CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

module.exports = async (req, res) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  // Aplicar headers CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { Reservation, Property } = await getModels();

    switch (req.method) {
      case 'GET':
        return await getAllReservations(Reservation, Property, res);
      
      case 'POST':
        return await createReservation(Reservation, req, res);
      
      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en /api/reservations:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Obtener todas las reservas
async function getAllReservations(Reservation, Property, res) {
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
        propertyTitle: prop?.title || '',
        propertyLocation: prop?.location || '',
        name,
        email,
        checkIn,
        checkOut,
        guests
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Crear nueva reserva
async function createReservation(Reservation, req, res) {
  try {
    const { propertyId, name, email, checkIn, checkOut, guests } = req.body;

    // Validación de campos obligatorios
    if (!propertyId || !name || !email || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Crear la reserva
    const nuevaReserva = await Reservation.create({
      propertyId,
      name,
      email,
      checkIn,
      checkOut,
      guests
    });

    return res.status(201).json({ success: true, id: nuevaReserva.id });
  } catch (error) {
    console.error('Error creando reserva:', error);
    return res.status(500).json({ error: error.message });
  }
}