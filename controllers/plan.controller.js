import Listing from "../models/plan.model.js";

// Create Listing (Admins Only)
export const createListing = async (req, res) => {
    try {
         
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { planType, planDuration, price, features } = req.body;
        if (!planType || !planDuration || !price || !Array.isArray(features) || features.length === 0) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const listing = new Listing({ planType, planDuration, price, features });
        await listing.save();
        res.status(201).json({ success: true, data: listing });
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get All Listings
export const getListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Fetch Listings by Plan Duration
export const getListingsByDuration = async (req, res) => {
    try {
        const { duration } = req.params; // Get duration from URL parameter

        // Validate input
        if (!["monthly", "annual"].includes(duration.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Invalid plan duration. Use 'monthly' or 'annual'." });
        }

        // Fetch listings based on duration
        const listings = await Listing.find({ planDuration: duration.toLowerCase() });

        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// Update Listing (Admins Only)
export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        listing.planType = req.body.planType || listing.planType;
        listing.planDuration = req.body.planDuration || listing.planDuration;
        listing.price = req.body.price || listing.price;
        listing.features = req.body.features && Array.isArray(req.body.features) ? req.body.features : listing.features;

        await listing.save();
        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Listing (Admins Only)
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
