import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

export default router;
  