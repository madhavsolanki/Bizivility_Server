import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User who filled the form
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    isPaid: {
      type: String,
      required: true,
      enum: ["PENDING", "SUCCESS"],
      default: "PENDING",
    },

    listingStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "EXPIRED", 'PUBLISHED'],
      default: "PENDING",
    },

    primaryDetails: {
      listingTitle: { type: String, required: true },
      businessTagline: { type: String },
      address: {
        customAddress: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number },
        city: { type: String, required: true },
      },
      phoneNumber: { type: String, required: true },
      websiteUrl: { type: String },
    },

    category: [
      {
        type: String,
        enum: [
          "art_&_entertainment",
          "automotive",
          "beauty_&_spa",
          "health_&_medical",
          "hotels",
          "italian",
          "real_state",
          "restaurant",
          "services",
          "shopping",
        ],
        required: true,
      },
    ],

    delivery: {
      type: Boolean,
      default: false,
    },
    takeOut: {
      type: Boolean,
      default: false,
    },
    amenities: [
      {
        type: String,
        enum: [
          "air_conditioning",
          "dogs_allowed",
          "24_hours_open",
          "wheelchair_accessible",
        ],
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    acceptPayments: [
      {
        type: String,
        enum: ["credit_cards", "bank_transfer", "mobile_payments"],
      },
    ],
    priceDetails: {
      priceRange: {
        type: String,
        enum: ["inexpensive", "moderate", "pricey", "ultra_high"],
        required: true,
      },
      priceFrom: { type: Number, required: true },
      priceTo: { type: Number, required: true },
    },
    businessHours: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          required: true,
        },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
      },
    ],
    socialMediaLinks: [
      {
        platFormName: {
          type: String,
          enum: ["facebook", "twitter", "instagram", "linkedin", "youtube"],
        },
        platformUrl: { type: String },
      },
    ],
    frequentlyAskedQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    moreInformation: { type: String, required: true },
    tagsOrKeywords: [
      {
        type: String,
      },
    ],

    media: {
      businessVideo: {
        type: String,
      },
      images: [
        {
          type: String,
        },
      ],
      businessLogo: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

export default Form;
