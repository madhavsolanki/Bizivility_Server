import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    listing: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FORM",
      },
    

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
