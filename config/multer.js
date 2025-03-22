import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/**
 * 📌 Storage for Profile Photos
 */
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_photos",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `user_${req.user._id}_${Date.now()}`,
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadProfile = multer({ storage: profileStorage }); // ✅ Fix: Ensure multer is applied correctly

/**
 * 📌 Storage for Listing Images
 */
/**
 * 📌 Storage for Listing Images and Business Logo
 */
const listingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (!req.user) throw new Error("User not authenticated");

    return {
      folder: `listing_images/${req.user.username}_${req.user._id}`,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `listing_${Date.now()}_${file.originalname}`,
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    };
  },
});

const uploadListing = multer({ storage: listingStorage });

export const uploadListingMiddleware = uploadListing.fields([
  { name: "images", maxCount: 5 }, // Allows multiple images
  { name: "businessLogo", maxCount: 1 }, // Only one business logo
]);

export { uploadProfile, uploadListing }; // ✅ Fix: Ensure export is correct
