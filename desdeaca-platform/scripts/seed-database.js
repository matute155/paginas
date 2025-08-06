import { query, initializeDatabase } from '../lib/db.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Initialize database schema
    await initializeDatabase();
    console.log('✅ Database schema initialized');

    // Create demo users
    const saltRounds = 12;

    // Demo property owners
    const owners = [
      {
        email: 'maria.gonzalez@desdeaca.com',
        password: await bcrypt.hash('demo123', saltRounds),
        name: 'María González',
        phone: '+549 264 412-3456',
        whatsapp_number: '+549 264 412-3456',
        user_type: 'owner',
        verified: true
      },
      {
        email: 'carlos.perez@desdeaca.com',
        password: await bcrypt.hash('demo123', saltRounds),
        name: 'Carlos Pérez',
        phone: '+549 264 465-4321',
        whatsapp_number: '+549 264 465-4321',
        user_type: 'owner',
        verified: true
      },
      {
        email: 'ana.rodriguez@desdeaca.com',
        password: await bcrypt.hash('demo123', saltRounds),
        name: 'Ana Rodríguez',
        phone: '+549 264 478-9012',
        whatsapp_number: '+549 264 478-9012',
        user_type: 'owner',
        verified: true
      }
    ];

    // Demo guests
    const guests = [
      {
        email: 'juan.tourist@gmail.com',
        password: await bcrypt.hash('demo123', saltRounds),
        name: 'Juan Turista',
        phone: '+549 11 1234-5678',
        user_type: 'guest',
        verified: false
      }
    ];

    // Insert users
    const allUsers = [...owners, ...guests];
    const insertedUsers = [];

    for (const user of allUsers) {
      try {
        const result = await query(`
          INSERT INTO users (email, password_hash, name, phone, whatsapp_number, user_type, verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (email) DO NOTHING
          RETURNING id, email, name, user_type
        `, [
          user.email,
          user.password,
          user.name,
          user.phone,
          user.whatsapp_number || null,
          user.user_type,
          user.verified
        ]);

        if (result.rows.length > 0) {
          insertedUsers.push(result.rows[0]);
          console.log(`✅ Created user: ${result.rows[0].name} (${result.rows[0].user_type})`);
        } else {
          // User already exists, fetch it
          const existing = await query('SELECT id, email, name, user_type FROM users WHERE email = $1', [user.email]);
          if (existing.rows.length > 0) {
            insertedUsers.push(existing.rows[0]);
            console.log(`📋 User already exists: ${existing.rows[0].name}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error creating user ${user.name}:`, error.message);
      }
    }

    // Get owner IDs
    const ownerUsers = insertedUsers.filter(u => u.user_type === 'owner');

    if (ownerUsers.length === 0) {
      throw new Error('No owners created, cannot create properties');
    }

    // Demo properties
    const properties = [
      {
        owner_id: ownerUsers[0].id,
        title: 'Casa amplia con quincho en Villa Krause',
        description: `Hermosa casa familiar perfecta para familias y grupos de amigos. Cuenta con una amplia piscina, quincho equipado con parrilla, y todos los amenities necesarios para una estadía inolvidable en San Juan.

La propiedad está ubicada en una zona tranquila y segura, a pocos minutos del centro de la ciudad y cerca de los principales atractivos turísticos.

Características destacadas:
• Piscina climatizada
• Quincho con parrilla profesional
• Jardín amplio con árboles frutales
• Estacionamiento cubierto para 2 vehículos
• WiFi de alta velocidad
• Aire acondicionado en todos los ambientes`,
        property_type: 'house',
        area: 'villa_krause',
        address: 'Villa Krause, San Juan',
        coordinates: JSON.stringify({ lat: -31.5375, lng: -68.5364 }),
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da16c06?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
        ],
        amenities: ['wifi', 'parking', 'pool', 'bbq', 'air_conditioning', 'kitchen', 'washing_machine', 'garden'],
        capacity: 8,
        bedrooms: 3,
        bathrooms: 2,
        price_daily: 15000,
        price_weekly: 90000,
        price_monthly: 350000,
        rules: [
          'No fumar en el interior',
          'Mascotas permitidas con consulta previa',
          'Horario de silencio: 22:00 - 08:00',
          'Check-in: 15:00 - 20:00',
          'Check-out: 11:00'
        ],
        status: 'active'
      },
      {
        owner_id: ownerUsers[1]?.id || ownerUsers[0].id,
        title: 'Departamento moderno en el Centro',
        description: `Departamento completamente equipado en zona céntrica de San Juan. Ideal para parejas o viajeros de negocios. Ubicado cerca de restaurantes, comercios y atractivos turísticos.

El departamento cuenta con todos los amenities necesarios para una estadía cómoda y está ubicado en un edificio moderno con seguridad 24 horas.

Características:
• Ubicación céntrica privilegiada
• Cocina completamente equipada
• Internet de alta velocidad
• Aire acondicionado y calefacción
• Seguridad 24 horas
• Fácil acceso a transporte público`,
        property_type: 'apartment',
        area: 'centro',
        address: 'Centro, San Juan',
        coordinates: JSON.stringify({ lat: -31.5375, lng: -68.5364 }),
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-604b3592824f?w=800'
        ],
        amenities: ['wifi', 'air_conditioning', 'heating', 'kitchen'],
        capacity: 4,
        bedrooms: 2,
        bathrooms: 1,
        price_daily: 8000,
        price_weekly: 50000,
        price_monthly: 180000,
        rules: [
          'No fumar',
          'No mascotas',
          'Check-in: 14:00 - 22:00',
          'Check-out: 10:00'
        ],
        status: 'active'
      },
      {
        owner_id: ownerUsers[2]?.id || ownerUsers[0].id,
        title: 'Cabaña en Ullúm con vista al dique',
        description: `Escapada perfecta con vista panorámica al dique de Ullúm. Ideal para descansar y disfrutar de deportes acuáticos. Ambiente tranquilo rodeado de naturaleza.

La cabaña ofrece una experiencia única de conexión con la naturaleza, perfecta para familias que buscan relajarse y disfrutar de actividades al aire libre.

Actividades cercanas:
• Deportes acuáticos en el dique
• Senderismo y trekking
• Observación de aves
• Pesca deportiva
• Windsurf y kayak`,
        property_type: 'cabin',
        area: 'ullum',
        address: 'Ullúm, San Juan',
        coordinates: JSON.stringify({ lat: -31.4167, lng: -68.6667 }),
        images: [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        ],
        amenities: ['wifi', 'parking', 'bbq', 'garden', 'kitchen'],
        capacity: 6,
        bedrooms: 2,
        bathrooms: 1,
        price_daily: 12000,
        price_weekly: 75000,
        price_monthly: 280000,
        rules: [
          'Mascotas permitidas',
          'Respetar la naturaleza',
          'No ruidos molestos después de las 23:00',
          'Check-in: 16:00 - 20:00',
          'Check-out: 11:00'
        ],
        status: 'active'
      }
    ];

    // Insert properties
    for (const property of properties) {
      try {
        const result = await query(`
          INSERT INTO properties (
            owner_id, title, description, property_type, area, address, coordinates,
            images, amenities, capacity, bedrooms, bathrooms, price_daily, price_weekly,
            price_monthly, rules, status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
          ) RETURNING id, title
        `, [
          property.owner_id,
          property.title,
          property.description,
          property.property_type,
          property.area,
          property.address,
          property.coordinates,
          property.images,
          property.amenities,
          property.capacity,
          property.bedrooms,
          property.bathrooms,
          property.price_daily,
          property.price_weekly,
          property.price_monthly,
          property.rules,
          property.status
        ]);

        console.log(`✅ Created property: ${result.rows[0].title}`);
      } catch (error) {
        console.error(`❌ Error creating property ${property.title}:`, error.message);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo accounts created:');
    console.log('Owners:');
    console.log('  - maria.gonzalez@desdeaca.com / demo123');
    console.log('  - carlos.perez@desdeaca.com / demo123');
    console.log('  - ana.rodriguez@desdeaca.com / demo123');
    console.log('Guests:');
    console.log('  - juan.tourist@gmail.com / demo123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };