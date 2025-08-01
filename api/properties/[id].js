import { getModels, parseJsonField } from '../_lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

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
        return id ? await getPropertyById(Property, res, id)
                 : await getAllProperties(Property, res);
      
      case 'DELETE':
        if (!id) return res.status(400).json({ error: 'ID requerido' });
        return await deleteProperty(Property, res, id);
      
      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en /api/properties:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getAllProperties(Property, res) {
  try {
    const properties = await Property.findAll();
    const parsedProperties = properties.map(prop => {
      const row = prop.toJSON();
      row.amenities = parseJsonField(row.amenities, []);
      row.image = parseJsonField(row.image, []);
      if (!Array.isArray(row.image)) {
        row.image = [row.image];
      }
      return row;
    });
    
    return res.status(200).json(parsedProperties);
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getPropertyById(Property, res, id) {
  try {
    const item = await Property.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const row = item.toJSON();
    
    row.amenities = parseJsonField(row.amenities, []);
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