const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM admins WHERE username = ? AND password = ?',
    [username, password],
    (err, admin) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      if (!admin) return res.status(401).json({ error: 'Credenciales inválidas' });

      res.json({ message: 'Login exitoso', adminId: admin.id });
    }
  );
});

module.exports = router;
