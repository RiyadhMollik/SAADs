import express from "express";
import {
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "../controllers/districtController.js";

const router = express.Router();

// Get all districts
router.get("/districts", getAllDistricts);

// Create a new district
router.post("/districts", createDistrict);

// Update a district
router.put("/districts/:id", updateDistrict);

// Delete a district
router.delete("/districts/:id", deleteDistrict);

export default router;
