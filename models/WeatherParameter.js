import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

// Define the WeatherParameter model
const WeatherParameter = sequelize.define("WeatherParameter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default WeatherParameter;
