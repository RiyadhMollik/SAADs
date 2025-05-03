// controllers/saaOFormController.js
import SAAOForm from "../models/saaOForm.js";

// Create a new SAAO Form entry
export const createSAAOForm = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      gender,
      age,
      mobileNumber,
      whatsappNumber,
      imoNumber,
      messengerId,
      email,
      alternateContact,
      nationalId,
      educationStatus,
      block,
      union,
      upazila,
      district,
      division,
      region,
      coordinates,
      aez,
      hotspot,
      csa,
      farmSize,
      landType,
      cultivationSeason,
      majorCrops,
      croppingPattern,
      riceVarieties,
      plantingMethod,
      irrigationPractices,
      fertilizerUsage,
      soilType,
      avgProduction,
      plantingDate,
      seedlingAge,
      transplantationDate,
      wateringStages,
      harvestDate,
      pestDiseases,
      weedManagement,
    } = req.body;

    const newSAAOForm = await SAAOForm.create({
      name,
      fatherName,
      gender,
      age,
      mobileNumber,
      whatsappNumber,
      imoNumber,
      messengerId,
      email,
      alternateContact,
      nationalId,
      educationStatus,
      block,
      union,
      upazila,
      district,
      division,
      region,
      coordinates,
      aez,
      hotspot,
      csa,
      farmSize,
      landType,
      cultivationSeason,
      majorCrops,
      croppingPattern,
      riceVarieties,
      plantingMethod,
      irrigationPractices,
      fertilizerUsage,
      soilType,
      avgProduction,
      plantingDate,
      seedlingAge,
      transplantationDate,
      wateringStages,
      harvestDate,
      pestDiseases,
      weedManagement,
    });

    res.status(201).json({ message: "SAAO Form created successfully", data: newSAAOForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating SAAO Form", error: error.message });
  }
};

// Get all SAAO Forms
export const getAllSAAOForms = async (req, res) => {
  try {
    const saaOForms = await SAAOForm.findAll();
    res.status(200).json(saaOForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching SAAO Forms", error: error.message });
  }
};

// Get SAAO Form by ID
export const getSAAOFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const saaOForm = await SAAOForm.findByPk(id);
    
    if (!saaOForm) {
      return res.status(404).json({ message: "SAAO Form not found" });
    }
    
    res.status(200).json(saaOForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching SAAO Form", error: error.message });
  }
};

// Update SAAO Form by ID
export const updateSAAOForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    const [updated] = await SAAOForm.update(updatedData, {
      where: { id },
    });

    if (updated) {
      const updatedSAAOForm = await SAAOForm.findByPk(id);
      res.status(200).json({ message: "SAAO Form updated successfully", data: updatedSAAOForm });
    } else {
      res.status(404).json({ message: "SAAO Form not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating SAAO Form", error: error.message });
  }
};

// Delete SAAO Form by ID
export const deleteSAAOForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SAAOForm.destroy({ where: { id } });

    if (deleted) {
      res.status(200).json({ message: "SAAO Form deleted successfully" });
    } else {
      res.status(404).json({ message: "SAAO Form not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting SAAO Form", error: error.message });
  }
};
