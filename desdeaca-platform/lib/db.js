import { Pool } from 'pg';

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database initialization function
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) DEFAULT 'guest' CHECK (user_type IN ('guest', 'owner')),
        verified BOOLEAN DEFAULT false,
        whatsapp_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('house', 'apartment', 'cabin', 'studio')),
        area VARCHAR(50) NOT NULL,
        address TEXT,
        coordinates JSONB,
        images TEXT[] DEFAULT '{}',
        amenities TEXT[] DEFAULT '{}',
        capacity INTEGER NOT NULL DEFAULT 1,
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        price_daily DECIMAL(10, 2) NOT NULL,
        price_weekly DECIMAL(10, 2),
        price_monthly DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT 'pending_approval' CHECK (status IN ('active', 'inactive', 'pending_approval')),
        rules TEXT[],
        availability_start DATE,
        availability_end DATE,
        blocked_dates DATE[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create inquiries table for tracking contact attempts
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        guest_name VARCHAR(100),
        guest_phone VARCHAR(20),
        guest_email VARCHAR(255),
        check_in DATE,
        check_out DATE,
        guests INTEGER DEFAULT 1,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
      CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
      CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_daily);
      CREATE INDEX IF NOT EXISTS idx_inquiries_property ON inquiries(property_id);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to execute queries
export async function query(text, params) {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to get a client from the pool for transactions
export async function getClient() {
  return await pool.connect();
}

// Graceful shutdown
export async function closePool() {
  await pool.end();
}

export { pool };

// Auto-initialize database on import in production
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  initializeDatabase().catch(console.error);
}