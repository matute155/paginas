const { getModels } = require('./_lib/db');

module.exports = async (req, res) => {
  // Headers para CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST' });
  }

  try {
    console.log('Iniciando migración de base de datos...');
    
    const { sequelize, Property, Reservation, Admin } = await getModels();
    
    // Sincronizar todos los modelos
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Migración completada exitosamente');
    
    return res.status(200).json({ 
      success: true,
      message: 'Base de datos sincronizada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en migración:', error);
    return res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};