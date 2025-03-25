import mongoose from "mongoose";

const addCompaignSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    days: {
      type: Number,
      required: true,
    },

    adPlacement: {
      // enum: ["SPOTLIGHT", "TOPOFSEARCH", "SIDEBAR"],
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Compaign = mongoose.model("Compaign", addCompaignSchema);

export default Compaign;
