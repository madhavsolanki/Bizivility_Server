import User from "../models/user.model.js";
import Form from "../models/form.model.js";
import Listing from "../models/listing.model.js";
import nodemailer from "nodemailer";

/**
 * @desc Middleware to check if the requester is an admin
 */
const isUser = (req) => req.user && req.user.role === "user";

/**
 * @desc Sends an email notification to the user after form submission
 */
const sendEmailNotification = async (userEmail, listingTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: userEmail,
      subject: "Form Submission Confirmation - Bizivility",
      html: `
        <p>Dear Valued Customer,</p>
        <p>Thank you for submitting your form for <strong>${listingTitle}</strong>.</p>
        <p>We appreciate your trust in <strong>Bizivility</strong>.</p>
        <p>Best regards,</p>
        <p><strong>Bizivility Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    res.json({
      success: false,
      message: "Failed to send email notification.",
      error: error.message
    })
  }
}

/**
 * @route POST /api/forms/:userId/:planId
 * @desc Create a new form (Only Admin)
 */
export const createForm = async (req, res) => {
  try {
    if (!isUser(req)) return res.status(403).json({ message: "Access denied. Users only." });

    const { userId, planId} = req.params;
    const formData = req.body;

    const user = await User.findById(userId);

    if(!user || user.role !== "user")
      return res.status(404).json({ message: "User not found or invalid role." });

    const plan = await Listing.findById(planId);

    if(!plan)
      return res.status(404).json({ message: "Plan not found." });

    const newForm = new Form({buyerId: userId, plan:planId, ...formData});
    await newForm.save();

    // Update the user's associatedForms array
    user.associatedForms.push(newForm._id);
    await user.save();

    // Send email notification
    await sendEmailNotification(user.email, formData.primaryDetails.listingTitle);

    res.status(201).json({ message: "Form Submitted successfully.", form: newForm });

  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
}

/**
 * @route PUT /api/forms/:formId
 * @desc Update form details (Only Admin)
 */
export const updateForm = async (req, res) => {
  try {

    const { formId } = req.params;
    const updatedData = req.body;

    // Fetch the existing form data
    const existingForm = await Form.findById(formId);
    if (!existingForm) 
      return res.status(404).json({ message: "Form not found." });

    // Deep merge existing form data with updated data
    const mergedData = { ...existingForm.toObject(), ...updatedData };

    // Update form using `save()` instead of `findByIdAndUpdate()`
    Object.assign(existingForm, mergedData);
    await existingForm.save(); // `save()` ensures proper validation

    res.status(200).json({ message: "Form updated successfully.", form: existingForm });

  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};


/**
 * @route GET /api/forms
 * @desc Get all forms (Only Admin)
 */
export const getAllForms = async (req, res) => {
  try {
   

    const forms = await Form.find().populate("buyerId plan");
    res.status(200).json({ message: "Forms fetched successfully.", forms });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @route GET /api/forms/:formId
 * @desc Get a single form (Only Admin)
 */
export const getSingleForm = async (req, res) => {
  try {

    const { formId } = req.params;
    const form = await Form.findById(formId).populate("buyerId plan");

    if (!form) return res.status(404).json({ message: "Form not found." });

    res.status(200).json({ message: "Form fetched successfully.", form });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @route DELETE /api/forms/:formId
 * @desc Delete a form (Only Admin)
 */
export const deleteForm = async (req, res) => {
  try {

    const { formId } = req.params;
    const deletedForm = await Form.findByIdAndDelete(formId);

    if (!deletedForm) return res.status(404).json({ message: "Form not found." });

    res.status(200).json({ message: "Form deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};