const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Guarda en /uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


// Crear una nueva propiedad
router.post('/', upload.array('images', 10), (req, res) => {
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


// Asegurar que amenities sea un array
if (typeof amenities === 'string') {
  try {
    amenities = JSON.parse(amenities);
  } catch (e) {
    amenities = [];
  }
}


  const imagePaths = req.files && req.files.length > 0
  ? req.files.map(file => `/uploads/${file.filename}`)
  : [];


  const sql = `
  INSERT INTO properties 
  (title, location, price, rating, reviews, capacity, amenities, image, status, description, address, phone, contactEmail, hostName) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;


const values = [
  title,
  location,
  price,
  rating || 0,
  reviews || 0,
  capacity,
  JSON.stringify(amenities),
  JSON.stringify(imagePaths),
  'pendiente',
  description,
  address,
  phone,
  contactEmail,
  hostName
];



  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});


// Obtener todas las propiedades
router.get('/', (req, res) => {
  db.all('SELECT * FROM properties', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsedRows = rows.map(row => {
      try {
        row.amenities = typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities;
      } catch {
        row.amenities = [];
      }

      try {
  if (typeof row.image === 'string') {
    row.image = JSON.parse(row.image);
  }

  if (!Array.isArray(row.image)) {
    row.image = [row.image];
  }
} catch {
  row.image = [];
}


      return row;
    });

    res.json(parsedRows);
  });
});


// Obtener una propiedad por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.get('SELECT * FROM properties WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error("Error al obtener la propiedad:", err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else if (!row) {
      res.status(404).json({ error: 'Propiedad no encontrada' });
    } else {
      // Aseguramos que amenities sea array
      // Aseguramos que amenities sea array
if (typeof row.amenities === 'string') {
  try {
    row.amenities = JSON.parse(row.amenities);
  } catch {
    row.amenities = row.amenities.split(',').map(a => a.trim());
  }
}

// Aseguramos que image sea array
if (typeof row.image === 'string') {
  try {
    row.image = JSON.parse(row.image);
  } catch {
    row.image = [row.image];
  }
}

res.json(row);

    }
  });
});

// PUT /api/properties/:id/approve
router.put('/:id/approve', (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE properties SET status = 'aprobado' WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// DELETE /api/properties/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM properties WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


module.exports = router;
