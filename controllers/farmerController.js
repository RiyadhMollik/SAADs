// controllers/farmerController.js
import Farmer from "../models/farmer.js";

// Create a new farmer
export const createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all farmers
export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.findAll();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a farmer by ID
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a farmer
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    await farmer.update(req.body);
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a farmer
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    await farmer.destroy();
    res.status(200).json({ message: "Farmer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
