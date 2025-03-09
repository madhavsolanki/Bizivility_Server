import express from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import {
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get User Info
router.route("/profile").get(authenticateUser, getUserController);

// Update User Info
router.route("/update").put(authenticateUser, updateUserController);

// Delete User Info
router.route("/delete").delete(authenticateUser, deleteUserController);

export default router;
