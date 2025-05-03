import Division from "../models/Division.js";

// Get all divisions
export const getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.findAll();
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new division
export const createDivision = async (req, res) => {
  const { name } = req.body;
  try {
    const newDivision = await Division.create({ name });
    res.status(201).json(newDivision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a division
export const updateDivision = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const division = await Division.findByPk(id);
    if (!division) return res.status(404).json({ message: "Division not found" });
    division.name = name || division.name;
    await division.save();
    res.status(200).json(division);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a division
export const deleteDivision = async (req, res) => {
  const { id } = req.params;
  try {
    const division = await Division.findByPk(id);
    if (!division) return res.status(404).json({ message: "Division not found" });
    await division.destroy();
    res.status(200).json({ message: "Division deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
