import express from "express";
import {
  getAllUpazilas,
  createUpazila,
  updateUpazila,
  deleteUpazila,
} from "../controllers/upazilaController.js";

const router = express.Router();

// Get all upazilas
router.get("/upazilas", getAllUpazilas);

// Create a new upazila
router.post("/upazilas", createUpazila);

// Update an upazila
router.put("/upazilas/:id", updateUpazila);

// Delete an upazila
router.delete("/upazilas/:id", deleteUpazila);

export default router;
