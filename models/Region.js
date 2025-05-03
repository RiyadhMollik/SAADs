import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Define the Region model with latitude and longitude
const Region = sequelize.define("Region", {
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

export default Region;
