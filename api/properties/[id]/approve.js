const { getModels } = require('../../_lib/db');

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

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { Property } = await getModels();
    const { id } = req.query;

    const [updated] = await Property.update(
      { status: 'aprobado' },
      { where: { id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error aprobando propiedad:', error);
    return res.status(500).json({ error: error.message });
  }
};