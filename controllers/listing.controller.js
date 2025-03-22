import Form from "../models/listing.model.js";
import { v2 as cloudinary } from "cloudinary";
import Listing from "../models/plan.model.js";

function getPublicId(cloudinaryUrl) {
  // Step 1: Remove Cloudinary base URL and version part (v123456)
  const regex = /\/upload\/v\d+\/(.+?)\.\w+$/;
  const match = cloudinaryUrl.match(regex);

  // Step 2: Extract the public_id
  return match ? match[1] : null;
}

export const createForm = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const buyerId = req.user._id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Plan is required" });
    }

    const {
      listingTitle,
      businessTagline,
      customAddress,
      latitude,
      longitude,
      city,
      phoneNumber,
      websiteUrl,
      category,
      delivery,
      takeOut,
      amenities,
      gender,
      acceptPayments,
      priceRange,
      priceFrom,
      priceTo,
      businessHours,
      socialMediaLinks,
      frequentlyAskedQuestions,
      moreInformation,
      tagsOrKeywords,
    } = req.body;

    let images = [];
    let businessLogo = "";

    // ✅ Correctly extract multiple images
    if (req.files && req.files["images"]) {
      images = req.files["images"].map((file) => {
        return {
          imageUrl: file.path,
          publicId: getPublicId(file.path),
        };
      });
    }

    // ✅ Correctly extract single business logo
    if (req.files && req.files["businessLogo"]) {
      businessLogo = {
        imageUrl: req.files["businessLogo"][0].path,
        publicId: getPublicId(req.files["businessLogo"][0].path),
      };
    }

    // ✅ Apply lowercase & trim transformations at the controller level
    const formattedCity = city
      ? city.toLowerCase().trim().replace(/\s+/g, "")
      : "";
    const formattedCategory = category
      ? category.toLowerCase().trim().replace(/\s+/g, "")
      : "";

    // ✅ Now store all images properly
    const newForm = new Form({
      buyerId,
      plan: id,
      listingTitle,
      businessTagline,
      customAddress,
      latitude,
      longitude,
      city : formattedCity,
      phoneNumber,
      websiteUrl,
      category : formattedCategory,
      delivery,
      takeOut,
      amenities: amenities ? JSON.parse(amenities) : [],
      gender,
      acceptPayments: acceptPayments ? JSON.parse(acceptPayments) : [],
      priceRange,
      priceFrom,
      priceTo,
      businessHours: businessHours ? JSON.parse(businessHours) : {},
      socialMediaLinks: socialMediaLinks ? JSON.parse(socialMediaLinks) : {},
      frequentlyAskedQuestions: frequentlyAskedQuestions
        ? JSON.parse(frequentlyAskedQuestions)
        : {},
      moreInformation,
      tagsOrKeywords: tagsOrKeywords ? JSON.parse(tagsOrKeywords) : {},
      images, // Now stores multiple images correctly
      businessLogo,
    });

    await newForm.save();
    res
      .status(201)
      .json({ message: "Listing created successfully", data: newForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params; // Form ID
    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (form.buyerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this listing" });
    }

    const {
      isPaid,
      listingStatus,
      listingTitle,
      businessTagline,
      customAddress,
      latitude,
      longitude,
      city,
      phoneNumber,
      websiteUrl,
      category,
      delivery,
      takeOut,
      amenities,
      gender,
      acceptPayments,
      priceRange,
      priceFrom,
      priceTo,
      businessHours,
      socialMediaLinks,
      frequentlyAskedQuestions,
      moreInformation,
      tagsOrKeywords,
    } = req.body;

    let updatedImages = form.images || [];
    let updatedBusinessLogo = form.businessLogo;

    // **Handle Image Updates**
    if (req.files && req.files["images"]) {
      // ✅ Delete old images from Cloudinary before uploading new ones
      for (const { publicId } of form.images) {
        await cloudinary.uploader.destroy(publicId);
      }

      // ✅ Upload new images to Cloudinary
      updatedImages = req.files["images"].map((file) => {
        return {
          imageUrl: file.path,
          publicId: getPublicId(file.path),
        };
      });
    }

    // **Handle Business Logo Update**
    if (req.files && req.files["businessLogo"]) {
      // ✅ Delete old business logo from Cloudinary before uploading new one
      if (form.businessLogo) {
        await cloudinary.uploader.destroy(form.businessLogo.publicId);
      }

      // ✅ Upload new business logo to Cloudinary
      updatedBusinessLogo = {
        imageUrl: req.files["businessLogo"][0].path,
        publicId: getPublicId(req.files["businessLogo"][0].path),
      };
    }

    // ✅ Apply lowercase & trim transformations at the controller level
    const formattedCity = city ? city.toLowerCase().trim().replace(/\s+/g, "") : form.city;
    const formattedCategory = category ? category.toLowerCase().trim().replace(/\s+/g, "") : form.category;

    // **Update only provided fields & preserve old values**
    form.listingTitle = listingTitle || form.listingTitle;
    form.businessTagline = businessTagline || form.businessTagline;
    form.customAddress = customAddress || form.customAddress;
    form.latitude = latitude || form.latitude;
    form.longitude = longitude || form.longitude;
    form.city = formattedCity || form.city;
    form.phoneNumber = phoneNumber || form.phoneNumber;
    form.websiteUrl = websiteUrl || form.websiteUrl;
    form.category = formattedCategory || form.category;
    form.delivery = delivery !== undefined ? delivery : form.delivery;
    form.takeOut = takeOut !== undefined ? takeOut : form.takeOut;
    form.amenities = amenities ? JSON.parse(amenities) : form.amenities;
    form.gender = gender || form.gender;
    form.acceptPayments = acceptPayments
      ? JSON.parse(acceptPayments)
      : form.acceptPayments;
    form.priceRange = priceRange || form.priceRange;
    form.priceFrom = priceFrom || form.priceFrom;
    form.priceTo = priceTo || form.priceTo;
    form.businessHours = businessHours
      ? JSON.parse(businessHours)
      : form.businessHours;
    form.socialMediaLinks = socialMediaLinks
      ? JSON.parse(socialMediaLinks)
      : form.socialMediaLinks;
    form.frequentlyAskedQuestions = frequentlyAskedQuestions
      ? JSON.parse(frequentlyAskedQuestions)
      : form.frequentlyAskedQuestions;
    form.moreInformation = moreInformation || form.moreInformation;
    form.tagsOrKeywords = tagsOrKeywords
      ? JSON.parse(tagsOrKeywords)
      : form.tagsOrKeywords;
    form.images = updatedImages;
    form.businessLogo = updatedBusinessLogo;
    (form.isPaid = isPaid || form.isPaid),
      (form.listingStatus = listingStatus || form.listingStatus);
    await form.save();

    res
      .status(200)
      .json({ message: "Listing updated successfully", data: form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Form.find();
    res.json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getListingByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const listings = await Form.find({ buyerId: id });
    res.json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Listing Based on Payment Status
export const getListingsByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validathe the status
    if (!["PENDING", "SUCCESS"].includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid payment status. Please provide either PENDING or SUCCESS.",
        });
    }

    // fetch listings based on isPaid Status
    const listings = await Form.find({ isPaid: status.toUpperCase() });

    if (!listings.length) {
      return res
        .status(404)
        .json({
          message: "No listings found with the provided payment status.",
        });
    }

    res
      .status(200)
      .json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET  All listings based on Payment Status but it is user specific
export const getAllUserListingByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate the payment status string
    if (!["PENDING", "SUCCESS"].includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid payment status. Please provide either PENDING or SUCCESS.",
        });
    }

    const { id } = req.user; // User ID
    const listings = await Form.find({
      isPaid: status.toUpperCase(),
      buyerId: id,
    });
    if (!listings.length) {
      return res
        .status(404)
        .json({
          message: "No listings found with the provided payment status.",
        });
    }
    res
      .status(200)
      .json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET all listings based on listingStatus  (pass the ENUM Value) not user specific
