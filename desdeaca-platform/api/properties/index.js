import { query } from '../../lib/db.js';

// Helper function to validate property data
function validatePropertyData(data) {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  }
  
  if (!data.description || data.description.trim().length < 20) {
    errors.push('La descripción debe tener al menos 20 caracteres');
  }
  
  if (!data.area) {
    errors.push('La zona es requerida');
  }
  
  if (!data.price_daily || data.price_daily <= 0) {
    errors.push('El precio diario debe ser mayor a 0');
  }
  
  if (!data.capacity || data.capacity < 1) {
    errors.push('La capacidad debe ser al menos 1 huésped');
  }
  
  const validTypes = ['house', 'apartment', 'cabin', 'studio'];
  if (!data.property_type || !validTypes.includes(data.property_type)) {
    errors.push('Tipo de propiedad inválido');
  }
  
  const validAreas = [
    'centro', 'villa_krause', 'chimbas', 'rawson', 'pocito', 
    'santa_lucia', 'ullum', 'zonda', 'caucete', 'rivadavia'
  ];
  if (!validAreas.includes(data.area)) {
    errors.push('Zona inválida');
  }
  
  return errors;
}

// Main API handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
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

// Handle GET requests - List and filter properties
async function handleGet(req, res) {
  const {
    area,
    property_type,
    min_price,
    max_price,
    capacity,
    search,
    page = 1,
    limit = 20,
    status = 'active'
  } = req.query;

  let whereConditions = ['status = $1'];
  let params = [status];
  let paramCount = 1;

  // Build WHERE conditions dynamically
  if (area) {
    paramCount++;
    whereConditions.push(`area = $${paramCount}`);
    params.push(area);
  }

  if (property_type) {
    paramCount++;
    whereConditions.push(`property_type = $${paramCount}`);
    params.push(property_type);
  }

  if (min_price) {
    paramCount++;
    whereConditions.push(`price_daily >= $${paramCount}`);
    params.push(parseFloat(min_price));
  }

  if (max_price) {
    paramCount++;
    whereConditions.push(`price_daily <= $${paramCount}`);
    params.push(parseFloat(max_price));
  }

  if (capacity) {
    paramCount++;
    whereConditions.push(`capacity >= $${paramCount}`);
    params.push(parseInt(capacity));
  }

  if (search) {
    paramCount++;
    whereConditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
    params.push(`%${search}%`);
  }

  // Calculate offset for pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Main query with user join for owner information
  const queryText = `
    SELECT 
      p.*,
      u.name as owner_name,
      u.phone as owner_phone,
      u.whatsapp_number as owner_whatsapp,
      u.verified as owner_verified
    FROM properties p
    JOIN users u ON p.owner_id = u.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY p.created_at DESC
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `;

  params.push(parseInt(limit), offset);

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(*) as total
    FROM properties p
    WHERE ${whereConditions.join(' AND ')}
  `;

  const [propertiesResult, countResult] = await Promise.all([
    query(queryText, params),
    query(countQuery, params.slice(0, -2)) // Remove limit and offset for count
  ]);

  // Transform data to match frontend expectations
  const properties = propertiesResult.rows.map(row => ({
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
      responseTime: '2-4 horas' // Default value, could be calculated based on inquiries
    },
    status: row.status,
    rules: row.rules || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));

  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.status(200).json({
    success: true,
    data: properties,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1
    }
  });
}

// Handle POST requests - Create new property
async function handlePost(req, res) {
  const {
    owner_id,
    title,
    description,
    property_type,
    area,
    address,
    coordinates,
    images = [],
    amenities = [],
    capacity,
    bedrooms = 0,
    bathrooms = 0,
    price_daily,
    price_weekly,
    price_monthly,
    rules = [],
    availability_start,
    availability_end
  } = req.body;

  // Validate required fields
  const validationErrors = validatePropertyData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: validationErrors
    });
  }

  // Verify owner exists
  const ownerCheck = await query(
    'SELECT id, user_type FROM users WHERE id = $1',
    [owner_id]
  );

  if (ownerCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Propietario no encontrado'
    });
  }

  if (ownerCheck.rows[0].user_type !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Solo los propietarios pueden crear propiedades'
    });
  }

  // Calculate weekly and monthly prices if not provided
  const calculatedWeekly = price_weekly || (price_daily * 7 * 0.9); // 10% discount
  const calculatedMonthly = price_monthly || (price_daily * 30 * 0.8); // 20% discount

  // Insert new property
  const insertQuery = `
    INSERT INTO properties (
      owner_id, title, description, property_type, area, address, coordinates,
      images, amenities, capacity, bedrooms, bathrooms, price_daily, price_weekly,
      price_monthly, rules, availability_start, availability_end
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    ) RETURNING *
  `;

  const result = await query(insertQuery, [
    owner_id,
    title.trim(),
    description.trim(),
    property_type,
    area,
    address?.trim(),
    coordinates ? JSON.stringify(coordinates) : null,
    images,
    amenities,
    capacity,
    bedrooms,
    bathrooms,
    price_daily,
    calculatedWeekly,
    calculatedMonthly,
    rules,
    availability_start || null,
    availability_end || null
  ]);

  const newProperty = result.rows[0];

  // Get owner information for response
  const ownerInfo = await query(
    'SELECT name, phone, whatsapp_number, verified FROM users WHERE id = $1',
    [owner_id]
  );

  const owner = ownerInfo.rows[0];

  // Transform response to match frontend format
  const responseProperty = {
    id: newProperty.id.toString(),
    title: newProperty.title,
    description: newProperty.description,
    type: newProperty.property_type,
    area: newProperty.area,
    address: newProperty.address,
    coordinates: newProperty.coordinates,
    images: newProperty.images || [],
    amenities: newProperty.amenities || [],
    capacity: newProperty.capacity,
    bedrooms: newProperty.bedrooms,
    bathrooms: newProperty.bathrooms,
    price: {
      daily: parseFloat(newProperty.price_daily),
      weekly: parseFloat(newProperty.price_weekly),
      monthly: parseFloat(newProperty.price_monthly)
    },
    owner: {
      id: owner_id,
      name: owner.name,
      phone: owner.phone || owner.whatsapp_number,
      verified: owner.verified,
      responseTime: '2-4 horas'
    },
    status: newProperty.status,
    rules: newProperty.rules || [],
    createdAt: newProperty.created_at,
    updatedAt: newProperty.updated_at
  };

  res.status(201).json({
    success: true,
    data: responseProperty,
    message: 'Propiedad creada exitosamente. Será revisada antes de publicarse.'
  });
}