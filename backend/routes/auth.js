// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { Admin } = require('../models');  // ← Importa tu modelo Sequelize

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca un admin con las credenciales proporcionadas
    const admin = await Admin.findOne({
      where: { username, password }
    });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales inválidas' });
    }

    res.json({
      success: true,
      message: 'Acceso concedido',
      adminId: admin.id
    });
  } catch (err) {
    console.error('Error en /api/admin/login:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;