export const getAllListingByListingStstus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate the listing status string
    if (!["PENDING", "EXPIRED", "PUBLISHED"].includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid listing status. Please provide either PENDING, EXPIRED or PUBLISHED.",
        });
    }

    const listings = await Form.find({ listingStatus: status.toUpperCase() });

    if (!listings.length) {
      return res
        .status(404)
        .json({
          message: "No listings found with the provided listing status.",
        });
    }

    res
      .status(200)
      .json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET all listing Based on status for particular user (pass the ENUM Value)  user specific
export const getAllUserListingsByListingStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate the listing status string
    if (!["PENDING", "EXPIRED", "PUBLISHED"].includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid listing status. Please provide either PENDING, EXPIRED or PUBLISHED.",
        });
    }
    const { id } = req.user; // User ID

    const listings = await Form.find({
      listingStatus: status.toUpperCase(),
      buyerId: id,
    });

    if (!listings.length) {
      return res
        .status(404)
        .json({
          message: "No listings found with the provided listing status.",
        });
    }

    res
      .status(200)
      .json({ message: "Listings fetched successfully", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update pplan
export const updatePlan = async (req, res) => {
  try {
    const { listingId } = req.params; // User ID
    const { planId } = req.body; // Get new plan id from request body

    const userId = req.user.id; // Get logged in user id

    // Validate request data
    if (!planId) {
      return res.status(400).json({ message: "Plan ID is required." });
    }

    // Check if the plan exists in the listing collection
    const planExists = await Listing.findById(planId);
    if (!planExists) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // find the listing in db
    const listing = await Form.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Ensure the logged-in user in the owner of the listing
    if (listing.buyerId.toString() != userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot update this listing" });
    }

    // update the plan
    listing.plan = planId;
    await listing.save();

    return res.status(200).json({
      message: "Plan updated successfully",
      data: listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available in req.user

    // Find the listing by ID
    const listing = await Form.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Check if the logged-in user is the real owner of the listing
    if (listing.buyerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot delete this listing" });
    }

    // Construct the folder name
    const folderName = `listing_images/${req.user.username}_${req.user._id}`;

    // Delete the folder from Cloudinary (this deletes all images inside it)
    await cloudinary.api.delete_resources_by_prefix(folderName);
    await cloudinary.api.delete_folder(folderName);

    // Delete the listing document from the database
    await listing.deleteOne();

    res
      .status(200)
      .json({ message: "Listing and associated images deleted successfully." });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET All unique cqtegories from the db
export const getAllUniqueCqtegories = async (req, res) => {
  try {
    const categories = await Form.distinct("category"); // Fetch all unique categories

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching unique categories:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

// Get all listins based on city name
export const getListingsByCity = async (req, res) => {
  try {
    let { city } = req.params;  // Get City from URL Params
    if(!city){
      return res.status(400).json({message: "City is required"});
    }

     // Convert input to lowercase and trim to match DB format
     city = city.toLowerCase().trim();

    const listings = await Form.find({ city: city});

    if(listings.length === 0){
      return res.status(404).json({message: "No listings found in this city"});
    }

    res.status(200).json({ listings });

  } catch (error) {
    console.error("Error fetching listings by city:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}





