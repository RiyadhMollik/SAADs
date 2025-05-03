import CSA from "../models/CSA.js";

export const getAllCSAs = async (req, res) => {
  try {
    const csas = await CSA.findAll();
    res.status(200).json(csas);
  } catch (error) {
    res.status(500).json({ error: "Error fetching CSAs" });
  }
};

export const createCSA = async (req, res) => {
  const { name} = req.body;
  try {
    const csa = await CSA.create({ name});
    res.status(201).json(csa);
  } catch (error) {
    res.status(500).json({ error: "Error creating CSA" });
  }
};

export const updateCSA = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;
  
  try {
    const csa = await CSA.findByPk(id);
    if (!csa) return res.status(404).json({ error: "CSA not found" });
    
    csa.name = name;
    await csa.save();
    res.status(200).json(csa);
  } catch (error) {
    res.status(500).json({ error: "Error updating CSA" });
  }
};

export const deleteCSA = async (req, res) => {
  const { id } = req.params;
  try {
    const csa = await CSA.findByPk(id);
    if (!csa) return res.status(404).json({ error: "CSA not found" });
    
    await csa.destroy();
    res.status(200).json({ message: "CSA deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting CSA" });
  }
};
