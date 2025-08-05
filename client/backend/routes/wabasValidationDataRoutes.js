import express from 'express';
import {
  createWABASValidationData,
  getWABASValidationData,
  updateWABASValidationData,
  getAllFarmerDataBySaao,
  deleteWABASValidationData,
  getAllWABASValidationDataBySaao
} from '../controllers/wabasValidationDataController.js';

const router = express.Router();

// Create new WABAS validation data
router.post('/', createWABASValidationData);

// Get WABAS validation data by farmerId and saaoId
router.get('/:farmerId', getWABASValidationData);

// Update WABAS validation data
router.put('/:farmerId', updateWABASValidationData);

// Get all WABAS validation data for a SAAO
router.get('/saao/:saaoId', getAllFarmerDataBySaao);

// Get all WABAS validation data by SAAO (alternative endpoint)
router.get('/validation/:saaoId', getAllWABASValidationDataBySaao);

// Delete WABAS validation data
router.delete('/:farmerId', deleteWABASValidationData);

export default router; 