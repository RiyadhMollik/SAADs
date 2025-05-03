import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Block = sequelize.define("Block", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT, 
    allowNull: true,  
  },
  longitude: {
    type: DataTypes.FLOAT, 
    allowNull: true,  
  },
  hotspot: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  aez: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  csa: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  region: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  division: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  district: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  upazila: {
    type: DataTypes.STRING, 
    allowNull: true,  
  },
  union: {
    type: DataTypes.STRING, 
    allowNull: true,  
  }
});

export default Block;
