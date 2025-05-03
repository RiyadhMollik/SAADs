import express from "express";
import {
  getAllRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "../controllers/regionController.js";

const router = express.Router();

// Get all regions
router.get("/regions", getAllRegions);

// Create a new region
router.post("/regions", createRegion);

// Update a region
router.put("/regions/:id", updateRegion);

// Delete a region
router.delete("/regions/:id", deleteRegion);

export default router;
