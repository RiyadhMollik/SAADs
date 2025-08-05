import FarmerData from '../models/FarmerData.js';

// Create new farmer data (blank data)
const createFarmerData = async (req, res) => {
  try {
    const { farmerId, saaoId, formData } = req.body;

    // Validate required fields
    if (!farmerId || !saaoId) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and SAAO ID are required'
      });
    }

    // Check if data already exists for this farmer and SAAO
    const existingData = await FarmerData.findOne({
      where: {
        farmerId,
        saaoId
      }
    });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: 'Data already exists for this farmer and SAAO'
      });
    }

    // Create new farmer data
    const farmerData = await FarmerData.create({
      farmerId,
      saaoId,
      formData: formData || {
        0: { irrigation: [], other: {} },
        1: { other: {} },
        2: { other: {} },
        3: { herbicide: [], other: {} },
        4: { other: {} },
        5: { fertilizer: [], other: {} },
        6: { other: {} },
        7: { pesticide: [], other: {} },
        8: { fungicide: [], other: {} },
        9: { other: {} },
        10: { other: {} },
        11: { other: {} }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Farmer data created successfully',
      data: farmerData
    });

  } catch (error) {
    console.error('Error creating farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get farmer data by farmerId and saaoId
const getFarmerData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and SAAO ID are required'
      });
    }

    const farmerData = await FarmerData.findOne({
      where: {
        farmerId,
        saaoId
      }
    });

    if (!farmerData) {
      return res.status(404).json({
        success: false,
        message: 'Farmer data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer data retrieved successfully',
      data: farmerData
    });

  } catch (error) {
    console.error('Error getting farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update farmer data
const updateFarmerData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId, formData } = req.body;

    if (!farmerId || !saaoId || !formData) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, SAAO ID, and form data are required'
      });
    }

    // Find existing data
    const existingData = await FarmerData.findOne({
      where: {
        farmerId,
        saaoId
      }
    });

    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Farmer data not found'
      });
    }

    // Update the data
    await existingData.update({
      formData,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Farmer data updated successfully',
      data: existingData
    });

  } catch (error) {
    console.error('Error updating farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all farmer data for a SAAO
const getAllFarmerDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({
        success: false,
        message: 'SAAO ID is required'
      });
    }

    const farmerDataList = await FarmerData.findAll({
      where: {
        saaoId
      },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'farmerId', 'saaoId', 'formData', 'createdAt', 'updatedAt']
    });

    // Transform data to include farmer information
    const transformedData = farmerDataList.map(item => ({
      id: item.id,
      farmerId: item.farmerId,
      saaoId: item.saaoId,
      farmerName: `Farmer ${item.farmerId}`, // You can join with farmers table if needed
      phone: '', // You can join with farmers table if needed
      village: '', // You can join with farmers table if needed
      formData: item.formData,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Farmer data list retrieved successfully',
      data: transformedData,
      count: transformedData.length
    });

  } catch (error) {
    console.error('Error getting all farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete farmer data
const deleteFarmerData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and SAAO ID are required'
      });
    }

    const deletedCount = await FarmerData.destroy({
      where: {
        farmerId,
        saaoId
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Farmer data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer data deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all WABAS validation data by SAAO
const getAllWABASValidationDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({ success: false, message: 'SAAO ID is required' });
    }

    const list = await FarmerData.findAll({
      where: { saaoId },
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: list, count: list.length });

  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export {
  createFarmerData,
  getFarmerData,
  updateFarmerData,
  getAllFarmerDataBySaao,
  deleteFarmerData,
  getAllWABASValidationDataBySaao
}; 