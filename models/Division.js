import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Define the Division model with latitude and longitude
const Division = sequelize.define("Division", {
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

export default Division;
