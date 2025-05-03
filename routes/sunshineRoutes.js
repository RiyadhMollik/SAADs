import express from 'express';
import { getSunshineData } from '../controllers/sunshineController.js';

const router = express.Router();

router.get('/sunshine', getSunshineData);

export default router;
