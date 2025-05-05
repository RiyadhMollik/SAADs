// controllers/farmerController.js
import Farmer from "../models/RegistedUser.js";

// Create a new farmer
export const createFarmer = async (req, res) => {
  
  console.log(req.body);
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (error) {
    console.error(error);
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

// Get farmers by role
export const getFarmersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const parsedLimit = parseInt(limit, 10);
    
    const farmers = await Farmer.findAll({
      where: { role },
      limit: parsedLimit,
      offset: offset,
    });

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found with this role" });
    }
    const totalFarmers = await Farmer.count({ where: { role } });
    const totalPages = Math.ceil(totalFarmers / parsedLimit);
    res.status(200).json({
      data: farmers,
      pagination: {
        currentPage: page,
        totalPages,
        totalFarmers,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  