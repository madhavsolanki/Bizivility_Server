import express from "express";
// import { createForm } from "../controllers/listing.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import { uploadListingMiddleware } from "../config/multer.js";
import {
  createForm,
  deleteListing,
  getAllListingByListingStstus,
  getAllListings,
  getAllUniqueCqtegories,
  getAllUserListingByPaymentStatus,
  getAllUserListingsByListingStatus,
  // getListingByCityAndCategory,
  getListingByUserId,
  getListingsByCity,
  getListingsByPaymentStatus,
  updateForm,
  updatePlan,
} from "../controllers/listing.controller.js";

const router = express.Router();

// Create Listings
router
  .route("/create/:id")
  .post(authenticateUser, uploadListingMiddleware, createForm);

// Update Listings
router
  .route("/update/:id")
  .put(authenticateUser, uploadListingMiddleware, updateForm);

// GET All Listings
router.route("/").get(authenticateUser, getAllListings);

// Get Specific Listing by User ID
router.route("/user/:id").get(authenticateUser, getListingByUserId);

// GET All Listings by Payment Status
router
  .route("/payment/:status")
  .get(authenticateUser, getListingsByPaymentStatus);

// GET All Listings by Payment Status for logged in user
router
 .route("/payment/my-listings/:status")
 .get(authenticateUser, getAllUserListingByPaymentStatus);
 
 router
 .route("/status/:status")
 .get(authenticateUser, getAllListingByListingStstus);

 // Get Specific Listing by for logged in user
 router
 .route("/status/my-listings/:status")
 .get(authenticateUser, getAllUserListingsByListingStatus);


 // Update plan of listing
 router.route("/:listingId/change-plan").patch(authenticateUser, updatePlan);

 // Delet user listing
 router
 .route("/delete/:id")
 .delete(authenticateUser, deleteListing);

 // Get all Unique Categories
 router.route("/categories").get(authenticateUser, getAllUniqueCqtegories);

 // GEt all Listings based on city name
  router.route("/listings/city/:city").get(authenticateUser, getListingsByCity);


  // Get listings based on city and category
  // router.route("/listings/city/:city/category/:category").get(authenticateUser, getListingByCityAndCategory);

export default router;
