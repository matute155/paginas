// backend/models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

// 1) Conexión
const sequelize = new Sequelize(config.url, {
  dialect: 'postgres',
  dialectOptions: config.dialectOptions,
  logging: false
});


const db = {};

// 2) Carga automática de modelos
fs
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model = defineModel(sequelize, DataTypes);
    db[model.name] = model;
  });

// 3) Asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 4) Exportar
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
