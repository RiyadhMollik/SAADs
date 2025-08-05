import express from 'express';
import {
  createFarmerData,
  getFarmerData,
  updateFarmerData,
  getAllFarmerDataBySaao,
  deleteFarmerData,
  getAllWABASValidationDataBySaao
} from '../controllers/farmerDataController.js';

const router = express.Router();

// Create new farmer data (blank data)
// POST /api/farmer-data
router.post('/', createFarmerData);

// Get farmer data by farmerId and saaoId
// GET /api/farmer-data/:farmerId?saaoId=123
router.get('/:farmerId', getFarmerData);

// Update farmer data
// PUT /api/farmer-data/:farmerId
router.put('/:farmerId', updateFarmerData);

// Get all farmer data for a SAAO
// GET /api/wabas/saao/:saaoId
router.get('/saao/:saaoId', getAllFarmerDataBySaao);

// Get all WABAS validation data by SAAO
// GET /api/wabas/validation/:saaoId
router.get('/validation/:saaoId', getAllWABASValidationDataBySaao);

// Delete farmer data
// DELETE /api/farmer-data/:farmerId?saaoId=123
router.delete('/:farmerId', deleteFarmerData);

export default router; 