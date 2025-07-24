// backend/routes/properties.js

const express = require('express');
const router = express.Router();
const { Property } = require('../models');      // ← Modelo Sequelize
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ——————————————————————————————
// POST /api/properties
// Crear una nueva propiedad
// ——————————————————————————————
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    let {
      title,
      location,
      price,
      rating,
      reviews,
      capacity,
      amenities,
      description,
      address,
      phone,
      contactEmail,
      hostName
    } = req.body;

    // Parsear amenities a array
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch {
        amenities = [];
      }
    }

    // Rutas de imágenes
    const imagePaths = (req.files || []).map(f => `/uploads/${f.filename}`);

    // Crear en Postgres
    const nueva = await Property.create({
      title,
      location,
      price: price ?? 0,
      rating: rating ?? 0,
      reviews: reviews ?? 0,
      capacity,
      amenities: JSON.stringify(amenities),
      image: JSON.stringify(imagePaths),
      status: 'pendiente',
      description,
      address,
      phone,
      contactEmail,
      hostName
    });

    res.status(201).json(nueva);
  } catch (err) {
    console.error('Error creando propiedad:', err);
    res.status(500).json({ error: err.message });
  }
});

// ——————————————————————————————
// GET /api/properties
// Obtener todas las propiedades
// ——————————————————————————————
router.get('/', async (req, res) => {
  try {
    const list = await Property.findAll();
    // Parsear JSON en amenities e image
    const parsed = list.map(item => {
      const row = item.toJSON();
      try {
        row.amenities = typeof row.amenities === 'string'
          ? JSON.parse(row.amenities)
          : row.amenities;
      } catch {
        row.amenities = [];
      }
      try {
        row.image = typeof row.image === 'string'
          ? JSON.parse(row.image)
          : row.image;
        if (!Array.isArray(row.image)) row.image = [row.image];
      } catch {
        row.image = [];
      }
      return row;
    });
    res.json(parsed);
  } catch (err) {
    console.error('Error obteniendo propiedades:', err);
    res.status(500).json({ error: err.message });
  }
});

// ——————————————————————————————
// GET /api/properties/:id
// Obtener una propiedad por ID
// ——————————————————————————————
router.get('/:id', async (req, res) => {
  try {
    const item = await Property.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Propiedad no encontrada' });

    const row = item.toJSON();
    // Parsear amenities
    if (typeof row.amenities === 'string') {
      try {
        row.amenities = JSON.parse(row.amenities);
      } catch {
        row.amenities = row.amenities.split(',').map(a => a.trim());
      }
    }
    // Parsear image
    if (typeof row.image === 'string') {
      try {
        row.image = JSON.parse(row.image);
      } catch {
        row.image = [row.image];
      }
    }

    res.json(row);
  } catch (err) {
    console.error('Error obteniendo propiedad:', err);
    res.status(500).json({ error: err.message });
  }
});

// ——————————————————————————————
// PUT /api/properties/:id/approve
// Aprobar una propiedad
// ——————————————————————————————
router.put('/:id/approve', async (req, res) => {
  try {
    const [updated] = await Property.update(
      { status: 'aprobado' },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error aprobando propiedad:', err);
    res.status(500).json({ error: err.message });
  }
});

// ——————————————————————————————
// DELETE /api/properties/:id
// Eliminar una propiedad
// ——————————————————————————————
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Property.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando propiedad:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
