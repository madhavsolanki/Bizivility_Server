import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from  'dotenv';

dotenv.config();

// nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  },
});

// Generate random password function
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // Generates an 8-character password
};

// -------------------------- Controllers --------------------------------

export const registerController = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Please provide username and email." });
    }

    const userExists = await User.findOne({ username, email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Send email with the generator password

    await transporter.sendMail({
      from: "Hi i am from Bizivility madhav75solanki@gmail.com",
      to: email,
      subject: "Your Bizivility Password",
      text: `Hello ${username}, your account has been created. Your password is: ${randomPassword}`,
    });

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Check your email for the password.",
      user: { username, email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server Error ${error}` });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

    res.status(200).json({ success: true, message: "Login successful.", token: token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email." });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user Password in DB
    user.password = hashedPassword;
    await user.save();

    // Send email with new password
    await transporter.sendMail({
      from: "Hi i am from Bizivility madhav75solanki@gmail.com",
      to: email,
      subject: "Your Password Reset request",
      text: `Hello ${user.username}, your new password is: ${newPassword}. Please login and update it.`,
    });

    res.status(200).json({ success: true, message: "New password sent to your email." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
}