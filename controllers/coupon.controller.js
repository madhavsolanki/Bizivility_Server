import Coupon from "../models/coupon.model.js";
import Form from "../models/listing.model.js";
import cloudinary from "../config/cloudinary.js"; // Ensure you have this function
import { Readable } from "stream";

export const createCoupon = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login" });
    }

    const listing = await Form.findById(planId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (!listing.buyerId || listing.buyerId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You are not the buyer of this listing",
      });
    }

    if (listing.isPaid !== "SUCCESS" || listing.listingStatus !== "PUBLISHED") {
      return res.status(400).json({
        message:
          "Invalid listing status or payment status. Listing should be PUBLISHED and paid successfully",
      });
    }

    const {
      title,
      couponCode,
      discountValue,
      couponStart,
      couponsEnd,
      details,
    } = req.body;

    if (!title || !couponCode || !discountValue || !couponStart || !couponsEnd) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    let parsedCouponStart = {};
    let parsedCouponsEnd = {};

    try {
      parsedCouponStart = JSON.parse(couponStart);
      parsedCouponsEnd = JSON.parse(couponsEnd);
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON format in date fields" });
    }

    if (
      !parsedCouponStart.startDate ||
      !parsedCouponStart.startTime ||
      !parsedCouponsEnd.endDate ||
      !parsedCouponsEnd.endTime
    ) {
      return res.status(400).json({ message: "Please provide valid start and end date/time" });
    }

    // Handle Image Upload
    let couponImage = {};
    if (req.file) {
      try {
        const uploadedImage = await uploadToCloudinary(req.file.buffer);
        couponImage = {
          imageUrl: uploadedImage.imageUrl,  // Store secure_url
          publicId: uploadedImage.publicId,  // Store public ID
        };
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
      }
    }

    const newCoupon = new Coupon({
      listing: planId,
      user: userId,
      title,
      couponCode,
      discountValue,
      couponStart: parsedCouponStart,
      couponsEnd: parsedCouponsEnd,
      details,
      couponImage, // Ensure image details are stored properly
    });

    await newCoupon.save();
    await Form.findByIdAndUpdate(planId, { $push: { coupons: newCoupon._id } });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });

  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "coupon_images", resource_type: "image" }, // Ensure it's treated as an image
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve({
          imageUrl: result.secure_url, // Correctly retrieve image URL
          publicId: result.public_id,  // Retrieve Cloudinary public ID
        });
      }
    );

    Readable.from(buffer).pipe(stream); // Ensure the buffer is correctly passed
  });
};

/**
 * Get all coupons for a specific listing
 */
export const getAllCoupons = async (req, res) => {
  try {
    const { planId } = req.params;

    // Check if listing exists
    const listing = await Form.findById(planId).populate("coupons");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: "Coupons retrieved successfully",
      coupons: listing.coupons,
    });

  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Delete a specific coupon
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    // Find coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Remove the coupon image from Cloudinary if it exists
    if (coupon.couponImage && coupon.couponImage.publicId) {
      try {
        await cloudinary.uploader.destroy(coupon.couponImage.publicId);
      } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
      }
    }

    // Remove coupon reference from listing
    await Form.findByIdAndUpdate(coupon.listing, { $pull: { coupons: couponId } });

    // Delete the coupon
    await Coupon.findByIdAndDelete(couponId);

    res.status(200).json({ message: "Coupon deleted successfully" });

  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};