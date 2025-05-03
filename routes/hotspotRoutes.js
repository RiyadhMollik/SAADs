import express from "express";
import {
  getAllHotspots,
  createHotspot,
  updateHotspot,
  deleteHotspot,
} from "../controllers/hotspotController.js";

const router = express.Router();

router.get("/", getAllHotspots);
router.post("/", createHotspot);
router.put("/:id", updateHotspot);
router.delete("/:id", deleteHotspot);

export default router;
