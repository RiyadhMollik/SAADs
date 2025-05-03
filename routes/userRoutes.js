import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById
} from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/", createUser);

// User login
router.post("/login", loginUser);

// Get all users
router.get("/", getUsers);

// Get a specific user by ID
router.get("/:id", getUserById);

// Update a user
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

export default router;
