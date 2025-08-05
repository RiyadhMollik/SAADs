import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FarmerData = sequelize.define('FarmerData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  farmerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'farmers', // Assuming you have a farmers table
      key: 'id'
    }
  },
  saaoId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users', // Assuming you have a users table for SAAO
      key: 'id'
    }
  },
  formData: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      0: { irrigation: [], other: {} },
      1: { other: {} },
      2: { other: {} },
      3: { herbicide: [], other: {} },
      4: { other: {} },
      5: { fertilizer: [], other: {} },
      6: { other: {} },
      7: { pesticide: [], other: {} },
      8: { fungicide: [], other: {} },
      9: { other: {} },
      10: { other: {} },
      11: { other: {} }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'farmer_data',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['farmerId', 'saaoId']
    }
  ]
});

export default FarmerData; 