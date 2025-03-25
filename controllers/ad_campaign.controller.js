import Compaign from "../models/ad_compaingn.model.js";
import Form from "../models/listing.model.js";

export const createAdCampaign = async (req, res) => {
  try {
    
    const {planId} = req.params;
    const userId = req.user._id;  // Logged in user id

    const {days, adPlacement, paymentMethod} = req.body;

    // Validate request data
    if (!days ||!adPlacement ||!paymentMethod) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if plan exists
    const plan = await Form.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Check the user is the owner of the plan
    if(plan.buyerId.toString() !== userId.toString()){
      return res.status(403).json({ message: "Unauthorized: You are not the owner of this plan" });
    }

    const newAdCampaign = new Compaign({
      listing:planId,
      user:userId,
      days,
      adPlacement,
      paymentMethod,
    });

    await newAdCampaign.save();

    return res.status(201).json({
      message: "Ad campaign created successfully",
      newAdCampaign,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getAllAdCapmiagns = async (req, res) => {
  try {
    const userId = req.user._id;
    const adCampaigns = await Compaign.find({user: userId});
    return res.status(200).json({ adCampaigns });
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const deleteAdCampaign = async (req, res) => {
  try {
    const { planId, campaignId } = req.params; // Fix typo: "capmpaignId" → "campaignId"
    const userId = req.user._id; // Logged-in user ID

    // Check if the plan exists in DB
    const plan = await Form.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Check if the logged-in user is the owner of the plan
    if (plan.buyerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the owner of this plan" });
    }

    // Delete the ad campaign
    const adCampaign = await Compaign.findByIdAndDelete(campaignId); // Fix: Await the delete operation
    if (!adCampaign) {
      return res.status(404).json({ message: "Ad campaign not found" });
    }

    res.status(200).json({ message: "Ad campaign deleted successfully" });

  } catch (error) {
    console.error("Error deleting ad campaign:", error); // Log error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
