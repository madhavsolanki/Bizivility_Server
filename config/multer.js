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

// Configure Multer for memory storage
const storage = multer.memoryStorage();

// File Filter (Allow only image files)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize Multer with limits and file filter
export const uploadEventImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter,
});

export const uploadCouponImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter,
});
