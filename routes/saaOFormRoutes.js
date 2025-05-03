// routes/saaOFormRoutes.js
import express from "express";
import {
  createSAAOForm,
  getAllSAAOForms,
  getSAAOFormById,
  updateSAAOForm,
  deleteSAAOForm,
} from "../controllers/saaOFormController.js";

const router = express.Router();

// Route to create a new SAAO Form
router.post("/", createSAAOForm);

// Route to get all SAAO Forms
router.get("/", getAllSAAOForms);

// Route to get a specific SAAO Form by ID
router.get("/:id", getSAAOFormById);

// Route to update an existing SAAO Form
router.put("/:id", updateSAAOForm);

// Route to delete a SAAO Form by ID
router.delete("/:id", deleteSAAOForm);

export default router;
