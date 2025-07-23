// backend/models/Admin.js
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {});
  return Admin;
};
