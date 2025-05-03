import Region from "../models/Region.js";

// Get all regions
export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new region
export const createRegion = async (req, res) => {
  const { name} = req.body;
  try {
    const newRegion = await Region.create({ name});
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a region
export const updateRegion = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;
  try {
    const region = await Region.findByPk(id);
    if (!region) return res.status(404).json({ message: "Region not found" });
    region.name = name || region.name;
    await region.save();
    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a region
export const deleteRegion = async (req, res) => {
  const { id } = req.params;
  try {
    const region = await Region.findByPk(id);
    if (!region) return res.status(404).json({ message: "Region not found" });

    await region.destroy();
    res.status(200).json({ message: "Region deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
