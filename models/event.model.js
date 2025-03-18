import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

  listing:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    },

  users:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

  title:{
    type: String,
    required: true
  },

  location:{
    address:{
      type: String,
      required: true
    },
    latitude:{
      type: Number,
      required: true
    },
    longitude:{
      type: Number,
      required: true
    }
  },

  eventStart: {
    startDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    }
  },

  eventEnd: {
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

  description: {
    type: String,
    required: true
  },

  eventTickets: {
    platform: {
      type: String,
      enum: ["Facebook", "Twitter"],
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },

  bannerImage: {
    type: String,
    required: true
  }


}, {timestams:true});

const Event = mongoose.model('Event', eventSchema);

export default Event;