import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  planType: {
    type: String,
    required: true,
  },

  planDuration: {
    type: String,
    enum: ["monthly", "annual"],
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  features: [
    {
      type: String,
      required: true,
    },
  ],

  purchased:{
    type: Boolean,
    default: false,
  }
  
},{timestamps: true});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
