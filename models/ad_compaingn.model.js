import mongoose from "mongoose";

const addCompaignSchema = new mongoose.Schema(
  {
    listing: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    

    users: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    

    days:{
      type: Number,
      required: true,
    },

    selectType:{
      enum:["spotlight", "top_of_search", "sidebar"],
      type:String,
      required: true,
    },

    paymentMethod:{
      enum:["paypal", "stripe", "upi" ,"credit_card"],
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Compaign = mongoose.model("Compaign", addCompaignSchema);

export default Compaign;
