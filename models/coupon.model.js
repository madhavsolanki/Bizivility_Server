import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    listing: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

    title:{
      type: String,
      required: true,
    },

    couponCode:{
      type: String,
      required: true,
      unique: true,
    },

    discountValue:{
      type: String,
      required: true,
      default:""
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
      endDate: {
        type: Date
      },
      endTime: {
        type: String
      }
    },

    details:{
      type: String,
      required: true,
    },

    couponImage:{
      imageUrl:{type: String},
      publicId:{type: String}
    }


  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
