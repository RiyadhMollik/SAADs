import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
// Define the District model with latitude and longitude
const District = sequelize.define("District", {
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

export default District;
