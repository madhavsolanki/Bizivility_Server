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

  enabled: { type: Boolean, default: false },
  expirationDate: { type: Date },
},{timestamps: true});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
