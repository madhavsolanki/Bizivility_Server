import express from "express";
import { uploadCouponImage } from "../config/multer.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controllers/coupon.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";

const router = express.Router();

router.post(
  "/:planId",
  authenticateUser,
  uploadCouponImage.single("couponImage"),
  createCoupon
);

// Get all coupons for a specific listing
router.get("/:planId", authenticateUser, getAllCoupons);

// Delete a specific coupon
router.delete("/:couponId", authenticateUser, deleteCoupon);

export default router;
