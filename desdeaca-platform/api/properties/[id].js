import { query } from '../../lib/db.js';

// Main API handler for individual property operations
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  // Validate property ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'ID de propiedad inválido'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res, parseInt(id));
        break;
      case 'PUT':
        await handlePut(req, res, parseInt(id));
        break;
      case 'DELETE':
        await handleDelete(req, res, parseInt(id));
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Handle GET request - Get single property with detailed information
async function handleGet(req, res, propertyId) {
  const propertyQuery = `
    SELECT 
      p.*,
      u.name as owner_name,
      u.phone as owner_phone,
      u.whatsapp_number as owner_whatsapp,
      u.verified as owner_verified,
      u.email as owner_email
    FROM properties p
    JOIN users u ON p.owner_id = u.id
    WHERE p.id = $1
  `;

  const result = await query(propertyQuery, [propertyId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Propiedad no encontrada'
    });
  }

  const row = result.rows[0];

  // Calculate average response time based on inquiries (mock calculation)
  let responseTime = '2-4 horas';
  try {
    const responseQuery = `
      SELECT AVG(EXTRACT(EPOCH FROM (created_at + INTERVAL '2 hours' - created_at))) as avg_response
      FROM inquiries 
      WHERE property_id = $1 AND status = 'contacted'
      AND created_at > NOW() - INTERVAL '30 days'
    `;
    const responseResult = await query(responseQuery, [propertyId]);
    // This is a simplified calculation - in reality you'd track actual response times
  } catch (error) {
    console.log('Response time calculation error:', error.message);
  }

  // Transform data to match frontend expectations
  const property = {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    type: row.property_type,
    area: row.area,
    address: row.address,
    coordinates: row.coordinates,
    images: row.images || [],
    amenities: row.amenities || [],
    capacity: row.capacity,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    price: {
      daily: parseFloat(row.price_daily),
      weekly: row.price_weekly ? parseFloat(row.price_weekly) : null,
      monthly: row.price_monthly ? parseFloat(row.price_monthly) : null
    },
    owner: {
      id: row.owner_id,
      name: row.owner_name,
      phone: row.owner_phone || row.owner_whatsapp,
      verified: row.owner_verified,
      responseTime: responseTime
    },
    status: row.status,
    rules: row.rules || [],
    availability: {
      startDate: row.availability_start,
      endDate: row.availability_end,
      blockedDates: row.blocked_dates || []
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  res.status(200).json({
    success: true,
    data: property
  });
}

// Handle PUT request - Update property (owner only)
async function handlePut(req, res, propertyId) {
  const {
    owner_id, // Required for authorization
    title,
    description,
    property_type,
    area,
    address,
    coordinates,
    images,
    amenities,
    capacity,
    bedrooms,
    bathrooms,
    price_daily,
    price_weekly,
    price_monthly,
    rules,
    availability_start,
    availability_end,
    blocked_dates,
    status
  } = req.body;

  if (!owner_id) {
    return res.status(401).json({
      success: false,
      message: 'ID de propietario requerido para autorización'
    });
  }

  // Verify property exists and belongs to the owner
  const ownershipCheck = await query(
    'SELECT owner_id FROM properties WHERE id = $1',
    [propertyId]
  );

  if (ownershipCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Propiedad no encontrada'
    });
  }

  if (ownershipCheck.rows[0].owner_id !== owner_id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para modificar esta propiedad'
    });
  }

  // Build dynamic update query
  const updateFields = [];
  const updateValues = [];
  let paramCount = 0;

  if (title !== undefined) {
    paramCount++;
    updateFields.push(`title = $${paramCount}`);
    updateValues.push(title.trim());
  }

  if (description !== undefined) {
    paramCount++;
    updateFields.push(`description = $${paramCount}`);
    updateValues.push(description.trim());
  }

  if (property_type !== undefined) {
    paramCount++;
    updateFields.push(`property_type = $${paramCount}`);
    updateValues.push(property_type);
  }

  if (area !== undefined) {
    paramCount++;
    updateFields.push(`area = $${paramCount}`);
    updateValues.push(area);
  }

  if (address !== undefined) {
    paramCount++;
    updateFields.push(`address = $${paramCount}`);
    updateValues.push(address?.trim());
  }

  if (coordinates !== undefined) {
    paramCount++;
    updateFields.push(`coordinates = $${paramCount}`);
    updateValues.push(coordinates ? JSON.stringify(coordinates) : null);
  }

  if (images !== undefined) {
    paramCount++;
    updateFields.push(`images = $${paramCount}`);
    updateValues.push(images);
  }

  if (amenities !== undefined) {
    paramCount++;
    updateFields.push(`amenities = $${paramCount}`);
    updateValues.push(amenities);
  }

  if (capacity !== undefined) {
    paramCount++;
    updateFields.push(`capacity = $${paramCount}`);
    updateValues.push(capacity);
  }

  if (bedrooms !== undefined) {
    paramCount++;
    updateFields.push(`bedrooms = $${paramCount}`);
    updateValues.push(bedrooms);
  }

  if (bathrooms !== undefined) {
    paramCount++;
    updateFields.push(`bathrooms = $${paramCount}`);
    updateValues.push(bathrooms);
  }

  if (price_daily !== undefined) {
    paramCount++;
    updateFields.push(`price_daily = $${paramCount}`);
    updateValues.push(price_daily);
  }

  if (price_weekly !== undefined) {
    paramCount++;
    updateFields.push(`price_weekly = $${paramCount}`);
    updateValues.push(price_weekly);
  }

  if (price_monthly !== undefined) {
    paramCount++;
    updateFields.push(`price_monthly = $${paramCount}`);
    updateValues.push(price_monthly);
  }

  if (rules !== undefined) {
    paramCount++;
    updateFields.push(`rules = $${paramCount}`);
    updateValues.push(rules);
  }

  if (availability_start !== undefined) {
    paramCount++;
    updateFields.push(`availability_start = $${paramCount}`);
    updateValues.push(availability_start);
  }

  if (availability_end !== undefined) {
    paramCount++;
    updateFields.push(`availability_end = $${paramCount}`);
    updateValues.push(availability_end);
  }

  if (blocked_dates !== undefined) {
    paramCount++;
    updateFields.push(`blocked_dates = $${paramCount}`);
    updateValues.push(blocked_dates);
  }

  if (status !== undefined) {
    paramCount++;
    updateFields.push(`status = $${paramCount}`);
    updateValues.push(status);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No hay campos para actualizar'
    });
  }

  // Always update the updated_at timestamp
  paramCount++;
  updateFields.push(`updated_at = $${paramCount}`);
  updateValues.push(new Date());

  // Add property ID as the last parameter
  paramCount++;
  updateValues.push(propertyId);

  const updateQuery = `
    UPDATE properties 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await query(updateQuery, updateValues);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Error al actualizar la propiedad'
    });
  }

  // Get updated property with owner information
  const updatedProperty = await query(`
    SELECT 
      p.*,
      u.name as owner_name,
      u.phone as owner_phone,
      u.whatsapp_number as owner_whatsapp,
      u.verified as owner_verified
    FROM properties p
    JOIN users u ON p.owner_id = u.id
    WHERE p.id = $1
  `, [propertyId]);

  const row = updatedProperty.rows[0];

  const responseProperty = {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    type: row.property_type,
    area: row.area,
    address: row.address,
    coordinates: row.coordinates,
    images: row.images || [],
    amenities: row.amenities || [],
    capacity: row.capacity,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    price: {
      daily: parseFloat(row.price_daily),
      weekly: row.price_weekly ? parseFloat(row.price_weekly) : null,
      monthly: row.price_monthly ? parseFloat(row.price_monthly) : null
    },
    owner: {
      id: row.owner_id,
      name: row.owner_name,
      phone: row.owner_phone || row.owner_whatsapp,
      verified: row.owner_verified,
      responseTime: '2-4 horas'
    },
    status: row.status,
    rules: row.rules || [],
    availability: {
      startDate: row.availability_start,
      endDate: row.availability_end,
      blockedDates: row.blocked_dates || []
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  res.status(200).json({
    success: true,
    data: responseProperty,
    message: 'Propiedad actualizada exitosamente'
  });
}

// Handle DELETE request - Delete property (owner only)
async function handleDelete(req, res, propertyId) {
  const { owner_id } = req.body;

  if (!owner_id) {
    return res.status(401).json({
      success: false,
      message: 'ID de propietario requerido para autorización'
    });
  }

  // Verify property exists and belongs to the owner
  const ownershipCheck = await query(
    'SELECT owner_id, title FROM properties WHERE id = $1',
    [propertyId]
  );

  if (ownershipCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Propiedad no encontrada'
    });
  }

  if (ownershipCheck.rows[0].owner_id !== owner_id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para eliminar esta propiedad'
    });
  }

  const propertyTitle = ownershipCheck.rows[0].title;

  // Delete the property (this will cascade delete inquiries due to foreign key constraint)
  await query('DELETE FROM properties WHERE id = $1', [propertyId]);

  res.status(200).json({
    success: true,
    message: `Propiedad "${propertyTitle}" eliminada exitosamente`
  });
}