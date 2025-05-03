import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Permission = sequelize.define("Permission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isGranted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
});

export default Permission;
