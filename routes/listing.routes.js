import express from "express";
import { createListing, getListings, updateListing, deleteListing } from "../controllers/listing.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js.js";

const router = express.Router();

router.post("/", authenticateUser, isAdmin, createListing);
router.get("/", getListings);
router.put("/:id", authenticateUser, isAdmin, updateListing);
router.delete("/:id", authenticateUser, isAdmin, deleteListing);

export default router;
