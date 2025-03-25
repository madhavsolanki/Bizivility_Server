import express from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import {
  getUserController,
  getUserProfileImage,
  updateUserController,
} from "../controllers/user.controller.js";
import { uploadProfile } from "../config/multer.js";

const router = express.Router();

// Get User Info
router.route("/profile").get(authenticateUser, getUserController);

// Update User Info
router.put("/update", authenticateUser, uploadProfile.single("profilePhoto"), updateUserController);

router.get("/profile-image", authenticateUser, getUserProfileImage);




export default router;
