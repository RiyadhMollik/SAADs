// models/saaOForm.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SAAOForm = sequelize.define("SAAOForm", {
  // 1. SAAO Identification and Demographics
  name: {
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
  educationStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // 2. Location Information
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

  // 3. Rice Crop Details under Block
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

  // 4. Stage-wise Crop Management Information
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
});

export default SAAOForm;
