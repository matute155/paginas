// backend/models/index.js
const fs   = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const configFile = require('../config/config.js');

// Carga tanto si es development como production, pero no importa el env aquí:
const config = configFile[process.env.NODE_ENV] || configFile.development;

let sequelize;

// 1) Si tenemos DATABASE_URL (de Railway), úsala siempre:
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:        'postgres',
    dialectOptions: config.dialectOptions,
    logging:        false
  });
} else {
  // 2) Si no, caemos al modo individual (development local)
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

// Carga automática de todos los modelos en carpeta
fs
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model       = defineModel(sequelize, DataTypes);
    db[model.name]    = model;
  });

// Aplica asociaciones si existen
Object.keys(db).forEach(name => {
  if (db[name].associate) {
    db[name].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

