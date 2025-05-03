import express from "express";
import {
  getAllWeatherParameters,
  createWeatherParameter,
  updateWeatherParameter,
  deleteWeatherParameter,
} from "../controllers/weatherParameterController.js";

const router = express.Router();

// Get all weather parameters
router.get("/weather-parameters", getAllWeatherParameters);

// Create a new weather parameter
router.post("/weather-parameters", createWeatherParameter);

// Update a weather parameter
router.put("/weather-parameters/:id", updateWeatherParameter);

// Delete a weather parameter
router.delete("/weather-parameters/:id", deleteWeatherParameter);

export default router;

