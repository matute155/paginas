// backend/models/index.js
const fs   = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const configFile = require('../config/config.js');
const env        = process.env.NODE_ENV || 'development';
const config     = configFile[env] || configFile.development;

// 1) Si hay DATABASE_URL, úsala sin mirar más:
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:        'postgres',
    dialectOptions: config.dialectOptions,
    logging:        false
  });
} else {
  // 2) Si no hay URL, cae al modo individual
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

// resto de carga de modelos y asociaciones…
const db = {};
fs
  .readdirSync(__dirname)
  .filter(f => f !== 'index.js' && f.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model       = defineModel(sequelize, DataTypes);
    db[model.name]    = model;
  });
Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
