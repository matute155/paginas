// backend/models/Property.js
module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    price: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    reviews: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    amenities: DataTypes.TEXT,
    image: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'pendiente' },
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    hostName: DataTypes.STRING
  }, {});
  Property.associate = models => {
    Property.hasMany(models.Reservation, { foreignKey: 'propertyId' });
  };
  return Property;
};
