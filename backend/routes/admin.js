// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { Admin } = require('../models'); // ← Usamos el modelo Sequelize

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca un admin que coincida con usuario y contraseña
    const admin = await Admin.findOne({
      where: { username, password }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Si quisieras excluir la contraseña del response:
    // const { password: _, ...adminData } = admin.toJSON();

    res.json({ message: 'Login exitoso', adminId: admin.id });
  } catch (err) {
    console.error('Error durante login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
