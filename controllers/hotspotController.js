import Hotspot from "../models/Hotspot.js";

export const getAllHotspots = async (req, res) => {
  try {
    const hotspots = await Hotspot.findAll();
    res.status(200).json(hotspots);
  } catch (error) {
    res.status(500).json({ error: "Error fetching hotspots" });
  }
};

export const createHotspot = async (req, res) => {
  const { name} = req.body;
  try {
    const hotspot = await Hotspot.create({ name});
    res.status(201).json(hotspot);
  } catch (error) {
    res.status(500).json({ error: "Error creating hotspot" });
  }
};

export const updateHotspot = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;

  try {
    const hotspot = await Hotspot.findByPk(id);
    if (!hotspot) return res.status(404).json({ error: "Hotspot not found" });
    hotspot.name = name;
    await hotspot.save();
    res.status(200).json(hotspot);
  } catch (error) {
    res.status(500).json({ error: "Error updating hotspot" });
  }
};

export const deleteHotspot = async (req, res) => {
  const { id } = req.params;
  try {
    const hotspot = await Hotspot.findByPk(id);
    if (!hotspot) return res.status(404).json({ error: "Hotspot not found" });

    await hotspot.destroy();
    res.status(200).json({ message: "Hotspot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting hotspot" });
  }
};
