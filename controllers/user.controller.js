import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from  'dotenv';

dotenv.config();


// Update User Info
export const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from auth middleware
    const updates = { ...req.body }; // Clone request body to avoid mutation

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash password if it's being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    } else {
      delete updates.password; // Ensure password isn't overridden with an empty value
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true, // Ensure validation
    }).select("-password"); // Exclude password from response

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


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




