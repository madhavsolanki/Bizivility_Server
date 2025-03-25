import express from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import {
  createAnnouncement,
  deleteAnnoucement,
  getAnnouncements,
} from "../controllers/announcement.controller.js";

const router = express.Router();

router.post("/:listingId", authenticateUser, createAnnouncement);

router.get("/:listingId", authenticateUser, getAnnouncements);

router.delete("/:id", authenticateUser, deleteAnnoucement);

export default router;
