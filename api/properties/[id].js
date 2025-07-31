// Cambia require a import (recomendado para Vercel)
import { getModels, parseJsonField } from '../_lib/db';

// Headers para CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Usa export default en lugar de module.exports
export default async function handler(req, res) {
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
    const { Property } = await getModels();
    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        return await getPropertyById(Property, res, id);
      
      case 'DELETE':
        return await deleteProperty(Property, res, id);
      
      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en /api/properties/[id]:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Funciones auxiliares (no necesitan exportarse)
async function getPropertyById(Property, res, id) {
  try {
    const item = await Property.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const row = item.toJSON();
    
    // Parsear amenities
    row.amenities = parseJsonField(row.amenities, []);
    
    // Parsear images
    row.image = parseJsonField(row.image, []);
    if (!Array.isArray(row.image)) {
      row.image = [row.image];
    }

    return res.status(200).json(row);
  } catch (error) {
    console.error('Error obteniendo propiedad:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function deleteProperty(Property, res, id) {
  try {
    const deleted = await Property.destroy({ where: { id } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error eliminando propiedad:', error);
    return res.status(500).json({ error: error.message });
  }
}