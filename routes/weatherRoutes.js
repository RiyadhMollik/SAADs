import express from 'express';
import { getRainfall, getTemperature, getHumidity, getSoilMoisture } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/rainfall', getRainfall);
router.get('/temperature', getTemperature);
router.get('/humidity', getHumidity);
router.get('/soil-moisture', getSoilMoisture);

export default router;
