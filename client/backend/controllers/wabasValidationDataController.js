import WABASValidationData from '../models/WABASValidationData.js';

// Create
export const createWABASValidationData = async (req, res) => {
  try {
    const { farmerId, saaoId, formData } = req.body;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const existingData = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (existingData) {
      return res.status(400).json({ success: false, message: 'Data already exists for this farmer and SAAO' });
    }

    const defaultFormData = {
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
    };

    const newData = await WABASValidationData.create({
      farmerId,
      saaoId,
      formData: formData || defaultFormData
    });

    res.status(201).json({ success: true, message: 'Data created successfully', data: newData });

  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get by farmerId and saaoId
export const getWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const data = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Update
export const updateWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId, formData } = req.body;

    if (!farmerId || !saaoId || !formData) {
      return res.status(400).json({ success: false, message: 'Farmer ID, SAAO ID, and form data are required' });
    }

    const data = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    await data.update({ formData, updatedAt: new Date() });

    res.status(200).json({ success: true, message: 'Data updated successfully', data });

  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get all by saaoId
export const getAllFarmerDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({
        success: false,
        message: 'SAAO ID is required'
      });
    }

    const farmerDataList = await WABASValidationData.findAll({
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

// Delete
export const deleteWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const deleted = await WABASValidationData.destroy({ where: { farmerId, saaoId } });

    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, message: 'Data deleted successfully' });

  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get all WABAS validation data by SAAO
export const getAllWABASValidationDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({ success: false, message: 'SAAO ID is required' });
    }

    const list = await WABASValidationData.findAll({
      where: { saaoId },
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: list, count: list.length });

  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}; 