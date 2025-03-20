import Enquiry from "../models/enquiry.model.js";
import Listing from "../models/plan.model.js";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";


/**
 * @desc Create new enquiry
 * @route POST /api/enquiries
 * @access User (Authenticated)
 */
export const sendEnquiry = async (req, res) => {
  try {
     // Ensure only admins can access this route
     if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }
    // Enquiry user must be loggen in before sending an enquiry
    const userId = req.user._id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "Please register first"});
    }
  

    // Get listingId from URL params
    const { listingId } = req.params; 
    if(!listingId){
      return res.status(400).json({ message: "Please provide a listing ID"});
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const {fullName, email, phoneNumber, category} = req.body;

    // Check if enquiry already exists for this user and listing
    let enquiry = await Enquiry.findOne({user: userId});

    if(enquiry){
      // If the listing already exists in the enquiry, do not add it again
      if(enquiry.listings.includes(listingId)){
        return res.status(400).json({message: `You have already generated an enquiry for this plan: ${listing.planType}` })
      }

      // Otherwise, push the new listing ID to the existing enquiry
      enquiry.listings.push(listingId);
    } else {
      // If No Enquiry exists , create a new one
      enquiry = new Enquiry({
        fullName,
        email,
        phoneNumber,
        category,
        user: userId,
        listings: [listingId],
      });
    }

    await enquiry.save();

     // Send confirmation email
     sendEnquiryEmail(email, listing);

     res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
    
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ message: "Enquiry not sent due to Server error" });
  }
}


/**
 * @desc Get all enquiries (Admin only)
 * @route GET /api/enquiries
 * @access Admin
 */
export const getAllEnquiries = async (req, res) => {
  try {
    
     // Ensure only admins can access this route
     if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    // Fetch all enquiries and Populate user & listing details
    const enquiries = await Enquiry.find()
    .populate("user", "fullName email phoneNumber") // Populate user details
    .populate("listings", "planType planDuration price features"); // Populate listing details

    res.status(200).json({
      message: "Enquiries fetched successfully",
      enquiries
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Enquiries not fetched due to Server error" });
  }
};

/**
 * @desc Get a single enquiry by ID (Admin only)
 * @route GET /api/enquiries/:id
 * @access Admin
 */

export const getEnquiryById = async (req, res) => {
  try {
      // Ensure only admins can access this route
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
    const { id } = req.params;

    // Fetch enquiry by ID and Populate user & listing details
    const enquiry = await Enquiry.findById(id)
    .populate("user", "fullName email phoneNumber")  // Populate user details
    .populate("listings", "planType price features"); // Populate listing details

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      message: "Enquiry fetched successfully",
      enquiry
    });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    res.status(500).json({ message: "Enquiry not fetched due to Server error" });
  }
};


/**
 * @desc Send an email upon successful enquiry submission
 * @param {string} email
 * @param {object} listing
 */
const sendEnquiryEmail = async (email, listing) => {
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user:process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
  });

  const mailOptions = {
    from:process.env.SMTP_MAIL,
    to:email,
    subject:"Enquiry Submitted Successfully",
    text: `Thank you for your enquiry. Your selected plan details:\n\n
    Plan Type: ${listing.planType}\n
    Plan Duration: ${listing.planDuration}\n
    Price: ${listing.price}\n
    Features: ${listing.features.join(", ")}\n\n
    We will contact you soon.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      console.error("Error sending email:", error);
    }else{
      console.log("Email sent:", info.response);
    }
  });

};