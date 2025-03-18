import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    listing: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

    title:{
      type: String,
      required: true,
      trim: true,
    },
    couponCode:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    DiscountValue:{
      type: Number,
      enum:["dollar", "percent"],
      required: true,
      min: 0,
    },

    couponStart: {
      startDate: {
        type: Date,
        required: true
      },
      startTime: {
        type: String,
        required: true
      }
    },
  
    couponsEnd: {
      enabled: {
        type: Boolean,
        default: false
      },
      endDate: {
        type: Date
      },
      endTime: {
        type: String
      }
    },

    buttonName:{
      type: String,
      required: true,
    },

    buttonUrl:{
      enabled: {
        type: Boolean,
        default: false
      },
      type:String
    },

    details:{
      type: String,
      required: true,
    },

    couponImage:{
      type: String,
      required: true,
    }


  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
