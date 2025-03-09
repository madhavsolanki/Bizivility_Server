import Listing from "../models/listing.model.js";

// Create Listing (Admins Only)
export const createListing = async (req, res) => {
    try {
        const { planType, price, features } = req.body;
        if (!planType || !price || !Array.isArray(features) || features.length === 0) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const listing = new Listing({ planType, price, features });
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

// Update Listing (Admins Only)
export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        listing.planType = req.body.planType || listing.planType;
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
