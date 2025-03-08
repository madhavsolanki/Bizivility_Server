import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  ownerName:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  tagline:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  bannerImage:{
    type:String,
  },
  isOpen:{
    type:Boolean,
    required:true,
    default:false
  },
  address:{
    // use businessAddress model
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessAddress",
  },
  contact:{
    type:String,
    required:true
  },
  website:{
    type:"String",
  },
  socialMediaHandles:[{
    type:String
  }],

  reviews:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tracks business owner
  
},{timestamps:true});


const Business = mongoose.model("Business", businessSchema);

export default Business;