import express from "express";
import { getAllBlocks, createBlock, updateBlock, deleteBlock } from "../controllers/blockController.js";

const router = express.Router();

// Get all blocks
router.get("/blocks", getAllBlocks);

// Create a new block
router.post("/blocks", createBlock);

// Update a block
router.put("/blocks/:id", updateBlock);

// Delete a block
router.delete("/blocks/:id", deleteBlock);

export default router;
