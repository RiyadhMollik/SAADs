import express from "express";
import multer from "multer";
import { getAllFeedback, addFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getAllFeedback);
router.post("/", upload.single("file"), addFeedback);

export default router;
