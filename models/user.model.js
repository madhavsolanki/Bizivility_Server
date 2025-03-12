import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilePhoto:{
      type: String,
      default: ''
    },
    firstName:{
      type:String,
      minLength:[3,'At least 3 characters in required'],
      maxLength:[30,'maximum 30 can be entered']
    },
    lastName:{
      type:String,
      minLength:[3,'At least 3 characters in required'],
      maxLength:[30,'maximum 30 can be entered']
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber:{
      type: String,
    },

    adreessLine1:{
      type: String
    },
    addressLine2:{
      type: String
    },
    city:{
      type: String
    },
    zipCode:{
      type: String
    },
    country:{
      type:String
    },

    about:{
      type: String,
      maxLength:[500,'maximum 500 can be entered'],
      minLength:[10, 'At least 10 characters is required']
    },
    facebookUrl:{
      type:String
    },
    twitterUrl:{
      type: String
    },
    linkedinUrl:{
      type: String
    },
    instagramUrl:{
      type: String
    },
    pinterest:{
      type: String
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    purchasedPlans: [
      {
        plan: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        expirationDate: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
