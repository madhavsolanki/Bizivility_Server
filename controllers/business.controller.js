import mongoose from "mongoose";
import Business from "../models/business.model.js";
import BusinessAddress from "../models/business_address.model.js";
import User from "../models/user.model.js";


export const createBusiness = async (req, res) => {
  try {

    const { name, ownerName, category, tagline, details, email, bannerImage, isOpen, contact, website, socialMediaHandles, address } = req.body;

    // Check if the user already exists
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Unauthorized: Only registered users can create a business" });
    }

    // Check if all required fields are provided 
    if(!name || !ownerName || !category || !details || !email || !contact || !address){
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the business already exists with the same email
    // const existingBusiness = await Business.findOne({email});
    // if(existingBusiness){
    //   return res.status(400).json({ message: "A business with this email already exists" });
    // }


    // Create business address separately 
    const businessAddress = await BusinessAddress.create({
      address: address.address,
      city: address.city,
      zipCode: address.zipCode,
      state: address.state,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
    });

    // Create a new business
    const newBusiness  = await Business.create({
      name,
      ownerName,
      category,
      tagline,
      details,
      email,
      bannerImage,
      isOpen,
      contact,
      website,
      socialMediaHandles,
      address: businessAddress._id, // Linking the business address
      createdBy: req.user._id, // Getting the user from auth middleware
    });

    // save the business
    await newBusiness.save();
    
    res.status(201).json({ message: "Business created successfully", business: newBusiness });

  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json({ businesses });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
