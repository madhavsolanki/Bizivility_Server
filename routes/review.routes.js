import express from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import {
  deleteReview,
  getAllReviews,
  // getListingsByRating,
  getUserReviews,
  postReview,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/:formId", authenticateUser, postReview);

router.put("/:reviewId", authenticateUser, updateReview);

router.get("/listing/:formId", authenticateUser, getAllReviews);

router.get("/user", authenticateUser, getUserReviews);

router.delete("/:reviewId", authenticateUser, deleteReview);

// router.get("/by-rating", getListingsByRating);

export default router;
