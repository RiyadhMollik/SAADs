import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  remarks: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  filePath: {
    type: DataTypes.STRING, // Store file path or URL
    allowNull: true,
  },
});

// Define relationships
Feedback.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" }); // Feedback belongs to a User
User.hasMany(Feedback, { foreignKey: "UserId" }); // A User has many Feedback entries

export default Feedback;
