import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissionsByRole,
  updatePermissions
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/", getRoles); // Fetch all roles
router.post("/", createRole); // Create a new role
router.put("/:id", updateRole); // Update an existing role
router.delete("/:id", deleteRole); // Delete a role
router.get("/roles/:roleId/permissions", getPermissionsByRole);
router.put("/roles/:roleId/permissions", updatePermissions);

export default router;
