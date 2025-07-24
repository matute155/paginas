// backend/models/index.js

const fs   = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Carga la sección correcta (development o production)
const env    = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

let sequelize;
// Si tienes URL (production), la usamos:
if (config.url) {
  sequelize = new Sequelize(config.url, {
    dialect:      'postgres',
    dialectOptions: config.dialectOptions,
    logging:      false
  });
} else {
  // Si no, caemos a credenciales separadas (development)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host:           config.host,
      port:           config.port,
      dialect:        config.dialect,
      dialectOptions: config.dialectOptions,
      logging:        false
    }
  );
}

const db = {};

// Carga todos los modelos dinámicamente
fs
  .readdirSync(__dirname)
  .filter(f => f !== 'index.js' && f.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model       = defineModel(sequelize, DataTypes);
    db[model.name]    = model;
  });

// Aplica asociaciones (hasMany, belongsTo, etc.)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
