import User from "../models/user.model.js";
import Form from "../models/form.model.js";
import Listing from "../models/listing.model.js";

/**
 * @desc Middleware to check if the requester is an admin
 */
const isAdmin = (req) => req.user && req.user.role === "admin";

/**
 * @route POST /api/forms/:userId/:planId
 * @desc Create a new form (Only Admin)
 */
export const createForm = async (req, res) => {
  try {
    if(!isAdmin(req))
      return res.status(403).json({ message: "Access denied. Only admins can fill forms" });

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
    if (!isAdmin(req)) 
      return res.status(403).json({ message: "Access denied. Admins only." });

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
    if (!isAdmin(req)) return res.status(403).json({ message: "Access denied. Admins only." });

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
    if (!isAdmin(req)) return res.status(403).json({ message: "Access denied. Admins only." });

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
    if (!isAdmin(req)) return res.status(403).json({ message: "Access denied. Admins only." });

    const { formId } = req.params;
    const deletedForm = await Form.findByIdAndDelete(formId);

    if (!deletedForm) return res.status(404).json({ message: "Form not found." });

    res.status(200).json({ message: "Form deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};