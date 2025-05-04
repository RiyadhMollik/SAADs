// models/farmer.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Farmer = sequelize.define("Farmer", {
  farmerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imoNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  messengerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  alternateContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationalId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agrilCard: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  educationStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  village: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  union: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upazila: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  division: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinates: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aez: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hotspot: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  csa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Rice Crop Details
  farmSize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cultivationSeason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  majorCrops: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  croppingPattern: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  riceVarieties: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plantingMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  irrigationPractices: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fertilizerUsage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soilType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avgProduction: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  plantingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  seedlingAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transplantationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  wateringStages: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  harvestDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pestDiseases: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weedManagement: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
});

Farmer.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Farmer, { foreignKey: "userId" });

export default Farmer;
