import express from "express";
import {
  getAllDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../controllers/divisionController.js";

const router = express.Router();

// Get all divisions
router.get("/divisions", getAllDivisions);

// Create a new division
router.post("/divisions", createDivision);

// Update a division
router.put("/divisions/:id", updateDivision);

// Delete a division
router.delete("/divisions/:id", deleteDivision);

export default router;
