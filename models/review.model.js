import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

  // User's details
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true }, // Links review to business

  rating:{
    type:Number,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  review:{
    type:String,
    required:true
  },
  reaction: { type: String, enum: ["good", "bad", "moderate", "excellent"], default: "moderate" },

}, {timestamps: true});

const Review = mongoose.model("Review", reviewSchema);

export default Review;