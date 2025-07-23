// backend/models/Reservation.js
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    guests: DataTypes.INTEGER
  }, {});
  Reservation.associate = models => {
    Reservation.belongsTo(models.Property, { foreignKey: 'propertyId' });
  };
  return Reservation;
};
