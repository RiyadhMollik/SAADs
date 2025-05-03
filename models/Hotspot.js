import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Hotspot = sequelize.define("Hotspot", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default Hotspot;

