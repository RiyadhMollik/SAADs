import Block from "../models/block.js";

// Get all blocks
export const getAllBlocks = async (req, res) => {
  try {
    const blocks = await Block.findAll();
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new block
export const createBlock = async (req, res) => {
  const { block, latitude, longitude, hotspot, aez, csa, region, division, district, upazila, union } = req.body;
  try {
    const newBlock = await Block.create({
      block,
      latitude,
      longitude,
      hotspot,
      aez,
      csa,
      region,
      division,
      district,
      upazila,
      union
    });
    res.status(201).json(newBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a block
export const updateBlock = async (req, res) => {
  const { id } = req.params;
  const { block, latitude, longitude, hotspot, aez, csa, region, division, district, upazila, union } = req.body;
  try {
    const blockRecord = await Block.findByPk(id);
    if (!blockRecord) return res.status(404).json({ message: "Block not found" });

    blockRecord.block = block || blockRecord.block;
    blockRecord.latitude = latitude || blockRecord.latitude;
    blockRecord.longitude = longitude || blockRecord.longitude;
    blockRecord.hotspot = hotspot || blockRecord.hotspot;
    blockRecord.aez = aez || blockRecord.aez;
    blockRecord.csa = csa || blockRecord.csa;
    blockRecord.region = region || blockRecord.region;
    blockRecord.division = division || blockRecord.division;
    blockRecord.district = district || blockRecord.district;
    blockRecord.upazila = upazila || blockRecord.upazila;
    blockRecord.union = union || blockRecord.union;

    await blockRecord.save();
    res.status(200).json(blockRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a block
export const deleteBlock = async (req, res) => {
  const { id } = req.params;
  try {
    const block = await Block.findByPk(id);
    if (!block) return res.status(404).json({ message: "Block not found" });

    await block.destroy();
    res.status(200).json({ message: "Block deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
