import Event from "../models/event.model.js";
import Form from "../models/listing.model.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const createEvent = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login" });
    }

    // Check if the listing exists
    const listing = await Form.findById(planId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Ensure the logged-in user is the buyer of the listing
    if (listing.buyerId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You are not the buyer of this listing",
      });
    }
     // Ensure listing meets the conditions to create an announcement 
     if(listing.isPaid !== "SUCCESS" || listing.listingStatus !== "PUBLISHED"){
      return res.status(400).json({message: "Invalid listing status or payment status. Listing should be PUBLISHED and paid successfully"});
    }

    // Manually parse JSON fields
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location ? JSON.parse(req.body.location) : {};
    const eventStart = req.body.eventStart ? JSON.parse(req.body.eventStart) : {};
    const eventEnd = req.body.eventEnd ? JSON.parse(req.body.eventEnd) : {};
    const eventTickets = req.body.eventTickets ? JSON.parse(req.body.eventTickets) : [];

    // Validate required fields
    if (!title || !description || !location.address || !eventStart.startDate || !eventStart.startTime) {
      return res.status(400).json({ message: "Missing required fields in request body" });
    }

    // Handle Image Upload (if provided)
    let eventImage = {};
    if (req.file) {
      eventImage = await uploadToCloudinary(req.file.buffer);
      if (!eventImage) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Create a new event document
    const newEvent = new Event({
      listing: planId,
      user: userId,
      title,
      location,
      eventStart,
      eventEnd,
      description,
      eventTickets,
      eventImage,
    });

    await newEvent.save();

    // Add event ID to the Form model's events array
    await Form.findByIdAndUpdate(planId, { $push: { events: newEvent._id } });

    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("listing user", "title name email"); // Populate listing & user details
    res.status(200).json({ message: "Events fetched successfully", events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const {eventId} = req.params;
    const userId = req.user._id;

    // Find Event
    const event = await Event.findById(eventId);

    if(!event){
      return res.status(404).json({ message: "Event not found" });
    }

    // Esure the logged in user is the creator of the event
    if(event.user.toString() !== userId.toString()){
      return res.status(403).json({ message: "Unauthorized: You are not the creator of this event"});
    }

    // Delete the event image from cloudinary if exists
    if(event.eventImage && event.eventImage.publicId){
      await cloudinary.uploader.destroy(event.eventImage.publicId);
    }

    // Remove the event reference from the listing (without deleting the listing)
    await Form.findByIdAndUpdate(event.listing, { $pull: { events: eventId } });

    // Delete the event 
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully" });

  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} buffer - The image buffer
 * @returns {Promise<Object>} - The uploaded image details { imageUrl, publicId }
 */
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "event_images" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

