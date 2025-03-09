import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import UserBusinessInteraction from "../models/user_interaction.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from  'dotenv';
import Business from "../models/business.model.js";

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

// Delete User
export const deleteUserController = async (req, res) => {
  try {
    // Authenticated User Id
    const userId = req.user._id;
    
    // Find the User
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ message: "User not found." });
    }

    // Delete User Businesses
    await Business.deleteMany({createdBy: userId});

    // Delete User Reviews
    await Review.deleteMany({createdBy: userId});
    
    // Delete User User Business Interactions
    await UserBusinessInteraction.deleteMany({userId: userId});

    // Delete the User
    await User.findByIdAndDelete(userId);

    // Send account deletion confirmation on email
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: "Account Deletion Successfully",
      text: `Dear ${user.firstName},\n\nYour account has been successfully deleted.\n\nIf this was a mistake, please contact support.\n\nBest regards,\nYour Company`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        console.log("Error sending email: ", err);
      }
      else{
        console.log("Email Sent: ", info.response);
      }
    });

    res.status(200).json({ message: "Account deleted successfully." });

  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({message: "Internal Server Error"})
  }
}


