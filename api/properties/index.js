const { getModels, parseJsonField } = require('../_lib/db');
const { parseFormData, processFiles, generateImageUrls } = require('../_lib/upload');

// Headers para CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Función principal del endpoint
module.exports = async (req, res) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Aplicar headers CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { Property } = await getModels();
    const { method, query } = req;
    const { id } = query;

    switch (method) {
      case 'GET':
        if (id) {
          // GET /api/properties/[id] - Obtener propiedad específica
          return await getPropertyById(Property, res, id);
        } else {
          // GET /api/properties - Obtener todas las propiedades
          return await getAllProperties(Property, res);
        }

      case 'POST':
        // POST /api/properties - Crear nueva propiedad
        return await createProperty(Property, req, res);

      case 'PUT':
        if (id && req.url.includes('/approve')) {
          // PUT /api/properties/[id]/approve - Aprobar propiedad
          return await approveProperty(Property, res, id);
        }
        return res.status(404).json({ error: 'Ruta no encontrada' });

      case 'DELETE':
        if (id) {
          // DELETE /api/properties/[id] - Eliminar propiedad
          return await deleteProperty(Property, res, id);
        }
        return res.status(400).json({ error: 'ID requerido para eliminar' });

      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en /api/properties:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Obtener todas las propiedades
async function getAllProperties(Property, res) {
  try {
    const list = await Property.findAll();
    
    const parsed = list.map(item => {
      const row = item.toJSON();
      
      // Parsear amenities
      row.amenities = parseJsonField(row.amenities, []);
      
      // Parsear images
      row.image = parseJsonField(row.image, []);
      if (!Array.isArray(row.image)) {
        row.image = [row.image];
      }
      
      return row;
    });
    
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Obtener propiedad por ID
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
// Crear nueva propieda
async function createProperty(Property, req, res) {
  try {
    let fields = {};
    let files = [];

    // Parsear form data si es multipart
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const parsed = await parseFormData(req);
      fields = parsed.fields;
      files = parsed.files;
    } else {
      // JSON body
      fields = req.body || {};
    }

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
    } = fields;

    // Parsear amenities
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch {
        amenities = [];
      }
    }

    // Procesar archivos subidos
    let imagePaths = [];
    if (files.length > 0) {
      const processedFiles = processFiles(files);
      imagePaths = generateImageUrls(processedFiles);
    }

    // Crear en base de datos
    const nueva = await Property.create({
      title,
      location,
      price: price ? parseFloat(price) : 0,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      capacity: capacity ? parseInt(capacity) : 1,
      amenities: JSON.stringify(amenities || []),
      image: JSON.stringify(imagePaths),
      status: 'pendiente',
      description,
      address,
      phone,
      contactEmail,
      hostName
    });

    return res.status(201).json(nueva);
  } catch (error) {
    console.error('Error creando propiedad:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Aprobar propiedad
async function approveProperty(Property, res, id) {
  try {
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
}

// Eliminar propiedad
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