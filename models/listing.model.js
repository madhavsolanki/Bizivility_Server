import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    isPaid: {
      type: String,
      enum: ["PENDING", "SUCCESS"],
      required: true,
      default: "PENDING",
    },

    listingStatus: {
      type: String,
      enum: ["PENDING", "EXPIRED", "PUBLISHED"],
      required: true,
      default: "PENDING",
    },

    listingTitle: { type: String, required: true },
    businessTagline: { type: String },

    customAddress: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    // Convert to lowercase, trim, and remove spaces },
    city: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase().trim().replace(/\s+/g, ""),
    },

    phoneNumber: { type: String, required: true },
    websiteUrl: { type: String },

    category: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase().trim().replace(/\s+/g, ""),
    },

    delivery: { type: Boolean, default: false },
    takeOut: { type: Boolean, default: false },

    amenities: [
      {
        type: String,
        required: true,
      },
    ],

    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },

    acceptPayments: [
      {
        type: String,
        required: true,
      },
    ],

    priceRange: {
      type: String,
      required: true,
    },

    priceFrom: { type: Number, required: true },
    priceTo: { type: Number, required: true },

    businessHours: [
      {
        day: {
          type: String,
          // required: true,
        },
        openTime: {
          type: String,
          // required: true
        },
        closeTime: {
          type: String,
          // required: true
        },
      },
    ],

    socialMediaLinks: [
      {
        platFormName: {
          type: String,
          // required: true,
        },
        platformUrl: {
          type: String,
          //  required: true
        },
      },
    ],

    frequentlyAskedQuestions: [
      { question: { type: String }, answer: { type: String } },
    ],

    moreInformation: { type: String, required: true },
    tagsOrKeywords: [{ type: String }],

    businessVideo: { type: String },

    images: [{ imageUrl: { type: String }, publicId: { type: String } }],
    businessLogo: { imageUrl: { type: String }, publicId: { type: String } },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],


    announcements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    }]



  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
export default Form;
