import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from  'dotenv';
import cloudinary from "../config/cloudinary.js";

dotenv.config();


// Update User Info
export const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = { ...req.body };

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔹 Handle profile photo update
    if (req.file) {
      // 🔸 Extract old public_id and delete from Cloudinary
      if (user.profilePhoto && user.profilePhoto.publicId) {
        await cloudinary.uploader.destroy(user.profilePhoto.publicId);
      }

      // 🔹 Store new Cloudinary image details
      updates.profilePhoto = {
        imageUrl: req.file.path, // Cloudinary image URL
        publicId: req.file.filename, // Public ID
      };
    }


    // 🔹 Hash password if updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // 🔹 Update user in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

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

// GET user profile Image
export const getUserProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.profilePhoto || !user.profilePhoto.imageUrl || !user.profilePhoto.publicId) {
      return res.status(404).json({ message: "User not found or profile photo not available" });
    }

    res.status(200).json({
      profileImageUrl: user.profilePhoto.imageUrl, // Corrected property
      publicId: user.profilePhoto.publicId
    });

  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};




