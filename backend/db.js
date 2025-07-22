const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      location TEXT,
      price INTEGER,
      rating REAL,
      reviews INTEGER,
      capacity INTEGER,
      amenities TEXT,
      image TEXT
    )
  `);
});

module.exports = db;

db.run(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
`);
db.run(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER,
    name TEXT,
    email TEXT,
    checkIn TEXT,
    checkOut TEXT,
    guests INTEGER,
    FOREIGN KEY (propertyId) REFERENCES properties(id)
  )
`);

db.run(`ALTER TABLE properties ADD COLUMN status TEXT DEFAULT 'pendiente'`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna status:', err.message);
  } else {
    console.log('Columna status agregada (o ya existía)');
  }
});

db.run(`ALTER TABLE properties ADD COLUMN description TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna description:', err.message);
  }
});
db.run(`ALTER TABLE properties ADD COLUMN address TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna address:', err.message);
  }
});
db.run(`ALTER TABLE properties ADD COLUMN phone TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna phone:', err.message);
  }
});
db.run(`ALTER TABLE properties ADD COLUMN contactEmail TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna contactEmail:', err.message);
  }
});
db.run(`ALTER TABLE properties ADD COLUMN hostName TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error agregando columna hostName:', err.message);
  }
});
