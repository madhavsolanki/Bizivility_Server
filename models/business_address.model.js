import mongoose from "mongoose";

const businessAddressSchema = new mongoose.Schema({

  address:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  zipCode:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  },
  latitude: { type: Number },  
  longitude: { type: Number },

},{timestamps:true});

const BusinessAddress = mongoose.model("BusinessAddress", businessAddressSchema);

export default BusinessAddress;