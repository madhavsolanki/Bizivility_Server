import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilePhoto: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      minLength: [3, "At least 3 characters in required"],
      maxLength: [30, "maximum 30 can be entered"],
    },
    lastName: {
      type: String,
      minLength: [3, "At least 3 characters in required"],
      maxLength: [30, "maximum 30 can be entered"],
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

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },

    about: {
      type: String,
      maxLength: [500, "maximum 500 can be entered"],
      minLength: [10, "At least 10 characters is required"],
    },
    facebookUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    instagramUrl: {
      type: String,
    },
    pinterest: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    dashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dashboard",
    },

    announcements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcement",
      },
    ],

    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],

    adCompaign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Compaign",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    enquires: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enquiry",
      },
    ],

    associatedForms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
