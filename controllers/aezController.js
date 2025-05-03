import AEZ from "../models/AEZ.js";

export const getAllAEZs = async (req, res) => {
  try {
    const aezs = await AEZ.findAll();
    res.status(200).json(aezs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching AEZs" });
  }
};

export const createAEZ = async (req, res) => {
  const { name } = req.body;
  try {
    const aez = await AEZ.create({ name });
    res.status(201).json(aez);
  } catch (error) {
    res.status(500).json({ error: "Error creating AEZ" });
  }
};

export const updateAEZ = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const aez = await AEZ.findByPk(id);
    if (!aez) return res.status(404).json({ error: "AEZ not found" });
    aez.name = name;
    await aez.save();
    res.status(200).json(aez);
  } catch (error) {
    res.status(500).json({ error: "Error updating AEZ" });
  }
};

export const deleteAEZ = async (req, res) => {
  const { id } = req.params;
  try {
    const aez = await AEZ.findByPk(id);
    if (!aez) return res.status(404).json({ error: "AEZ not found" });

    await aez.destroy();
    res.status(200).json({ message: "AEZ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting AEZ" });
  }
};
