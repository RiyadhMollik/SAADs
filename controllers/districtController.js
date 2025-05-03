import District from "../models/District.js";

// Get all districts
export const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.findAll();
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new district
export const createDistrict = async (req, res) => {
  const { name} = req.body;
  try {
    const newDistrict = await District.create({ name});
    res.status(201).json(newDistrict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a district
export const updateDistrict = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;
  try {
    const district = await District.findByPk(id);
    if (!district) return res.status(404).json({ message: "District not found" });
    district.name = name || district.name;
    await district.save();
    res.status(200).json(district);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a district
export const deleteDistrict = async (req, res) => {
  const { id } = req.params;
  try {
    const district = await District.findByPk(id);
    if (!district) return res.status(404).json({ message: "District not found" });

    await district.destroy();
    res.status(200).json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
