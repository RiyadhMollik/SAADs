import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Adjust the path if needed
import Permission from "./Permission.js"; // Assuming Permission is a separate model

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// After creating a new role, set default permissions to false
Role.afterCreate(async (role) => {
  const defaultPermissions = [
    "Roles",
    "Permissions",
    "Farmer List",
    "Farmer Edit",
    "Farmer Delete",
    "SAAO List",
    "SAAO Edit",
    "SAAO Delete",
    "UAO List",
    "UAO Edit",
    "UAO Delete",
    "DD List",
    "DD Edit",
    "DD Delete",
    "AD List",
    "AD Edit",
    "AD Delete",
    "Report",
    "Feedback",
    "Send Feedback",
    "Feedback Table",
    "Add Block",
    "Add Union",
    "Add Upazela",
    "Add District",
    "Add Division",
    "Add Region",
    "Add Hotspot",
    "Add User",
    "Change Password"
  ];

  await Promise.all(
    defaultPermissions.map((permissionName) =>
      Permission.create({
        roleId: role.id,
        permission: permissionName,
        isGranted: false, // All permissions default to false
      })
    )
  );
});

export default Role;
