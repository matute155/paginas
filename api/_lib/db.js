import { Sequelize, DataTypes } from 'sequelize';

let sequelize = null;

function getSequelizeInstance() {
  if (!sequelize) {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL o POSTGRES_URL debe estar configurada');
    }

    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
  
  return sequelize;
}

function defineModels(sequelize) {
  const models = {};

  // Modelo Property (completo)
  models.Property = sequelize.define('Property', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0
    },
    reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amenities: {
      type: DataTypes.TEXT,
      defaultValue: '[]'
    },
    image: {
      type: DataTypes.TEXT,
      defaultValue: '[]'
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
      defaultValue: 'pendiente'
    },
    description: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    contactEmail: {
      type: DataTypes.STRING
    },
    hostName: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Properties',
    timestamps: true
  });

  // Modelo Reservation (completo)
  models.Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    checkIn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkOut: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Reservations',
    timestamps: true
  });

  // Modelo Admin (completo)
  models.Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Admins',
    timestamps: true
  });

  // Asociaciones
  models.Property.hasMany(models.Reservation, { foreignKey: 'propertyId' });
  models.Reservation.belongsTo(models.Property, { foreignKey: 'propertyId' });

  return models;
}

async function getModels() {
  const sequelize = getSequelizeInstance();
  const models = defineModels(sequelize);
  
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
  
  return { sequelize, ...models };
}

function parseJsonField(field, defaultValue = []) {
  if (!field) return defaultValue;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  return field;
}

export { getModels, parseJsonField };