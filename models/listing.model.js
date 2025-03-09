import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({

    planType:{
      type:String,
      required:true
    },

    price:{
      type:Number,
      required:true
    },

    features:[{
      type:String,
      required:true
    }]
  
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
