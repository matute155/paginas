// backend/config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host:     process.env.PGHOST,
    port:     process.env.PGPORT,
    dialect:  'postgres',
    dialectOptions: { ssl: { rejectUnauthorized: false } }
  },
  production: {
    url: process.env.DATABASE_URL,       // ← Usa la URL completa
    dialect: 'postgres',
    dialectOptions: { ssl: { rejectUnauthorized: false } }
  }
};
