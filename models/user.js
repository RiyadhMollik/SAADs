import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Farmer from "./RegistedUser.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  farmerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Farmer,
      key: "id",
    },
    allowNull: false,
  },
});

// Associations
User.belongsTo(Farmer, { foreignKey: "farmerId" });
Farmer.hasMany(User, { foreignKey: "farmerId" });

export default User;
