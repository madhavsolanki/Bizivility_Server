import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({

  fullName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  phoneNumber:{
    type: String,
    required: true,
  },
  category:{
    type: String,
    enum: [
      "art_&_entertainment",
      "automotive",
      "beauty_&_spa",
      "health_&_medical",
      "hotels",
      "italian",
      "real_state",
      "restaurant",
      "services",
      "shopping",
    ],
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true }],

},{timestamps: true});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;