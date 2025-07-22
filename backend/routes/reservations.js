const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { propertyId, name, email, checkIn, checkOut, guests } = req.body;

  if (!propertyId || !name || !email || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO reservations 
    (propertyId, name, email, checkIn, checkOut, guests) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [propertyId, name, email, checkIn, checkOut, guests];

  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, id: this.lastID });
  });
});

router.get('/', (req, res) => {
  const sql = `
    SELECT 
      reservations.id,
      reservations.propertyId,
      reservations.name,
      reservations.email,
      reservations.checkIn,
      reservations.checkOut,
      reservations.guests,
      properties.title AS propertyTitle,
      properties.location AS propertyLocation
    FROM reservations
    JOIN properties ON reservations.propertyId = properties.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



module.exports = router;
