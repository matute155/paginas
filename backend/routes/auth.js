// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Datos de administrador (podés reemplazar esto por una tabla de usuarios en el futuro)
const ADMIN_EMAIL = 'admin@desdeaca.com';
const ADMIN_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Acceso concedido' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

module.exports = router;
