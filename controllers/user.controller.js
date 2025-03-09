import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from  'dotenv';

dotenv.config();

// Naodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Update User Info
export const updateUserController = async (req, res) =>{
  try {

    const userId = req.user._id; // User Id from auth Middleware
    const updates = req.body;  // Fields to Update
    
    // Find the user
    const user = await User.findById(userId);
  
    if(!user){
      return res.status(404).json({ message: "User not found." });
    }

     // Check if password is updated & hash it
     if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updates.password = hashedPassword; // Replace with hashed password
    }

    // Update only Provided Fields
    Object.keys(updates).forEach((key) => {
      if(updates[key] !== undefined && updates[key] !== ""){
        user[key] = updates[key];
      }
    });

    // save the Updated User,
    await user.save();


    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        adreessLine1: user.adreessLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country,
        about: user.about,
        facebookUrl: user.facebookUrl,
        twitterUrl: user.twitterUrl,
        linkedinUrl: user.linkedinUrl,
        instagramUrl: user.instagramUrl,
        pinterest: user.pinterest,
      },
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
}

// Get User Info 
export const getUserController = async (req, res) => {
  try {
    
    const userId = req.user._id;  // Get User Id from middleware

    const user = await User.findById(userId).select("-password");  // Exclude password

    if(!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
     res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
}




