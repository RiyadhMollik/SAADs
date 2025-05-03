// routes/farmerRoutes.js
import express from "express";
import {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
} from "../controllers/farmerController.js";

const router = express.Router();

router.post("/farmers", createFarmer);
router.get("/farmers", getFarmers);
router.get("/farmers/:id", getFarmerById);
router.put("/farmers/:id", updateFarmer);
router.delete("/farmers/:id", deleteFarmer);

export default router;
