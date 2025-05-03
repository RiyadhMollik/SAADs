import Upazila from "../models/Upazila.js";

// Get all upazilas
export const getAllUpazilas = async (req, res) => {
  try {
    const upazilas = await Upazila.findAll();
    res.status(200).json(upazilas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new upazila
export const createUpazila = async (req, res) => {
  const { name} = req.body;
  try {
    const newUpazila = await Upazila.create({ name});
    res.status(201).json(newUpazila);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an upazila
export const updateUpazila = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;
  try {
    const upazila = await Upazila.findByPk(id);
    if (!upazila) return res.status(404).json({ message: "Upazila not found" });
    upazila.name = name || upazila.name;
    await upazila.save();
    res.status(200).json(upazila);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an upazila
export const deleteUpazila = async (req, res) => {
  const { id } = req.params;
  try {
    const upazila = await Upazila.findByPk(id);
    if (!upazila) return res.status(404).json({ message: "Upazila not found" });

    await upazila.destroy();
    res.status(200).json({ message: "Upazila deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
