import express from "express";
import {
  getAllCSAs,
  createCSA,
  updateCSA,
  deleteCSA,
} from "../controllers/csaController.js";

const router = express.Router();

router.get("/", getAllCSAs);
router.post("/", createCSA);
router.put("/:id", updateCSA);
router.delete("/:id", deleteCSA);

export default router;
