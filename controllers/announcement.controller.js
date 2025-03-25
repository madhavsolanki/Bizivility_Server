import Announcement from "../models/announcement.model.js";
import Form from "../models/listing.model.js";


export const createAnnouncement = async (req, res) => {
  try {
    
    // listing payment status shoulbe SUCCESS, and listingStatus is PUBLISHED then we create thee annoucement
    const { listingId } = req.params;
    const userId = req.user.id; // Assuming req.user  contains logged-in user info

    // Validate listing existance & ownership 
    const listing = await Form.findById(listingId);
    if(!listing){
      return res.status(404).json({message:"Listing not found"});
    }

    // Check if the user is the owner of the listing 
    if(listing.buyerId.toString() !== userId){
      return res.status(403).json({message: "Unauthorized: You are not the owner of this listing"});
    }

    // Ensure listing meets the conditions to create an announcement 
    if(listing.isPaid !== "SUCCESS" || listing.listingStatus !== "PUBLISHED"){
      return res.status(400).json({message: "Invalid listing status or payment status. Listing should be PUBLISHED and paid successfully"});
    }

    // Create the announcement
    const announcement = new Announcement({
      listing:listingId,
      user:userId,
      actionType: req.body.actionType,
      title:req.body.title,
      description:req.body.description,
    });

    await announcement.save();

      // Add announcement reference to listing
      listing.announcements.push(announcement._id);

      await listing.save();

      return res.status(201).json({
        message: "Announcement created successfully",
        announcement,
      })


  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const getAnnouncements = async (req, res) => {
  try {
    // Get plan id  from re.params and user id from logged in user
    const {listingId} = req.params;
    const userId = req.user._id;

    if(!userId){
      return res.status(401).json({message: "Unauthorized: please login"});
    }

    // check plan and user exists or not
    const plan = await Form.findById(listingId);
    if(!plan){
      return res.status(404).json({message: "Plan not found"});
    }
    
    // check plan id user pass is the owner of that plan 
    if(plan.buyerId.toString() !== userId.toString()){
      return res.status(403).json({message: "Unauthorized: You are not the owner of this plan"});
    }

    // Get all announcements related to the plan
    const announcements = await Announcement.find({listing: listingId});

    return res.status(200).json({
      message: "Announcements fetched successfully",
      announcements,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const deleteAnnoucement = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user._id; 

    if(!userId){
      return res.status(401).json({message:"Unautorized: please login"});
    }

    // Find and delete the announcement only if it exists and belongs to the user
    const announcement = await Announcement.findById(id);
    if(!announcement){
      return res.status(404).json({message: "Announcement not found"});
    }
    if(announcement.user.toString()!== userId.toString()){
      return res.status(403).json({message: "Unauthorized: You are not the owner of this announcement"});
    }
     // Remove the announcement ID from the Form model
     await Form.updateOne(
      { _id: announcement.listing }, 
      { $pull: { announcements: id } } // Assuming Form model has an 'announcements' array
    );
    await Announcement.findByIdAndDelete(id);

    return res.status(200).json({ message: "Announcement deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}