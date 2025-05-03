import express from "express";
import {
  getAllAEZs,
  createAEZ,
  updateAEZ,
  deleteAEZ,
} from "../controllers/aezController.js";

const router = express.Router();

router.get("/", getAllAEZs);
router.post("/", createAEZ);
router.put("/:id", updateAEZ);
router.delete("/:id", deleteAEZ);

export default router;
