// Mock API endpoint for properties
// This would be replaced with actual database calls in production

const mockProperties = [
  {
    id: '1',
    title: 'Casa amplia con quincho en Villa Krause',
    description: 'Hermosa casa familiar con piscina y parrilla. Perfecta para familias y grupos de amigos. Cuenta con una amplia piscina, quincho equipado con parrilla, y todos los amenities necesarios para una estadía inolvidable en San Juan.',
    type: 'house',
    area: 'villa_krause',
    address: 'Villa Krause, San Juan',
    coordinates: { lat: -31.5375, lng: -68.5364 },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da16c06?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    amenities: ['wifi', 'parking', 'pool', 'bbq', 'air_conditioning', 'kitchen', 'washing_machine', 'garden'],
    capacity: 8,
    bedrooms: 3,
    bathrooms: 2,
    price: {
      daily: 15000,
      weekly: 90000,
      monthly: 350000
    },
    owner: {
      id: 'owner1',
      name: 'María González',
      phone: '2644123456',
      verified: true,
      responseTime: '2 horas'
    },
    status: 'active',
    rules: [
      'No fumar en el interior',
      'Mascotas permitidas con consulta previa',
      'Horario de silencio: 22:00 - 08:00',
      'Check-in: 15:00 - 20:00',
      'Check-out: 11:00'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Departamento moderno en el Centro',
    description: 'Departamento completamente equipado en zona céntrica de San Juan. Ideal para parejas o viajeros de negocios. Ubicado cerca de restaurantes, comercios y atractivos turísticos.',
    type: 'apartment',
    area: 'centro',
    address: 'Centro, San Juan',
    coordinates: { lat: -31.5375, lng: -68.5364 },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-604b3592824f?w=800'
    ],
    amenities: ['wifi', 'air_conditioning', 'heating', 'kitchen'],
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    price: {
      daily: 8000,
      weekly: 50000,
      monthly: 180000
    },
    owner: {
      id: 'owner2',
      name: 'Carlos Pérez',
      phone: '2644654321',
      verified: true,
      responseTime: '1 hora'
    },
    status: 'active',
    rules: [
      'No fumar',
      'No mascotas',
      'Check-in: 14:00 - 22:00',
      'Check-out: 10:00'
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    title: 'Cabaña en Ullúm con vista al dique',
    description: 'Escapada perfecta con vista panorámica al dique de Ullúm. Ideal para descansar y disfrutar de deportes acuáticos. Ambiente tranquilo rodeado de naturaleza.',
    type: 'cabin',
    area: 'ullum',
    address: 'Ullúm, San Juan',
    coordinates: { lat: -31.4167, lng: -68.6667 },
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    amenities: ['wifi', 'parking', 'bbq', 'garden', 'kitchen'],
    capacity: 6,
    bedrooms: 2,
    bathrooms: 1,
    price: {
      daily: 12000,
      weekly: 75000,
      monthly: 280000
    },
    owner: {
      id: 'owner3',
      name: 'Ana Rodríguez',
      phone: '2644789012',
      verified: true,
      responseTime: '3 horas'
    },
    status: 'active',
    rules: [
      'Mascotas permitidas',
      'Respetar la naturaleza',
      'No ruidos molestos después de las 23:00',
      'Check-in: 16:00 - 20:00',
      'Check-out: 11:00'
    ],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

// API Handler for Vercel Serverless Functions
export default function handler(req, res) {
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

  const { method, query } = req;

  switch (method) {
    case 'GET':
      // Get all properties or filter by query parameters
      let filteredProperties = [...mockProperties];

      // Apply filters
      if (query.area) {
        filteredProperties = filteredProperties.filter(p => p.area === query.area);
      }
      
      if (query.type) {
        filteredProperties = filteredProperties.filter(p => p.type === query.type);
      }
      
      if (query.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price.daily >= parseInt(query.minPrice));
      }
      
      if (query.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price.daily <= parseInt(query.maxPrice));
      }
      
      if (query.capacity) {
        filteredProperties = filteredProperties.filter(p => p.capacity >= parseInt(query.capacity));
      }
      
      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      res.status(200).json({
        success: true,
        data: filteredProperties,
        total: filteredProperties.length
      });
      break;

    case 'POST':
      // Create new property (for owners)
      const newProperty = {
        id: String(mockProperties.length + 1),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending_approval'
      };
      
      mockProperties.push(newProperty);
      
      res.status(201).json({
        success: true,
        data: newProperty,
        message: 'Propiedad creada exitosamente'
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`
      });
      break;
  }
}

// Export for ES modules (if using Node.js with "type": "module")
export { handler, mockProperties };